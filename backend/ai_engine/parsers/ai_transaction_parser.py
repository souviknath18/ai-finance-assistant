import json
from datetime import datetime
from decimal import Decimal
from decouple import config
from openai import OpenAI


client = OpenAI(api_key=config("OPENAI_API_KEY"))


def parse_transactions_with_ai(extracted_text: str):
    prompt = f"""
    You are a financial document parser.

    Extract financial transactions from the provided document text.

    The document may be:
    - bank statement
    - credit card statement
    - invoice
    - bill
    - receipt
    - subscription receipt
    - travel receipt
    - utility bill
    - salary slip

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
    - For bank statements, withdrawals/debits are expense and deposits/credits are income.
    - For invoices, bills, receipts, and subscription receipts, create ONE expense transaction using the final total/amount paid/total due.
    - Use merchant/provider/vendor name as description when available.
    - If there is no date, use today's date: {datetime.today().strftime("%Y-%m-%d")}.
    - Convert amounts like ₹4,398, Rs. 4,398, INR 4,398, or ■4,398 into decimal numbers.
    - Expenses must be negative amounts.
    - Income must be positive amounts.
    - If a transaction spans multiple lines, combine the description.
    - Do not invent transactions.
    - If no financial transaction is found, return [].

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