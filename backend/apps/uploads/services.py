import os
import tempfile
from django.utils import timezone
from .models import UploadedFile
from apps.transactions.models import Transaction
from pipelines.document_processing.categorization.service import (
    categorize_transaction,
)
from apps.subscriptions.services import sync_detected_subscriptions
from apps.uploads.ai_tip_service import (
    generate_and_store_upload_ai_tip,
    get_cached_upload_ai_tip,
)
from apps.insights.services import regenerate_insights_snapshot, mark_insights_stale
from django.db import transaction as db_transaction
from apps.transactions.tasks import (
    store_transaction_vector_task,
)
from pipelines.document_processing.pipeline import (
    process_financial_document_file,
)


ALLOWED_EXTENSIONS = [".pdf", ".csv", ".jpg", ".jpeg", ".png"]


def detect_file_type(filename: str) -> str:
    filename = filename.lower()

    if filename.endswith(".pdf"):
        return UploadedFile.FileType.PDF

    if filename.endswith(".csv"):
        return UploadedFile.FileType.CSV

    if filename.endswith((".jpg", ".jpeg", ".png")):
        return UploadedFile.FileType.IMAGE

    return UploadedFile.FileType.UNKNOWN


def validate_uploaded_file(file):
    filename = file.name.lower()

    if not any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise ValueError("Only PDF, CSV, JPG, JPEG, and PNG files are allowed.")

    max_size = 10 * 1024 * 1024

    if file.size > max_size:
        raise ValueError("File size must be less than 10MB.")
    

def create_temporary_upload_file(uploaded_file: UploadedFile) -> str:
    """
    Copy a Django stored file into a temporary local file.

    This works with both local storage and remote storage such as
    Cloudflare R2 or Amazon S3.
    """
    extension = uploaded_file.extension

    uploaded_file.file.open("rb")

    try:
        with tempfile.NamedTemporaryFile(
            suffix=extension,
            delete=False,
        ) as temporary_file:
            for chunk in uploaded_file.file.chunks():
                temporary_file.write(chunk)

            return temporary_file.name
    finally:
        uploaded_file.file.close()
    

def update_processing_status(
    uploaded_file,
    progress: int,
    step: str,
):
    uploaded_file.processing_progress = progress
    uploaded_file.processing_step = step
    uploaded_file.save(
        update_fields=[
            "processing_progress",
            "processing_step",
        ]
    )


def normalize_category_cache_key(
    description: str,
    transaction_type: str,
) -> str:
    normalized_description = " ".join(
        str(description or "")
        .lower()
        .strip()
        .split()
    )

    normalized_transaction_type = (
        str(transaction_type or "")
        .lower()
        .strip()
    )

    return (
        f"{normalized_transaction_type}:"
        f"{normalized_description}"
    )


def get_cached_category_result(
    category_cache: dict,
    description: str,
    transaction_type: str,
):
    cache_key = normalize_category_cache_key(
        description,
        transaction_type,
    )

    if cache_key not in category_cache:
        category_cache[cache_key] = categorize_transaction(
            description,
            transaction_type,
        )

    return category_cache[cache_key]


def prepare_category_fields(category_result: dict) -> dict:
    category = category_result.get(
        "category",
        "Uncategorized",
    )

    category_source = category_result.get(
        "category_source",
        "none",
    )

    is_ai_categorized = bool(
        category_result.get(
            "is_ai_categorized",
            False,
        )
    )

    confidence = category_result.get(
        "confidence",
    )

    reason = category_result.get(
        "reason",
    )

    # Confidence only represents an AI model's confidence.
    if category_source != "ai":
        confidence = None
        is_ai_categorized = False

    # Automatically review deterministic rule matches.
    if category_source == "rule":
        is_reviewed = True

    # AI results are automatically reviewed only when
    # the confidence is sufficiently high.
    elif category_source == "ai":
        is_reviewed = (
            confidence is not None
            and confidence >= 0.85
        )

    # User-provided categories are already verified.
    elif category_source == "user":
        is_reviewed = True

    else:
        is_reviewed = False

    return {
        "category": category,
        "category_source": category_source,
        "is_ai_categorized": is_ai_categorized,
        "ai_confidence": confidence,
        "ai_reason": reason,
        "is_reviewed": is_reviewed,
    }


