from pgvector.django import CosineDistance

from ai_engine.embeddings.generate_embeddings import generate_embedding
from apps.transactions.models import TransactionEmbedding


def semantic_search_transactions(user, query: str, n_results: int = 5):
    query_embedding = generate_embedding(query)

    results = (
        TransactionEmbedding.objects
        .filter(user=user)
        .select_related("transaction")
        .annotate(distance=CosineDistance("embedding", query_embedding))
        .order_by("distance")[:n_results]
    )

    matches = []

    for item in results:
        transaction = item.transaction

        matches.append(
            {
                "transaction_id": transaction.transaction_id,
                "document": item.document,
                "metadata": {
                    "user_id": str(transaction.user.id),
                    "transaction_id": transaction.transaction_id,
                    "category": transaction.category or "Uncategorized",
                    "transaction_type": transaction.transaction_type,
                    "amount": str(transaction.amount),
                    "date": str(transaction.date),
                    "merchant": transaction.merchant_name or "Unknown",
                    "description": transaction.description or "",
                },
                "distance": float(item.distance),
            }
        )

    return matches


def find_similar_transactions(user, transaction_id: str, n_results: int = 5):
    original = (
        TransactionEmbedding.objects
        .filter(user=user, transaction__transaction_id=transaction_id)
        .select_related("transaction")
        .first()
    )

    if not original:
        return []

    results = (
        TransactionEmbedding.objects
        .filter(user=user)
        .exclude(transaction__transaction_id=transaction_id)
        .select_related("transaction")
        .annotate(distance=CosineDistance("embedding", original.embedding))
        .order_by("distance")[:n_results]
    )

    matches = []

    for item in results:
        transaction = item.transaction

        matches.append(
            {
                "transaction_id": transaction.transaction_id,
                "document": item.document,
                "metadata": {
                    "user_id": str(transaction.user.id),
                    "transaction_id": transaction.transaction_id,
                    "category": transaction.category or "Uncategorized",
                    "transaction_type": transaction.transaction_type,
                    "amount": str(transaction.amount),
                    "date": str(transaction.date),
                    "merchant": transaction.merchant_name or "Unknown",
                    "description": transaction.description or "",
                },
                "distance": float(item.distance),
            }
        )

    return matches