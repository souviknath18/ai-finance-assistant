from datetime import date
from decimal import Decimal
from typing import Any

from apps.transactions.services.analytics import (
    get_category_breakdown,
    get_category_spending,
    get_largest_expense,
    get_top_spending_category,
    get_total_income,
    get_total_spending,
    get_transaction_counts,
)


def _json_safe(value: Any):
    """
    Convert tool output into JSON-safe values.

    LangChain/LangGraph tool results should avoid leaking
    Django/Decimal objects into model-facing state.
    """

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, date):
        return value.isoformat()

    if isinstance(value, list):
        return [
            _json_safe(item)
            for item in value
        ]

    if isinstance(value, dict):
        return {
            key: _json_safe(item)
            for key, item in value.items()
        }

    return value


def total_spending_tool(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    result = get_total_spending(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)


def total_income_tool(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    result = get_total_income(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)


def category_spending_tool(
    *,
    user,
    category: str,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    result = get_category_spending(
        user=user,
        category=category,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)


def category_breakdown_tool(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int = 10,
) -> list[dict]:
    result = get_category_breakdown(
        user=user,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
    )

    return _json_safe(result)


def top_spending_category_tool(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict | None:
    result = get_top_spending_category(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)


def largest_expense_tool(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict | None:
    result = get_largest_expense(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)


def transaction_counts_tool(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    result = get_transaction_counts(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return _json_safe(result)