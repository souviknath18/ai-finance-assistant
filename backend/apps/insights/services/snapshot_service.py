import json

from django.utils import timezone

from apps.insights.models import (
    InsightSnapshot,
)

from apps.insights.services.analytics_service import (
    calculate_category_breakdown,
    calculate_monthly_spending,
    calculate_period_metrics,
    get_current_month_period,
    get_previous_month_period,
)

from apps.insights.services.trend_analyzer import (
    analyze_category_trends,
    analyze_overall_spending_trend,
    find_category_spikes,
)

from apps.insights.services.anomaly_detector import (
    detect_anomalies,
)

from apps.insights.services.recurring_detector import (
    analyze_recurring_expenses,
)

from apps.insights.services.financial_health import (
    calculate_financial_health,
)

from apps.insights.services.insight_engine import (
    build_insight_signals,
)

from apps.insights.services.context_builder import (
    build_insight_context,
)

from apps.insights.services.insight_generator import (
    generate_executive_summary,
)

from apps.notifications.services import (
    create_notification_once,
)


def build_insights_summary(
    *,
    user,
    start_date,
    end_date,
):
    previous_start, previous_end = (
        get_previous_month_period(
            start_date
        )
    )

    current_metrics = (
        calculate_period_metrics(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    previous_metrics = (
        calculate_period_metrics(
            user=user,
            start_date=previous_start,
            end_date=previous_end,
        )
    )

    current_categories = (
        calculate_category_breakdown(
            user=user,
            start_date=start_date,
            end_date=end_date,
            limit=10,
        )
    )

    previous_categories = (
        calculate_category_breakdown(
            user=user,
            start_date=previous_start,
            end_date=previous_end,
            limit=20,
        )
    )

    spending_trend = (
        analyze_overall_spending_trend(
            current_metrics=current_metrics,
            previous_metrics=previous_metrics,
        )
    )

    category_trends = (
        analyze_category_trends(
            current_categories=current_categories,
            previous_categories=previous_categories,
        )
    )

    category_spikes = (
        find_category_spikes(
            category_trends
        )
    )

    anomalies = detect_anomalies(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    recurring = analyze_recurring_expenses(
        user=user
    )

    health = calculate_financial_health(
        metrics=current_metrics,
        spending_trend=spending_trend,
        anomalies=anomalies,
        recurring=recurring,
    )

    signals = build_insight_signals(
        metrics=current_metrics,
        spending_trend=spending_trend,
        category_trends=category_trends,
        category_spikes=category_spikes,
        anomalies=anomalies,
        recurring=recurring,
        health=health,
    )

    context = build_insight_context(
        period={
            "start": start_date,
            "end": end_date,
        },

        metrics=current_metrics,
        previous_metrics=previous_metrics,

        spending_trend=spending_trend,

        categories=current_categories,
        category_trends=category_trends,

        anomalies=anomalies,
        recurring=recurring,
        health=health,
        signals=signals,
    )

    executive_summary = (
        generate_executive_summary(
            context=context,
            metrics=current_metrics,
            health=health,
            spending_trend=spending_trend,
        )
    )

    # --------------------------------
    # Frontend-compatible response
    # --------------------------------

    primary_alert = anomalies.get(
        "primary_alert",
        {},
    )

    change = spending_trend.get(
        "change_percent"
    )

    if change is None:
        spending_value = "No comparison"
        spending_description = (
            "More historical data is needed "
            "to calculate a spending trend."
        )

    elif change > 0:
        spending_value = f"+{change:.1f}%"
        spending_description = (
            f"Spending increased {change:.1f}% "
            "compared with the previous month."
        )

    elif change < 0:
        spending_value = f"-{abs(change):.1f}%"
        spending_description = (
            f"Spending decreased {abs(change):.1f}% "
            "compared with the previous month."
        )

    else:
        spending_value = "0%"
        spending_description = (
            "Spending is unchanged from "
            "the previous month."
        )

    return {
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),

            "comparison_start": (
                previous_start.isoformat()
            ),

            "comparison_end": (
                previous_end.isoformat()
            ),
        },

        "executive_summary": {
            "headline": (
                executive_summary["headline"]
            ),

            "description": (
                executive_summary["description"]
            ),

            "recommendation": (
                executive_summary[
                    "recommendation"
                ]
            ),

            "source": (
                executive_summary["source"]
            ),
        },

        "alerts": {
            "budget_warning": {
                "title": primary_alert.get(
                    "title",
                    "Spending looks stable",
                ),

                "description": (
                    primary_alert.get(
                        "description",
                        "No major financial warning detected.",
                    )
                ),
            },

            "saving_opportunity": {
                "title": "Smart Saving",

                "description": (
                    executive_summary.get(
                        "recommendation"
                    )
                    or recurring[
                        "recommendation"
                    ]
                ),
            },
        },

        "metrics": {
            "spending_spikes": (
                spending_value
            ),

            "spending_spikes_description": (
                spending_description
            ),

            "unusual_activity_count": (
                anomalies["alert_count"]
            ),

            "recurring_total": (
                recurring[
                    "monthly_total_display"
                ]
            ),

            "recurring_description": (
                recurring[
                    "recommendation"
                ]
            ),

            "health_score": (
                health["score"]
            ),

            "health_status": (
                health["status"]
            ),
        },

        "overview": {
            **current_metrics,

            "total_income": str(
                current_metrics[
                    "total_income"
                ]
            ),

            "total_expense": str(
                current_metrics[
                    "total_expense"
                ]
            ),

            "savings": str(
                current_metrics[
                    "savings"
                ]
            ),
        },

        "trends": {
            "spending": spending_trend,
            "categories": category_trends,
            "spikes": category_spikes,
        },

        "anomalies": anomalies,

        "recurring": {
            **recurring,

            "monthly_total": str(
                recurring[
                    "monthly_total"
                ]
            ),
        },

        "category_breakdown": [
            {
                **category,
                "amount": str(
                    category["amount"]
                ),
            }
            for category in current_categories
        ],

        "monthly_spending": (
            calculate_monthly_spending(
                user=user,
                months=6,
            )
        ),

        "health": health,

        # Keep temporarily because your frontend
        # still references wealth_tip.description.
        "wealth_tip": {
            "title": (
                f"Financial Health: "
                f"{health['score']}/100"
            ),

            "description": (
                f"Your financial health is "
                f"{health['status']} with a "
                f"savings rate of "
                f"{health['savings_rate']:.1f}%."
            ),

            "potential_earn": (
                f"{health['score']}/100"
            ),

            "potential_description": (
                "Based on savings, cash flow, "
                "spending stability, recurring "
                "costs, and unusual activity."
            ),
        },

        "signals": signals,

        # Current ObservationTable compatibility.
        "observations": signals[:8],

        "generated_at": (
            timezone.now().isoformat()
        ),
    }


def _json_safe(data):
    return json.loads(
        json.dumps(
            data,
            default=str,
        )
    )


def regenerate_insights_snapshot(
    user,
    *,
    start_date=None,
    end_date=None,
):
    if not start_date or not end_date:
        start_date, end_date = (
            get_current_month_period()
        )

    snapshot, _ = (
        InsightSnapshot.objects.get_or_create(
            user=user,
            period_start=start_date,
            period_end=end_date,
        )
    )

    snapshot.mark_generating()

    try:
        data = build_insights_summary(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )

        snapshot.data = _json_safe(
            data
        )

        snapshot.save(
            update_fields=[
                "data",
                "updated_at",
            ]
        )

        snapshot.mark_ready()

        create_insight_notifications(
            user=user,
            data=data,
        )

        return snapshot.data

    except Exception as error:
        snapshot.mark_failed(
            str(error)
        )

        raise


def get_insights_summary(
    user,
    *,
    start_date=None,
    end_date=None,
):
    if not start_date or not end_date:
        start_date, end_date = (
            get_current_month_period()
        )

    snapshot, _ = (
        InsightSnapshot.objects.get_or_create(
            user=user,
            period_start=start_date,
            period_end=end_date,
        )
    )

    if (
        snapshot.data
        and not snapshot.is_stale
        and snapshot.status
        == InsightSnapshot.Status.READY
    ):
        return snapshot.data

    return regenerate_insights_snapshot(
        user,
        start_date=start_date,
        end_date=end_date,
    )


def mark_insights_stale(user):
    InsightSnapshot.objects.filter(
        user=user,
    ).update(
        is_stale=True,
    )


def create_insight_notifications(
    *,
    user,
    data,
):
    anomalies = data.get(
        "anomalies",
        {}
    )

    primary_alert = anomalies.get(
        "primary_alert",
        {}
    )

    if not anomalies.get(
        "alert_count"
    ):
        return

    title = primary_alert.get(
        "title"
    )

    description = primary_alert.get(
        "description"
    )

    if not title:
        return

    create_notification_once(
        user=user,

        title=title,

        description=(
            description
            or ""
        ),

        notification_type="ai_alert",

        tone="purple",

        action_label="View Insights",

        action_url="/insights",
    )