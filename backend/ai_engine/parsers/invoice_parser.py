import re
from datetime import datetime
from decimal import Decimal

from .parser_schema import (
    empty_parser_result,
)
from .transaction_normalizer import (
    build_transaction,
    parse_decimal_amount,
)


FINAL_TOTAL_LABELS = [
    "total amount payable",
    "amount payable",
    "net amount payable",
    "net amount",
    "grand total",
    "invoice total",
    "total due",
    "amount paid",
    "total amount",
]

REJECTED_TOTAL_CONTEXT = {
    "taxable",
    "gst",
    "tax amount",
    "discount",
    "subtotal",
    "previous paid",
    "previous balance",
}

LEGAL_ENTITY_PATTERNS = [
    r"\bpvt\.?\s*ltd\.?\b",
    r"\bprivate\s+limited\b",
    r"\blimited\b",
    r"\bllp\b",
    r"\binc\.?\b",
    r"\bcorporation\b",
    r"\btechnologies\b",
]

MERCHANT_BUSINESS_PATTERNS = [
    r"\bstore\b",
    r"\brestaurant\b",
    r"\broasters\b",
    r"\bcafe\b",
    r"\bservices\b",
    r"\bsolutions\b",
]

MERCHANT_REJECTED_TERMS = {
    "tax invoice",
    "invoice",
    "bill to",
    "ship to",
    "invoice number",
    "invoice no",
    "invoice date",
    "reverse charge",
    "place of supply",
    "payment status",
    "payment method",
    "transaction id",
    "gstin",
    "cin:",
    "road",
    "street",
    "floor",
    "sector",
    "layout",
    "address",
    "mobile",
    "phone",
    "email",
    "website",
    "gurgaon",
    "bangalore",
    "karnataka",
    "haryana",
    "india",
}

INVOICE_NUMBER_PATTERNS = [
    r"invoice\s*(?:number|no\.?|#)\s*[:\-]?\s*([A-Za-z0-9/_\-]+)",
    r"bill\s*(?:number|no\.?|#)\s*[:\-]?\s*([A-Za-z0-9/_\-]+)",
]

DATE_PATTERNS = [
    r"invoice\s+date\s*[:\-]?\s*([^\n]+)",
    r"bill\s+date\s*[:\-]?\s*([^\n]+)",
    r"date\s*[:\-]?\s*([^\n]+)",
]

DATE_FORMATS = [
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%d %b %Y",
    "%d %B %Y",
    "%d-%b-%Y",
    "%d-%B-%Y",
]


def build_invoice_description(
    merchant_name: str | None,
    service_description: str | None,
) -> str:
    if merchant_name and service_description:
        return (
            f"{service_description} purchased from "
            f"{merchant_name}"
        )[:500]

    if service_description:
        return service_description[:500]

    if merchant_name:
        return f"Invoice payment to {merchant_name}"[:500]

    return "Invoice payment"


def parse_invoice_transactions(
    extracted_text: str,
):
    result = empty_parser_result(
        document_type="invoice",
        parser="invoice_parser_v1",
        confidence=0.20,
    )

    merchant_name = extract_merchant_name(
        extracted_text
    )

    amount = extract_final_total(
        extracted_text
    )

    invoice_date = extract_invoice_date(
        extracted_text
    )

    invoice_number = extract_invoice_number(
        extracted_text
    )

    service_description = extract_invoice_service_description(
        extracted_text
    )

    print("\n========== INVOICE DEBUG ==========")
    print("Merchant:", merchant_name)
    print("Service:", service_description)
    print("==================================\n")

    if amount is None:
        result["warnings"].append(
            {
                "code": "missing_invoice_total",
                "message": (
                    "A reliable final invoice total "
                    "could not be found."
                ),
            }
        )

        return result

    transaction = build_transaction(
        transaction_date=invoice_date,
        description=build_invoice_description(
            merchant_name=merchant_name,
            service_description=service_description,
        ),
        merchant_name=merchant_name,
        amount=amount,
        transaction_type="expense",
        balance_after_transaction=None,
        reference_number=invoice_number,
        raw_text=extracted_text,
    )

    confidence = Decimal("0.45")

    if merchant_name:
        confidence += Decimal("0.15")

    if invoice_date:
        confidence += Decimal("0.15")
    else:
        result["warnings"].append(
            {
                "code": "missing_invoice_date",
                "message": (
                    "Invoice date was not found."
                ),
            }
        )

    if invoice_number:
        confidence += Decimal("0.10")

    if amount is not None:
        confidence += Decimal("0.15")

    result["confidence"] = float(
        min(
            confidence,
            Decimal("0.95"),
        )
    )

    result["transactions"] = [
        transaction
    ]

    result["document_metadata"] = {
        "invoice_number": invoice_number,
        "invoice_date": invoice_date,
        "merchant_name": merchant_name,
        "service_description": service_description,
        "final_total": amount,
    }

    return result


