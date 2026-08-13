from apps.transactions.models import TransactionEmbedding

from ai.embeddings.client import generate_embedding
from ai.rag.schemas import RetrievedEvidence
from ai.vectorstores.pgvector import (
    find_similar,
    semantic_search,
)


def _serialize_match(item: TransactionEmbedding) -> dict:
    """
    Keeping this structure stable avoids breaking existing
    API/frontend code during the AI architecture migration.
    """

    transaction = item.transaction

    return {
        "transaction_id": transaction.transaction_id,
        "document": item.document,
        "metadata": {
            "user_id": str(transaction.user_id),
            "transaction_id": transaction.transaction_id,
            "category": (
                transaction.category
                if transaction.category
                else "Uncategorized"
            ),
            "transaction_type": transaction.transaction_type,
            "amount": str(transaction.amount),
            "date": (
                str(transaction.date)
                if transaction.date
                else None
            ),
            "merchant": (
                transaction.merchant_name
                if transaction.merchant_name
                else "Unknown"
            ),
            "description": (
                transaction.description
                if transaction.description
                else ""
            ),
        },
        "distance": float(item.distance),
    }


def semantic_search_transactions(
    user,
    query: str,
    n_results: int = 5,
) -> list[dict]:
    """
    Search transactions belonging to the authenticated user
    using semantic similarity.

    Flow:
        query
        -> OpenAI embedding
        -> pgvector cosine similarity
        -> matching transactions

    User isolation is enforced in the pgvector query.
    """

    if not query or not query.strip():
        return []

    if n_results <= 0:
        return []

    query_embedding = generate_embedding(
        query.strip()
    )

    results = semantic_search(
        user=user,
        query_embedding=query_embedding,
        limit=n_results,
    )

    return [
        _serialize_match(item)
        for item in results
    ]


def find_similar_transactions(
    user,
    transaction_id: str,
    n_results: int = 5,
) -> list[dict]:
    """
    Find transactions semantically similar to an existing
    transaction.

    The original transaction must belong to the same user.
    """

    if not transaction_id:
        return []

    if n_results <= 0:
        return []

    original = (
        TransactionEmbedding.objects
        .filter(
            user=user,
            transaction__transaction_id=transaction_id,
        )
        .select_related(
            "transaction",
        )
        .first()
    )

    if not original:
        return []

    results = find_similar(
        user=user,
        embedding=original.embedding,
        exclude_transaction_id=transaction_id,
        limit=n_results,
    )

    return [
        _serialize_match(item)
        for item in results
    ]


def retrieve_semantic_transaction_evidence(
    *,
    user,
    query: str,
    limit: int = 5,
) -> list[RetrievedEvidence]:
    """
    Retrieve transaction matches using semantic search and
    convert them into Aura's common RAG evidence format.

    This is the preferred interface for the new shared RAG layer.

    Chat, Insights, and eventually LangGraph can consume
    RetrievedEvidence without depending directly on pgvector.
    """

    if not query or not query.strip():
        return []

    if limit <= 0:
        return []

    results = semantic_search_transactions(
        user=user,
        query=query,
        n_results=limit,
    )

    evidence: list[RetrievedEvidence] = []

    for result in results:
        metadata = result.get(
            "metadata",
            {},
        )

        transaction_id = (
            metadata.get("transaction_id")
            or result.get("transaction_id")
        )

        if not transaction_id:
            continue

        evidence.append(
            RetrievedEvidence(
                source_type="transaction",
                source_id=transaction_id,
                content=result.get(
                    "document",
                    "",
                ),
                metadata=metadata,
                score=result.get(
                    "distance",
                ),
            )
        )

    return evidence