from datetime import date

from apps.insights.services.analytics_service import (
    build_period_analytics,
)
from apps.insights.services.anomaly_detector import (
    detect_anomalies,
)
from apps.insights.services.budget_analyzer import (
    analyze_budgets,
)
from apps.insights.services.financial_health import (
    calculate_financial_health,
)
from apps.insights.services.goal_analyzer import (
    analyze_goals,
)
from apps.insights.services.recurring_detector import (
    detect_recurring_patterns,
)
from apps.insights.services.trend_analyzer import (
    analyze_trends,
)


def build_insight_analysis(
    *,
    user,
    start_date: date,
    end_date: date,
) -> dict:
    """
    Build all deterministic financial analysis required
    by the Aura Insights engine.

    No LLM calls should happen here.
    """

    analytics = build_period_analytics(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    trends = analyze_trends(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    anomalies = detect_anomalies(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    recurring = detect_recurring_patterns(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    budgets = analyze_budgets(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    goals = analyze_goals(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    health = calculate_financial_health(
        analytics=analytics,
        budgets=budgets,
        goals=goals,
    )

    return {
        "analytics": analytics,
        "trends": trends,
        "anomalies": anomalies,
        "recurring": recurring,
        "budgets": budgets,
        "goals": goals,
        "health": health,
    }