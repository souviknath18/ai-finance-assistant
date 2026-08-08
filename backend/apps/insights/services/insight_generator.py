import json

from decouple import config
from openai import OpenAI

from apps.insights.prompts.monthly_summary import (
    SYSTEM_PROMPT,
    build_monthly_summary_prompt,
)


client = OpenAI(
    api_key=config(
        "OPENAI_API_KEY"
    )
)


def build_fallback_summary(
    *,
    metrics,
    health,
    spending_trend,
):
    change = spending_trend.get(
        "change_percent"
    )

    headline = (
        f"Your financial health score is "
        f"{health['score']}/100"
    )

    description = (
        f"You spent "
        f"{metrics['total_expense_display']} "
        f"and saved "
        f"{metrics['savings_display']} "
        "during this period."
    )

    if change is not None:
        if change > 0:
            description += (
                f" Spending increased "
                f"{change:.1f}% compared "
                "with the previous month."
            )

        elif change < 0:
            description += (
                f" Spending decreased "
                f"{abs(change):.1f}% compared "
                "with the previous month."
            )

    return {
        "headline": headline,
        "description": description,
        "recommendation": (
            "Review your largest spending categories "
            "for practical saving opportunities."
        ),
        "source": "rule",
    }


def generate_executive_summary(
    *,
    context,
    metrics,
    health,
    spending_trend,
):
    fallback = build_fallback_summary(
        metrics=metrics,
        health=health,
        spending_trend=spending_trend,
    )

    if metrics.get(
        "transaction_count",
        0,
    ) == 0:
        return fallback

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",

            input=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": (
                        build_monthly_summary_prompt(
                            context
                        )
                    ),
                },
            ],

            text={
                "format": {
                    "type": "json_object",
                }
            },
        )

        data = json.loads(
            response.output_text
        )

        return {
            "headline": (
                data.get("headline")
                or fallback["headline"]
            ),

            "description": (
                data.get("description")
                or fallback["description"]
            ),

            "recommendation": (
                data.get("recommendation")
                or fallback["recommendation"]
            ),

            "source": "ai",
        }

    except Exception:
        return fallback