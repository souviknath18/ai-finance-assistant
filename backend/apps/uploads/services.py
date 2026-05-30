from django.utils import timezone
from .models import UploadedFile
from ai_engine.parsers.pdf_parser import extract_text_from_pdf
from ai_engine.parsers.bank_statement_parser import parse_bank_statement_transactions
from ai_engine.parsers.receipt_invoice_parser import parse_receipt_invoice_transactions
from ai_engine.parsers.ai_transaction_parser import parse_transactions_with_ai
from ai_engine.parsers.document_type_detector import detect_document_type
from ai_engine.parsers.csv_transaction_parser import parse_csv_transactions
from ai_engine.parsers.subscription_parser import parse_subscription_transactions
from apps.transactions.models import Transaction
from ai_engine.categorization.categorize_transactions import categorize_transaction
from ai_engine.embeddings.vector_store import store_transaction_vector
from apps.subscriptions.services import sync_detected_subscriptions
from ai_engine.insights.upload_tip_generator import generate_and_store_upload_ai_tip
from apps.insights.services import regenerate_insights_snapshot, mark_insights_stale


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

    try:
        if uploaded_file.file_type == UploadedFile.FileType.PDF:
            update_processing_status(uploaded_file, 15, "Extracting PDF text")

            extracted_text = extract_text_from_pdf(uploaded_file.file.path)

            uploaded_file.extracted_text = extracted_text

            update_processing_status(uploaded_file, 30, "Detecting document type")

            document_type_result = detect_document_type(extracted_text)
            document_type = document_type_result["document_type"]

            print("Detected document type:", document_type_result)

            update_processing_status(uploaded_file, 45, "Parsing transactions")

            if document_type == "bank_statement":
                parser_result = parse_bank_statement_transactions(extracted_text)

            elif document_type == "subscription_receipt":
                parser_result = parse_subscription_transactions(extracted_text)

            elif document_type == "receipt_invoice":
                parser_result = parse_receipt_invoice_transactions(extracted_text)

            else:
                parser_result = parse_bank_statement_transactions(extracted_text)

                if not parser_result["transactions"]:
                    parser_result = parse_subscription_transactions(extracted_text)

                if not parser_result["transactions"]:
                    parser_result = parse_receipt_invoice_transactions(extracted_text)

            parsed_transactions = parser_result["transactions"]
            parser_confidence = parser_result["confidence"]

            print("Parser used:", parser_result["parser"])
            print("Parser confidence:", parser_confidence)
            print("Transactions parsed:", len(parsed_transactions))

            if parser_confidence < 0.75:
                update_processing_status(
                    uploaded_file,
                    60,
                    "Running AI transaction analysis",
                )
                parsed_transactions = parse_transactions_with_ai(extracted_text)

            created_count = 0
            total_transactions = max(len(parsed_transactions), 1)

            for index, item in enumerate(parsed_transactions, start=1):
                current_progress = 70 + int((index / total_transactions) * 20)

                update_processing_status(
                    uploaded_file,
                    min(current_progress, 90),
                    f"Processing transaction {index} of {total_transactions}",
                )

                category_result = categorize_transaction(
                    item["description"],
                    item["transaction_type"],
                )

                transaction = Transaction.objects.create(
                    user=uploaded_file.user,
                    uploaded_file=uploaded_file,
                    date=item["date"],
                    description=item["description"],
                    amount=item["amount"],
                    transaction_type=item["transaction_type"],
                    balance_after_transaction=item["balance_after_transaction"],
                    raw_text=item["raw_text"],
                    category=category_result["category"],
                    category_source=(
                        "ai"
                        if category_result["is_ai_categorized"]
                        else "rule"
                        if category_result["category"] != "Uncategorized"
                        else "none"
                    ),
                    is_ai_categorized=category_result["is_ai_categorized"],
                    ai_confidence=category_result["confidence"],
                    ai_reason=category_result["reason"],
                    is_reviewed=category_result["confidence"] >= 0.85,
                )
                if not transaction.is_vectorized:
                    try:
                        store_transaction_vector(transaction)
                    except Exception as vector_error:
                        print("Vector storage failed:", vector_error)

                created_count += 1

            uploaded_file.extracted_transactions_count = created_count
            uploaded_file.extracted_amount = None

        elif uploaded_file.file_type == UploadedFile.FileType.CSV:
            update_processing_status(uploaded_file, 20, "Reading CSV file")

            parser_result = parse_csv_transactions(uploaded_file.file.path)

            parsed_transactions = parser_result["transactions"]

            update_processing_status(uploaded_file, 55, "Parsing CSV transactions")

            created_count = 0
            total_transactions = max(len(parsed_transactions), 1)

            for index, item in enumerate(parsed_transactions, start=1):
                current_progress = 70 + int((index / total_transactions) * 20)

                update_processing_status(
                    uploaded_file,
                    min(current_progress, 90),
                    f"Processing transaction {index} of {total_transactions}",
                )

                category_result = categorize_transaction(
                    item.get("category") or item["description"],
                    item["transaction_type"],
                )

                transaction = Transaction.objects.create(
                    user=uploaded_file.user,
                    uploaded_file=uploaded_file,
                    date=item["date"],
                    description=item["description"],
                    amount=item["amount"],
                    transaction_type=item["transaction_type"],
                    balance_after_transaction=item["balance_after_transaction"],
                    raw_text=item["raw_text"],
                    category=item.get("category") or category_result["category"],
                    category_source=(
                        "user"
                        if item.get("category")
                        else "ai"
                        if category_result["is_ai_categorized"]
                        else "rule"
                        if category_result["category"] != "Uncategorized"
                        else "none"
                    ),
                    is_ai_categorized=category_result["is_ai_categorized"],
                    ai_confidence=category_result["confidence"],
                    ai_reason=category_result["reason"],
                    is_reviewed=category_result["confidence"] >= 0.85,
                )

                if not transaction.is_vectorized:
                    try:
                        store_transaction_vector(transaction)
                    except Exception as vector_error:
                        print("Vector storage failed:", vector_error)

                created_count += 1

            uploaded_file.extracted_text = "CSV transactions parsed successfully."
            uploaded_file.extracted_transactions_count = created_count
            uploaded_file.extracted_amount = None

        elif uploaded_file.file_type == UploadedFile.FileType.IMAGE:
            update_processing_status(uploaded_file, 25, "Checking image document")

            uploaded_file.extracted_text = "OCR image extraction will be added later."
            uploaded_file.extracted_transactions_count = 0
            uploaded_file.extracted_amount = None

        else:
            raise ValueError("Unsupported file type.")

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
        return uploaded_file