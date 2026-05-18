from ai_engine.categorization.category_rules import CATEGORY_RULES
from ai_engine.categorization.ai_categorizer import categorize_transaction_with_ai


def categorize_transaction(description: str, transaction_type: str):
    rule_result = categorize_transaction_with_rules(description, transaction_type)

    if rule_result["confidence"] >= 0.75:
        return rule_result

    try:
        return categorize_transaction_with_ai(description, transaction_type)
    except Exception as error:
        print("AI categorization fallback failed:", error)
        return rule_result


def categorize_transaction_with_rules(description: str, transaction_type: str):
    text = description.lower()

    for category, keywords in CATEGORY_RULES.items():
        if any(keyword in text for keyword in keywords):
            return {
                "category": category,
                "confidence": 0.90,
                "reason": f"Matched keyword rule for {category}.",
                "is_ai_categorized": False,
            }

    if transaction_type == "income":
        return {
            "category": "Income",
            "confidence": 0.60,
            "reason": "Fallback category based on transaction type.",
            "is_ai_categorized": False,
        }

    return {
        "category": "Uncategorized",
        "confidence": 0.30,
        "reason": "No category rule matched.",
        "is_ai_categorized": False,
    }