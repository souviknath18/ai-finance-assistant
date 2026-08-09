import json
import logging
from typing import Any

from django.conf import settings
from openai import OpenAI
from pydantic import BaseModel, Field, ValidationError

from apps.insights.prompts.monthly_summary import (
    SYSTEM_PROMPT as MONTHLY_SUMMARY_SYSTEM_PROMPT,
    build_monthly_summary_prompt,
)

from apps.insights.prompts.spending_insight import (
    SYSTEM_PROMPT as SPENDING_SYSTEM_PROMPT,
    build_spending_insight_prompt,
)

from apps.insights.prompts.anomaly_explanation import (
    SYSTEM_PROMPT as ANOMALY_SYSTEM_PROMPT,
    build_anomaly_explanation_prompt,
)


logger = logging.getLogger(__name__)


DEFAULT_MODEL = getattr(
    settings,
    "OPENAI_INSIGHTS_MODEL",
    "gpt-5.6",
)


# ---------------------------------------------------------------------
# Structured output schemas
# ---------------------------------------------------------------------

class ExecutiveSummaryOutput(BaseModel):
    headline: str = Field(
        min_length=1,
        max_length=140,
    )

    description: str = Field(
        min_length=1,
        max_length=1200,
    )

    recommendation: str = Field(
        min_length=1,
        max_length=500,
    )

    confidence: float = Field(
        ge=0.0,
        le=1.0,
    )


class SpendingInsightOutput(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=140,
    )

    description: str = Field(
        min_length=1,
        max_length=1000,
    )

    recommendation: str = Field(
        min_length=1,
        max_length=500,
    )

    confidence: float = Field(
        ge=0.0,
        le=1.0,
    )


class AnomalyExplanationOutput(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=140,
    )

    description: str = Field(
        min_length=1,
        max_length=1000,
    )

    recommendation: str = Field(
        min_length=1,
        max_length=500,
    )

    confidence: float = Field(
        ge=0.0,
        le=1.0,
    )


# ---------------------------------------------------------------------
# Client
# ---------------------------------------------------------------------

def get_openai_client():
    """
    Create the OpenAI client.

    OPENAI_API_KEY should be configured through environment variables
    or Django settings.

    Example:
        OPENAI_API_KEY=...
    """

    api_key = getattr(
        settings,
        "OPENAI_API_KEY",
        None,
    )

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured."
        )

    return OpenAI(
        api_key=api_key
    )


# ---------------------------------------------------------------------
# Generic helpers
# ---------------------------------------------------------------------

def serialize_prompt_evidence(
    evidence: Any,
) -> str:
    """
    Convert verified evidence into compact JSON for prompts.

    evidence_builder.py already makes values JSON-safe, but this helper
    gives the generator a stable string representation.
    """

    return json.dumps(
        evidence,
        ensure_ascii=False,
        separators=(",", ":"),
        default=str,
    )


def clamp_confidence(
    value,
) -> float:
    """
    Defensive confidence normalization.
    """

    try:
        confidence = float(value)
    except (TypeError, ValueError):
        return 0.0

    return max(
        0.0,
        min(confidence, 1.0),
    )


def _call_structured_output(
    *,
    system_prompt,
    user_prompt,
    output_model,
):
    """
    Execute one structured OpenAI request.

    The output_model must be a Pydantic model.

    OpenAI validates the model output against the schema and returns
    the parsed Pydantic instance through response.output_parsed.
    """

    client = get_openai_client()

    response = client.responses.parse(
        model=DEFAULT_MODEL,

        input=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],

        text_format=output_model,
    )

    parsed = response.output_parsed

    if parsed is None:
        raise ValueError(
            "OpenAI returned no parsed structured output."
        )

    return parsed


# ---------------------------------------------------------------------
# Executive summary fallback
# ---------------------------------------------------------------------

