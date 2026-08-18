from datetime import date as Date
from decimal import Decimal, InvalidOperation
from typing import Literal

from pydantic import BaseModel, Field

from ai.llm.langchain_client import (
    get_aura_chat_model,
)


# ---------------------------------------------------------------------
# Structured output schemas
# ---------------------------------------------------------------------

class AITransactionItem(BaseModel):
    """
    One transaction extracted from a financial document.
    """

    date: Date | None = Field(
        default=None,
        description=(
            "Transaction date when explicitly available. "
            "Return null if a reliable date is unavailable."
        ),
    )

    description: str = Field(
        min_length=1,
        max_length=500,
        description=(
            "Transaction description, merchant, employer, "
            "provider, or other meaningful transaction text."
        ),
    )

    merchant_name: str | None = Field(
        default=None,
        max_length=255,
        description=(
            "Merchant or counterparty name when clearly identifiable."
        ),
    )

    amount: Decimal = Field(
        description=(
            "Transaction amount. Expenses should be negative "
            "and income should be positive."
        ),
    )

    transaction_type: Literal[
        "income",
        "expense",
    ] = Field(
        description=(
            "Whether the transaction is income or an expense."
        ),
    )

    balance_after_transaction: Decimal | None = Field(
        default=None,
        description=(
            "Running account balance after the transaction "
            "when explicitly available."
        ),
    )

    reference_number: str | None = Field(
        default=None,
        max_length=255,
        description=(
            "Transaction reference, UTR, invoice reference, "
            "or similar identifier when present."
        ),
    )

    raw_text: str | None = Field(
        default=None,
        max_length=5000,
        description=(
            "Relevant source text supporting this transaction."
        ),
    )


class AITransactionExtraction(BaseModel):
    """
    Structured output returned by the LLM.
    """

    transactions: list[
        AITransactionItem
    ] = Field(
        default_factory=list,
        description=(
            "All valid financial transactions explicitly "
            "supported by the document."
        ),
    )


# ---------------------------------------------------------------------
# Normalization
# ---------------------------------------------------------------------

def normalize_ai_transaction(
    item,
):
    """
    Convert structured AI output into Aura's normalized
    transaction dictionary.

    Even though Pydantic validates the model response,
    this function remains defensive because financial
    transaction data must be normalized consistently.
    """

    if isinstance(
        item,
        AITransactionItem,
    ):
        item = item.model_dump()

    if not isinstance(
        item,
        dict,
    ):
        return None

    # -------------------------------------------------------------
    # Description
    # -------------------------------------------------------------

    description = str(
        item.get(
            "description",
            "",
        )
        or ""
    ).strip()

    if not description:
        return None

    description = (
        description[:500]
    )

    # -------------------------------------------------------------
    # Transaction type
    # -------------------------------------------------------------

    transaction_type = str(
        item.get(
            "transaction_type",
            "",
        )
        or ""
    ).lower().strip()

    if transaction_type not in {
        "income",
        "expense",
    }:
        return None

    # -------------------------------------------------------------
    # Date
    # -------------------------------------------------------------

    transaction_date = (
        item.get("date")
    )

    if (
        transaction_date is not None
        and not isinstance(
            transaction_date,
            Date,
        )
    ):
        transaction_date = None

    # -------------------------------------------------------------
    # Amount
    # -------------------------------------------------------------

    try:
        amount = Decimal(
            str(
                item.get(
                    "amount"
                )
            )
        )

    except (
        TypeError,
        ValueError,
        InvalidOperation,
    ):
        return None

    # Aura stores:
    # income   -> positive
    # expense  -> negative

    if transaction_type == "income":
        amount = abs(
            amount
        )

    else:
        amount = -abs(
            amount
        )

    # -------------------------------------------------------------
    # Merchant
    # -------------------------------------------------------------

    merchant_name = None

    raw_merchant = item.get(
        "merchant_name"
    )

    if raw_merchant:
        merchant_name = str(
            raw_merchant
        ).strip()

        if merchant_name:
            merchant_name = (
                merchant_name[:255]
            )
        else:
            merchant_name = None

    # -------------------------------------------------------------
    # Balance
    # -------------------------------------------------------------

    balance_after_transaction = None

    raw_balance = item.get(
        "balance_after_transaction"
    )

    if raw_balance is not None:
        try:
            balance_after_transaction = (
                Decimal(
                    str(
                        raw_balance
                    )
                )
            )

        except (
            TypeError,
            ValueError,
            InvalidOperation,
        ):
            balance_after_transaction = None

    # -------------------------------------------------------------
    # Reference
    # -------------------------------------------------------------

    reference_number = None

    raw_reference = item.get(
        "reference_number"
    )

    if raw_reference:
        reference_number = str(
            raw_reference
        ).strip()

        if reference_number:
            reference_number = (
                reference_number[:255]
            )
        else:
            reference_number = None

    # -------------------------------------------------------------
    # Raw source text
    # -------------------------------------------------------------

    raw_text = str(
        item.get(
            "raw_text",
            "",
        )
        or ""
    ).strip()

    raw_text = (
        raw_text[:5000]
    )

    # -------------------------------------------------------------
    # Final normalized transaction
    # -------------------------------------------------------------

    return {
        "date": transaction_date,
        "description": description,
        "merchant_name": merchant_name,
        "amount": amount,
        "transaction_type": (
            transaction_type
        ),
        "balance_after_transaction": (
            balance_after_transaction
        ),
        "reference_number": (
            reference_number
        ),
        "raw_text": raw_text,
    }


