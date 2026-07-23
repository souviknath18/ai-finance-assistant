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


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from a JPG, JPEG, or PNG financial document.
    """

    try:
        with Image.open(image_path) as image:
            processed_image = preprocess_image(image)

            extracted_text = pytesseract.image_to_string(
                processed_image,
                lang="eng",
                config="--oem 3 --psm 6",
            )

    except Exception as error:
        raise ValueError(
            f"Image OCR failed: {error}"
        ) from error

    extracted_text = extracted_text.strip()

    if not extracted_text:
        raise ValueError(
            "No readable text was found in the uploaded image."
        )

    if len(extracted_text) < 10:
        raise ValueError(
            "The uploaded image does not contain enough readable financial data."
        )

    return extracted_text