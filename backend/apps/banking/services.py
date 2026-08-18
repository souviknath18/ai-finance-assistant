from decimal import Decimal

from django.db import transaction as db_transaction
from django.db.models import Sum
from django.utils import timezone

from apps.banking.models import (
    BankConnection,
)

from apps.transactions.models import (
    Transaction,
)

from apps.transactions.tasks import (
    store_transaction_vector_task,
)

from apps.insights.services import (
    mark_insights_stale,
)

from apps.reports.services import (
    mark_report_dashboard_stale,
)

from apps.subscriptions.services import (
    sync_detected_subscriptions,
)

from pipelines.document_processing.categorization.service import (
    categorize_transaction,
)

from .providers.demo_bank import (
    create_demo_account,
    generate_demo_transactions,
    get_demo_institutions,
)


def prepare_category_fields(
    category_result: dict,
):
    category_source = (
        category_result.get(
            "category_source",
            "none",
        )
    )

    confidence = (
        category_result.get(
            "confidence"
        )
    )

    is_ai_categorized = bool(
        category_result.get(
            "is_ai_categorized",
            False,
        )
    )

    if (
        category_source
        != "ai"
    ):
        confidence = None
        is_ai_categorized = False

    return {
        "category":
            category_result.get(
                "category",
                "Uncategorized",
            ),

        "category_source":
            category_source,

        "is_ai_categorized":
            is_ai_categorized,

        "ai_confidence":
            confidence,

        "ai_reason":
            category_result.get(
                "reason"
            ),

        "is_reviewed":
            category_source
            == "rule",
    }


def get_available_institutions():
    return get_demo_institutions()


def create_bank_connection(
    *,
    user,
    institution_code: str,
):
    account_data = (
        create_demo_account(
            institution_code
        )
    )

    connection = (
        BankConnection.objects.create(
            user=user,
            **account_data,
        )
    )

    return connection


def queue_transaction_vectorization(
    transaction,
):
    if transaction.is_vectorized:
        return

    transaction_id = str(
        transaction.id
    )

    db_transaction.on_commit(
        lambda: (
            store_transaction_vector_task.delay(
                transaction_id
            )
        )
    )


def persist_bank_transaction(
    *,
    user,
    connection,
    item,
):
    external_id = item[
        "external_transaction_id"
    ]

    existing = (
        Transaction.objects.filter(
            bank_connection=connection,
            external_transaction_id=external_id,
        )
        .first()
    )

    if existing:
        return existing, False

    category_result = (
        categorize_transaction(
            item.get(
                "description",
                "",
            ),
            item.get(
                "transaction_type",
                "unknown",
            ),
        )
    )

    category_fields = (
        prepare_category_fields(
            category_result
        )
    )

    transaction = (
        Transaction.objects.create(
            user=user,

            uploaded_file=None,

            bank_connection=connection,

            source=(
                Transaction
                .TransactionSource
                .BANK_SYNC
            ),

            external_transaction_id=(
                external_id
            ),

            date=item.get(
                "date"
            ),

            date_is_estimated=False,

            description=(
                item.get(
                    "description"
                )
                or "Bank transaction"
            ),

            merchant_name=item.get(
                "merchant_name"
            ),

            reference_number=item.get(
                "reference_number"
            ),

            amount=item[
                "amount"
            ],

            transaction_type=item.get(
                "transaction_type",
                Transaction
                .TransactionType
                .UNKNOWN,
            ),

            balance_after_transaction=(
                item.get(
                    "balance_after_transaction"
                )
            ),

            raw_text=(
                item.get(
                    "description",
                    ""
                )
            ),

            parser_used=(
                "demo_bank_provider"
            ),

            parser_confidence=(
                Decimal("1.000")
            ),

            **category_fields,
        )
    )

    queue_transaction_vectorization(
        transaction
    )

    return transaction, True


def sync_bank_connection(
    connection: BankConnection,
):
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
        items = (
            generate_demo_transactions()
        )

        imported = 0
        skipped = 0

        with db_transaction.atomic():
            for item in items:
                _, created = (
                    persist_bank_transaction(
                        user=connection.user,
                        connection=connection,
                        item=item,
                    )
                )

                if created:
                    imported += 1
                else:
                    skipped += 1

        balance = (
            Transaction.objects.filter(
                bank_connection=connection
            )
            .aggregate(
                total=Sum("amount")
            )
            .get("total")
        )

        if balance is not None:
            connection.balance = (
                connection.balance
                or Decimal("0")
            )

        connection.status = (
            BankConnection.Status.CONNECTED
        )

        connection.last_synced_at = (
            timezone.now()
        )

        connection.save(
            update_fields=[
                "balance",
                "status",
                "last_synced_at",
                "last_sync_error",
                "updated_at",
            ]
        )

        sync_detected_subscriptions(
            connection.user
        )

        mark_insights_stale(
            connection.user
        )

        mark_report_dashboard_stale(
            connection.user
        )

        return {
            "account_id":
                str(connection.id),

            "imported":
                imported,

            "updated":
                0,

            "skipped":
                skipped,

            "last_synced_at":
                connection.last_synced_at,
        }

    except Exception as error:
        connection.status = (
            BankConnection.Status.ERROR
        )

        connection.last_sync_error = (
            str(error)
        )

        connection.save(
            update_fields=[
                "status",
                "last_sync_error",
                "updated_at",
            ]
        )

        raise