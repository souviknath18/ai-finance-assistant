from decimal import Decimal
from django.db.models import Sum
from django.utils import timezone

from apps.transactions.models import Transaction


def format_money(amount):
    amount = amount or Decimal("0.00")
    return f"₹{abs(amount):,.2f}"


def get_current_month_range():
    today = timezone.now().date()
    start = today.replace(day=1)
    return start, today


def analyze_budget_usage(user, budget):
    start_date, end_date = get_current_month_range()

    spent = (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
            category__iexact=budget.category,
            date__gte=start_date,
            date__lte=end_date,
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    spent = abs(spent)
    limit_amount = budget.limit_amount
    remaining = limit_amount - spent

    usage_percent = 0
    if limit_amount > 0:
        usage_percent = round((spent / limit_amount) * 100, 2)

    status = "safe"

    if usage_percent >= 100:
        status = "exceeded"
    elif usage_percent >= 85:
        status = "critical"
    elif usage_percent >= 70:
        status = "warning"

    return {
        "id": budget.id,
        "budget_id": budget.budget_id,
        "category": budget.category,
        "limit_amount": str(limit_amount),
        "spent_amount": str(spent),
        "remaining_amount": str(remaining),
        "limit_display": format_money(limit_amount),
        "spent_display": format_money(spent),
        "remaining_display": format_money(remaining),
        "usage_percent": min(float(usage_percent), 100),
        "raw_usage_percent": float(usage_percent),
        "status": status,
        "period": budget.period,
    }


def generate_budget_recommendation(budget_items):
    if not budget_items:
        return {
            "title": "Create your first monthly budget",
            "description": "Set category-wise limits so Aura can track your spending and suggest improvements.",
        }

    critical = [item for item in budget_items if item["status"] in ["critical", "exceeded"]]
    underused = [
        item for item in budget_items
        if item["raw_usage_percent"] < 50 and float(item["spent_amount"]) > 0
    ]

    if critical:
        item = critical[0]
        return {
            "title": f"Review your {item['category']} budget",
            "description": (
                f"You have used {item['raw_usage_percent']:.0f}% of your {item['category']} budget. "
                f"Remaining balance is {item['remaining_display']}."
            ),
        }

    if underused:
        item = underused[0]
        return {
            "title": f"{item['category']} budget looks underused",
            "description": (
                f"You have used only {item['raw_usage_percent']:.0f}% of this budget. "
                f"You may reallocate some unused amount to savings or goals."
            ),
        }

    return {
        "title": "Your budgets look healthy",
        "description": "Most categories are within safe spending limits this month.",
    }