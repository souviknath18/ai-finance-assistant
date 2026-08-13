import logging

logger = logging.getLogger(__name__)
from decimal import Decimal, InvalidOperation
from ai.rag.evidence import (
    serialize_evidence_list,
)
from ai.rag.transaction_retriever import (
    retrieve_semantic_transaction_evidence,
)

ZERO = Decimal("0.00")


# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------

def to_decimal(value) -> Decimal:
    """
    Safely convert a value into Decimal.
    """

    if value is None:
        return ZERO

    if isinstance(value, Decimal):
        return value

    try:
        return Decimal(str(value))

    except (InvalidOperation, TypeError, ValueError):
        return ZERO


def serialize_value(value):
    """
    Convert values such as Decimal into JSON-safe primitives.

    This keeps evidence_builder independent from snapshot serialization.
    """

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, dict):
        return {
            key: serialize_value(item)
            for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            serialize_value(item)
            for item in value
        ]

    if isinstance(value, tuple):
        return [
            serialize_value(item)
            for item in value
        ]

    return value


def select_top_signals(
    signals,
    *,
    limit=8,
):
    """
    Keep only the highest-priority signals for AI context.

    insight_engine.py already sorts by priority, so slicing is enough.
    """

    safe_limit = max(
        1,
        min(limit, 20),
    )

    return signals[:safe_limit]


# ---------------------------------------------------------------------
# Analytics evidence
# ---------------------------------------------------------------------

def build_overview_evidence(
    analytics,
):
    """
    Extract the core verified financial metrics.
    """

    metrics = analytics.get(
        "metrics",
        {},
    )

    return {
        "income": str(
            metrics.get(
                "total_income",
                ZERO,
            )
        ),

        "income_display": (
            metrics.get(
                "total_income_display"
            )
        ),

        "expenses": str(
            metrics.get(
                "total_expense",
                ZERO,
            )
        ),

        "expenses_display": (
            metrics.get(
                "total_expense_display"
            )
        ),

        "savings": str(
            metrics.get(
                "savings",
                ZERO,
            )
        ),

        "savings_display": (
            metrics.get(
                "savings_display"
            )
        ),

        "savings_rate": (
            metrics.get(
                "savings_rate",
                0,
            )
        ),

        "transaction_count": (
            metrics.get(
                "transaction_count",
                0,
            )
        ),

        "expense_count": (
            metrics.get(
                "expense_count",
                0,
            )
        ),

        "income_count": (
            metrics.get(
                "income_count",
                0,
            )
        ),
    }


def build_category_evidence(
    analytics,
    *,
    limit=5,
):
    """
    Keep only top spending categories for prompt context.
    """

    categories = analytics.get(
        "categories",
        [],
    )

    safe_limit = max(
        1,
        min(limit, 10),
    )

    return [
        {
            "category": item.get(
                "category"
            ),

            "amount": str(
                item.get(
                    "amount",
                    ZERO,
                )
            ),

            "amount_display": (
                item.get(
                    "total_display"
                )
            ),

            "percentage": (
                item.get(
                    "percentage",
                    0,
                )
            ),

            "transaction_count": (
                item.get(
                    "count",
                    0,
                )
            ),
        }
        for item in categories[:safe_limit]
    ]


def build_merchant_evidence(
    analytics,
    *,
    limit=5,
):
    """
    Keep only top merchants for prompt context.
    """

    merchants = analytics.get(
        "merchants",
        [],
    )

    safe_limit = max(
        1,
        min(limit, 10),
    )

    return [
        {
            "merchant": item.get(
                "merchant"
            ),

            "amount": str(
                item.get(
                    "amount",
                    ZERO,
                )
            ),

            "amount_display": (
                item.get(
                    "amount_display"
                )
            ),

            "transaction_count": (
                item.get(
                    "count",
                    0,
                )
            ),
        }
        for item in merchants[:safe_limit]
    ]


# ---------------------------------------------------------------------
# Trend evidence
# ---------------------------------------------------------------------

