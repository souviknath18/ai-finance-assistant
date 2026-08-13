from datetime import date
from decimal import Decimal

from apps.transactions.services.analytics import (
    get_total_income,
    get_total_spending,
)


ZERO = Decimal("0.00")


def compare_spending_periods(
    *,
    user,
    current_start: date,
    current_end: date,
    previous_start: date,
    previous_end: date,
) -> dict:
    current = get_total_spending(
        user=user,
        start_date=current_start,
        end_date=current_end,
    )

    previous = get_total_spending(
        user=user,
        start_date=previous_start,
        end_date=previous_end,
    )

    current_total = current["total"]
    previous_total = previous["total"]

    difference = current_total - previous_total

    if previous_total == ZERO:
        percentage_change = None
    else:
        percentage_change = (
            difference / previous_total
        ) * Decimal("100")

    return {
        "current_period": {
            "start_date": current_start,
            "end_date": current_end,
            "total": current_total,
        },
        "previous_period": {
            "start_date": previous_start,
            "end_date": previous_end,
            "total": previous_total,
        },
        "difference": difference,
        "percentage_change": percentage_change,
    }


def calculate_cash_flow(
    *,
    user,
    start_date: date,
    end_date: date,
) -> dict:
    income = get_total_income(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    spending = get_total_spending(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    net_cash_flow = (
        income["total"]
        - spending["total"]
    )

    return {
        "start_date": start_date,
        "end_date": end_date,
        "income": income["total"],
        "spending": spending["total"],
        "net_cash_flow": net_cash_flow,
        "is_positive": net_cash_flow >= ZERO,
    }