from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth

from apps.transactions.models import Transaction


def money(value):
    value = value or Decimal("0.00")
    return f"₹{abs(value):,.2f}"


def get_total_income(user):
    total = (
        Transaction.objects.filter(
            user=user,
            transaction_type="income",
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    return abs(total)


def get_total_expenses(user):
    total = (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
    )

    return abs(total)


def get_category_breakdown(user, limit=5):
    queryset = (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
        )
        .exclude(category__isnull=True)
        .exclude(category="")
        .values("category")
        .annotate(
            total=Sum("amount"),
            count=Count("id"),
        )
        .order_by("total")[:limit]
    )

    return [
        {
            "category": item["category"] or "Uncategorized",
            "amount": str(abs(item["total"] or Decimal("0.00"))),
            "total_display": money(item["total"]),
            "count": item["count"],
        }
        for item in queryset
    ]


def get_top_spending_categories(user, limit=5):
    categories = get_category_breakdown(user, limit=limit)

    categories.sort(
        key=lambda item: Decimal(str(item["amount"])),
        reverse=True,
    )

    return categories[:limit]


def get_monthly_spending(user):
    queryset = (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
        )
        .annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    return [
        {
            "month": item["month"].strftime("%b %Y"),
            "amount": str(abs(item["total"] or Decimal("0.00"))),
            "amount_display": money(item["total"]),
        }
        for item in queryset
        if item["month"]
    ]


def get_spending_overview(user):
    transactions = Transaction.objects.filter(user=user)

    total_income = get_total_income(user)
    total_expense = get_total_expenses(user)

    top_categories = get_top_spending_categories(user, limit=1)
    top_category = top_categories[0] if top_categories else None

    return {
        "total_income": str(total_income),
        "total_income_display": money(total_income),
        "total_expense": str(total_expense),
        "total_expense_display": money(total_expense),
        "transaction_count": transactions.count(),
        "expense_count": transactions.filter(transaction_type="expense").count(),
        "income_count": transactions.filter(transaction_type="income").count(),
        "top_category": top_category,
    }