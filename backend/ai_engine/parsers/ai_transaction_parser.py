import json
from datetime import datetime
from decimal import Decimal
from decouple import config
from openai import OpenAI


client = OpenAI(api_key=config("OPENAI_API_KEY"))


def parse_transactions_with_ai(extracted_text: str):
    prompt = f"""
    You are a financial document parser.

    Extract transaction rows from this bank statement text.

    Return ONLY valid JSON in this format:
    [
      {{
        "date": "YYYY-MM-DD",
        "description": "string",
        "amount": "decimal number",
        "transaction_type": "income or expense",
        "balance_after_transaction": "decimal number or null",
        "raw_text": "original text used"
      }}
    ]

    Rules:
    - Do not include opening balance or closing balance.
    - Withdrawals are expense.
    - Deposits are income.
    - If a transaction spans multiple lines, combine the description.
    - Do not invent transactions.

    TEXT:
    {extracted_text}
    """

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    raw_output = response.output_text.strip()

    parsed = json.loads(raw_output)

    cleaned = []

    for item in parsed:
        cleaned.append(
            {
                "date": datetime.strptime(item["date"], "%Y-%m-%d").date(),
                "description": item["description"],
                "amount": Decimal(str(item["amount"])),
                "transaction_type": item["transaction_type"],
                "balance_after_transaction": (
                    Decimal(str(item["balance_after_transaction"]))
                    if item.get("balance_after_transaction") is not None
                    else None
                ),
                "raw_text": item.get("raw_text", ""),
            }
        )

    return cleaned