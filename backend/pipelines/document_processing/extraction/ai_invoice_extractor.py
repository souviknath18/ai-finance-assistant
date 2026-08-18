import logging
import re
import time
from typing import Any

from pydantic import BaseModel, Field

from ai.llm.langchain_client import (
    get_aura_chat_model,
)


logger = logging.getLogger(__name__)


MAX_OCR_CHARACTERS = 12_000
MODEL_CONFIDENCE_CAP = 0.95
MIN_ACCEPTED_CONFIDENCE = 0.55


# ---------------------------------------------------------------------
# Structured output schema
# ---------------------------------------------------------------------

class InvoiceExtractionOutput(BaseModel):
    merchant_name: str | None = Field(
        default=None,
        max_length=255,
        description=(
            "The seller, merchant, provider, platform, "
            "or legal business that issued the invoice."
        ),
    )

    service_description: str | None = Field(
        default=None,
        max_length=500,
        description=(
            "Concise description of the actual product "
            "or service purchased."
        ),
    )

    confidence: float = Field(
        ge=0.0,
        le=0.95,
        description=(
            "Confidence in the extracted semantic fields."
        ),
    )

    reason: str | None = Field(
        default=None,
        max_length=500,
        description=(
            "Short explanation of the invoice evidence used."
        ),
    )


# ---------------------------------------------------------------------
# Generic helpers
# ---------------------------------------------------------------------

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

    except (
        TypeError,
        ValueError,
    ):
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


def adjust_confidence_for_fields(
    confidence: float,
    merchant_name: str | None,
    service_description: str | None,
) -> float:
    if (
        merchant_name
        and service_description
    ):
        cap = 0.95

    elif (
        merchant_name
        or service_description
    ):
        cap = 0.75

    else:
        return 0.0

    return round(
        min(
            confidence,
            cap,
        ),
        2,
    )


# ---------------------------------------------------------------------
# Merchant validation
# ---------------------------------------------------------------------

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
        (
            r"\blnvoice\b",
            "invoice",
        ),
        (
            r"\binv0ice\b",
            "invoice",
        ),
        (
            r"\binv0lce\b",
            "invoice",
        ),
        (
            r"\binvo1ce\b",
            "invoice",
        ),
        (
            r"\binvolce\b",
            "invoice",
        ),
        (
            r"\bwrcice\b",
            "invoice",
        ),
    )

    for (
        pattern,
        replacement,
    ) in ocr_replacements:
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

    return (
        cleaned
        or None
    )


