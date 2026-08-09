from datetime import date

from django.db.models import QuerySet

from apps.transactions.models import Transaction


def get_user_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return all transactions belonging to a user.

    Optional start_date and end_date filters can be used
    to restrict transactions to a specific financial period.

    This is the base transaction selector used by the
    Insights module.
    """

    queryset = (
        Transaction.objects
        .filter(user=user)
        .select_related("uploaded_file")
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


def get_dated_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return only transactions that have a valid transaction date.

    Trend analysis, monthly comparisons, anomaly history,
    and period analytics should generally use dated transactions.
    """

    return (
        get_user_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .exclude(date__isnull=True)
    )


def get_expense_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return expense transactions for the requested user and period.

    Aura stores expenses using TransactionType.EXPENSE.
    The amount itself may be negative, so amount normalization
    should happen inside analytics_service.py rather than here.
    """

    return (
        get_dated_transactions(
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
) -> QuerySet:
    """
    Return income transactions for the requested user and period.
    """

    return (
        get_dated_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            transaction_type=Transaction.TransactionType.INCOME,
        )
    )


def get_transfer_transactions(
    *,
    user,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return transfer transactions.

    Transfers should normally be excluded from income/expense
    calculations because they move money rather than represent
    new income or actual spending.
    """

    return (
        get_dated_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            transaction_type=Transaction.TransactionType.TRANSFER,
        )
    )


def get_transactions_by_category(
    *,
    user,
    category: str,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return expense transactions belonging to a specific category.
    """

    category = category.strip()

    if not category:
        return Transaction.objects.none()

    return (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            category__iexact=category,
        )
    )


def get_transactions_by_merchant(
    *,
    user,
    merchant_name: str,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return transactions for a specific merchant.

    merchant_name uses case-insensitive matching so variations
    in capitalization do not affect analysis.
    """

    merchant_name = merchant_name.strip()

    if not merchant_name:
        return Transaction.objects.none()

    return (
        get_dated_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            merchant_name__iexact=merchant_name,
        )
    )


def search_transactions_by_merchant(
    *,
    user,
    merchant_name: str,
    start_date: date | None = None,
    end_date: date | None = None,
) -> QuerySet:
    """
    Return transactions whose merchant name contains the
    supplied value.

    Useful for merchant-level analytics when names may vary,
    for example:

    AMAZON
    Amazon.in
    AMAZON SELLER SERVICES
    """

    merchant_name = merchant_name.strip()

    if not merchant_name:
        return Transaction.objects.none()

    return (
        get_dated_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            merchant_name__icontains=merchant_name,
        )
    )


def get_recent_transactions(
    *,
    user,
    limit: int = 20,
) -> QuerySet:
    """
    Return the user's most recent dated transactions.
    """

    safe_limit = max(
        1,
        min(limit, 100),
    )

    return get_dated_transactions(
        user=user,
    )[:safe_limit]


def get_recent_expenses(
    *,
    user,
    limit: int = 20,
) -> QuerySet:
    """
    Return the user's most recent expense transactions.
    """

    safe_limit = max(
        1,
        min(limit, 100),
    )

    return get_expense_transactions(
        user=user,
    )[:safe_limit]


def get_historical_expenses(
    *,
    user,
    before_date: date,
) -> QuerySet:
    """
    Return expense history before a particular date.

    This will be useful for anomaly detection because a
    transaction should be compared against the user's
    historical spending behaviour rather than against
    future transactions.
    """

    return (
        get_expense_transactions(
            user=user,
        )
        .filter(
            date__lt=before_date,
        )
    )


def get_historical_merchant_expenses(
    *,
    user,
    merchant_name: str,
    before_date: date,
) -> QuerySet:
    """
    Return previous expenses from the same merchant.

    Used by anomaly_detector.py to answer questions such as:

    "Is ₹7,850 at Amazon unusual compared with this user's
    previous Amazon transactions?"
    """

    merchant_name = merchant_name.strip()

    if not merchant_name:
        return Transaction.objects.none()

    return (
        get_historical_expenses(
            user=user,
            before_date=before_date,
        )
        .filter(
            merchant_name__iexact=merchant_name,
        )
    )


def get_historical_category_expenses(
    *,
    user,
    category: str,
    before_date: date,
) -> QuerySet:
    """
    Return historical expenses from the same category.

    Used as a fallback when there is not enough merchant-specific
    history for anomaly detection.
    """

    category = category.strip()

    if not category:
        return Transaction.objects.none()

    return (
        get_historical_expenses(
            user=user,
            before_date=before_date,
        )
        .filter(
            category__iexact=category,
        )
    )