def extract_final_total(
    extracted_text: str,
) -> Decimal | None:
    lines = [
        " ".join(line.split())
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    for label in FINAL_TOTAL_LABELS:
        for line in reversed(lines):
            lower_line = line.lower()

            if label not in lower_line:
                continue

            if any(
                rejected in lower_line
                for rejected in (
                    REJECTED_TOTAL_CONTEXT
                )
            ):
                continue

            amounts = extract_amounts(
                line
            )

            if amounts:
                return amounts[-1]

    return None


def extract_amounts(
    line: str,
) -> list[Decimal]:
    values = re.findall(
        r"(?:₹|INR|Rs\.?)?\s*"
        r"(-?\d[\d,]*\.\d{1,2})",
        line,
        flags=re.IGNORECASE,
    )

    amounts = []

    for value in values:
        parsed = parse_decimal_amount(
            value
        )

        if parsed is not None:
            amounts.append(
                abs(parsed)
            )

    return amounts


def extract_invoice_number(
    extracted_text: str,
) -> str | None:
    for pattern in INVOICE_NUMBER_PATTERNS:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

    return None


def extract_invoice_date(
    extracted_text: str,
):
    for pattern in DATE_PATTERNS:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        candidate = (
            match.group(1)
            .splitlines()[0]
            .strip(" :-")
        )

        for date_format in DATE_FORMATS:
            try:
                return datetime.strptime(
                    candidate,
                    date_format,
                ).date()
            except ValueError:
                continue

    return None


def clean_merchant_candidate(
    line: str,
) -> str:
    metadata_patterns = [
        r"\s+invoice\s+date\s*[:\-].*$",
        r"\s+invoice\s+(?:number|no\.?|#)\s*[:\-].*$",
        r"\s+bill\s+date\s*[:\-].*$",
        r"\s+place\s+of\s+supply\s*[:\-].*$",
        r"\s+reverse\s+charge\s*[:\-].*$",
        r"\s+payment\s+status\s*[:\-].*$",
    ]

    cleaned = line

    for pattern in metadata_patterns:
        cleaned = re.sub(
            pattern,
            "",
            cleaned,
            flags=re.IGNORECASE,
        )

    return cleaned.strip(" ,:-")


def extract_merchant_name(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    candidates = []

    for index, original_line in enumerate(lines[:20]):
        line = clean_merchant_candidate(
            original_line
        )

        lower_line = line.lower()

        if len(line) < 3 or len(line) > 180:
            continue

        if any(
            rejected_term in lower_line
            for rejected_term in MERCHANT_REJECTED_TERMS
        ):
            continue

        if re.search(
            r"\b\d{5,6}\b",
            line,
        ):
            continue

        if re.search(
            r"\b(?:road|street|floor|sector|layout|cross|main)\b",
            line,
            flags=re.IGNORECASE,
        ):
            continue

        legal_entity_match = any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in LEGAL_ENTITY_PATTERNS
        )

        business_name_match = any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in MERCHANT_BUSINESS_PATTERNS
        )

        if not legal_entity_match and not business_name_match:
            continue

        score = max(0, 10 - index)

        if legal_entity_match:
            score += 5

        if business_name_match:
            score += 2

        if re.fullmatch(
            r"[A-Za-z0-9&.,'()\- ]+",
            line,
        ):
            score += 1

        candidates.append(
            {
                "value": line[:255],
                "score": score,
            }
        )

    if not candidates:
        return None

    candidates.sort(
        key=lambda candidate: candidate["score"],
        reverse=True,
    )

    return candidates[0]["value"]


SERVICE_DESCRIPTION_PATTERNS = [
    r"service\s+type\s*[:\-]\s*([^\n]+)",
    r"service\s+description\s*[:\-]\s*([^\n]+)",
    r"item\s+description\s*[:\-]\s*([^\n]+)",
    r"description\s*[:\-]\s*([^\n]+)",
]


def extract_invoice_service_description(
    extracted_text: str,
) -> str | None:
    for pattern in SERVICE_DESCRIPTION_PATTERNS:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        value = (
            match.group(1)
            .splitlines()[0]
            .strip(" :-")
        )

        if (
            value
            and len(value) >= 3
            and not re.fullmatch(
                r"[\d,.\-₹ ]+",
                value,
            )
        ):
            return value[:255]

    # Fallback for common invoice table rows.
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    rejected_terms = {
        "description",
        "hsn",
        "sac",
        "subtotal",
        "sub total",
        "grand total",
        "total amount",
        "cgst",
        "sgst",
        "igst",
        "discount",
        "convenience fee",
    }

    for line in lines:
        lower_line = line.lower()

        if any(
            term in lower_line
            for term in rejected_terms
        ):
            continue

        if re.search(
            r"\b(?:service|cleaning|repair|maintenance|consulting|subscription)\b",
            lower_line,
        ):
            return line[:255]

    return None