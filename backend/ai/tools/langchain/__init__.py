from ai.tools.langchain.retrieval import (
    search_transactions,
)
from ai.tools.langchain.analytics import (
    compare_spending_periods,
    get_cash_flow,
    get_monthly_spending_trend,
)
from ai.tools.langchain.transactions import (
    get_category_breakdown,
    get_category_spending,
    get_largest_expense,
    get_top_spending_category,
    get_total_income,
    get_total_spending,
    get_transaction_counts,
)

from ai.tools.langchain.budgets import (
    get_active_budgets,
    get_budget_status,
)

from ai.tools.langchain.goals import (
    get_active_goals,
    get_goal_status,
)

from ai.tools.langchain.subscriptions import (
    get_active_subscriptions,
    get_subscription_cancel_candidates,
    get_subscription_summary,
)


AURA_TOOLS = [
    # Transactions
    get_total_spending,
    get_total_income,
    get_category_spending,
    get_category_breakdown,
    get_top_spending_category,
    get_largest_expense,
    get_transaction_counts,

    # Analytics
    compare_spending_periods,
    get_cash_flow,
    get_monthly_spending_trend,

    # Budgets
    get_active_budgets,
    get_budget_status,

    # Goals
    get_active_goals,
    get_goal_status,

    # Subscriptions
    get_active_subscriptions,
    get_subscription_summary,
    get_subscription_cancel_candidates,

    # Semantic retrieval
    search_transactions,
]


__all__ = [
    "AURA_TOOLS",
]