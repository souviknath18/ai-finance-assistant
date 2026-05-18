from pathlib import Path
from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract readable text from a digital PDF.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {file_path}")

    reader = PdfReader(str(path))

    extracted_pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        if text.strip():
            extracted_pages.append(
                f"\n--- Page {page_number} ---\n{text.strip()}"
            )

    final_text = "\n".join(extracted_pages).strip()

    if not final_text:
        raise ValueError(
            "No readable text found in this PDF. It may be scanned or image-based."
        )

    return final_text