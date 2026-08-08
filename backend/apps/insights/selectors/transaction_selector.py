from apps.transactions.models import Transaction


def get_user_transactions(
    *,
    user,
    start_date=None,
    end_date=None,
):
    queryset = (
        Transaction.objects
        .filter(user=user)
        .select_related("uploaded_file")
        .order_by("-date", "-created_at")
    )

    if start_date:
        queryset = queryset.filter(
            date__gte=start_date,
        )

    if end_date:
        queryset = queryset.filter(
            date__lte=end_date,
        )

    return queryset


def get_expense_transactions(
    *,
    user,
    start_date=None,
    end_date=None,
):
    return get_user_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    ).filter(
        transaction_type=Transaction.TransactionType.EXPENSE,
    )


def get_income_transactions(
    *,
    user,
    start_date=None,
    end_date=None,
):
    return get_user_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    ).filter(
        transaction_type=Transaction.TransactionType.INCOME,
    )


def get_transactions_by_category(
    *,
    user,
    category,
    start_date=None,
    end_date=None,
):
    return get_expense_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    ).filter(
        category__iexact=category,
    )


def get_transactions_by_merchant(
    *,
    user,
    merchant,
    start_date=None,
    end_date=None,
):
    queryset = get_user_transactions(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    return queryset.filter(
        merchant_name__iexact=merchant,
    )