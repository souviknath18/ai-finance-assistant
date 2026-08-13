from pydantic import BaseModel, Field

from ai.llm.langchain_client import (
    get_aura_chat_model,
)


class ReportSummaryOutput(BaseModel):
    summary: str = Field(
        min_length=1,
        max_length=900,
        description=(
            "Professional financial report summary "
            "based only on the verified report data."
        ),
    )


def generate_ai_report_summary(
    report_data: dict,
) -> str:
    """
    Generate a concise AI-written report summary.

    All financial calculations must already exist in report_data.
    The LLM only explains the verified results.
    """

    performance = report_data.get(
        "performance",
        {},
    )

    ai_insight = report_data.get(
        "ai_insight",
        {},
    )

    categories = report_data.get(
        "categories",
        [],
    )

    recurring_count = report_data.get(
        "recurring_count",
        0,
    )

    category_text = ", ".join(
        (
            f"{item.get('label', 'Unknown')} "
            f"({item.get('value', '')})"
        )
        for item in categories[:4]
    )

    system_prompt = """
You are Aura's financial report writer.

You receive verified financial calculations from Aura's backend.

Rules:
- Use only the provided data.
- Never invent amounts, categories, subscriptions, trends, or financial facts.
- Do not recalculate financial totals.
- Treat the backend values as authoritative.
- Clearly mention meaningful risks and opportunities when supported by the data.
- Do not provide legal, tax, or investment advice.
- Keep the summary professional and under 90 words.
""".strip()

    user_prompt = f"""
Verified report data:

Income:
{performance.get("income", "N/A")}

Expenses:
{performance.get("expenses", "N/A")}

Net Savings:
{performance.get("savings", "N/A")}

Deterministic financial insight:
{ai_insight.get("summary", "No summary available.")}

Top spending categories:
{category_text or "No category data available."}

Recurring subscriptions count:
{recurring_count}

Generate the financial report summary.
""".strip()

    model = (
        get_aura_chat_model()
        .with_structured_output(
            ReportSummaryOutput,
            method="json_schema",
        )
    )

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
        raise ValueError(
            "Aura returned no report summary."
        )

    summary = (
        result.summary
        or ""
    ).strip()

    if not summary:
        raise ValueError(
            "Aura returned an empty report summary."
        )

    return summary