# ---------------------------------------------------------------------
# AI extraction
# ---------------------------------------------------------------------

def parse_transactions_with_ai(
    extracted_text: str,
    document_type: str = "unknown",
):
    """
    Extract transactions using Aura's shared LangChain model.

    This function is intended as a fallback when deterministic
    parsing is insufficient.

    It does not save Transaction models.
    It only returns normalized transaction dictionaries.
    """

    safe_text = str(
        extracted_text
        or ""
    ).strip()

    if not safe_text:
        return []

    # Prevent excessively large document prompts.
    safe_text = (
        safe_text[:20_000]
    )

    normalized_document_type = str(
        document_type
        or "unknown"
    ).strip().lower()

    # -------------------------------------------------------------
    # Structured model
    # -------------------------------------------------------------

    model = (
        get_aura_chat_model()
        .with_structured_output(
            AITransactionExtraction,
            method="json_schema",
        )
    )

    # -------------------------------------------------------------
    # System prompt
    # -------------------------------------------------------------

    system_prompt = """
You are Aura's strict financial document transaction extraction system.

Your job is to extract only real financial transactions that are
explicitly supported by the provided document text.

Never invent financial data.

GENERAL RULES

1. Return every real transaction that appears in the document.

2. Do not merge separate transaction rows into one transaction.

3. If a reliable transaction date is not present, return null.

4. Expenses must use:
   transaction_type = "expense"

5. Income must use:
   transaction_type = "income"

6. Expense amounts must be negative.

7. Income amounts must be positive.

8. Do not use a running account balance as the transaction amount.

9. Do not create transactions from:
   - opening balances
   - closing balances
   - totals
   - summaries
   - taxes
   - discounts
   - headings
   - metadata
   - statement period information

10. Never manufacture:
    - dates
    - amounts
    - merchants
    - references
    - balances

11. If no valid transaction is supported by the document,
    return an empty transactions list.


BANK STATEMENT / CREDIT CARD STATEMENT

- Return one transaction for each actual transaction row.
- Keep the date, description, amount, debit/credit information,
  and running balance from the same row.
- Debit means expense.
- Credit means income.
- Do not return opening balance or closing balance as transactions.
- Do not combine multiple rows.
- If ten real transaction rows are visible, return ten transactions.


INVOICE

- Return exactly one expense transaction.
- Use the final amount payable, invoice total, grand total,
  net amount, total due, or equivalent final charge.
- Do not create separate transactions for:
  - individual products
  - GST
  - tax
  - subtotal
  - taxable value
  - discounts
- The merchant should be the invoice issuer when clear.


RECEIPT

- Return exactly one expense transaction.
- Use the final amount actually paid.
- Do not create individual transactions for line items.


UTILITY BILL

- Return exactly one expense transaction.
- Use the current bill amount, amount payable, total due,
  or equivalent final charge.


SUBSCRIPTION RECEIPT

- Return exactly one expense transaction.
- Use the charged subscription amount.


SALARY SLIP

- Return exactly one income transaction.
- Use net salary or net pay.
- Do not create separate income/expense transactions for:
  - allowances
  - deductions
  - taxes
  - PF
  - HRA
""".strip()

    # -------------------------------------------------------------
    # User prompt
    # -------------------------------------------------------------

    user_prompt = f"""
Detected document type:
{normalized_document_type}

Extract transactions from the following financial document.

Document text:

{safe_text}
""".strip()

    # -------------------------------------------------------------
    # Invoke LangChain structured output
    # -------------------------------------------------------------

    result = model.invoke(
        [
            (
                "system",
                system_prompt,
            ),
            (
                "human",
                user_prompt,
            ),
        ]
    )

    if result is None:
        return []

    # -------------------------------------------------------------
    # Normalize output
    # -------------------------------------------------------------

    transactions = []

    for item in (
        result.transactions
        or []
    ):
        normalized = (
            normalize_ai_transaction(
                item
            )
        )

        if normalized:
            transactions.append(
                normalized
            )

    return transactions