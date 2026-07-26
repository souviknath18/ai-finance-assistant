import json
import logging
import re
import time
from typing import Any

from decouple import config
from openai import OpenAI
logger = logging.getLogger(__name__)


client = OpenAI(
    api_key=config("OPENAI_API_KEY")
)

MODEL_NAME = "gpt-4.1-mini"
MAX_OCR_CHARACTERS = 12_000
MODEL_CONFIDENCE_CAP = 0.95


def clean_json_output(
    raw_output: str,
) -> str:
    cleaned = str(raw_output or "").strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):]

    elif cleaned.startswith("```"):
        cleaned = cleaned[len("```"):]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    return cleaned.strip()


def clean_text_value(
    value: Any,
    max_length: int = 255,
) -> str | None:
    if value is None:
        return None

    cleaned = " ".join(
        str(value).split()
    ).strip(" ,:-|")

    if not cleaned:
        return None

    return cleaned[:max_length]


def normalize_confidence(
    value: Any,
) -> float:
    try:
        confidence = float(value)
    except (TypeError, ValueError):
        return 0.0

    confidence = max(
        0.0,
        min(
            confidence,
            MODEL_CONFIDENCE_CAP,
        ),
    )

    return round(
        confidence,
        2,
    )


MIN_ACCEPTED_CONFIDENCE = 0.55

def adjust_confidence_for_fields(
    confidence: float,
    merchant_name: str | None,
    service_description: str | None,
) -> float:
    if merchant_name and service_description:
        cap = 0.95

    elif merchant_name or service_description:
        cap = 0.75

    else:
        return 0.0

    return round(
        min(confidence, cap),
        2,
    )


def is_valid_merchant_name(
    value: str | None,
) -> bool:
    if not value:
        return False

    cleaned = clean_text_value(
        value,
        max_length=255,
    )

    if not cleaned:
        return False

    if len(cleaned) < 3:
        return False

    if not re.search(
        r"[A-Za-z]",
        cleaned,
    ):
        return False

    lower_value = cleaned.lower()

    rejected_terms = (
        "tax invoice",
        "invoice number",
        "invoice no",
        "invoice date",
        "bill to",
        "ship to",
        "customer name",
        "customer details",
        "net amount",
        "total amount",
        "grand total",
        "subtotal",
        "description",
        "item description",
        "product description",
        "place of supply",
        "payment status",
        "payment method",
        "authorized signatory",
        "authorised signatory",
    )

    if any(
        term in lower_value
        for term in rejected_terms
    ):
        return False

    if re.fullmatch(
        r"(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*(?:\.\d{1,2})?",
        cleaned,
        flags=re.IGNORECASE,
    ):
        return False

    return True


def clean_ai_merchant_name(
    value: str | None,
) -> str | None:
    cleaned = clean_text_value(
        value,
        max_length=255,
    )

    if not cleaned:
        return None

    cleaned = " ".join(
        cleaned.split()
    )

    ocr_replacements = (
        (r"\blnvoice\b", "invoice"),
        (r"\binv0ice\b", "invoice"),
        (r"\binv0lce\b", "invoice"),
        (r"\binvo1ce\b", "invoice"),
        (r"\binvolce\b", "invoice"),
        (r"\bwrcice\b", "invoice"),
    )

    for pattern, replacement in ocr_replacements:
        cleaned = re.sub(
            pattern,
            replacement,
            cleaned,
            flags=re.IGNORECASE,
        )

    metadata_patterns = (
        r"\s+tax\s+invoice\b.*$",
        r"\s+invoice\s+date\b.*$",
        r"\s+invoice\s*(?:number|no\.?|#)\b.*$",
        r"\s+bill\s+date\b.*$",
        r"\s+bill\s*(?:number|no\.?|#)\b.*$",
        r"\s+order\s*(?:id|number|no\.?|#)\b.*$",
        r"\s+gstin\b.*$",
        r"\s+place\s+of\s+supply\b.*$",
        r"\s+payment\s+(?:status|method)\b.*$",
        r"\s+subtotal\b.*$",
        r"\s+grand\s+total\b.*$",
        r"\s+tax\s+amount\b.*$",
        r"\s+hsn\b.*$",
        r"\s+sac\b.*$",
        r"\s+cgst\b.*$",
        r"\s+sgst\b.*$",
        r"\s+igst\b.*$",
    )

    for pattern in metadata_patterns:
        cleaned = re.sub(
            pattern,
            "",
            cleaned,
            flags=re.IGNORECASE,
        )

    cleaned = cleaned.strip(
        " ,:-|"
    )

    return cleaned or None