def build_executive_summary_fallback(
    *,
    evidence,
):
    """
    Deterministic fallback used when OpenAI is unavailable.

    Insights must continue working even when AI generation fails.
    """

    overview = evidence.get(
        "overview",
        {},
    )

    trends = evidence.get(
        "trends",
        {},
    )

    health = evidence.get(
        "financial_health",
        {},
    )

    important = evidence.get(
        "important_insights",
        [],
    )

    health_score = int(
        health.get(
            "score",
            0,
        )
        or 0
    )

    health_status = (
        health.get(
            "status"
        )
        or "Unknown"
    )

    savings_rate = float(
        overview.get(
            "savings_rate",
            0,
        )
        or 0
    )

    expenses_display = (
        overview.get(
            "expenses_display"
        )
        or "₹0.00"
    )

    savings_display = (
        overview.get(
            "savings_display"
        )
        or "₹0.00"
    )

    spending = trends.get(
        "spending",
        {},
    )

    change = spending.get(
        "change_percent"
    )

    if important:
        top_signal = important[0]

        headline = (
            top_signal.get("title")
            or f"Financial health is {health_status}"
        )

    else:
        headline = (
            f"Financial health is {health_status}"
        )

    description_parts = [
        (
            f"You spent {expenses_display} "
            f"and saved {savings_display} "
            f"during this period."
        )
    ]

    if change is not None:
        change = float(change)

        if change > 0:
            description_parts.append(
                f"Spending increased "
                f"{change:.1f}% compared with "
                "the previous period."
            )

        elif change < 0:
            description_parts.append(
                f"Spending decreased "
                f"{abs(change):.1f}% compared with "
                "the previous period."
            )

    description_parts.append(
        f"Your Aura Financial Health Score is "
        f"{health_score}/100."
    )

    if savings_rate < 0:
        recommendation = (
            "Review your largest spending categories "
            "and identify expenses that can be reduced."
        )

    elif important:
        action = important[0].get(
            "action",
            {},
        )

        recommendation = (
            f"Review {important[0].get('title', 'your highest-priority insight')} "
            "and take the suggested action."
        )

        if action.get("label"):
            recommendation = (
                f"{action['label']} to better understand "
                "the highest-priority financial insight."
            )

    else:
        recommendation = (
            "Continue tracking your spending and review "
            "your largest categories regularly."
        )

    return {
        "headline": headline,

        "description": " ".join(
            description_parts
        ),

        "recommendation": (
            recommendation
        ),

        "confidence": 0.65,

        "source": "rule",
    }


# ---------------------------------------------------------------------
# Executive summary
# ---------------------------------------------------------------------

def generate_executive_summary(
    *,
    evidence,
):
    """
    Generate Aura's top-level executive summary.

    Falls back to deterministic text if:
        - OpenAI is unavailable
        - API call fails
        - structured parsing fails
        - output validation fails
    """

    fallback = (
        build_executive_summary_fallback(
            evidence=evidence
        )
    )

    overview = evidence.get(
        "overview",
        {},
    )

    transaction_count = int(
        overview.get(
            "transaction_count",
            0,
        )
        or 0
    )

    if transaction_count == 0:
        return {
            "headline": (
                "More transaction data is needed"
            ),

            "description": (
                "Aura does not have enough transaction data "
                "for a meaningful financial summary yet."
            ),

            "recommendation": (
                "Upload financial transactions to generate "
                "personalized insights."
            ),

            "confidence": 0.20,

            "source": "rule",
        }

    try:
        prompt_evidence = (
            serialize_prompt_evidence(
                evidence
            )
        )

        result = _call_structured_output(
            system_prompt=(
                MONTHLY_SUMMARY_SYSTEM_PROMPT
            ),

            user_prompt=(
                build_monthly_summary_prompt(
                    prompt_evidence
                )
            ),

            output_model=(
                ExecutiveSummaryOutput
            ),
        )

        return {
            "headline": (
                result.headline.strip()
            ),

            "description": (
                result.description.strip()
            ),

            "recommendation": (
                result.recommendation.strip()
            ),

            "confidence": (
                clamp_confidence(
                    result.confidence
                )
            ),

            "source": "ai",
        }

    except (
        ValidationError,
        ValueError,
        RuntimeError,
        Exception,
    ) as exc:
        logger.warning(
            "Aura executive summary generation failed: %s",
            exc,
            exc_info=True,
        )

        return fallback


