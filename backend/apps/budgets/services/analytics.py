from datetime import date
from decimal import Decimal

from django.db.models import Sum

from apps.budgets.models import Budget
from apps.transactions.models import Transaction


ZERO = Decimal("0.00")


def get_active_budgets(
    *,
    user,
) -> list[dict]:
    budgets = (
        Budget.objects
        .filter(
            user=user,
            is_active=True,
        )
        .order_by("category")
    )

    return [
        {
            "budget_id": budget.budget_id,
            "category": budget.category,
            "limit_amount": budget.limit_amount,
            "period": budget.period,
        }
        for budget in budgets
    ]


def get_budget_status(
    *,
    user,
    category: str,
    start_date: date,
    end_date: date,
) -> dict | None:
    """
    Return budget usage for one category.
    """

    budget = (
        Budget.objects
        .filter(
            user=user,
            category__iexact=category,
            is_active=True,
        )
        .first()
    )

    if budget is None:
        return None

    spending = (
        Transaction.objects
        .filter(
            user=user,
            transaction_type=(
                Transaction.TransactionType.EXPENSE
            ),
            category__iexact=budget.category,
            date__range=(
                start_date,
                end_date,
            ),
        )
        .aggregate(
            total=Sum("amount")
        )["total"]
        or ZERO
    )

    spending = abs(spending)

    remaining = (
        budget.limit_amount
        - spending
    )

    if budget.limit_amount > ZERO:
        utilization = (
            spending
            / budget.limit_amount
            * Decimal("100")
        )
    else:
        utilization = ZERO

    return {
        "budget_id": budget.budget_id,
        "category": budget.category,
        "period": budget.period,
        "limit_amount": budget.limit_amount,
        "spent_amount": spending,
        "remaining_amount": remaining,
        "utilization_percent": utilization,
        "is_over_budget": (
            spending
            > budget.limit_amount
        ),
    }