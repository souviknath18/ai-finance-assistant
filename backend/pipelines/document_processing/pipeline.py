from pathlib import Path
from typing import Any

from pipelines.document_processing.graph.workflow import (
    document_processing_graph,
)


SUPPORTED_FILE_TYPES = {
    "pdf",
    "csv",
    "image",
}


class DocumentProcessingError(
    Exception
):
    pass


def process_financial_document_file(
    *,
    file_path: str,
    file_type: str,
) -> dict[str, Any]:
    normalized_file_type = (
        str(
            file_type
            or ""
        )
        .strip()
        .lower()
    )

    if (
        normalized_file_type
        not in SUPPORTED_FILE_TYPES
    ):
        raise DocumentProcessingError(
            f"Unsupported file type: {file_type}"
        )

    path = Path(
        file_path
    )

    if not path.exists():
        raise DocumentProcessingError(
            "Document file does not exist: "
            f"{file_path}"
        )

    try:
        result = (
            document_processing_graph
            .invoke(
                {
                    "file_path": file_path,
                    "source_file_type": (
                        normalized_file_type
                    ),
                    "used_ai_fallback": False,
                    "used_ai_repair": False,
                    "error": None,
                }
            )
        )

    except Exception as exc:
        raise DocumentProcessingError(
            str(exc)
        ) from exc

    transactions = (
        result.get(
            "transactions",
            [],
        )
    )

    if not transactions:
        raise DocumentProcessingError(
            "No valid transactions were found "
            "after document processing."
        )

    return result