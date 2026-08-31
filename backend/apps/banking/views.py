from django.db.models import Sum
from django.shortcuts import (
    get_object_or_404,
)

from rest_framework import (
    status,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import (
    Response,
)

from rest_framework.views import (
    APIView,
)

from .models import (
    BankConnection,
)

from .serializers import (
    BankConnectionSerializer,
    ConnectBankSerializer,
)

from .services import (
    create_bank_connection,
    get_available_institutions,
)

from .tasks import (
    sync_bank_connection_task,
)


def queue_bank_sync(
    connection,
):
    """
    Mark the connection as syncing and
    queue the Celery worker.
    """

    connection.status = (
        BankConnection.Status.SYNCING
    )

    connection.last_sync_error = None

    connection.save(
        update_fields=[
            "status",
            "last_sync_error",
            "updated_at",
        ]
    )

    try:
        sync_bank_connection_task.delay(
            str(connection.id)
        )

    except Exception as error:
        connection.status = (
            BankConnection.Status.ERROR
        )

        connection.last_sync_error = (
            "Unable to queue bank sync."
        )

        connection.save(
            update_fields=[
                "status",
                "last_sync_error",
                "updated_at",
            ]
        )

        raise error


class BankAccountListView(
    APIView
):
    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        accounts = (
            BankConnection.objects
            .filter(
                user=request.user,
            )
            .exclude(
                status=(
                    BankConnection
                    .Status
                    .DISCONNECTED
                )
            )
            .order_by(
                "-created_at"
            )
        )

        serializer = (
            BankConnectionSerializer(
                accounts,
                many=True,
            )
        )

        total_balance = (
            accounts.aggregate(
                value=Sum(
                    "balance"
                )
            )["value"]
            or 0
        )

        connected_accounts = (
            accounts.filter(
                status=(
                    BankConnection
                    .Status
                    .CONNECTED
                )
            )
            .count()
        )

        last_synced = (
            accounts
            .exclude(
                last_synced_at__isnull=True
            )
            .order_by(
                "-last_synced_at"
            )
            .values_list(
                "last_synced_at",
                flat=True,
            )
            .first()
        )

        return Response(
            {
                "summary": {
                    "total_accounts":
                        accounts.count(),

                    "connected_accounts":
                        connected_accounts,

                    "total_balance":
                        total_balance,

                    "last_synced_at":
                        last_synced,
                },

                "accounts":
                    serializer.data,

                "available_institutions":
                    get_available_institutions(),
            }
        )


class ConnectBankAccountView(
    APIView
):
    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
    ):
        serializer = (
            ConnectBankSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        institution_code = (
            serializer.validated_data[
                "institution_code"
            ]
        )

        try:
            connection = (
                create_bank_connection(
                    user=request.user,
                    institution_code=(
                        institution_code
                    ),
                )
            )

            queue_bank_sync(
                connection
            )

            response_data = (
                BankConnectionSerializer(
                    connection
                ).data
            )

            return Response(
                response_data,
                status=(
                    status.HTTP_201_CREATED
                ),
            )

        except ValueError as error:
            return Response(
                {
                    "detail":
                        str(error)
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        except Exception:
            return Response(
                {
                    "detail": (
                        "Account was created, "
                        "but Aura could not "
                        "start synchronization."
                    )
                },
                status=(
                    status
                    .HTTP_503_SERVICE_UNAVAILABLE
                ),
            )


class SyncBankAccountView(
    APIView
):
    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        account_id,
    ):
        connection = (
            get_object_or_404(
                BankConnection,
                id=account_id,
                user=request.user,
            )
        )

        if (
            connection.status
            == BankConnection
            .Status
            .DISCONNECTED
        ):
            return Response(
                {
                    "detail": (
                        "Disconnected accounts "
                        "cannot be synchronized."
                    )
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        # Prevent the user from accidentally
        # creating multiple simultaneous jobs.
        if (
            connection.status
            == BankConnection.Status.SYNCING
        ):
            return Response(
                {
                    "account_id":
                        str(connection.id),

                    "status":
                        BankConnection
                        .Status
                        .SYNCING,

                    "message":
                        "Sync is already running.",
                },
                status=(
                    status
                    .HTTP_202_ACCEPTED
                ),
            )

        try:
            queue_bank_sync(
                connection
            )

        except Exception:
            return Response(
                {
                    "detail": (
                        "Aura could not start "
                        "the account sync."
                    )
                },
                status=(
                    status
                    .HTTP_503_SERVICE_UNAVAILABLE
                ),
            )

        return Response(
            {
                "account_id":
                    str(connection.id),

                "status":
                    BankConnection
                    .Status
                    .SYNCING,

                "message":
                    "Account sync started.",
            },
            status=(
                status
                .HTTP_202_ACCEPTED
            ),
        )


class BankAccountDetailView(
    APIView
):
    permission_classes = [
        IsAuthenticated
    ]

    def delete(
        self,
        request,
        account_id,
    ):
        connection = (
            get_object_or_404(
                BankConnection,
                id=account_id,
                user=request.user,
            )
        )

        connection.status = (
            BankConnection
            .Status
            .DISCONNECTED
        )

        connection.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            status=(
                status
                .HTTP_204_NO_CONTENT
            )
        )