def is_table_heading_description(
    value: str,
) -> bool:
    words = re.findall(
        r"[A-Za-z]+",
        value.lower(),
    )

    if not words:
        return True

    heading_words = {
        "description",
        "item",
        "items",
        "product",
        "products",
        "particulars",
        "quantity",
        "qty",
        "rate",
        "price",
        "amount",
        "tax",
        "total",
        "subtotal",
        "discount",
        "net",
        "gross",
        "hsn",
        "sac",
        "cgst",
        "sgst",
        "igst",
        "value",
        "unit",
    }

    heading_word_count = sum(
        1
        for word in words
        if word in heading_words
    )

    return (
        heading_word_count / len(words)
        >= 0.60
    )


def is_valid_service_description(
    value: str | None,
) -> bool:
    if not value:
        return False

    cleaned = clean_text_value(
        value,
        max_length=500,
    )

    if not cleaned:
        return False

    if len(cleaned) < 3:
        return False

    if not re.search(
        r"[A-Za-z]",
        cleaned,
    ):
        return False

    lower_value = cleaned.lower()

    ocr_replacements = {
        "wrcice": "invoice",
        "lnvoice": "invoice",
        "inv0ice": "invoice",
        "inv0lce": "invoice",
        "invo1ce": "invoice",
    }

    for wrong, correct in ocr_replacements.items():
        lower_value = lower_value.replace(
            wrong,
            correct,
        )

    rejected_terms = (
        "net amount",
        "total amount",
        "taxable value",
        "tax amount",
        "grand total",
        "subtotal",
        "invoice date",
        "invoice number",
        "invoice no",
        "bill to",
        "ship to",
        "place of supply",
        "payment method",
        "payment status",
        "track your order",
        "customer support",
        "amazon support",
        "thank you for shopping",
        "authorized signatory",
        "authorised signatory",
        "amount in words",
        "reverse charge",
    )

    if any(
        term in lower_value
        for term in rejected_terms
    ):
        return False

    if is_table_heading_description(
        lower_value
    ):
        return False

    if re.fullmatch(
        r"(?:₹|INR|Rs\.?)?\s*"
        r"-?\d[\d,]*(?:\.\d{1,2})?",
        cleaned,
        flags=re.IGNORECASE,
    ):
        return False

    return True


def build_failed_result(
    reason: str,
) -> dict:
    return {
        "merchant_name": None,
        "service_description": None,
        "confidence": 0.0,
        "reason": reason,
        "matched": False,
    }


def clean_ai_service_description(
    value: str | None,
) -> str | None:
    cleaned = clean_text_value(
        value,
        max_length=500,
    )

    if not cleaned:
        return None

    cleaned = re.sub(
        r"\s+(?:invoice|lnvoice|inv0ice|wrcice)"
        r"\s+(?:date|number|no\.?|#)\b.*$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s+(?:qty|quantity|rate|price|amount|gst|tax)"
        r"\s*[:\-]?\s*.*$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    return cleaned.strip(
        " ,:-|"
    ) or None


def validate_ai_invoice_output(
    data: Any,
) -> dict:
    if not isinstance(data, dict):
        return build_failed_result(
            "AI invoice extraction returned an invalid format."
        )

    merchant_name = clean_ai_merchant_name(
        data.get("merchant_name")
    )

    service_description = clean_ai_service_description(
        data.get("service_description")
    )

    confidence = normalize_confidence(
        data.get("confidence")
    )

    reason = clean_text_value(
        data.get("reason"),
        max_length=500,
    )

    if not is_valid_merchant_name(
        merchant_name
    ):
        merchant_name = None

    if not is_valid_service_description(
        service_description
    ):
        service_description = None

    confidence = adjust_confidence_for_fields(
        confidence=confidence,
        merchant_name=merchant_name,
        service_description=service_description,
    )

    matched = (
        confidence >= MIN_ACCEPTED_CONFIDENCE
        and (
            merchant_name
            or service_description
        )
    )

    if not matched:
        merchant_name = None
        service_description = None
        confidence = 0.0

    return {
        "merchant_name": merchant_name,
        "service_description": service_description,
        "confidence": confidence,
        "reason": (
            reason
            or "AI extracted invoice semantic fields."
        ),
        "matched": matched,
    }


