from apps.transactions.models import Transaction

from ai.embeddings.client import generate_embedding
from ai.embeddings.transaction_documents import (
    build_transaction_document,
)
from ai.vectorstores.pgvector import (
    delete_transaction_embedding,
    upsert_transaction_embedding,
)


def store_transaction_vector(
    transaction: Transaction,
) -> None:
    """
    Generate and persist the vector representation
    for a transaction.
    """

    document = build_transaction_document(transaction)

    embedding = generate_embedding(document)

    upsert_transaction_embedding(
        transaction=transaction,
        embedding=embedding,
        document=document,
    )

    if not transaction.is_vectorized:
        transaction.is_vectorized = True

        transaction.save(
            update_fields=[
                "is_vectorized",
                "updated_at",
            ]
        )


def delete_transaction_vector(
    transaction_id: str,
) -> int:
    """
    Remove the vector associated with a transaction.
    """

    return delete_transaction_embedding(
        transaction_id=transaction_id,
    )