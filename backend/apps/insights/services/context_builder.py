def build_insight_context(
    *,
    period,
    metrics,
    previous_metrics,
    spending_trend,
    categories,
    category_trends,
    anomalies,
    recurring,
    health,
    signals,
):
    return {
        "period": {
            "start": period["start"].isoformat(),
            "end": period["end"].isoformat(),
        },

        "overview": {
            "income": str(
                metrics["total_income"]
            ),

            "expenses": str(
                metrics["total_expense"]
            ),

            "savings": str(
                metrics["savings"]
            ),

            "savings_rate": (
                metrics["savings_rate"]
            ),
        },

        "previous_period": {
            "income": str(
                previous_metrics["total_income"]
            ),

            "expenses": str(
                previous_metrics["total_expense"]
            ),

            "savings": str(
                previous_metrics["savings"]
            ),
        },

        "spending_trend": spending_trend,

        "top_categories": categories[:5],

        "category_trends": category_trends[:5],

        "anomalies": {
            "count": anomalies.get(
                "alert_count",
                0,
            ),

            "items": anomalies.get(
                "alerts",
                [],
            )[:3],
        },

        "recurring": {
            "monthly_total": str(
                recurring.get(
                    "monthly_total",
                    0,
                )
            ),

            "subscription_count": recurring.get(
                "subscription_count",
                0,
            ),

            "duplicate_count": recurring.get(
                "duplicate_count",
                0,
            ),
        },

        "financial_health": health,

        "important_signals": signals[:6],
    }