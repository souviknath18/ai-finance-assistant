import re
from datetime import datetime
from decimal import Decimal

from .parser_schema import empty_parser_result
from .transaction_normalizer import (
    build_transaction,
    parse_decimal_amount,
)


FINAL_AMOUNT_LABELS = [
    "amount paid",
    "total paid",
    "grand total",
    "net total",
    "total",
]

DATE_PATTERNS = [
    r"date\s*[:\-]?\s*([^\n]+)",
    r"paid\s+on\s*[:\-]?\s*([^\n]+)",
    r"transaction\s+date\s*[:\-]?\s*([^\n]+)",
]

DATE_FORMATS = [
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%d %b %Y",
    "%d %B %Y",
    "%d-%b-%Y",
]


def parse_receipt_transactions(
    extracted_text: str,
):
    result = empty_parser_result(
        document_type="receipt",
        parser="receipt_parser_v1",
        confidence=0.20,
    )

    merchant_name = extract_merchant_name(
        extracted_text
    )

    amount = extract_paid_amount(
        extracted_text
    )

    receipt_date = extract_receipt_date(
        extracted_text
    )

    receipt_number = extract_receipt_number(
        extracted_text
    )

    if amount is None:
        result["warnings"].append(
            {
                "code": "missing_receipt_amount",
                "message": (
                    "A reliable paid amount could not be found."
                ),
            }
        )

        return result

    transaction = build_transaction(
        transaction_date=receipt_date,
        description=merchant_name or "Receipt payment",
        merchant_name=merchant_name,
        amount=amount,
        transaction_type="expense",
        balance_after_transaction=None,
        reference_number=receipt_number,
        raw_text=extracted_text,
    )

    confidence = Decimal("0.45")

    if merchant_name:
        confidence += Decimal("0.15")

    if receipt_date:
        confidence += Decimal("0.15")
    else:
        result["warnings"].append(
            {
                "code": "missing_receipt_date",
                "message": "Receipt date was not found.",
            }
        )

    if receipt_number:
        confidence += Decimal("0.10")

    if amount is not None:
        confidence += Decimal("0.15")

    result["confidence"] = float(
        min(confidence, Decimal("0.95"))
    )

    result["transactions"] = [transaction]

    result["document_metadata"] = {
        "receipt_number": receipt_number,
        "receipt_date": receipt_date,
        "merchant_name": merchant_name,
        "amount_paid": amount,
    }

    return result


def extract_paid_amount(
    extracted_text: str,
) -> Decimal | None:
    lines = [
        " ".join(line.split())
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    for label in FINAL_AMOUNT_LABELS:
        for line in reversed(lines):
            if label not in line.lower():
                continue

            amounts = extract_amounts(line)

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
        parsed = parse_decimal_amount(value)

        if parsed is not None:
            amounts.append(abs(parsed))

    return amounts


def extract_receipt_number(
    extracted_text: str,
) -> str | None:
    patterns = [
        r"receipt\s*(?:number|no\.?|#)\s*[:\-]?\s*([A-Za-z0-9/_\-]+)",
        r"transaction\s*(?:id|number)\s*[:\-]?\s*([A-Za-z0-9/_\-]+)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

    return None


def extract_receipt_date(
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


def extract_merchant_name(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split())
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    ignored_terms = {
        "receipt",
        "payment receipt",
        "tax receipt",
        "invoice",
        "thank you",
    }

    for line in lines[:8]:
        lower_line = line.lower()

        if any(
            term == lower_line
            or term in lower_line
            for term in ignored_terms
        ):
            continue

        if (
            2 <= len(line.split()) <= 12
            and not re.search(
                r"\d[\d,]*\.\d{2}",
                line,
            )
        ):
            return line[:255]

    return None