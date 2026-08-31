from celery import shared_task

from .models import BankConnection
from .services import sync_bank_connection


@shared_task(
    bind=True,
    max_retries=3,
)
def sync_bank_connection_task(
    self,
    connection_id,
):
    try:
        connection = (
            BankConnection.objects.get(
                id=connection_id
            )
        )

    except BankConnection.DoesNotExist:
        return {
            "status": "skipped",
            "reason": "connection_not_found",
        }

    # Do not sync accounts that were
    # disconnected before the worker started.
    if (
        connection.status
        == BankConnection.Status.DISCONNECTED
    ):
        return {
            "status": "skipped",
            "reason": "connection_disconnected",
        }

    try:
        return sync_bank_connection(
            connection
        )

    except Exception as error:
        # sync_bank_connection() currently sets
        # the account to ERROR when something fails.
        #
        # If Celery still has retries available,
        # move it back to SYNCING because another
        # attempt will happen.
        if (
            self.request.retries
            < self.max_retries
        ):
            connection.refresh_from_db()

            connection.status = (
                BankConnection.Status.SYNCING
            )

            connection.last_sync_error = (
                f"Sync attempt failed. "
                f"Retrying: {error}"
            )

            connection.save(
                update_fields=[
                    "status",
                    "last_sync_error",
                    "updated_at",
                ]
            )

            countdown = (
                5
                * (
                    2
                    ** self.request.retries
                )
            )

            raise self.retry(
                exc=error,
                countdown=countdown,
            )

        # Final attempt failed.
        #
        # sync_bank_connection() has already
        # stored ERROR + last_sync_error.
        raise