def resolve_transaction_category_fields(
    *,
    item: dict,
    category_cache: dict,
    allow_provided_category: bool = False,
) -> dict:
    """
    Resolve category fields for one parsed transaction.

    CSV transactions may already contain a user-provided
    category. Other documents use Aura categorization.
    """

    provided_category = (
        item.get("category")
        if allow_provided_category
        else None
    )

    if provided_category:
        return {
            "category": provided_category,
            "category_source": "user",
            "is_ai_categorized": False,
            "ai_confidence": None,
            "ai_reason": (
                "Category provided in uploaded CSV."
            ),
            "is_reviewed": True,
        }

    category_text = (
        item.get("description")
        or item.get("merchant_name")
        or "Unknown transaction"
    )

    category_result = get_cached_category_result(
        category_cache=category_cache,
        description=category_text,
        transaction_type=item["transaction_type"],
    )

    return prepare_category_fields(
        category_result
    )


def persist_parsed_transactions(
    *,
    uploaded_file,
    parsed_transactions,
    extracted_text,
    parser_used,
    parser_confidence,
    category_cache,
    allow_provided_category=False,
):
    created_count = 0

    total_transactions = max(
        len(parsed_transactions),
        1,
    )

    for index, item in enumerate(
        parsed_transactions,
        start=1,
    ):
        current_progress = (
            70
            + int(
                (
                    index
                    / total_transactions
                )
                * 20
            )
        )

        update_processing_status(
            uploaded_file,
            min(current_progress, 90),
            (
                f"Processing transaction "
                f"{index} of {total_transactions}"
            ),
        )

        category_fields = (
            resolve_transaction_category_fields(
                item=item,
                category_cache=category_cache,
                allow_provided_category=(
                    allow_provided_category
                ),
            )
        )

        (
            transaction_date,
            date_is_estimated,
        ) = resolve_transaction_date(
            item
        )

        transaction = Transaction.objects.create(
            user=uploaded_file.user,
            uploaded_file=uploaded_file,

            date=transaction_date,
            date_is_estimated=date_is_estimated,

            description=(
                item.get("description")
                or "Unknown transaction"
            ),

            amount=item["amount"],

            transaction_type=(
                item["transaction_type"]
            ),

            merchant_name=item.get(
                "merchant_name"
            ),

            reference_number=item.get(
                "reference_number"
            ),

            balance_after_transaction=item.get(
                "balance_after_transaction"
            ),

            raw_text=(
                item.get("raw_text")
                or extracted_text
                or ""
            ),

            parser_confidence=(
                parser_confidence
            ),

            parser_used=(
                parser_used
            ),

            category=(
                category_fields["category"]
            ),

            category_source=(
                category_fields[
                    "category_source"
                ]
            ),

            is_ai_categorized=(
                category_fields[
                    "is_ai_categorized"
                ]
            ),

            ai_confidence=(
                category_fields[
                    "ai_confidence"
                ]
            ),

            ai_reason=(
                category_fields[
                    "ai_reason"
                ]
            ),

            is_reviewed=(
                category_fields[
                    "is_reviewed"
                ]
            ),
        )

        queue_transaction_vectorization(
            transaction
        )

        created_count += 1

    return created_count


def queue_transaction_vectorization(
    transaction: Transaction,
):
    if transaction.is_vectorized:
        return

    transaction_id = str(transaction.id)

    db_transaction.on_commit(
        lambda transaction_id=transaction_id: (
            store_transaction_vector_task.delay(
                transaction_id
            )
        )
    )


def resolve_transaction_date(
    item: dict,
):
    transaction_date = item.get(
        "date"
    )
    if transaction_date:
        return transaction_date, False

    return None, True