# ---------------------------------------------------------------------
# Spending insight fallback
# ---------------------------------------------------------------------

def build_spending_insight_fallback(
    *,
    evidence,
):
    """
    Build a deterministic spending explanation from one Insight signal.
    """

    title = (
        evidence.get("title")
        or "Spending pattern detected"
    )

    description = (
        evidence.get("description")
        or (
            "Aura detected a change in your "
            "spending pattern."
        )
    )

    action = evidence.get(
        "action",
        {},
    )

    recommendation = (
        action.get("label")
        if isinstance(action, dict)
        else None
    )

    if recommendation:
        recommendation = (
            f"{recommendation} to review this spending pattern."
        )

    else:
        recommendation = (
            "Review the related transactions for more detail."
        )

    return {
        "title": title,
        "description": description,
        "recommendation": (
            recommendation
        ),
        "confidence": clamp_confidence(
            evidence.get(
                "confidence",
                0.70,
            )
        ),
        "source": "rule",
    }


# ---------------------------------------------------------------------
# Spending insight
# ---------------------------------------------------------------------

def generate_spending_insight(
    *,
    evidence,
):
    """
    Generate an AI explanation for one spending-related signal.

    Example signal types:
        spending_increase
        spending_decrease
        category_spike
        category_decrease
        merchant_spike
        new_category
    """

    fallback = (
        build_spending_insight_fallback(
            evidence=evidence
        )
    )

    try:
        prompt_evidence = (
            serialize_prompt_evidence(
                evidence
            )
        )

        result = _call_structured_output(
            system_prompt=(
                SPENDING_SYSTEM_PROMPT
            ),

            user_prompt=(
                build_spending_insight_prompt(
                    prompt_evidence
                )
            ),

            output_model=(
                SpendingInsightOutput
            ),
        )

        return {
            "title": (
                result.title.strip()
            ),

            "description": (
                result.description.strip()
            ),

            "recommendation": (
                result.recommendation.strip()
            ),

            "confidence": (
                clamp_confidence(
                    result.confidence
                )
            ),

            "source": "ai",
        }

    except (
        ValidationError,
        ValueError,
        RuntimeError,
        Exception,
    ) as exc:
        logger.warning(
            "Aura spending insight generation failed: %s",
            exc,
            exc_info=True,
        )

        return fallback


# ---------------------------------------------------------------------
# Anomaly fallback
# ---------------------------------------------------------------------

def build_anomaly_fallback(
    *,
    evidence,
):
    """
    Deterministic anomaly explanation.

    Never labels transactions as fraudulent.
    """

    merchant = (
        evidence.get("merchant")
        or "This transaction"
    )

    amount_display = (
        evidence.get(
            "amount_display"
        )
        or "the recorded amount"
    )

    multiplier = evidence.get(
        "multiplier"
    )

    historical_average_display = (
        evidence.get(
            "historical_average_display"
        )
    )

    basis = evidence.get(
        "basis"
    )

    title = (
        f"{merchant} is higher than usual"
    )

    if (
        multiplier is not None
        and historical_average_display
    ):
        description = (
            f"{merchant} at {amount_display} is about "
            f"{float(multiplier):.1f}× your historical "
            f"average of {historical_average_display}."
        )

    elif basis == "merchant_history":
        description = (
            f"{merchant} at {amount_display} is higher "
            "than your previous transactions with this merchant."
        )

    elif basis == "category_history":
        description = (
            f"{amount_display} is higher than your typical "
            "spending in this category."
        )

    else:
        description = (
            f"{amount_display} stands out compared with "
            "your broader historical spending pattern."
        )

    return {
        "title": title,

        "description": description,

        "recommendation": (
            "Review the transaction details and confirm "
            "that the amount matches your expectation."
        ),

        "confidence": (
            0.75
            if basis == "merchant_history"
            else 0.60
        ),

        "source": "rule",
    }


