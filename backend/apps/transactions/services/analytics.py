from datetime import date
from decimal import Decimal

from django.db.models import Count, Sum

from apps.transactions.models import Transaction


ZERO = Decimal("0.00")


def normalize_amount(value) -> Decimal:
    """
    Return an absolute Decimal amount.

    Aura may store expenses as negative values, so analytics
    should normalize them before totals are returned.
    """

    if value is None:
        return ZERO

    if not isinstance(value, Decimal):
        value = Decimal(str(value))

    return abs(value)


def get_user_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
):
    """
    Base user-scoped transaction queryset.
    """

    queryset = (
        Transaction.objects
        .filter(user=user)
        .order_by("-date", "-created_at")
    )

    if start_date is not None:
        queryset = queryset.filter(
            date__gte=start_date,
        )

    if end_date is not None:
        queryset = queryset.filter(
            date__lte=end_date,
        )

    return queryset


def get_expense_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
):
    return (
        get_user_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            transaction_type=Transaction.TransactionType.EXPENSE,
        )
    )


def get_income_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
):
    return (
        get_user_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            transaction_type=Transaction.TransactionType.INCOME,
        )
    )


def get_total_spending(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Return total expense amount and transaction count.
    """

    transactions = get_expense_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    raw_total = (
        transactions.aggregate(
            total=Sum("amount"),
        )["total"]
        or ZERO
    )

    return {
        "total": normalize_amount(raw_total),
        "transaction_count": transactions.count(),
        "start_date": (
            start_date.isoformat()
            if start_date
            else None
        ),
        "end_date": (
            end_date.isoformat()
            if end_date
            else None
        ),
    }


def get_total_income(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Return total income amount and transaction count.
    """

    transactions = get_income_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    raw_total = (
        transactions.aggregate(
            total=Sum("amount"),
        )["total"]
        or ZERO
    )

    return {
        "total": normalize_amount(raw_total),
        "transaction_count": transactions.count(),
        "start_date": (
            start_date.isoformat()
            if start_date
            else None
        ),
        "end_date": (
            end_date.isoformat()
            if end_date
            else None
        ),
    }


def get_category_spending(
    *,
    user,
    category: str,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Return expense totals for a particular category.
    """

    category = category.strip()

    if not category:
        return {
            "category": "",
            "total": ZERO,
            "transaction_count": 0,
        }

    transactions = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            category__iexact=category,
        )
    )

    raw_total = (
        transactions.aggregate(
            total=Sum("amount"),
        )["total"]
        or ZERO
    )

    return {
        "category": category,
        "total": normalize_amount(raw_total),
        "transaction_count": transactions.count(),
        "start_date": (
            start_date.isoformat()
            if start_date
            else None
        ),
        "end_date": (
            end_date.isoformat()
            if end_date
            else None
        ),
    }


def get_category_breakdown(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int = 10,
) -> list[dict]:
    """
    Return spending grouped by category.
    """

    safe_limit = max(
        1,
        min(limit, 50),
    )

    rows = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .exclude(category__isnull=True)
        .exclude(category="")
        .values("category")
        .annotate(
            total=Sum("amount"),
            transaction_count=Count("id"),
        )
        .order_by("-total")[:safe_limit]
    )

    return [
        {
            "category": row["category"],
            "total": normalize_amount(
                row["total"]
            ),
            "transaction_count": row[
                "transaction_count"
            ],
        }
        for row in rows
    ]


def get_top_spending_category(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict | None:
    """
    Return the highest-spending category.
    """

    breakdown = get_category_breakdown(
        user=user,
        start_date=start_date,
        end_date=end_date,
        limit=1,
    )

    if not breakdown:
        return None

    return breakdown[0]


def get_largest_expense(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict | None:
    """
    Return the user's largest single expense.
    """

    transaction = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .order_by("-amount")
        .first()
    )

    if transaction is None:
        return None

    return {
        "transaction_id": (
            transaction.transaction_id
        ),
        "amount": normalize_amount(
            transaction.amount
        ),
        "date": (
            transaction.date.isoformat()
            if transaction.date
            else None
        ),
        "merchant": (
            transaction.merchant_name
            or "Unknown"
        ),
        "description": (
            transaction.description
            or ""
        ),
        "category": (
            transaction.category
            or "Uncategorized"
        ),
    }


def get_transaction_counts(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    """
    Return transaction counts grouped by major transaction type.
    """

    transactions = get_user_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return {
        "total": transactions.count(),
        "expenses": transactions.filter(
            transaction_type=Transaction.TransactionType.EXPENSE,
        ).count(),
        "income": transactions.filter(
            transaction_type=Transaction.TransactionType.INCOME,
        ).count(),
        "transfers": transactions.filter(
            transaction_type=Transaction.TransactionType.TRANSFER,
        ).count(),
    }