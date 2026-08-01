from pathlib import Path

from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract readable text from a digital PDF.

    Page boundaries use form-feed characters so they do not
    accidentally become part of transaction descriptions.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"PDF file not found: {file_path}"
        )

    reader = PdfReader(str(path))

    extracted_pages: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        text = text.strip()

        if text:
            extracted_pages.append(text)

    final_text = "\n\f\n".join(
        extracted_pages
    ).strip()

    if not final_text:
        raise ValueError(
            "No readable text found in this PDF. "
            "It may be scanned or image-based."
        )

    return final_text