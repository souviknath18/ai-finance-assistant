from datetime import date

from apps.budgets.services.analytics import (
    get_active_budgets,
)
from apps.goals.services.analytics import (
    get_active_goals,
)
from apps.subscriptions.services.analytics import (
    get_subscription_summary,
)
from apps.transactions.services.analytics import (
    get_category_breakdown,
    get_total_income,
    get_total_spending,
)
from apps.transactions.services.comparisons import (
    calculate_cash_flow,
)
from apps.transactions.services.trends import (
    get_monthly_spending_trend,
)


def build_insights_context(
    *,
    user,
    start_date: date,
    end_date: date,
) -> dict:
    """
    Build deterministic financial context for Insights.

    No LLM calls should happen here.
    """

    spending = get_total_spending(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    income = get_total_income(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    category_breakdown = get_category_breakdown(
        user=user,
        start_date=start_date,
        end_date=end_date,
        limit=10,
    )

    cash_flow = calculate_cash_flow(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    monthly_trend = get_monthly_spending_trend(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    budgets = get_active_budgets(
        user=user,
    )

    goals = get_active_goals(
        user=user,
    )

    subscriptions = get_subscription_summary(
        user=user,
    )

    return {
        "period": {
            "start_date": start_date,
            "end_date": end_date,
        },
        "spending": spending,
        "income": income,
        "cash_flow": cash_flow,
        "category_breakdown": category_breakdown,
        "monthly_trend": monthly_trend,
        "budgets": budgets,
        "goals": goals,
        "subscriptions": subscriptions,
    }