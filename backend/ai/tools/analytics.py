from datetime import date

from ai.tools.transactions import _json_safe

from apps.transactions.services.comparisons import (
    calculate_cash_flow,
    compare_spending_periods,
)
from apps.transactions.services.trends import (
    get_monthly_spending_trend,
)


def compare_spending_periods_tool(
    *,
    user,
    current_start: date,
    current_end: date,
    previous_start: date,
    previous_end: date,
) -> dict:
    result = compare_spending_periods(
        user=user,
        current_start=current_start,
        current_end=current_end,
        previous_start=previous_start,
        previous_end=previous_end,
    )

    return _json_safe(result)


def cash_flow_tool(
    *,
    user,
    start_date: date,
    end_date: date,
) -> dict:
    result = calculate_cash_flow(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)


def monthly_spending_trend_tool(
    *,
    user,
    start_date: date,
    end_date: date,
) -> list[dict]:
    result = get_monthly_spending_trend(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)