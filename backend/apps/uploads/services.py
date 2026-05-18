from django.utils import timezone
from .models import UploadedFile
from ai_engine.parsers.pdf_parser import extract_text_from_pdf
from ai_engine.parsers.bank_statement_parser import parse_bank_statement_transactions
from ai_engine.parsers.ai_transaction_parser import parse_transactions_with_ai
from apps.transactions.models import Transaction
from ai_engine.categorization.categorize_transactions import categorize_transaction


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


def process_uploaded_file(uploaded_file: UploadedFile):
    uploaded_file.status = UploadedFile.Status.PROCESSING
    uploaded_file.save(update_fields=["status"])

    try:
        if uploaded_file.file_type == UploadedFile.FileType.PDF:
            extracted_text = extract_text_from_pdf(uploaded_file.file.path)

            uploaded_file.extracted_text = extracted_text

            parser_result = parse_bank_statement_transactions(extracted_text)

            parsed_transactions = parser_result["transactions"]
            parser_confidence = parser_result["confidence"]

            if parser_confidence < 0.75:
                parsed_transactions = parse_transactions_with_ai(extracted_text)

            created_count = 0

            for item in parsed_transactions:
                category_result = categorize_transaction(
                    item["description"],
                    item["transaction_type"],
                )

                Transaction.objects.create(
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

                created_count += 1

            uploaded_file.extracted_transactions_count = created_count
            uploaded_file.extracted_amount = None

        elif uploaded_file.file_type == UploadedFile.FileType.CSV:
            uploaded_file.extracted_text = "CSV parsing will be added next."
            uploaded_file.extracted_transactions_count = 0
            uploaded_file.extracted_amount = None

        elif uploaded_file.file_type == UploadedFile.FileType.IMAGE:
            uploaded_file.extracted_text = "OCR image extraction will be added later."
            uploaded_file.extracted_transactions_count = 0
            uploaded_file.extracted_amount = None

        else:
            raise ValueError("Unsupported file type.")

        uploaded_file.status = UploadedFile.Status.SUCCESS
        uploaded_file.error_message = None
        uploaded_file.processed_at = timezone.now()

    except Exception as error:
        uploaded_file.status = UploadedFile.Status.FAILED
        uploaded_file.error_message = str(error)

    uploaded_file.save()
    return uploaded_file