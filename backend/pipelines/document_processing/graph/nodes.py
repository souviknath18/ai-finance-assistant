from pathlib import Path

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
from pipelines.document_processing.repair.transaction_repair import (
    repair_transactions_with_ai,
)
from pipelines.document_processing.validation.parser_validator import (
    validate_parser_result,
)

from pipelines.document_processing.graph.state import (
    DocumentProcessingState,
)


# ---------------------------------------------------------------------
# Extract
# ---------------------------------------------------------------------

def extract_node(
    state: DocumentProcessingState,
) -> dict:
    file_path = state["file_path"]

    source_file_type = (
        state["source_file_type"]
        .strip()
        .lower()
    )

    path = Path(file_path)

    if not path.exists():
        raise ValueError(
            f"Document file does not exist: {file_path}"
        )

    if source_file_type == "pdf":
        extracted_text = (
            extract_text_from_pdf(
                file_path
            )
        )

        return {
            "extracted_text": extracted_text,
        }

    if source_file_type == "image":
        extracted_text = (
            extract_text_from_image(
                file_path
            )
        )

        return {
            "extracted_text": extracted_text,
        }

    if source_file_type == "csv":
        return {}

    raise ValueError(
        f"Unsupported file type: {source_file_type}"
    )


# ---------------------------------------------------------------------
# CSV processing
# ---------------------------------------------------------------------

def csv_parse_node(
    state: DocumentProcessingState,
) -> dict:
    parser_result = (
        parse_csv_transactions(
            state["file_path"]
        )
    )

    transactions = (
        parser_result.get(
            "transactions",
            [],
        )
    )

    if not transactions:
        raise ValueError(
            "No valid transactions were found "
            "in the CSV file."
        )

    return {
        "document_type": "bank_statement",

        "document_type_result": {
            "document_type": (
                "bank_statement"
            ),
            "source": "csv",
        },

        "extracted_text": (
            "CSV transactions parsed successfully."
        ),

        "normalized_text": (
            "CSV transactions parsed successfully."
        ),

        "parser_result": (
            parser_result
        ),

        "validation_result": {
            "is_valid": True,
        },

        "parser_used": (
            parser_result.get(
                "parser",
                "csv_transaction_parser",
            )
        ),

        "parser_confidence": (
            parser_result.get(
                "confidence"
            )
        ),

        "transactions": (
            transactions
        ),

        "used_ai_fallback": False,
        "used_ai_repair": False,
    }


# ---------------------------------------------------------------------
# Normalize
# ---------------------------------------------------------------------

def normalize_node(
    state: DocumentProcessingState,
) -> dict:
    extracted_text = (
        state.get(
            "extracted_text",
            "",
        )
    )

    if not extracted_text:
        raise ValueError(
            "No text could be extracted "
            "from the document."
        )

    normalized_text = (
        normalize_extracted_text(
            extracted_text
        )
    )

    if not normalized_text.strip():
        raise ValueError(
            "Extracted text is empty "
            "after normalization."
        )

    return {
        "normalized_text": (
            normalized_text
        ),
    }


# ---------------------------------------------------------------------
# Document type detection
# ---------------------------------------------------------------------

def detect_type_node(
    state: DocumentProcessingState,
) -> dict:
    normalized_text = (
        state["normalized_text"]
    )

    result = detect_document_type(
        normalized_text
    )

    return {
        "document_type_result": result,

        "document_type": (
            result.get(
                "document_type",
                "unknown",
            )
        ),
    }


# ---------------------------------------------------------------------
# Deterministic parse
# ---------------------------------------------------------------------