def process_uploaded_file(uploaded_file: UploadedFile):
    uploaded_file.status = UploadedFile.Status.PROCESSING
    uploaded_file.processing_progress = 5
    uploaded_file.processing_step = "Preparing document"
    uploaded_file.save(
        update_fields=[
            "status",
            "processing_progress",
            "processing_step",
        ]
    )

    temporary_path = None
    category_cache = {}

    try:
        temporary_path = create_temporary_upload_file(uploaded_file)

        temporary_path = (
            create_temporary_upload_file(
                uploaded_file
            )
        )

        # -------------------------------------------------------------
        # Document processing
        # -------------------------------------------------------------

        if (
            uploaded_file.file_type
            == UploadedFile.FileType.PDF
        ):
            update_processing_status(
                uploaded_file,
                15,
                "Processing PDF document",
            )

        elif (
            uploaded_file.file_type
            == UploadedFile.FileType.IMAGE
        ):
            update_processing_status(
                uploaded_file,
                15,
                "Processing image document",
            )

        elif (
            uploaded_file.file_type
            == UploadedFile.FileType.CSV
        ):
            update_processing_status(
                uploaded_file,
                20,
                "Processing CSV transactions",
            )

        else:
            raise ValueError(
                "Unsupported file type."
            )

        document_result = (
            process_financial_document_file(
                file_path=temporary_path,
                file_type=(
                    uploaded_file.file_type
                ),
            )
        )

        extracted_text = (
            document_result.get(
                "extracted_text",
                "",
            )
        )

        parsed_transactions = (
            document_result.get(
                "transactions",
                [],
            )
        )

        parser_used = (
            document_result.get(
                "parser_used",
                "unknown_parser",
            )
        )

        parser_confidence = (
            document_result.get(
                "parser_confidence"
            )
        )

        if not parsed_transactions:
            raise ValueError(
                "No valid transactions were found."
            )

        uploaded_file.extracted_text = (
            extracted_text
        )

        # -------------------------------------------------------------
        # Save transactions
        # -------------------------------------------------------------

        created_count = (
            persist_parsed_transactions(
                uploaded_file=uploaded_file,
                parsed_transactions=(
                    parsed_transactions
                ),
                extracted_text=(
                    extracted_text
                ),
                parser_used=(
                    parser_used
                ),
                parser_confidence=(
                    parser_confidence
                ),
                category_cache=(
                    category_cache
                ),
                allow_provided_category=(
                    uploaded_file.file_type
                    == UploadedFile.FileType.CSV
                ),
            )
        )

        uploaded_file.extracted_transactions_count = (
            created_count
        )

        uploaded_file.extracted_amount = None

        update_processing_status(uploaded_file, 92, "Detecting recurring payments")

        sync_detected_subscriptions(uploaded_file.user)

        uploaded_file.status = UploadedFile.Status.SUCCESS
        uploaded_file.error_message = None
        uploaded_file.processed_at = timezone.now()
        uploaded_file.processing_progress = 97
        uploaded_file.processing_step = "Generating AI insights"

        uploaded_file.save()

        generate_and_store_upload_ai_tip(uploaded_file.user, uploaded_file)

        try:
            regenerate_insights_snapshot(uploaded_file.user)
        except Exception as insight_error:
            print("Insight snapshot regeneration failed:", insight_error)
            mark_insights_stale(uploaded_file.user)

        uploaded_file.processing_progress = 100
        uploaded_file.processing_step = "Completed"
        uploaded_file.save(
            update_fields=[
                "processing_progress",
                "processing_step",
            ]
        )

        return uploaded_file

    except Exception as error:
        uploaded_file.status = UploadedFile.Status.FAILED
        uploaded_file.error_message = str(error)
        uploaded_file.processing_progress = 0
        uploaded_file.processing_step = "Failed"
        uploaded_file.processed_at = timezone.now()
        uploaded_file.save()

        raise

    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.remove(temporary_path)