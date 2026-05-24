from decouple import config
from openai import OpenAI

client = OpenAI(api_key=config("OPENAI_API_KEY"))


def generate_ai_report_summary(report_data):
    performance = report_data["performance"]
    ai_insight = report_data["ai_insight"]
    categories = report_data["categories"]
    recurring_count = report_data["recurring_count"]

    category_text = ", ".join(
        [f"{item['label']} ({item['value']})" for item in categories[:4]]
    )

    prompt = f"""
You are Aura, an AI financial report assistant.

Use only the data below. Do not invent numbers.

Income: {performance["income"]}
Expenses: {performance["expenses"]}
Net Savings: {performance["savings"]}
Rule Insight: {ai_insight["summary"]}
Top Categories: {category_text}
Recurring Subscriptions Count: {recurring_count}

Write a professional financial report summary under 90 words.
Mention risks and opportunities clearly.
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    return response.output_text.strip()