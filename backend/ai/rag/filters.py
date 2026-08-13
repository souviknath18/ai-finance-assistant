from django.db.models import QuerySet

from apps.transactions.models import Transaction

from ai.rag.schemas import RetrievalFilters


def apply_transaction_filters(
    queryset: QuerySet[Transaction],
    filters: RetrievalFilters | None,
) -> QuerySet[Transaction]:
    """
    Apply deterministic transaction filters.

    These filters are always scoped on top of an already
    user-scoped queryset.
    """

    if filters is None:
        return queryset

    if filters.start_date:
        queryset = queryset.filter(
            date__gte=filters.start_date
        )

    if filters.end_date:
        queryset = queryset.filter(
            date__lte=filters.end_date
        )

    if filters.category:
        queryset = queryset.filter(
            category__iexact=filters.category
        )

    if filters.merchant:
        queryset = queryset.filter(
            merchant_name__icontains=filters.merchant
        )

    if filters.transaction_type:
        queryset = queryset.filter(
            transaction_type=filters.transaction_type
        )

    if filters.min_amount is not None:
        queryset = queryset.filter(
            amount__gte=filters.min_amount
        )

    if filters.max_amount is not None:
        queryset = queryset.filter(
            amount__lte=filters.max_amount
        )

    return queryset