def extract_invoice_fields(
    extracted_text: str,
) -> dict:
    safe_text = str(
        extracted_text or ""
    )[:MAX_OCR_CHARACTERS]

    if not safe_text.strip():
        return build_failed_result(
            "No OCR text was provided."
        )

    prompt = f"""
You are a strict invoice semantic-field extraction system.

Your task is to extract only the semantic information needed
to understand the purchase.

Extract exactly these fields:

1. merchant_name
   The seller, business, company, provider, store, platform,
   or legal entity that issued the invoice.

2. service_description
   The actual product, subscription, plan, service, repair,
   booking, purchase, or work paid for.

3. confidence
   Confidence in the extracted merchant and product or service.

4. reason
   A short explanation of the evidence used.

Important merchant rules:

- Return the invoice issuer, seller, provider, or merchant.
- Do not return the customer, buyer, shipping recipient,
  billing recipient, or employee.
- Do not return an address as the merchant.
- A legal business name is preferred when clearly available.
- A brand name is acceptable when the legal name is unclear.
- Do not combine the merchant with invoice metadata.
- Return null when the merchant cannot be identified reliably.
- Return only the merchant name.
- Remove invoice date, invoice number, GSTIN, address,
  payment status, and any OCR-corrupted invoice labels
  accidentally attached to the merchant name.

Important description rules:

- Return the actual purchased product or service.
- If the invoice contains multiple purchased products or
  services, return a concise summary of the primary
  purchased items.

  Good examples:

  Bluetooth headphones, USB-C cable and power bank

  Groceries and household supplies

  Office stationery

  Electronics accessories

- Maximum 120 characters.

- Do not list prices, quantities, taxes, invoice metadata,
  GST, HSN, SAC codes or table values.
- Prefer a specific product name over a generic table heading.
- Prefer a specific service name over the merchant name.
- Keep the description concise but informative.
- Do not include the merchant name inside the description.
- Do not include price, quantity, tax, GST, HSN, SAC,
  invoice number, invoice date, payment method, or address.
- Do not return a table heading.
- Do not return totals, subtotals, tax labels, footer text,
  support text, marketing content, or legal disclaimers.
- Correct obvious OCR errors only when the intended value
  is reasonably clear.
- Do not invent a product or service.
- Return null when the product or service cannot be identified.

Invalid descriptions include:

- Net Amount Tax Tax Total Amount
- Description Qty Rate Amount
- Invoice Date
- Grand Total
- Taxable Value
- Customer Support
- Track Your Order
- Authorized Signatory

Confidence rules:

- 0.90 to 0.95:
  Merchant and purchased item or service are explicit.
- 0.75 to 0.89:
  Evidence is strong but one field has mild ambiguity.
- 0.55 to 0.74:
  Evidence is incomplete or affected by OCR noise.
- Below 0.55:
  Evidence is weak or highly ambiguous.
- Never return 1.0.
- Maximum confidence is 0.95.

Return valid JSON only:

{{
    "merchant_name": "string or null",
    "service_description": "string or null",
    "confidence": 0.0,
    "reason": "brief explanation"
}}

INVOICE OCR TEXT:

{safe_text}
"""

    try:
        start_time = time.perf_counter()

        response = client.responses.create(
            model=MODEL_NAME,
            input=[
                {
                    "role": "system",
                    "content": (
                        "You extract merchant and purchased "
                        "product or service fields from invoice OCR. "
                        "Return valid JSON only. Never invent values."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0,
        )
        elapsed_ms = (
            time.perf_counter() - start_time
        ) * 1000
    except Exception:
        logger.exception(
            "AI invoice extraction request failed"
        )

        return build_failed_result(
            "The AI invoice extraction request failed."
        )

    raw_output = str(
        response.output_text or ""
    ).strip()

    # print(
    #     "AI invoice extraction raw output:",
    #     raw_output,
    # )

    cleaned_output = clean_json_output(
        raw_output
    )

    try:
        parsed_data = json.loads(
            cleaned_output
        )
    except json.JSONDecodeError:
        logger.warning(
            "AI invoice extraction returned invalid JSON"
        )

        return build_failed_result(
            "AI invoice extraction returned invalid JSON."
        )

    result = validate_ai_invoice_output(
        parsed_data
    )

    logger.info(
        "AI invoice extraction completed",
        extra={
            "matched": result["matched"],
            "confidence": result["confidence"],
            "latency_ms": round(elapsed_ms),
            "merchant_found": bool(
                result["merchant_name"]
            ),
            "description_found": bool(
                result["service_description"]
            ),
        },
    )

    return result