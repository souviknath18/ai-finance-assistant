from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any


VALID_TRANSACTION_TYPES = {
    "income",
    "expense",
}


def parse_decimal_amount(value: Any) -> Decimal | None:
    if value is None:
        return None

    cleaned = (
        str(value)
        .replace("₹", "")
        .replace("Rs.", "")
        .replace("Rs", "")
        .replace("INR", "")
        .replace(",", "")
        .replace("+", "")
        .replace("(", "-")
        .replace(")", "")
        .strip()
    )

    if cleaned in {"", "-", "--"}:
        return None

    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def normalize_transaction_type(value: Any) -> str | None:
    text = str(value or "").lower().strip()

    income_values = {
        "income",
        "credit",
        "cr",
        "deposit",
        "received",
        "refund",
    }

    expense_values = {
        "expense",
        "debit",
        "dr",
        "withdrawal",
        "spent",
        "payment",
        "purchase",
    }

    if text in income_values:
        return "income"

    if text in expense_values:
        return "expense"

    return None


def normalize_amount_sign(
    amount: Decimal,
    transaction_type: str,
) -> Decimal:
    if transaction_type == "income":
        return abs(amount)

    return -abs(amount)


def build_transaction(
    *,
    transaction_date: date | None,
    description: str,
    amount: Decimal,
    transaction_type: str,
    raw_text: str,
    merchant_name: str | None = None,
    balance_after_transaction: Decimal | None = None,
    reference_number: str | None = None,
):
    normalized_type = normalize_transaction_type(
        transaction_type
    )

    if normalized_type not in VALID_TRANSACTION_TYPES:
        raise ValueError(
            "Transaction type must be income or expense."
        )

    cleaned_description = " ".join(
        str(description or "").split()
    ).strip()

    if not cleaned_description:
        raise ValueError(
            "Transaction description is required."
        )

    return {
        "date": transaction_date,
        "description": cleaned_description[:500],
        "merchant_name": (
            " ".join(str(merchant_name).split())[:255]
            if merchant_name
            else None
        ),
        "amount": normalize_amount_sign(
            amount,
            normalized_type,
        ),
        "transaction_type": normalized_type,
        "balance_after_transaction": (
            balance_after_transaction
        ),
        "reference_number": (
            str(reference_number).strip()[:255]
            if reference_number
            else None
        ),
        "raw_text": str(raw_text or "")[:5000],
    }