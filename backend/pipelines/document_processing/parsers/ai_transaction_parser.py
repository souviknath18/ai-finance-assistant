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

    # Date is optional.
    # AI may return null when the document has no reliable date.
    transaction_date = None

    if item.get("date"):
        try:
            transaction_date = datetime.strptime(
                str(item["date"]).strip(),
                "%Y-%m-%d",
            ).date()
        except (
            ValueError,
            TypeError,
        ):
            transaction_date = None

    # Amount is required.
    try:
        amount = Decimal(
            str(item["amount"])
        )
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

    if item.get(
        "balance_after_transaction"
    ) is not None:
        try:
            balance = Decimal(
                str(
                    item[
                        "balance_after_transaction"
                    ]
                )
            )
        except (
            ValueError,
            TypeError,
            InvalidOperation,
        ):
            balance = None

    merchant_name = None

    if item.get("merchant_name"):
        merchant_name = str(
            item["merchant_name"]
        ).strip()[:255]

    reference_number = None

    if item.get("reference_number"):
        reference_number = str(
            item["reference_number"]
        ).strip()[:255]

    return {
        "date": transaction_date,
        "description": description[:500],
        "merchant_name": merchant_name,
        "amount": amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": balance,
        "reference_number": reference_number,
        "raw_text": str(
            item.get("raw_text", "")
        )[:5000],
    }


def parse_transactions_with_ai(
    extracted_text: str,
    document_type: str = "unknown",
):
    prompt = f"""
    You are a strict financial document extraction system.

    Detected document type:
    {document_type}

    Extract only real financial transactions from the document.

    Return ONLY valid JSON:

    [
    {{
        "date": "YYYY-MM-DD or null",
        "description": "merchant, provider, employer, or transaction description",
        "merchant_name": "string or null",
        "amount": "decimal number",
        "transaction_type": "income or expense",
        "balance_after_transaction": "decimal number or null",
        "reference_number": "string or null",
        "raw_text": "source text used"
    }}
    ]

    Document rules:

    BANK OR CREDIT-CARD STATEMENT:
    - Return one JSON object for every actual transaction row.
    - Preserve the relationship between the date, description,
    debit, credit and balance from the same row.
    - The debit or credit column is the transaction amount.
    - The running balance is never the transaction amount.
    - Debit values are expenses.
    - Credit values are income.
    - Exclude opening balance, closing balance, account summary,
    statement date, statement period and totals.
    - Do not use the statement date as a transaction date.
    - If ten transaction rows are visible, return ten objects.
    - Never merge multiple transaction rows into one object.

    INVOICE:
    - Return exactly one expense transaction.
    - Use amount payable, net amount, invoice total,
    grand total or total due.
    - Do not create transactions from line items,
    subtotal, tax, GST, discount or taxable value.

    RECEIPT:
    - Return exactly one expense transaction using
    the final amount paid.
    - Do not return each purchased product separately.

    UTILITY BILL:
    - Return exactly one expense transaction using
    current bill amount, amount payable or total due.

    SUBSCRIPTION RECEIPT:
    - Return exactly one expense transaction for
    the charged subscription amount.

    SALARY SLIP:
    - Return exactly one income transaction using net pay.
    - Do not create separate transactions for allowances,
    benefits, tax or deductions.

    General rules:
    - Do not invent values.
    - If a date is unavailable, return null.
    - Expenses must be negative.
    - Income must be positive.
    - If no valid financial transaction exists, return [].

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