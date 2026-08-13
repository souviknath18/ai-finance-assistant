from pathlib import Path
from typing import Any

from pipelines.document_processing.detection.document_type_detector import (
    detect_document_type,
)
from pipelines.document_processing.extraction.image_extractor import (
    extract_text_from_image,
)
from pipelines.document_processing.extraction.invoice_enhancer import (
    enhance_invoice_result,
)
from pipelines.document_processing.extraction.pdf_extractor import (
    extract_text_from_pdf,
)
from pipelines.document_processing.normalization.text import (
    normalize_extracted_text,
)
from pipelines.document_processing.parsers.ai_transaction_parser import (
    parse_transactions_with_ai,
)
from pipelines.document_processing.parsers.csv_transaction_parser import (
    parse_csv_transactions,
)
from pipelines.document_processing.parsers.router import (
    parse_financial_document,
)
from pipelines.document_processing.validation.parser_validator import (
    should_use_ai_fallback,
    should_use_ai_repair,
    validate_parser_result,
)


SUPPORTED_FILE_TYPES = {
    "pdf",
    "csv",
    "image",
}


class DocumentProcessingError(Exception):
    """
    Base error raised by Aura's document-processing pipeline.
    """


def process_financial_document_file(
    *,
    file_path: str,
    file_type: str,
) -> dict[str, Any]:
    """
    Process one financial document.

    Responsibilities:
    - extract text/data
    - normalize text
    - detect document type
    - run deterministic parser
    - validate parser result
    - invoke AI fallback when necessary
    - optionally enhance invoice parsing
    - return normalized transaction candidates

    This function does NOT:
    - create Transaction rows
    - update UploadedFile status
    - trigger Celery tasks
    - generate embeddings
    - sync subscriptions
    - regenerate Insights
    """

    normalized_file_type = (
        str(file_type or "")
        .strip()
        .lower()
    )

    if normalized_file_type not in SUPPORTED_FILE_TYPES:
        raise DocumentProcessingError(
            f"Unsupported file type: {file_type}"
        )

    path = Path(file_path)

    if not path.exists():
        raise DocumentProcessingError(
            f"Document file does not exist: {file_path}"
        )

    if normalized_file_type == "csv":
        return _process_csv(
            file_path=file_path,
        )

    if normalized_file_type == "pdf":
        extracted_text = extract_text_from_pdf(
            file_path
        )

    else:
        extracted_text = extract_text_from_image(
            file_path
        )

    return _process_extracted_text(
        extracted_text=extracted_text,
        source_file_type=normalized_file_type,
    )


def _process_csv(
    *,
    file_path: str,
) -> dict[str, Any]:
    """
    Process CSV transactions.

    CSV already contains structured rows, so it does not need
    OCR/document-type detection or semantic parser routing.
    """

    parser_result = parse_csv_transactions(
        file_path
    )

    transactions = parser_result.get(
        "transactions",
        [],
    )

    if not transactions:
        raise DocumentProcessingError(
            "No valid transactions were found in the CSV file."
        )

    return {
        "source_file_type": "csv",
        "document_type": "bank_statement",
        "document_type_result": {
            "document_type": "bank_statement",
            "source": "csv",
        },
        "extracted_text": (
            "CSV transactions parsed successfully."
        ),
        "parser_result": parser_result,
        "validation_result": {
            "is_valid": True,
        },
        "parser_used": parser_result.get(
            "parser",
            "csv_transaction_parser",
        ),
        "parser_confidence": parser_result.get(
            "confidence",
        ),
        "transactions": transactions,
        "used_ai_fallback": False,
        "used_ai_repair": False,
    }


def _process_extracted_text(
    *,
    extracted_text: str,
    source_file_type: str,
) -> dict[str, Any]:
    """
    Process extracted PDF/image text through Aura's
    deterministic + AI fallback pipeline.
    """

    if not extracted_text:
        raise DocumentProcessingError(
            "No text could be extracted from the document."
        )

    normalized_text = (
        normalize_extracted_text(
            extracted_text
        )
    )

    if not normalized_text.strip():
        raise DocumentProcessingError(
            "The extracted document text is empty after normalization."
        )

    document_type_result = (
        detect_document_type(
            normalized_text
        )
    )

    document_type = (
        document_type_result.get(
            "document_type",
            "unknown",
        )
    )

    parser_result = (
        parse_financial_document(
            extracted_text=normalized_text,
            detected_type=document_type,
        )
    )

    validation_result = (
        validate_parser_result(
            parser_result
        )
    )

    used_ai_fallback = False
    used_ai_repair = False

    # -------------------------------------------------------------
    # Strong parser failure -> structured AI fallback
    # -------------------------------------------------------------

    if should_use_ai_fallback(
        parser_result,
        validation_result,
    ):
        transactions = (
            parse_transactions_with_ai(
                extracted_text=normalized_text,
                document_type=document_type,
            )
        )

        parser_used = (
            "ai_transaction_parser"
        )

        parser_confidence = None

        used_ai_fallback = True

        if not transactions:
            raise DocumentProcessingError(
                "Neither deterministic parsing nor AI extraction "
                "found valid transactions."
            )

        return {
            "source_file_type": source_file_type,
            "document_type": document_type,
            "document_type_result": (
                document_type_result
            ),
            "extracted_text": (
                normalized_text
            ),
            "parser_result": (
                parser_result
            ),
            "validation_result": (
                validation_result
            ),
            "parser_used": (
                parser_used
            ),
            "parser_confidence": (
                parser_confidence
            ),
            "transactions": (
                transactions
            ),
            "used_ai_fallback": (
                used_ai_fallback
            ),
            "used_ai_repair": (
                used_ai_repair
            ),
        }

    # -------------------------------------------------------------
    # Deterministic result accepted
    # -------------------------------------------------------------

    if document_type == "invoice":
        parser_result = (
            enhance_invoice_result(
                parser_result=parser_result,
                extracted_text=normalized_text,
            )
        )

        # Enhancement can change the parser result,
        # so validate it again.
        validation_result = (
            validate_parser_result(
                parser_result
            )
        )

    transactions = parser_result.get(
        "transactions",
        [],
    )

    parser_used = parser_result.get(
        "parser",
        "unknown_parser",
    )

    parser_confidence = (
        parser_result.get(
            "confidence"
        )
    )

    # -------------------------------------------------------------
    # Medium-confidence result
    # -------------------------------------------------------------

    if should_use_ai_repair(
        parser_result,
        validation_result,
    ):
        # We preserve the deterministic result for now.
        #
        # In the next step this becomes a LangChain structured
        # repair operation instead of replacing the entire parse.
        used_ai_repair = True

    if not transactions:
        raise DocumentProcessingError(
            "No valid transactions were found in the document."
        )

    return {
        "source_file_type": source_file_type,
        "document_type": document_type,
        "document_type_result": (
            document_type_result
        ),
        "extracted_text": (
            normalized_text
        ),
        "parser_result": (
            parser_result
        ),
        "validation_result": (
            validation_result
        ),
        "parser_used": (
            parser_used
        ),
        "parser_confidence": (
            parser_confidence
        ),
        "transactions": (
            transactions
        ),
        "used_ai_fallback": (
            used_ai_fallback
        ),
        "used_ai_repair": (
            used_ai_repair
        ),
    }