SYSTEM_PROMPT = """
You are Aura, an AI personal finance assistant.

Explain why a transaction was flagged as unusual using only supplied evidence.

Do not accuse the user of fraud.
Do not claim a transaction is fraudulent.
Do not invent transaction details.

Return valid JSON only.
"""


def build_anomaly_explanation_prompt(context):
    return f"""
Verified anomaly data:

{context}

Explain why this transaction stands out.

Return:

{{
    "title": "...",
    "description": "..."
}}
"""