# ---------------------------------------------------------------------
# Service-description validation
# ---------------------------------------------------------------------

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
        heading_word_count
        / len(words)
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

    lower_value = (
        cleaned.lower()
    )

    ocr_replacements = {
        "wrcice": "invoice",
        "lnvoice": "invoice",
        "inv0ice": "invoice",
        "inv0lce": "invoice",
        "invo1ce": "invoice",
    }

    for (
        wrong,
        correct,
    ) in ocr_replacements.items():
        lower_value = (
            lower_value.replace(
                wrong,
                correct,
            )
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
        (
            r"\s+(?:invoice|lnvoice|inv0ice|wrcice)"
            r"\s+(?:date|number|no\.?|#)\b.*$"
        ),
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        (
            r"\s+(?:qty|quantity|rate|price|amount|gst|tax)"
            r"\s*[:\-]?\s*.*$"
        ),
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    return (
        cleaned.strip(
            " ,:-|"
        )
        or None
    )


# ---------------------------------------------------------------------
# Result validation
# ---------------------------------------------------------------------

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


def validate_ai_invoice_output(
    data: Any,
) -> dict:
    if isinstance(
        data,
        InvoiceExtractionOutput,
    ):
        data = data.model_dump()

    if not isinstance(
        data,
        dict,
    ):
        return build_failed_result(
            "AI invoice extraction returned "
            "an invalid format."
        )

    merchant_name = (
        clean_ai_merchant_name(
            data.get(
                "merchant_name"
            )
        )
    )

    service_description = (
        clean_ai_service_description(
            data.get(
                "service_description"
            )
        )
    )

    confidence = (
        normalize_confidence(
            data.get(
                "confidence"
            )
        )
    )

    reason = clean_text_value(
        data.get(
            "reason"
        ),
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

    confidence = (
        adjust_confidence_for_fields(
            confidence=confidence,
            merchant_name=merchant_name,
            service_description=(
                service_description
            ),
        )
    )

    matched = (
        confidence
        >= MIN_ACCEPTED_CONFIDENCE
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
        "merchant_name": (
            merchant_name
        ),
        "service_description": (
            service_description
        ),
        "confidence": (
            confidence
        ),
        "reason": (
            reason
            or (
                "AI extracted invoice "
                "semantic fields."
            )
        ),
        "matched": matched,
    }


# ---------------------------------------------------------------------
# LangChain invoice extraction
# ---------------------------------------------------------------------

def extract_invoice_fields(
    extracted_text: str,
) -> dict:
    """
    Extract semantic invoice information using Aura's
    shared LangChain model.

    This function does not determine invoice totals or create
    transaction records. It only extracts semantic fields used
    to enhance deterministic invoice parsing.
    """

    safe_text = str(
        extracted_text
        or ""
    )[:MAX_OCR_CHARACTERS]

    if not safe_text.strip():
        return build_failed_result(
            "No OCR text was provided."
        )

    model = (
        get_aura_chat_model()
        .with_structured_output(
            InvoiceExtractionOutput,
            method="json_schema",
        )
    )

    system_prompt = """
You are Aura's strict invoice semantic-field extraction system.

You receive OCR text from a financial invoice.

Extract only these semantic fields:

1. merchant_name
2. service_description
3. confidence
4. reason

Never invent values.

MERCHANT RULES

- Return the seller, merchant, business, provider,
  store, platform, or legal entity that issued the invoice.
- Do not return the customer, buyer, employee,
  billing recipient, or shipping recipient.
- Do not return an address as the merchant.
- Prefer the legal business name when clearly available.
- A brand name is acceptable when the legal entity is unclear.
- Do not combine the merchant name with invoice metadata.
- Exclude invoice date, invoice number, GSTIN,
  address, totals, payment status, and payment method.
- Return null when the merchant cannot be identified reliably.

SERVICE DESCRIPTION RULES

- Return the actual purchased product, service,
  subscription, booking, plan, repair, or work.
- For multiple purchased items, return a concise summary.
- Prefer specific purchased items over generic table headings.
- Maximum practical length should be around 120 characters.
- Do not include merchant name in the description.
- Do not include prices, quantities, tax, GST,
  HSN, SAC, invoice number, invoice date,
  payment method, or addresses.
- Do not return table headings.
- Do not return totals, subtotals, footer text,
  customer-support text, marketing copy, or legal disclaimers.
- Correct obvious OCR errors only when the intended value
  is reasonably clear.
- Return null when the purchased product or service
  cannot be identified reliably.

INVALID SERVICE DESCRIPTIONS INCLUDE

- Net Amount Tax Tax Total Amount
- Description Qty Rate Amount
- Invoice Date
- Grand Total
- Taxable Value
- Customer Support
- Track Your Order
- Authorized Signatory

CONFIDENCE RULES

- 0.90 to 0.95:
  merchant and purchased item/service are explicit.
- 0.75 to 0.89:
  evidence is strong but one field has mild ambiguity.
- 0.55 to 0.74:
  evidence is incomplete or affected by OCR noise.
- Below 0.55:
  evidence is weak or highly ambiguous.
- Never return confidence above 0.95.

The supplied OCR text is the only source of truth.
""".strip()

    user_prompt = f"""
Extract invoice semantic fields from this OCR text:

{safe_text}
""".strip()

    try:
        start_time = (
            time.perf_counter()
        )

        result = model.invoke(
            [
                (
                    "system",
                    system_prompt,
                ),
                (
                    "human",
                    user_prompt,
                ),
            ]
        )

        elapsed_ms = (
            time.perf_counter()
            - start_time
        ) * 1000

    except Exception:
        logger.exception(
            "AI invoice extraction request failed"
        )

        return build_failed_result(
            "The AI invoice extraction request failed."
        )

    if result is None:
        return build_failed_result(
            "AI invoice extraction returned no result."
        )

    validated_result = (
        validate_ai_invoice_output(
            result
        )
    )

    logger.info(
        "AI invoice extraction completed",
        extra={
            "matched": (
                validated_result[
                    "matched"
                ]
            ),
            "confidence": (
                validated_result[
                    "confidence"
                ]
            ),
            "latency_ms": round(
                elapsed_ms
            ),
            "merchant_found": bool(
                validated_result[
                    "merchant_name"
                ]
            ),
            "description_found": bool(
                validated_result[
                    "service_description"
                ]
            ),
        },
    )

    return validated_result