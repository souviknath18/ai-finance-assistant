from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from apps.transactions.models import Transaction


ZERO = Decimal("0.00")


def format_money(amount):
    amount = amount or ZERO
    return f"₹{abs(amount):,.2f}"


def get_current_month_range():
    today = timezone.localdate()
    start = today.replace(day=1)

    return start, today


def analyze_budget_usage(
    user,
    budget,
):
    start_date, end_date = (
        get_current_month_range()
    )

    spent = (
        Transaction.objects
        .filter(
            user=user,
            transaction_type="expense",
            category__iexact=budget.category,
            date__gte=start_date,
            date__lte=end_date,
        )
        .aggregate(
            total=Sum("amount")
        )["total"]
        or ZERO
    )

    spent = abs(spent)

    limit_amount = (
        budget.limit_amount
        or ZERO
    )

    remaining = (
        limit_amount
        - spent
    )

    usage_percent = ZERO

    if limit_amount > ZERO:
        usage_percent = (
            spent
            / limit_amount
            * Decimal("100")
        )

    usage_percent = round(
        usage_percent,
        2,
    )

    status = "safe"

    if usage_percent >= Decimal("100"):
        status = "exceeded"

    elif usage_percent >= Decimal("85"):
        status = "critical"

    elif usage_percent >= Decimal("70"):
        status = "warning"

    return {
        "id": budget.id,
        "budget_id": budget.budget_id,
        "category": budget.category,

        "limit_amount": str(
            limit_amount
        ),

        "spent_amount": str(
            spent
        ),

        "remaining_amount": str(
            remaining
        ),

        "limit_display": (
            format_money(
                limit_amount
            )
        ),

        "spent_display": (
            format_money(
                spent
            )
        ),

        "remaining_display": (
            format_money(
                remaining
            )
        ),

        "usage_percent": min(
            float(usage_percent),
            100,
        ),

        "raw_usage_percent": float(
            usage_percent
        ),

        "status": status,
        "period": budget.period,
    }


def generate_budget_recommendation(
    budget_items,
):
    if not budget_items:
        return {
            "title": (
                "Create your first monthly budget"
            ),
            "description": (
                "Set category-wise limits so Aura can "
                "track your spending and suggest improvements."
            ),
        }

    critical = [
        item
        for item in budget_items
        if item["status"]
        in {
            "critical",
            "exceeded",
        }
    ]

    underused = [
        item
        for item in budget_items
        if (
            item["raw_usage_percent"]
            < 50
            and float(
                item["spent_amount"]
            ) > 0
        )
    ]

    if critical:
        item = critical[0]

        return {
            "title": (
                f"Review your "
                f"{item['category']} budget"
            ),
            "description": (
                f"You have used "
                f"{item['raw_usage_percent']:.0f}% "
                f"of your {item['category']} budget. "
                f"Remaining balance is "
                f"{item['remaining_display']}."
            ),
        }

    if underused:
        item = underused[0]

        return {
            "title": (
                f"{item['category']} "
                "budget looks underused"
            ),
            "description": (
                f"You have used only "
                f"{item['raw_usage_percent']:.0f}% "
                "of this budget. "
                "You may reallocate some unused amount "
                "to savings or goals."
            ),
        }

    return {
        "title": (
            "Your budgets look healthy"
        ),
        "description": (
            "Most categories are within safe "
            "spending limits this month."
        ),
    }