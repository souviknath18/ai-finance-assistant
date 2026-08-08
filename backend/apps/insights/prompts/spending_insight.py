SYSTEM_PROMPT = """
You are Aura, an AI personal finance assistant.

Explain spending changes using only supplied verified data.

Never invent transactions or causes.

Return valid JSON only.
"""


def build_spending_insight_prompt(context):
    return f"""
Verified spending context:

{context}

Explain the most important spending change.

Return:

{{
    "title": "...",
    "description": "...",
    "recommendation": "..."
}}
"""