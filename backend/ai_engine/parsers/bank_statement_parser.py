import re
from datetime import date
from decimal import Decimal, InvalidOperation


MONTH_MAP = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
    "May": 5, "Jun": 6, "Jul": 7, "Aug": 8,
    "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
}


DATE_LINE_PATTERN = re.compile(
    r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(.+)$"
)

AMOUNT_BALANCE_PATTERN = re.compile(
    r"""
    (?P<amount>
        [-+]?
        (?:₹|Rs\.?|INR)?\s*
        [\d,]+(?:\.\d{1,2})?
    )
    \s*
    (?P<marker>DR|CR|Debit|Credit)?
    \s+
    (?P<balance>
        [-+]?
        (?:₹|Rs\.?|INR)?\s*
        [\d,]+(?:\.\d{1,2})?
    )
    \s*$
    """,
    re.IGNORECASE | re.VERBOSE,
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


def parse_decimal_amount(value: str):
    cleaned = (
        str(value)
        .replace("₹", "")
        .replace("Rs.", "")
        .replace("Rs", "")
        .replace("INR", "")
        .replace(",", "")
        .replace(" ", "")
        .strip()
    )

    if not cleaned:
        return None

    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def build_transaction_if_complete(
    transaction_date,
    description_lines,
    previous_balance=None,
):
    combined = " ".join(description_lines)

    amount_balance_match = AMOUNT_BALANCE_PATTERN.search(
        combined
    )

    if not amount_balance_match:
        return None

    amount_text = amount_balance_match.group("amount")
    balance_text = amount_balance_match.group("balance")
    marker = amount_balance_match.group("marker")

    description = combined[
        :amount_balance_match.start()
    ].strip()

    description = clean_description(description)

    if not description or should_ignore_description(description):
        return None

    try:
        amount_decimal = parse_decimal_amount(amount_text)
        balance_decimal = parse_decimal_amount(balance_text)
    except Exception:
        return None

    transaction_type = detect_transaction_type(
        description=description,
        marker=marker,
        amount=amount_decimal,
        previous_balance=previous_balance,
        current_balance=balance_decimal,
    )

    final_amount = (
        abs(amount_decimal)
        if transaction_type == "income"
        else -abs(amount_decimal)
    )

    return {
        "date": transaction_date,
        "description": description,
        "amount": final_amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": balance_decimal,
        "raw_text": combined,
    }


def detect_transaction_type(
    description: str,
    marker: str | None = None,
    amount: Decimal | None = None,
    previous_balance: Decimal | None = None,
    current_balance: Decimal | None = None,
) -> str:
    """
    Detect transaction type using the strongest available signal.

    Priority:
    1. DR/CR marker
    2. Signed amount
    3. Balance movement
    4. Description keywords
    """

    # 1. Explicit DR/CR marker
    if marker:
        normalized_marker = marker.lower().strip()

        if normalized_marker in {"cr", "credit"}:
            return "income"

        if normalized_marker in {"dr", "debit"}:
            return "expense"

    # 2. Signed amount
    if amount is not None:
        if amount < 0:
            return "expense"

        # A positive amount alone is not enough to guarantee income,
        # because many statements show debit amounts as positive values.

    # 3. Balance movement
    if (
        previous_balance is not None
        and current_balance is not None
    ):
        if current_balance > previous_balance:
            return "income"

        if current_balance < previous_balance:
            return "expense"

    # 4. Description keywords
    description_text = description.lower()

    income_keywords = [
        "salary",
        "salary credit",
        "credited",
        "credit",
        "deposit",
        "cash deposit",
        "refund",
        "reversal",
        "cashback",
        "interest",
        "received",
        "transfer received",
        "upi received",
        "neft from",
        "imps from",
        "rtgs from",
        "employer",
    ]

    expense_keywords = [
        "debited",
        "debit",
        "withdrawal",
        "cash withdrawal",
        "atm withdrawal",
        "payment",
        "purchase",
        "paid",
        "fee",
        "charge",
        "upi payment",
        "neft to",
        "imps to",
        "rtgs to",
        "transfer to",
    ]

    if any(
        keyword in description_text
        for keyword in income_keywords
    ):
        return "income"

    if any(
        keyword in description_text
        for keyword in expense_keywords
    ):
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