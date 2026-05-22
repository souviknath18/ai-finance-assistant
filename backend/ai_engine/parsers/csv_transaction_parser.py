import csv
from datetime import datetime, date
from decimal import Decimal, InvalidOperation


DATE_KEYS = [
    "date",
    "transaction date",
    "txn date",
    "posting date",
    "value date",
]

DESCRIPTION_KEYS = [
    "description",
    "narration",
    "details",
    "merchant",
    "vendor",
    "payee",
    "transaction details",
]

AMOUNT_KEYS = [
    "amount",
    "transaction amount",
    "paid",
    "total",
    "price",
]

DEBIT_KEYS = [
    "debit",
    "withdrawal",
    "withdrawals",
    "expense",
    "spent",
]

CREDIT_KEYS = [
    "credit",
    "deposit",
    "deposits",
    "income",
    "received",
]

BALANCE_KEYS = [
    "balance",
    "closing balance",
    "available balance",
]

TYPE_KEYS = [
    "type",
    "transaction type",
]

CATEGORY_KEYS = [
    "category",
]


def parse_csv_transactions(file_path: str):
    transactions = []

    with open(file_path, "r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        if not reader.fieldnames:
            return empty_result()

        for row in reader:
            transaction = parse_csv_row(row)

            if transaction:
                transactions.append(transaction)

    return {
        "transactions": transactions,
        "confidence": 0.95 if transactions else 0.25,
        "parser": "csv_transaction_parser_v1",
    }


def parse_csv_row(row):
    date_value = get_value(row, DATE_KEYS)
    description = get_value(row, DESCRIPTION_KEYS)

    amount_value = get_value(row, AMOUNT_KEYS)
    debit_value = get_value(row, DEBIT_KEYS)
    credit_value = get_value(row, CREDIT_KEYS)
    balance_value = get_value(row, BALANCE_KEYS)
    type_value = get_value(row, TYPE_KEYS)
    category_value = get_value(row, CATEGORY_KEYS)

    if not date_value or not description:
        return None

    transaction_date = parse_date(date_value)

    amount = None
    transaction_type = None

    if debit_value:
        amount = -abs(parse_amount(debit_value))
        transaction_type = "expense"

    elif credit_value:
        amount = abs(parse_amount(credit_value))
        transaction_type = "income"

    elif amount_value:
        amount = parse_amount(amount_value)

        if type_value:
            transaction_type = normalize_transaction_type(type_value)
            amount = abs(amount) if transaction_type == "income" else -abs(amount)
        else:
            transaction_type = "income" if amount > 0 else "expense"

    if amount is None:
        return None

    return {
        "date": transaction_date,
        "description": description.strip(),
        "amount": amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": parse_amount(balance_value) if balance_value else None,
        "raw_text": str(row),
        "category": category_value.strip() if category_value else None,
    }


def get_value(row, possible_keys):
    normalized = {
        normalize_key(key): value
        for key, value in row.items()
        if key is not None
    }

    for key in possible_keys:
        value = normalized.get(normalize_key(key))

        if value not in [None, ""]:
            return str(value).strip()

    return None


def normalize_key(key: str):
    return key.lower().strip().replace("_", " ")


def parse_amount(value):
    cleaned = (
        str(value)
        .replace("₹", "")
        .replace("Rs.", "")
        .replace("INR", "")
        .replace(",", "")
        .replace("+", "")
        .strip()
    )

    if cleaned in ["", "-"]:
        return Decimal("0.00")

    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return Decimal("0.00")


def parse_date(value):
    formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%d %b %Y",
        "%d %B %Y",
        "%b %d, %Y",
        "%B %d, %Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value.strip(), fmt).date()
        except ValueError:
            pass

    return date.today()


def normalize_transaction_type(value):
    text = value.lower().strip()

    if text in ["income", "credit", "deposit", "received"]:
        return "income"

    if text in ["expense", "debit", "withdrawal", "spent", "payment"]:
        return "expense"

    return "expense"


def empty_result():
    return {
        "transactions": [],
        "confidence": 0.2,
        "parser": "csv_transaction_parser_v1",
    }