from apps.transactions.models import Transaction

from ai.rag.filters import (
    apply_transaction_filters,
)
from ai.rag.schemas import (
    RetrievalFilters,
    RetrievedEvidence,
)


def retrieve_structured_transactions(
    *,
    user,
    filters: RetrievalFilters | None = None,
    limit: int = 20,
) -> list[RetrievedEvidence]:
    """
    Retrieve transactions using deterministic database filters.
    """

    queryset = (
        Transaction.objects
        .filter(user=user)
        .select_related("uploaded_file")
        .order_by("-date", "-created_at")
    )

    queryset = apply_transaction_filters(
        queryset,
        filters,
    )

    transactions = queryset[:limit]

    evidence = []

    for transaction in transactions:
        merchant = (
            transaction.merchant_name
            or "Unknown"
        )

        category = (
            transaction.category
            or "Uncategorized"
        )

        content = (
            f"Date: {transaction.date}\n"
            f"Merchant: {merchant}\n"
            f"Description: {transaction.description}\n"
            f"Category: {category}\n"
            f"Type: {transaction.transaction_type}\n"
            f"Amount: ₹{transaction.amount}\n"
            f"Transaction ID: {transaction.transaction_id}"
        )

        evidence.append(
            RetrievedEvidence(
                source_type="transaction",
                source_id=transaction.transaction_id,
                content=content,
                metadata={
                    "transaction_id": transaction.transaction_id,
                    "date": str(transaction.date),
                    "merchant": merchant,
                    "description": transaction.description,
                    "category": category,
                    "transaction_type": (
                        transaction.transaction_type
                    ),
                    "amount": str(transaction.amount),
                },
            )
        )

    return evidence