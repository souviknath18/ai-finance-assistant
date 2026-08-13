from typing import Iterable

from ..categorization.rules import (
    CATEGORY_RULES,
)


INCOME_CATEGORIES = {
    "Salary",
    "Income",
}

EXPENSE_CATEGORIES = {
    "Food",
    "Groceries",
    "Transport",
    "Fuel",
    "Shopping",
    "Rent",
    "Utilities",
    "Subscriptions",
    "Bank Fees",
    "Healthcare",
    "Insurance",
    "Investments",
    "Travel",
    "Entertainment",
    "Education",
    "Cash Withdrawal",
    "Household",
}


AMBIGUOUS_MERCHANTS = {
    "amazon",
    "flipkart",
    "google",
    "apple",
    "paytm",
    "phonepe",
    "razorpay",
    "cashfree",
}

VAGUE_DESCRIPTIONS = {
    "payment",
    "purchase",
    "transaction",
    "transfer",
    "debit",
    "credit",
    "invoice",
    "bill",
    "order",
}


def calculate_calibrated_confidence(
    description: str,
    transaction_type: str,
    category: str,
    ai_confidence: float,
    parser_confidence: float | None = None,
    merchant_name: str | None = None,
    parser_warnings: Iterable[str] | None = None,
) -> float:
    """
    Adjust AI confidence only when deterministic evidence supports
    or contradicts the AI categorization.

    The AI confidence is preserved by default.
    """

    text = normalize_text(description)
    merchant = normalize_text(merchant_name)
    normalized_type = normalize_text(
        transaction_type
    )

    confidence = clamp_confidence(
        ai_confidence
    )

    matching_keywords = get_matching_keywords(
        text=text,
        category=category,
    )

    # ----------------------------------------
    # Negative evidence
    # ----------------------------------------

    # Uncategorized results should never appear
    # as high-confidence classifications.
    if category == "Uncategorized":
        confidence = min(confidence, 0.40)

    # Penalize category and transaction-type
    # contradictions.
    if (
        normalized_type == "income"
        and category in EXPENSE_CATEGORIES
    ):
        confidence -= 0.25

    elif (
        normalized_type == "expense"
        and category in INCOME_CATEGORIES
    ):
        confidence -= 0.25

    # Reduce confidence when the parser itself
    # was uncertain about the extracted fields.
    if parser_confidence is not None:
        parser_confidence = clamp_confidence(
            parser_confidence
        )

        if parser_confidence < 0.50:
            confidence -= 0.20

        elif parser_confidence < 0.70:
            confidence -= 0.10

    # Very short or generic descriptions provide
    # weak classification evidence.
    if is_vague_description(text):
        confidence -= 0.15

    # Large marketplaces and payment processors are
    # ambiguous when no purchased item is available.
    if (
        merchant
        and is_ambiguous_merchant(merchant)
        and not matching_keywords
    ):
        confidence -= 0.10

    # Parser warnings represent uncertainty that the
    # AI model may not be aware of.
    warnings = list(parser_warnings or [])

    if warnings:
        warning_penalty = min(
            0.15,
            len(warnings) * 0.04,
        )
        confidence -= warning_penalty

    return round(
        clamp_confidence(confidence),
        2,
    )


def normalize_text(
    value: str | None,
) -> str:
    return " ".join(
        str(value or "").lower().split()
    )


def clamp_confidence(
    value: float,
) -> float:
    try:
        confidence = float(value)
    except (TypeError, ValueError):
        confidence = 0.0

    return max(
        0.0,
        min(confidence, 0.99),
    )


def get_matching_keywords(
    text: str,
    category: str,
) -> set[str]:
    category_keywords = CATEGORY_RULES.get(
        category,
        [],
    )

    return {
        keyword.lower()
        for keyword in category_keywords
        if keyword.lower() in text
    }


def is_vague_description(
    text: str,
) -> bool:
    if not text:
        return True

    words = text.split()

    if len(words) <= 1:
        return True

    return text in VAGUE_DESCRIPTIONS


def is_ambiguous_merchant(
    merchant_name: str,
) -> bool:
    return any(
        ambiguous_merchant in merchant_name
        for ambiguous_merchant
        in AMBIGUOUS_MERCHANTS
    )