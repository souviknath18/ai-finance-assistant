from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field

from ai.llm.langchain_client import (
    get_aura_chat_model,
)


class RepairedTransaction(BaseModel):
    description: str = Field(
        min_length=1,
        max_length=500,
    )

    merchant_name: str | None = Field(
        default=None,
        max_length=255,
    )

    amount: Decimal

    transaction_type: str

    reference_number: str | None = None
    balance_after_transaction: Decimal | None = None


class TransactionRepairOutput(BaseModel):
    transactions: list[RepairedTransaction] = Field(
        default_factory=list,
    )


def repair_transactions_with_ai(
    *,
    extracted_text: str,
    deterministic_transactions: list[dict[str, Any]],
    document_type: str,
) -> list[dict]:
    """
    Repair incomplete deterministic transaction output.

    The deterministic result remains the starting point.
    The LLM may fix missing/incorrect semantic fields, but must
    not invent transactions unsupported by the document.
    """

    if not deterministic_transactions:
        return []

    model = (
        get_aura_chat_model()
        .with_structured_output(
            TransactionRepairOutput,
            method="json_schema",
        )
    )

    system_prompt = """
You are Aura's transaction repair system.

You receive:
1. original financial document text
2. deterministic parser output

Repair only fields that are incomplete or clearly inconsistent.

Rules:
- Do not invent transactions.
- Do not add transactions that are not supported by the document.
- Preserve verified amounts whenever possible.
- Preserve transaction count unless the deterministic parser
  clearly merged or duplicated rows.
- Expense amounts must be negative.
- Income amounts must be positive.
- Do not use running balance as transaction amount.
- Do not convert totals, taxes, headings, or metadata into transactions.
""".strip()

    user_prompt = f"""
Document type:
{document_type}

Original document text:
{extracted_text[:20000]}

Deterministic transactions:
{deterministic_transactions}
""".strip()

    result = model.invoke(
        [
            ("system", system_prompt),
            ("human", user_prompt),
        ]
    )

    if result is None:
        return deterministic_transactions

    repaired = []

    for item in result.transactions:
        data = item.model_dump()

        transaction_type = (
            str(
                data.get(
                    "transaction_type",
                    "",
                )
            )
            .lower()
            .strip()
        )

        if transaction_type not in {
            "income",
            "expense",
        }:
            continue

        amount = Decimal(
            str(
                data["amount"]
            )
        )

        if transaction_type == "income":
            amount = abs(amount)
        else:
            amount = -abs(amount)

        repaired.append(
            {
                **data,
                "amount": amount,
            }
        )

    return (
        repaired
        or deterministic_transactions
    )