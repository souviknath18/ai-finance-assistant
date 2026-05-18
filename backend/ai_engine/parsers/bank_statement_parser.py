import re
from datetime import date
from decimal import Decimal


MONTH_MAP = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
    "May": 5, "Jun": 6, "Jul": 7, "Aug": 8,
    "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
}


DATE_LINE_PATTERN = re.compile(
    r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(.+)$"
)

AMOUNT_BALANCE_PATTERN = re.compile(
    r"([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$"
)


def extract_statement_year(extracted_text: str) -> int:
    match = re.search(
        r"For\s+\w+\s+\d+\s+to\s+\w+\s+\d+,\s+(\d{4})",
        extracted_text,
    )

    return int(match.group(1)) if match else date.today().year


def should_ignore_description(description: str) -> bool:
    ignored = ["Opening balance", "Closing balance"]

    return any(text.lower() in description.lower() for text in ignored)


def parse_bank_statement_transactions(extracted_text: str):
    year = extract_statement_year(extracted_text)

    lines = [line.strip() for line in extracted_text.splitlines() if line.strip()]

    transactions = []
    current_date = None
    current_description_lines = []

    for line in lines:
        date_match = DATE_LINE_PATTERN.match(line)

        if date_match:
            month_name, day, rest = date_match.groups()
            current_date = date(year, MONTH_MAP[month_name], int(day))
            current_description_lines = [rest]

            possible_transaction = build_transaction_if_complete(
                current_date,
                current_description_lines,
            )

            if possible_transaction:
                transactions.append(possible_transaction)
                current_description_lines = []

            continue

        if current_date:
            current_description_lines.append(line)

            possible_transaction = build_transaction_if_complete(
                current_date,
                current_description_lines,
            )

            if possible_transaction:
                transactions.append(possible_transaction)
                current_description_lines = []

    confidence = calculate_parser_confidence(extracted_text, transactions)

    return {
        "transactions": transactions,
        "confidence": confidence,
        "parser": "generic_bank_statement_parser_v2",
    }


def build_transaction_if_complete(transaction_date, description_lines):
    combined = " ".join(description_lines)

    amount_balance_match = AMOUNT_BALANCE_PATTERN.search(combined)

    if not amount_balance_match:
        return None

    amount, balance = amount_balance_match.groups()

    description = combined[: amount_balance_match.start()].strip()
    description = clean_description(description)

    if not description or should_ignore_description(description):
        return None

    amount_decimal = Decimal(amount.replace(",", ""))
    balance_decimal = Decimal(balance.replace(",", ""))

    transaction_type = detect_transaction_type(description)

    final_amount = amount_decimal if transaction_type == "income" else -amount_decimal

    return {
        "date": transaction_date,
        "description": description,
        "amount": final_amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": balance_decimal,
        "raw_text": combined,
    }


def detect_transaction_type(description: str) -> str:
    income_keywords = [
        "deposit",
        "credit",
        "waiver",
        "refund",
        "reversal",
        "cashback",
        "interest",
    ]

    expense_keywords = [
        "fee",
        "charge",
        "debit",
        "withdrawal",
        "payment",
        "purchase",
    ]

    desc = description.lower()

    if any(keyword in desc for keyword in income_keywords):
        return "income"

    if any(keyword in desc for keyword in expense_keywords):
        return "expense"

    return "expense"


def clean_description(description: str) -> str:
    description = re.sub(r"\s+", " ", description).strip()

    # Remove quantity-like fragments such as "1.0" before amount.
    description = re.sub(r"\b\d+\.\d\b", "", description).strip()

    return description


def calculate_parser_confidence(extracted_text: str, transactions: list) -> float:
    transaction_section_exists = "Transaction details" in extracted_text

    amount_like_count = len(re.findall(r"[\d,]+\.\d{2}\s+[\d,]+\.\d{2}", extracted_text))

    if not transaction_section_exists:
        return 0.2

    if amount_like_count == 0:
        return 0.3

    if len(transactions) >= amount_like_count:
        return 0.95

    if len(transactions) >= 1:
        return 0.65

    return 0.35