def build_trend_evidence(
    trends,
):
    """
    Build a concise trend summary for AI generation.
    """

    spending = trends.get(
        "spending",
        {},
    )

    income = trends.get(
        "income",
        {},
    )

    savings = trends.get(
        "savings",
        {},
    )

    return {
        "spending": {
            "current_amount": str(
                spending.get(
                    "current_amount",
                    ZERO,
                )
            ),

            "previous_amount": str(
                spending.get(
                    "previous_amount",
                    ZERO,
                )
            ),

            "change_percent": (
                spending.get(
                    "change_percent"
                )
            ),

            "direction": (
                spending.get(
                    "direction"
                )
            ),
        },

        "income": {
            "current_amount": str(
                income.get(
                    "current_amount",
                    ZERO,
                )
            ),

            "previous_amount": str(
                income.get(
                    "previous_amount",
                    ZERO,
                )
            ),

            "change_percent": (
                income.get(
                    "change_percent"
                )
            ),

            "direction": (
                income.get(
                    "direction"
                )
            ),
        },

        "savings": {
            "current_savings": str(
                savings.get(
                    "current_savings",
                    ZERO,
                )
            ),

            "previous_savings": str(
                savings.get(
                    "previous_savings",
                    ZERO,
                )
            ),

            "change_percent": (
                savings.get(
                    "change_percent"
                )
            ),

            "direction": (
                savings.get(
                    "direction"
                )
            ),

            "current_savings_rate": (
                savings.get(
                    "current_savings_rate",
                    0,
                )
            ),

            "previous_savings_rate": (
                savings.get(
                    "previous_savings_rate",
                    0,
                )
            ),

            "savings_rate_change": (
                savings.get(
                    "savings_rate_change",
                    0,
                )
            ),
        },

        "category_spikes": [
            serialize_value(item)
            for item in trends.get(
                "category_spikes",
                [],
            )[:3]
        ],

        "category_decreases": [
            serialize_value(item)
            for item in trends.get(
                "category_decreases",
                [],
            )[:3]
        ],

        "new_categories": [
            serialize_value(item)
            for item in trends.get(
                "new_categories",
                [],
            )[:3]
        ],

        "merchant_spikes": [
            serialize_value(item)
            for item in trends.get(
                "merchant_spikes",
                [],
            )[:3]
        ],
    }


# ---------------------------------------------------------------------
# Anomaly evidence
# ---------------------------------------------------------------------

def build_anomaly_evidence(
    anomalies,
    *,
    limit=3,
):
    """
    Include only the strongest anomalies in AI context.
    """

    safe_limit = max(
        1,
        min(limit, 5),
    )

    items = anomalies.get(
        "items",
        [],
    )

    return {
        "count": anomalies.get(
            "count",
            0,
        ),

        "items": [
            {
                "transaction_id": (
                    item.get(
                        "transaction_id"
                    )
                ),

                "merchant": (
                    item.get(
                        "merchant"
                    )
                ),

                "category": (
                    item.get(
                        "category"
                    )
                ),

                "date": (
                    item.get(
                        "date"
                    )
                ),

                "amount": (
                    item.get(
                        "amount"
                    )
                ),

                "amount_display": (
                    item.get(
                        "amount_display"
                    )
                ),

                "description": (
                    item.get(
                        "description"
                    )
                ),

                "basis": (
                    item.get(
                        "basis"
                    )
                ),

                "multiplier": (
                    item.get(
                        "multiplier"
                    )
                ),

                "z_score": (
                    item.get(
                        "z_score"
                    )
                ),

                "historical_average": (
                    item.get(
                        "historical_average"
                    )
                ),

                "historical_average_display": (
                    item.get(
                        "historical_average_display"
                    )
                ),

                "history_count": (
                    item.get(
                        "history_count",
                        0,
                    )
                ),
            }
            for item in items[:safe_limit]
        ],
    }


# ---------------------------------------------------------------------
# Recurring evidence
# ---------------------------------------------------------------------

def build_recurring_evidence(
    recurring,
):
    """
    Build compact recurring-expense evidence.
    """

    return {
        "monthly_total": str(
            recurring.get(
                "monthly_total",
                ZERO,
            )
        ),

        "monthly_total_display": (
            recurring.get(
                "monthly_total_display"
            )
        ),

        "subscription_count": (
            recurring.get(
                "subscription_count",
                0,
            )
        ),

        "duplicate_count": (
            recurring.get(
                "duplicate_count",
                0,
            )
        ),

        "upcoming_count": (
            recurring.get(
                "upcoming_count",
                0,
            )
        ),

        "duplicates": (
            recurring.get(
                "duplicates",
                [],
            )[:3]
        ),

        "upcoming_bills": (
            recurring.get(
                "upcoming_bills",
                [],
            )[:3]
        ),

        "top_subscriptions": (
            recurring.get(
                "subscriptions",
                [],
            )[:5]
        ),
    }


# ---------------------------------------------------------------------
# Budget evidence
# ---------------------------------------------------------------------

