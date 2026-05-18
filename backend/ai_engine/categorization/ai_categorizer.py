import json
from decouple import config
from openai import OpenAI

from ai_engine.categorization.category_prompts import CATEGORY_SYSTEM_PROMPT


client = OpenAI(api_key=config("OPENAI_API_KEY"))


def categorize_transaction_with_ai(description: str, transaction_type: str):
    prompt = f"""
Transaction description: {description}
Transaction type: {transaction_type}

Categorize this transaction.
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
    )

    raw_text = response.output_text.strip()
    data = json.loads(raw_text)

    return {
        "category": data.get("category", "Uncategorized"),
        "confidence": float(data.get("confidence", 0.5)),
        "reason": data.get("reason", "AI categorized this transaction."),
        "is_ai_categorized": True,
    }