# ---------------------------------------------------------------------
# Anomaly explanation
# ---------------------------------------------------------------------

def generate_anomaly_explanation(
    *,
    evidence,
):
    """
    Generate a calm, grounded explanation of one unusual transaction.
    """

    fallback = (
        build_anomaly_fallback(
            evidence=evidence
        )
    )

    try:
        prompt_evidence = (
            serialize_prompt_evidence(
                evidence
            )
        )

        result = _call_structured_output(
            system_prompt=(
                ANOMALY_SYSTEM_PROMPT
            ),

            user_prompt=(
                build_anomaly_explanation_prompt(
                    prompt_evidence
                )
            ),

            output_model=(
                AnomalyExplanationOutput
            ),
        )

        return {
            "title": (
                result.title.strip()
            ),

            "description": (
                result.description.strip()
            ),

            "recommendation": (
                result.recommendation.strip()
            ),

            "confidence": (
                clamp_confidence(
                    result.confidence
                )
            ),

            "source": "ai",
        }

    except (
        ValidationError,
        ValueError,
        RuntimeError,
        Exception,
    ) as exc:
        logger.warning(
            "Aura anomaly explanation generation failed: %s",
            exc,
            exc_info=True,
        )

        return fallback


# ---------------------------------------------------------------------
# Optional signal enrichment
# ---------------------------------------------------------------------

SPENDING_SIGNAL_TYPES = {
    "spending_increase",
    "spending_decrease",
    "category_spike",
    "category_decrease",
    "merchant_spike",
    "new_category",
}


def enrich_signal_with_ai(
    signal,
):
    """
    Optionally enrich one deterministic Insight Engine signal.

    This does not replace the original evidence.

    The original signal remains the source of truth, while AI adds:
        ai_title
        ai_description
        ai_recommendation
        ai_confidence
        ai_source
    """

    signal_type = signal.get(
        "type"
    )

    evidence = {
        **signal,

        "evidence": (
            signal.get(
                "evidence",
                {},
            )
        ),
    }

    if signal_type in SPENDING_SIGNAL_TYPES:
        generated = (
            generate_spending_insight(
                evidence=evidence
            )
        )

    elif signal_type == "unusual_transaction":
        anomaly_evidence = (
            signal.get(
                "evidence",
                {}
            )
        )

        generated = (
            generate_anomaly_explanation(
                evidence=anomaly_evidence
            )
        )

    else:
        return signal

    return {
        **signal,

        "ai": {
            "title": (
                generated[
                    "title"
                ]
            ),

            "description": (
                generated[
                    "description"
                ]
            ),

            "recommendation": (
                generated[
                    "recommendation"
                ]
            ),

            "confidence": (
                generated[
                    "confidence"
                ]
            ),

            "source": (
                generated[
                    "source"
                ]
            ),
        },
    }


def enrich_top_signals_with_ai(
    signals,
    *,
    limit=3,
):
    """
    AI-enrich only the highest-priority relevant signals.

    Do not send every insight to OpenAI. That would increase latency,
    cost, and duplicate work.

    Default:
        enrich at most 3 signals.
    """

    safe_limit = max(
        0,
        min(limit, 5),
    )

    enriched = []

    ai_calls_used = 0

    for signal in signals:
        signal_type = signal.get(
            "type"
        )

        eligible = (
            signal_type
            in SPENDING_SIGNAL_TYPES
            or signal_type
            == "unusual_transaction"
        )

        if (
            eligible
            and ai_calls_used
            < safe_limit
        ):
            enriched.append(
                enrich_signal_with_ai(
                    signal
                )
            )

            ai_calls_used += 1

        else:
            enriched.append(
                signal
            )

    return enriched