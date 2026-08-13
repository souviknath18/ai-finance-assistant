from datetime import date

from ai.tools.transactions import (
    _json_safe,
)

from apps.budgets.services.analytics import (
    get_active_budgets,
    get_budget_status,
)


def active_budgets_tool(
    *,
    user,
) -> list[dict]:
    return _json_safe(
        get_active_budgets(
            user=user,
        )
    )


def budget_status_tool(
    *,
    user,
    category: str,
    start_date: date,
    end_date: date,
) -> dict | None:
    return _json_safe(
        get_budget_status(
            user=user,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )
    )