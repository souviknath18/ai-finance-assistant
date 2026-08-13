import re
from datetime import date
from decimal import Decimal


SUBSCRIPTION_MERCHANTS = [
    "netflix",
    "spotify",
    "youtube premium",
    "apple icloud",
    "google one",
    "amazon prime",
    "prime membership",
    "adobe",
    "canva",
    "figma",
    "aws",
    "openai",
    "chatgpt",
    "github",
    "notion",
]

AMOUNT_PATTERN = re.compile(
    r"(?:₹|Rs\.?|INR|■|n)\s*([\d,]+(?:\.\d{1,2})?)",
    re.IGNORECASE,
)


def parse_subscription_transactions(extracted_text: str):
    text = extracted_text.lower()

    merchant = extract_subscription_merchant(text)
    amount = extract_subscription_amount(extracted_text)

    if not merchant and not has_subscription_context(text):
        return {
            "transactions": [],
            "confidence": 0.2,
            "parser": "subscription_parser_v1",
        }

    if not amount:
        return {
            "transactions": [],
            "confidence": 0.3,
            "parser": "subscription_parser_v1",
        }

    description = merchant or "Subscription Payment"

    return {
        "transactions": [
            {
                "date": date.today(),
                "description": description,
                "amount": -amount,
                "transaction_type": "expense",
                "balance_after_transaction": None,
                "raw_text": extracted_text[:1000],
            }
        ],
        "confidence": 0.9,
        "parser": "subscription_parser_v1",
    }


def extract_subscription_merchant(text: str):
    for merchant in SUBSCRIPTION_MERCHANTS:
        if merchant in text:
            return merchant.title()

    merchant_match = re.search(r"Merchant:\s*(.+)", text, re.IGNORECASE)

    if merchant_match:
        return merchant_match.group(1).strip()

    return None


def has_subscription_context(text: str):
    keywords = [
        "subscription",
        "recurring billing",
        "billing month",
        "membership",
        "premium",
        "monthly plan",
        "renewal",
        "amount paid",
        "charged",
    ]

    return any(keyword in text for keyword in keywords)


def extract_subscription_amount(text: str):
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    priority_keywords = [
        "amount paid",
        "total paid",
        "charged",
        "amount",
        "total",
    ]

    for keyword in priority_keywords:
        for line in lines:
            if keyword in line.lower():
                amount = extract_last_amount_from_line(line)
                if amount:
                    return amount

    amounts = []

    for line in lines:
        amount = extract_last_amount_from_line(line)

        if amount:
            amounts.append(amount)

    return max(amounts) if amounts else None


def extract_last_amount_from_line(line: str):
    matches = AMOUNT_PATTERN.findall(line)

    if not matches:
        return None

    try:
        return Decimal(matches[-1].replace(",", ""))
    except Exception:
        return None