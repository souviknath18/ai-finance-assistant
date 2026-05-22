import re
from datetime import date
from decimal import Decimal


AMOUNT_PATTERN = re.compile(
    r"(?:₹|Rs\.?|INR|■|n)\s*([\d,]+(?:\.\d{1,2})?)",
    re.IGNORECASE,
)

DATE_PATTERN = re.compile(
    r"(\d{1,2})\s+"
    r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December)"
    r"\s+(\d{4})",
    re.IGNORECASE,
)

MONTH_MAP = {
    "jan": 1, "january": 1,
    "feb": 2, "february": 2,
    "mar": 3, "march": 3,
    "apr": 4, "april": 4,
    "may": 5,
    "jun": 6, "june": 6,
    "jul": 7, "july": 7,
    "aug": 8, "august": 8,
    "sep": 9, "september": 9,
    "oct": 10, "october": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}


def parse_receipt_invoice_transactions(extracted_text: str):
    merchant = extract_merchant(extracted_text)
    amount = extract_total_amount(extracted_text)
    transaction_date = extract_document_date(extracted_text)

    if not amount:
        return {
            "transactions": [],
            "confidence": 0.2,
            "parser": "receipt_invoice_parser_v1",
        }

    description = merchant or extract_title(extracted_text) or "Receipt / Invoice Payment"

    transaction = {
        "date": transaction_date,
        "description": description,
        "amount": -amount,
        "transaction_type": "expense",
        "balance_after_transaction": None,
        "raw_text": extracted_text[:1000],
    }

    return {
        "transactions": [transaction],
        "confidence": 0.8,
        "parser": "receipt_invoice_parser_v1",
    }


def extract_merchant(text: str):
    patterns = [
        r"Merchant:\s*(.+)",
        r"Provider:\s*(.+)",
        r"Restaurant:\s*(.+)",
        r"Sold By:\s*(.+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()

    lower_text = text.lower()

    known_merchants = [
        "airbnb",
        "amazon",
        "netflix",
        "swiggy",
        "zomato",
        "apollo",
        "bescom",
        "spotify",
        "uber",
    ]

    for merchant in known_merchants:
        if merchant in lower_text:
            return merchant.title()

    return None


def extract_total_amount(text: str):
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    priority_keywords = [
        "total due",
        "grand total",
        "amount paid",
        "total",
    ]

    for keyword in priority_keywords:
        for line in lines:
            if keyword in line.lower():
                amount = extract_last_amount_from_line(line)
                if amount:
                    return amount

    amounts = []

    ignored_lines = [
        "invoice id",
        "invoice no",
        "invoice number",
        "order id",
        "consumer id",
        "consumer number",
        "billing period",
    ]

    for line in lines:
        lower_line = line.lower()

        if any(ignored in lower_line for ignored in ignored_lines):
            continue

        amount = extract_last_amount_from_line(line)

        if amount:
            amounts.append(amount)

    return max(amounts) if amounts else None


def extract_last_amount_from_line(line: str):
    matches = AMOUNT_PATTERN.findall(line)

    if not matches:
        return None

    raw_amount = matches[-1].replace(",", "")

    try:
        return Decimal(raw_amount)
    except Exception:
        return None


def extract_document_date(text: str):
    match = DATE_PATTERN.search(text)

    if not match:
        return date.today()

    day, month, year = match.groups()

    return date(
        int(year),
        MONTH_MAP[month.lower()],
        int(day),
    )


def extract_title(text: str):
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    if not lines:
        return None

    return lines[0][:120]