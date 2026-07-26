import re
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import pytesseract
import os

if os.name == "nt":
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Prepare an uploaded financial document image for OCR.
    """

    image = ImageOps.exif_transpose(image)

    image = image.convert("L")

    image = ImageOps.autocontrast(image)

    image = image.resize(
        (
            image.width * 2,
            image.height * 2,
        )
    )

    image = image.filter(ImageFilter.SHARPEN)

    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.5)

    return image


def extract_text_from_image(
    image_path: str,
) -> str:
    try:
        with Image.open(image_path) as image:
            processed_image = preprocess_image(
                image
            )

            text_psm_4 = pytesseract.image_to_string(
                processed_image,
                lang="eng",
                config="--oem 3 --psm 4",
            ).strip()

            text_psm_6 = pytesseract.image_to_string(
                processed_image,
                lang="eng",
                config="--oem 3 --psm 6",
            ).strip()

            extracted_text = choose_best_ocr_text(
                text_psm_4,
                text_psm_6,
            )

    except Exception as error:
        raise ValueError(
            f"Image OCR failed: {error}"
        ) from error

    if not extracted_text:
        raise ValueError(
            "No readable text was found in the uploaded image."
        )

    if len(extracted_text) < 10:
        raise ValueError(
            "The uploaded image does not contain enough "
            "readable financial data."
        )

    return extracted_text


def choose_best_ocr_text(
    *candidates: str,
) -> str:
    def score(text: str) -> int:
        lower_text = text.lower()

        important_terms = (
            "invoice date",
            "invoice number",
            "invoice value",
            "grand total",
            "amount payable",
            "bill to",
            "sold by",
        )

        date_patterns = (
            r"\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b",
            r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b",
            r"\b\d{4}-\d{1,2}-\d{1,2}\b",
        )

        result = 0

        # Small reward for readable content.
        result += min(len(text), 2000) // 20

        # Strong reward for financial labels.
        result += sum(
            300
            for term in important_terms
            if term in lower_text
        )

        # Strong reward for a complete invoice date.
        if (
            "invoice date" in lower_text
            and any(
                re.search(
                    pattern,
                    text,
                    flags=re.IGNORECASE,
                )
                for pattern in date_patterns
            )
        ):
            result += 1000

        # Reward invoice value containing a decimal amount.
        if re.search(
            r"invoice\s+value.{0,20}"
            r"\d[\d,]*\.\d{2}",
            text,
            flags=re.IGNORECASE,
        ):
            result += 600

        return result

    valid_candidates = [
        text
        for text in candidates
        if text.strip()
    ]

    if not valid_candidates:
        return ""

    return max(
        valid_candidates,
        key=score,
    )