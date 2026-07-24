from ai_engine.categorization.category_rules import CATEGORY_RULES
from ai_engine.categorization.ai_categorizer import categorize_transaction_with_ai


def categorize_transaction(description: str, transaction_type: str):
    rule_result = categorize_transaction_with_rules(description, transaction_type)

    if rule_result["matched"]:
        return rule_result

    try:
        return categorize_transaction_with_ai(description, transaction_type)
    except Exception as error:
        print("AI categorization fallback failed for:", description)
        print("Error:", error)
        return rule_result


def categorize_transaction_with_rules(description: str, transaction_type: str):
    text = str(description or "").lower().strip()
    normalized_transaction_type = (
        str(transaction_type or "").lower().strip()
    )

    for category, keywords in CATEGORY_RULES.items():
        matched_keyword = next(
            (
                keyword
                for keyword in keywords
                if keyword.lower() in text
            ),
            None,
        )
        if matched_keyword:
            return {
                "category": category,
                "confidence": None,
                "reason": (
                    f'Matched rule keyword "{matched_keyword}" '
                    f"for {category}."
                ),
                "is_ai_categorized": False,
                "category_source": "rule",
                "matched": True,
            }

    if normalized_transaction_type == "income":
        return {
            "category": "Income",
            "confidence": None,
            "reason": (
                "Assigned from the transaction type because "
                "no keyword rule matched."
            ),
            "is_ai_categorized": False,
            "category_source": "rule",
            "matched": True,
        }

    return {
        "category": "Uncategorized",
        "confidence": None,
        "reason": "No category rule matched.",
        "is_ai_categorized": False,
        "category_source": "none",
        "matched": False,
    }