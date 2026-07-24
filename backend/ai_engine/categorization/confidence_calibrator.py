from ai_engine.categorization.category_rules import CATEGORY_RULES


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
}


def calculate_calibrated_confidence(
    description: str,
    transaction_type: str,
    category: str,
    ai_confidence: float,
) -> float:
    text = str(description or "").lower().strip()
    normalized_type = str(transaction_type or "").lower().strip()

    # Reduce the influence of the model's self-reported confidence.
    confidence = 0.50 + ((ai_confidence - 0.50) * 0.50)

    category_keywords = CATEGORY_RULES.get(category, [])

    matching_keywords = [
        keyword
        for keyword in category_keywords
        if keyword.lower() in text
    ]

    # Strong direct evidence in the transaction description.
    if matching_keywords:
        confidence += 0.12

    # More than one relevant keyword provides stronger evidence.
    if len(matching_keywords) >= 2:
        confidence += 0.04

    # Check whether the selected category agrees with transaction type.
    if (
        normalized_type == "income"
        and category in INCOME_CATEGORIES
    ):
        confidence += 0.08

    elif (
        normalized_type == "expense"
        and category in EXPENSE_CATEGORIES
    ):
        confidence += 0.05

    # Penalize contradictory category/type combinations.
    if (
        normalized_type == "income"
        and category in EXPENSE_CATEGORIES
    ):
        confidence -= 0.15

    if (
        normalized_type == "expense"
        and category in INCOME_CATEGORIES
    ):
        confidence -= 0.15

    # Short or vague descriptions provide less evidence.
    word_count = len(text.split())

    if word_count <= 1 and not matching_keywords:
        confidence -= 0.08

    if category == "Uncategorized":
        confidence = min(confidence, 0.49)

    return round(
        max(0.0, min(confidence, 0.99)),
        2,
    )