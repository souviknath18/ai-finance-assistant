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

        result = 0

        result += min(
            len(text),
            3000,
        ) // 20

        financial_terms = (
            "bank statement",
            "account statement",
            "transaction details",
            "opening balance",
            "closing balance",
            "debit",
            "credit",
            "balance",
            "invoice date",
            "invoice number",
            "grand total",
            "amount payable",
            "bill to",
            "sold by",
        )

        result += sum(
            150
            for term in financial_terms
            if term in lower_text
        )

        transaction_date_count = len(
            re.findall(
                r"\b\d{1,2}\s+"
                r"[A-Za-z]{3,9}\s+"
                r"\d{4}\b",
                text,
                flags=re.IGNORECASE,
            )
        )

        decimal_amount_count = len(
            re.findall(
                r"\b\d[\d,]*\.\d{2}\b",
                text,
            )
        )

        # Bank statements should preserve many dated rows.
        if transaction_date_count >= 3:
            result += (
                transaction_date_count * 100
            )

        if decimal_amount_count >= 6:
            result += (
                decimal_amount_count * 30
            )

        if (
            "transaction details"
            in lower_text
        ):
            result += 800

        if (
            "opening balance"
            in lower_text
            and "closing balance"
            in lower_text
        ):
            result += 500

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