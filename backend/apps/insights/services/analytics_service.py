from calendar import monthrange
from datetime import date
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth

from apps.insights.selectors.transaction_selector import (
    get_expense_transactions,
    get_income_transactions,
    get_user_transactions,
)


ZERO = Decimal("0.00")


def money(value):
    value = Decimal(str(value or ZERO))

    return f"₹{abs(value):,.2f}"


def normalize_amount(value):
    return abs(
        Decimal(str(value or ZERO))
    )


def get_current_month_period():
    today = date.today()

    start = today.replace(day=1)

    end = date(
        today.year,
        today.month,
        monthrange(today.year, today.month)[1],
    )

    return start, end


def get_previous_month_period(start_date):
    if start_date.month == 1:
        previous_start = date(
            start_date.year - 1,
            12,
            1,
        )
    else:
        previous_start = date(
            start_date.year,
            start_date.month - 1,
            1,
        )

    previous_end = date(
        previous_start.year,
        previous_start.month,
        monthrange(
            previous_start.year,
            previous_start.month,
        )[1],
    )

    return previous_start, previous_end


def calculate_period_metrics(
    *,
    user,
    start_date,
    end_date,
):
    transactions = get_user_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    expenses = get_expense_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    income = get_income_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    raw_expenses = (
        expenses.aggregate(
            total=Sum("amount")
        )["total"]
        or ZERO
    )

    raw_income = (
        income.aggregate(
            total=Sum("amount")
        )["total"]
        or ZERO
    )

    total_expense = normalize_amount(raw_expenses)
    total_income = normalize_amount(raw_income)

    savings = total_income - total_expense

    if total_income > ZERO:
        savings_rate = round(
            (savings / total_income) * Decimal("100"),
            2,
        )
    else:
        savings_rate = ZERO

    return {
        "total_income": total_income,
        "total_income_display": money(total_income),

        "total_expense": total_expense,
        "total_expense_display": money(total_expense),

        "savings": savings,
        "savings_display": money(savings),

        "savings_rate": float(savings_rate),

        "transaction_count": transactions.count(),
        "expense_count": expenses.count(),
        "income_count": income.count(),
    }


def calculate_category_breakdown(
    *,
    user,
    start_date,
    end_date,
    limit=5,
):
    expenses = get_expense_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    rows = (
        expenses
        .exclude(category__isnull=True)
        .exclude(category="")
        .values("category")
        .annotate(
            total=Sum("amount"),
            count=Count("id"),
        )
    )

    categories = []

    grand_total = ZERO

    for row in rows:
        amount = normalize_amount(row["total"])

        grand_total += amount

        categories.append(
            {
                "category": row["category"] or "Uncategorized",
                "amount": amount,
                "total_display": money(amount),
                "count": row["count"],
            }
        )

    categories.sort(
        key=lambda item: item["amount"],
        reverse=True,
    )

    for item in categories:
        if grand_total > ZERO:
            percentage = (
                item["amount"]
                / grand_total
                * Decimal("100")
            )
        else:
            percentage = ZERO

        item["percentage"] = round(
            float(percentage),
            2,
        )

    return categories[:limit]


def calculate_monthly_spending(
    *,
    user,
    months=6,
):
    expenses = get_expense_transactions(
        user=user,
    )

    rows = (
        expenses
        .exclude(date__isnull=True)
        .annotate(
            month=TruncMonth("date")
        )
        .values("month")
        .annotate(
            total=Sum("amount")
        )
        .order_by("-month")[:months]
    )

    result = []

    for row in reversed(list(rows)):
        amount = normalize_amount(
            row["total"]
        )

        result.append(
            {
                "month": row["month"].strftime("%b %Y"),
                "amount": str(amount),
                "amount_display": money(amount),
            }
        )

    return result