def build_budget_evidence(
    budgets,
):
    """
    Keep only useful budget summary and risk items.
    """

    summary = budgets.get(
        "summary",
        {},
    )

    return {
        "summary": {
            "active_budgets": (
                summary.get(
                    "active_budgets",
                    0,
                )
            ),

            "total_limit": (
                summary.get(
                    "total_limit"
                )
            ),

            "total_limit_display": (
                summary.get(
                    "total_limit_display"
                )
            ),

            "total_spent": (
                summary.get(
                    "total_spent"
                )
            ),

            "total_spent_display": (
                summary.get(
                    "total_spent_display"
                )
            ),

            "overall_usage_percent": (
                summary.get(
                    "overall_usage_percent",
                    0,
                )
            ),

            "exceeded_count": (
                summary.get(
                    "exceeded_count",
                    0,
                )
            ),

            "at_risk_count": (
                summary.get(
                    "at_risk_count",
                    0,
                )
            ),

            "warning_count": (
                summary.get(
                    "warning_count",
                    0,
                )
            ),
        },

        "exceeded": [
            serialize_value(item)
            for item in budgets.get(
                "exceeded",
                [],
            )[:3]
        ],

        "at_risk": [
            serialize_value(item)
            for item in budgets.get(
                "at_risk",
                [],
            )[:3]
        ],

        "warnings": [
            serialize_value(item)
            for item in budgets.get(
                "warnings",
                [],
            )[:3]
        ],
    }


# ---------------------------------------------------------------------
# Goal evidence
# ---------------------------------------------------------------------

def build_goal_evidence(
    goals,
):
    """
    Keep relevant goal progress and risk information.
    """

    summary = goals.get(
        "summary",
        {},
    )

    return {
        "summary": {
            "active_goals": (
                summary.get(
                    "active_goals",
                    0,
                )
            ),

            "overall_progress_percent": (
                summary.get(
                    "overall_progress_percent",
                    0,
                )
            ),

            "on_track_count": (
                summary.get(
                    "on_track_count",
                    0,
                )
            ),

            "at_risk_count": (
                summary.get(
                    "at_risk_count",
                    0,
                )
            ),

            "overdue_count": (
                summary.get(
                    "overdue_count",
                    0,
                )
            ),

            "total_remaining": (
                summary.get(
                    "total_remaining"
                )
            ),

            "total_remaining_display": (
                summary.get(
                    "total_remaining_display"
                )
            ),
        },

        "at_risk": [
            serialize_value(item)
            for item in goals.get(
                "at_risk",
                [],
            )[:3]
        ],

        "overdue": [
            serialize_value(item)
            for item in goals.get(
                "overdue",
                [],
            )[:3]
        ],

        "on_track": [
            serialize_value(item)
            for item in goals.get(
                "on_track",
                [],
            )[:3]
        ],
    }


# ---------------------------------------------------------------------
# Financial health evidence
# ---------------------------------------------------------------------

def build_health_evidence(
    health,
):
    """
    Keep score, breakdown, strengths, and concerns.
    """

    return {
        "score": health.get(
            "score",
            0,
        ),

        "status": health.get(
            "status"
        ),

        "savings_rate": (
            health.get(
                "savings_rate",
                0,
            )
        ),

        "breakdown": (
            health.get(
                "breakdown",
                {},
            )
        ),

        "strengths": (
            health.get(
                "strengths",
                [],
            )
        ),

        "concerns": (
            health.get(
                "concerns",
                [],
            )
        ),
    }


# ---------------------------------------------------------------------
# Signal evidence
# ---------------------------------------------------------------------

def build_signal_evidence(
    signals,
    *,
    limit=8,
):
    """
    Keep the important signal fields without passing unnecessary
    frontend-only data into the LLM.
    """

    top_signals = select_top_signals(
        signals,
        limit=limit,
    )

    return [
        {
            "id": signal.get(
                "id"
            ),

            "type": signal.get(
                "type"
            ),

            "severity": signal.get(
                "severity"
            ),

            "priority": signal.get(
                "priority"
            ),

            "title": signal.get(
                "title"
            ),

            "description": signal.get(
                "description"
            ),

            "category": signal.get(
                "category"
            ),

            "impact": (
                serialize_value(
                    signal.get(
                        "impact"
                    )
                )
            ),

            "confidence": (
                signal.get(
                    "confidence"
                )
            ),

            "evidence": (
                serialize_value(
                    signal.get(
                        "evidence",
                        {},
                    )
                )
            ),
        }
        for signal in top_signals
    ]


