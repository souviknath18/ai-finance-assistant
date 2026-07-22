import json
from datetime import datetime
from decimal import Decimal, InvalidOperation
from decouple import config
from openai import OpenAI


client = OpenAI(api_key=config("OPENAI_API_KEY"))


def clean_json_output(raw_output: str) -> str:
    cleaned = raw_output.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):]

    elif cleaned.startswith("```"):
        cleaned = cleaned[len("```"):]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    return cleaned.strip()


def normalize_ai_transaction(item):
    if not isinstance(item, dict):
        return None

    description = str(
        item.get("description", "")
    ).strip()

    transaction_type = str(
        item.get("transaction_type", "")
    ).lower().strip()

    if not description:
        return None

    if transaction_type not in {"income", "expense"}:
        return None

    try:
        transaction_date = datetime.strptime(
            str(item["date"]).strip(),
            "%Y-%m-%d",
        ).date()

        amount = Decimal(str(item["amount"]))

    except (
        KeyError,
        ValueError,
        TypeError,
        InvalidOperation,
    ):
        return None

    amount = (
        abs(amount)
        if transaction_type == "income"
        else -abs(amount)
    )

    balance = None

    if item.get("balance_after_transaction") is not None:
        try:
            balance = Decimal(
                str(item["balance_after_transaction"])
            )
        except (
            ValueError,
            TypeError,
            InvalidOperation,
        ):
            balance = None

    return {
        "date": transaction_date,
        "description": description[:500],
        "amount": amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": balance,
        "raw_text": str(
            item.get("raw_text", "")
        ),
    }


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

    cleaned_output = clean_json_output(raw_output)

    try:
        parsed = json.loads(cleaned_output)
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI parser returned invalid JSON."
        ) from error

    if not isinstance(parsed, list):
        raise ValueError(
            "AI parser returned an invalid response format."
        )

    cleaned = []

    for item in parsed:
        transaction = normalize_ai_transaction(item)

        if transaction:
            cleaned.append(transaction)

    return cleaned