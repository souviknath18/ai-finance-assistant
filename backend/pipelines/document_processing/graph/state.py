from typing import Any, TypedDict


class DocumentProcessingState(
    TypedDict,
    total=False,
):
    file_path: str
    source_file_type: str

    extracted_text: str
    normalized_text: str

    document_type: str
    document_type_result: dict[str, Any]

    parser_result: dict[str, Any]
    validation_result: dict[str, Any]

    transactions: list[dict[str, Any]]

    parser_used: str
    parser_confidence: float | None

    used_ai_fallback: bool
    used_ai_repair: bool

    error: str | None