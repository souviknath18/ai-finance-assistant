from pgvector.django import CosineDistance

from apps.transactions.models import (
    Transaction,
    TransactionEmbedding,
)


def upsert_transaction_embedding(
    *,
    transaction: Transaction,
    embedding: list[float],
    document: str,
) -> TransactionEmbedding:
    """
    Store or update the embedding associated with a transaction.
    """

    embedding_record, _ = TransactionEmbedding.objects.update_or_create(
        transaction=transaction,
        defaults={
            "user": transaction.user,
            "embedding": embedding,
            "document": document,
        },
    )

    return embedding_record


def delete_transaction_embedding(
    *,
    transaction_id: str,
) -> int:
    """
    Delete a transaction embedding by public transaction ID.

    Returns the number of deleted records.
    """

    deleted_count, _ = TransactionEmbedding.objects.filter(
        transaction__transaction_id=transaction_id,
    ).delete()

    return deleted_count


def semantic_search(
    *,
    user,
    query_embedding: list[float],
    limit: int = 5,
):
    """
    Retrieve the user's transaction embeddings ordered by
    cosine-distance similarity.
    """

    return (
        TransactionEmbedding.objects
        .filter(user=user)
        .select_related(
            "transaction",
            "transaction__user",
        )
        .annotate(
            distance=CosineDistance(
                "embedding",
                query_embedding,
            )
        )
        .order_by("distance")[:limit]
    )


def find_similar(
    *,
    user,
    embedding: list[float],
    exclude_transaction_id: str | None = None,
    limit: int = 5,
):
    """
    Find transaction embeddings similar to an existing embedding.
    """

    queryset = (
        TransactionEmbedding.objects
        .filter(user=user)
        .select_related(
            "transaction",
            "transaction__user",
        )
    )

    if exclude_transaction_id:
        queryset = queryset.exclude(
            transaction__transaction_id=exclude_transaction_id,
        )

    return (
        queryset
        .annotate(
            distance=CosineDistance(
                "embedding",
                embedding,
            )
        )
        .order_by("distance")[:limit]
    )