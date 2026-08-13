from celery import shared_task

from apps.transactions.models import Transaction
from ai.embeddings.service import (
    store_transaction_vector,
)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def store_transaction_vector_task(
    self,
    transaction_id: str,
):
    transaction = Transaction.objects.get(
        id=transaction_id
    )

    if transaction.is_vectorized:
        return {
            "status": "already_vectorized",
            "transaction_id": str(transaction.id),
        }

    store_transaction_vector(transaction)

    transaction.refresh_from_db(
        fields=["is_vectorized"]
    )

    return {
        "status": "vectorized",
        "transaction_id": str(transaction.id),
        "is_vectorized": transaction.is_vectorized,
    }