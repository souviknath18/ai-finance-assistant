from celery import shared_task

from .models import (
    BankConnection,
)

from .services import (
    sync_bank_connection,
)


@shared_task(
    bind=True,
    autoretry_for=(
        Exception,
    ),
    retry_backoff=True,
    retry_kwargs={
        "max_retries": 3
    },
)
def sync_bank_connection_task(
    self,
    connection_id,
):
    connection = (
        BankConnection.objects.get(
            id=connection_id
        )
    )

    return sync_bank_connection(
        connection
    )