# ---------------------------------------------------------------------
# Semantic RAG evidence
# ---------------------------------------------------------------------

def get_insight_rag_evidence(
    *,
    user,
    query: str,
    limit: int = 6,
):
    """
    Retrieve semantically relevant transaction evidence.

    This supplements deterministic financial analysis with
    actual supporting transaction context.
    """

    if not query or not query.strip():
        return []

    safe_limit = max(
        1,
        min(limit, 10),
    )

    evidence = (
        retrieve_semantic_transaction_evidence(
            user=user,
            query=query.strip(),
            limit=safe_limit,
        )
    )

    return serialize_evidence_list(
        evidence
    )


def build_supporting_evidence(
    *,
    user,
    analysis: dict,
) -> dict:
    evidence = {}

    anomalies = analysis.get(
        "anomalies",
        {},
    )

    trends = analysis.get(
        "trends",
        {},
    )

    anomaly_items = anomalies.get(
        "items",
        [],
    )

    if anomaly_items:
        logger.info(
            "Insights RAG: retrieving anomaly evidence for user=%s",
            user.pk,
        )

        evidence["anomalies"] = (
            get_insight_rag_evidence(
                user=user,
                query=(
                    "unusually large unexpected "
                    "or abnormal expense transactions"
                ),
                limit=6,
            )
        )

    spending_change = (
        trends.get(
            "spending",
            {},
        ).get(
            "change_percent"
        )
    )

    has_meaningful_spending_increase = (
        spending_change is not None
        and float(spending_change) >= 10
    )

    has_category_spikes = bool(
        trends.get(
            "category_spikes",
            [],
        )
    )

    has_merchant_spikes = bool(
        trends.get(
            "merchant_spikes",
            [],
        )
    )

    if (
        has_meaningful_spending_increase
        or has_category_spikes
        or has_merchant_spikes
    ):
        logger.info(
            "Insights RAG: retrieving spending evidence for user=%s",
            user.pk,
        )

        evidence["spending"] = (
            get_insight_rag_evidence(
                user=user,
                query=(
                    "recent discretionary spending "
                    "high spending and increased expenses"
                ),
                limit=6,
            )
        )

    return evidence


# ---------------------------------------------------------------------
# Full evidence package
# ---------------------------------------------------------------------

def build_evidence_package(
    *,
    period,
    comparison_period,
    analytics,
    previous_analytics,
    trends,
    anomalies,
    recurring,
    budgets,
    goals,
    health,
    signals,
):
    """
    Build the verified financial context consumed by OpenAI.

    Everything in this package comes from deterministic backend
    services. The LLM should only explain or summarize it.

    No new financial calculations should happen inside the prompt.
    """

    evidence = {
        "period": {
            "start": (
                period["start"].isoformat()
                if hasattr(
                    period["start"],
                    "isoformat",
                )
                else period["start"]
            ),

            "end": (
                period["end"].isoformat()
                if hasattr(
                    period["end"],
                    "isoformat",
                )
                else period["end"]
            ),
        },

        "comparison_period": {
            "start": (
                comparison_period[
                    "start"
                ].isoformat()
                if hasattr(
                    comparison_period[
                        "start"
                    ],
                    "isoformat",
                )
                else comparison_period[
                    "start"
                ]
            ),

            "end": (
                comparison_period[
                    "end"
                ].isoformat()
                if hasattr(
                    comparison_period[
                        "end"
                    ],
                    "isoformat",
                )
                else comparison_period[
                    "end"
                ]
            ),
        },

        "overview": (
            build_overview_evidence(
                analytics
            )
        ),

        "previous_overview": (
            build_overview_evidence(
                previous_analytics
            )
        ),

        "top_categories": (
            build_category_evidence(
                analytics
            )
        ),

        "top_merchants": (
            build_merchant_evidence(
                analytics
            )
        ),

        "trends": (
            build_trend_evidence(
                trends
            )
        ),

        "anomalies": (
            build_anomaly_evidence(
                anomalies
            )
        ),

        "recurring": (
            build_recurring_evidence(
                recurring
            )
        ),

        "budgets": (
            build_budget_evidence(
                budgets
            )
        ),

        "goals": (
            build_goal_evidence(
                goals
            )
        ),

        "financial_health": (
            build_health_evidence(
                health
            )
        ),

        "important_insights": (
            build_signal_evidence(
                signals
            )
        ),
    }

    return serialize_value(
        evidence
    )