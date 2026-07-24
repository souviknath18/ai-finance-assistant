import re


OCR_REPLACEMENTS = {
    "₹": " INR ",
    "Rs.": " INR ",
    "Rs": " INR ",
    "■": " INR ",
}


def normalize_extracted_text(
    extracted_text: str,
) -> str:
    text = str(extracted_text or "")

    for source, replacement in (
        OCR_REPLACEMENTS.items()
    ):
        text = text.replace(
            source,
            replacement,
        )

    normalized_lines = []

    for line in text.splitlines():
        cleaned_line = re.sub(
            r"[ \t]+",
            " ",
            line,
        ).strip()

        if cleaned_line:
            normalized_lines.append(
                cleaned_line
            )

    return "\n".join(
        normalized_lines
    ).strip()