from datetime import date
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import TruncMonth

from apps.transactions.models import Transaction


ZERO = Decimal("0.00")


def get_monthly_spending_trend(
    *,
    user,
    start_date: date,
    end_date: date,
) -> list[dict]:
    rows = (
        Transaction.objects
        .filter(
            user=user,
            transaction_type=(
                Transaction.TransactionType.EXPENSE
            ),
            date__range=(
                start_date,
                end_date,
            ),
        )
        .annotate(
            month=TruncMonth("date")
        )
        .values("month")
        .annotate(
            total=Sum("amount")
        )
        .order_by("month")
    )

    return [
        {
            "month": row["month"].date(),
            "total": abs(
                row["total"] or ZERO
            ),
        }
        for row in rows
    ]