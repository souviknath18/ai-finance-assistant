import json
from decouple import config
from openai import OpenAI

from ai_engine.categorization.category_prompts import (
    CATEGORY_SYSTEM_PROMPT,
)
from ai_engine.categorization.category_constants import (
    ALLOWED_CATEGORIES,
)
from ai_engine.categorization.confidence_calibrator import (
    calculate_calibrated_confidence,
)


client = OpenAI(
    api_key=config("OPENAI_API_KEY")
)


def categorize_transaction_with_ai(
    description: str,
    transaction_type: str,
):
    cleaned_description = (
        " ".join((description or "").split())
        or "Unknown transaction"
    )

    allowed_categories_text = ", ".join(
        ALLOWED_CATEGORIES
    )

    prompt = f"""
Classify this financial transaction.

Transaction description:
{cleaned_description}

Transaction type:
{transaction_type}

Allowed categories:
{allowed_categories_text}

Important classification rules:
1. Classify using the product or service that was purchased.
2. Give the service description higher priority than the merchant name.
3. Use the merchant name only as supporting context.
4. Never categorize using an address, road name, city, state,
   postal code, place of supply, GSTIN, CIN, or invoice metadata.
5. A road name in a company address does not mean Transport.
6. Home cleaning, appliance repair, plumbing, electrical repair,
   and household maintenance are home or household services.
7. Return exactly one category from the allowed categories.
8. Confidence must reflect how clearly the description supports
   the selected category.

Return valid JSON only:
{{
    "category": "one allowed category",
    "confidence": 0.0,
    "reason": "brief explanation based on the purchased service"
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": CATEGORY_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0,
    )

    raw_text = response.output_text.strip()

    print(
        "AI categorization input:",
        cleaned_description,
    )
    print(
        "AI categorization raw output:",
        raw_text,
    )

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "category": "Uncategorized",
            "confidence": 0.0,
            "reason": (
                "The AI categorization response was not valid JSON."
            ),
            "is_ai_categorized": True,
            "category_source": "ai",
            "matched": False,
        }

    category = data.get(
        "category",
        "Uncategorized",
    )

    if category not in ALLOWED_CATEGORIES:
        category = "Uncategorized"

    try:
        raw_confidence = float(
            data.get("confidence", 0.5)
        )
    except (TypeError, ValueError):
        raw_confidence = 0.5

    raw_confidence = max(
        0.0,
        min(raw_confidence, 1.0),
    )

    confidence = calculate_calibrated_confidence(
        description=cleaned_description,
        transaction_type=transaction_type,
        category=category,
        ai_confidence=raw_confidence,
    )

    return {
        "category": category,
        "confidence": confidence,
        "reason": data.get(
            "reason",
            "AI categorized this transaction.",
        ),
        "is_ai_categorized": True,
        "category_source": "ai",
        "matched": category != "Uncategorized",
    }