def deterministic_parse_node(
    state: DocumentProcessingState,
) -> dict:
    normalized_text = (
        state["normalized_text"]
    )

    document_type = (
        state.get(
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

    return {
        "parser_result": (
            parser_result
        ),

        "transactions": (
            parser_result.get(
                "transactions",
                [],
            )
        ),

        "parser_used": (
            parser_result.get(
                "parser",
                "unknown_parser",
            )
        ),

        "parser_confidence": (
            parser_result.get(
                "confidence"
            )
        ),
    }


# ---------------------------------------------------------------------
# Invoice enhancement
# ---------------------------------------------------------------------

def invoice_enhancement_node(
    state: DocumentProcessingState,
) -> dict:
    if (
        state.get(
            "document_type"
        )
        != "invoice"
    ):
        return {}

    parser_result = (
        state.get(
            "parser_result",
            {},
        )
    )

    enhanced_result = (
        enhance_invoice_result(
            parser_result=parser_result,
            extracted_text=(
                state["normalized_text"]
            ),
        )
    )

    return {
        "parser_result": (
            enhanced_result
        ),

        "transactions": (
            enhanced_result.get(
                "transactions",
                [],
            )
        ),

        "parser_used": (
            enhanced_result.get(
                "parser",
                state.get(
                    "parser_used",
                    "unknown_parser",
                ),
            )
        ),

        "parser_confidence": (
            enhanced_result.get(
                "confidence",
                state.get(
                    "parser_confidence"
                ),
            )
        ),
    }


# ---------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------

def validate_node(
    state: DocumentProcessingState,
) -> dict:
    parser_result = (
        state.get(
            "parser_result",
            {},
        )
    )

    validation_result = (
        validate_parser_result(
            parser_result
        )
    )

    return {
        "validation_result": (
            validation_result
        ),
    }


# ---------------------------------------------------------------------
# AI fallback
# ---------------------------------------------------------------------

def ai_fallback_node(
    state: DocumentProcessingState,
) -> dict:
    transactions = (
        parse_transactions_with_ai(
            extracted_text=(
                state["normalized_text"]
            ),
            document_type=(
                state.get(
                    "document_type",
                    "unknown",
                )
            ),
        )
    )

    if not transactions:
        raise ValueError(
            "AI fallback did not find "
            "valid transactions."
        )

    parser_result = {
        **state.get(
            "parser_result",
            {},
        ),

        "parser": (
            "ai_transaction_parser"
        ),

        "transactions": (
            transactions
        ),
    }

    return {
        "transactions": (
            transactions
        ),

        "parser_result": (
            parser_result
        ),

        "parser_used": (
            "ai_transaction_parser"
        ),

        "parser_confidence": None,

        "used_ai_fallback": True,
    }


# ---------------------------------------------------------------------
# AI repair
# ---------------------------------------------------------------------

def ai_repair_node(
    state: DocumentProcessingState,
) -> dict:
    deterministic_transactions = (
        state.get(
            "transactions",
            [],
        )
    )

    repaired_transactions = (
        repair_transactions_with_ai(
            extracted_text=(
                state["normalized_text"]
            ),

            deterministic_transactions=(
                deterministic_transactions
            ),

            document_type=(
                state.get(
                    "document_type",
                    "unknown",
                )
            ),
        )
    )

    if not repaired_transactions:
        return {}

    repaired_parser_result = {
        **state.get(
            "parser_result",
            {},
        ),
        "transactions": (
            repaired_transactions
        ),
    }

    return {
        "transactions": (
            repaired_transactions
        ),

        "parser_result": (
            repaired_parser_result
        ),

        "parser_used": (
            repaired_parser_result.get(
                "parser",
                state.get(
                    "parser_used",
                    "unknown_parser",
                ),
            )
        ),

        "parser_confidence": (
            repaired_parser_result.get(
                "confidence",
                state.get(
                    "parser_confidence"
                ),
            )
        ),

        "used_ai_repair": True,
    }


# ---------------------------------------------------------------------
# Finalization
# ---------------------------------------------------------------------

def finalize_node(
    state: DocumentProcessingState,
) -> dict:
    transactions = (
        state.get(
            "transactions",
            [],
        )
    )

    if not transactions:
        raise ValueError(
            "No valid transactions were found "
            "after document processing."
        )

    return {
        "transactions": (
            transactions
        ),

        "used_ai_fallback": (
            state.get(
                "used_ai_fallback",
                False,
            )
        ),

        "used_ai_repair": (
            state.get(
                "used_ai_repair",
                False,
            )
        ),
    }