import logging
from datetime import date

from celery import shared_task
from django.contrib.auth import get_user_model
from django.db import transaction

from apps.insights.models import InsightSnapshot
from apps.insights.services.snapshot_service import (
    get_or_create_snapshot,
    regenerate_insights_snapshot,
)


logger = logging.getLogger(__name__)

User = get_user_model()


def parse_date_value(value):
    """
    Convert an ISO date string into a date object.

    Celery task arguments should stay JSON-serializable, so dates
    are passed as ISO strings rather than Python date objects.
    """

    if not value:
        return None

    if isinstance(value, date):
        return value

    return date.fromisoformat(
        str(value)
    )


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=60,
    retry_jitter=True,
    max_retries=3,
)
def regenerate_user_insights_task(
    self,
    user_id,
    start_date=None,
    end_date=None,
):
    """
    Regenerate one user's insight snapshot asynchronously.

    Args:
        user_id:
            User primary key.

        start_date:
            Optional ISO date string: YYYY-MM-DD.

        end_date:
            Optional ISO date string: YYYY-MM-DD.

    Returns:
        Lightweight task result only.

    The full dashboard data is stored inside InsightSnapshot.
    """

    parsed_start_date = parse_date_value(
        start_date
    )

    parsed_end_date = parse_date_value(
        end_date
    )

    user = User.objects.get(
        pk=user_id
    )

    logger.info(
        "Starting Aura insights regeneration "
        "user=%s start=%s end=%s",
        user_id,
        parsed_start_date,
        parsed_end_date,
    )

    data = regenerate_insights_snapshot(
        user,
        start_date=parsed_start_date,
        end_date=parsed_end_date,
    )

    logger.info(
        "Aura insights regeneration completed "
        "user=%s start=%s end=%s",
        user_id,
        parsed_start_date,
        parsed_end_date,
    )

    return {
        "user_id": str(
            user_id
        ),

        "status": (
            InsightSnapshot.Status.READY
        ),

        "period": (
            data.get(
                "period",
                {},
            )
        ),

        "generated_at": (
            data.get(
                "generated_at"
            )
        ),
    }


@shared_task(
    bind=True,
    max_retries=0,
)
def queue_user_insights_regeneration_task(
    self,
    user_id,
    start_date=None,
    end_date=None,
):
    """
    Lightweight queueing task.

    This is useful when another Celery workflow wants to trigger
    regeneration without directly running the heavy Insights pipeline.

    It checks whether the requested snapshot is already generating
    before queueing another regeneration.
    """

    parsed_start_date = parse_date_value(
        start_date
    )

    parsed_end_date = parse_date_value(
        end_date
    )

    user = User.objects.get(
        pk=user_id
    )

    snapshot = get_or_create_snapshot(
        user=user,
        start_date=parsed_start_date,
        end_date=parsed_end_date,
    )

    if (
        snapshot.status
        == InsightSnapshot.Status.GENERATING
    ):
        return {
            "queued": False,

            "reason": (
                "already_generating"
            ),

            "insight_id": (
                snapshot.insight_id
            ),
        }

    regenerate_user_insights_task.delay(
        str(user_id),
        (
            parsed_start_date.isoformat()
            if parsed_start_date
            else None
        ),
        (
            parsed_end_date.isoformat()
            if parsed_end_date
            else None
        ),
    )

    return {
        "queued": True,

        "insight_id": (
            snapshot.insight_id
        ),

        "status": (
            snapshot.status
        ),
    }


@shared_task(
    bind=True,
    max_retries=0,
)
def mark_and_regenerate_user_insights_task(
    self,
    user_id,
):
    """
    Convenience task for transaction/upload workflows.

    Flow:

        financial data changes
            ↓
        mark existing snapshots stale
            ↓
        queue current-period regeneration

    This is useful after:
        uploaded statement processing
        transaction import
        bulk transaction changes
    """

    user = User.objects.get(
        pk=user_id
    )

    InsightSnapshot.objects.filter(
        user=user
    ).update(
        is_stale=True
    )

    snapshot = get_or_create_snapshot(
        user=user
    )

    if (
        snapshot.status
        == InsightSnapshot.Status.GENERATING
    ):
        return {
            "queued": False,
            "reason": (
                "already_generating"
            ),
            "insight_id": (
                snapshot.insight_id
            ),
        }

    regenerate_user_insights_task.delay(
        str(user_id)
    )

    return {
        "queued": True,
        "insight_id": (
            snapshot.insight_id
        ),
    }


@shared_task(
    bind=True,
    max_retries=0,
)
def regenerate_stale_insights_task(
    self,
    limit=50,
):
    """
    Periodic maintenance task.

    Regenerate stale snapshots in small batches.

    This can later be scheduled through Celery Beat, for example
    every 15 or 30 minutes.

    Avoid processing an unlimited number of snapshots in one run.
    """

    safe_limit = max(
        1,
        min(
            int(limit),
            200,
        ),
    )

    stale_snapshot_ids = list(
        InsightSnapshot.objects
        .filter(
            is_stale=True,
        )
        .exclude(
            status=(
                InsightSnapshot.Status.GENERATING
            )
        )
        .order_by(
            "updated_at"
        )
        .values_list(
            "id",
            flat=True,
        )[:safe_limit]
    )

    queued = 0
    skipped = 0

    for snapshot_id in stale_snapshot_ids:
        with transaction.atomic():
            snapshot = (
                InsightSnapshot.objects
                .select_for_update()
                .select_related(
                    "user"
                )
                .get(
                    id=snapshot_id
                )
            )

            if (
                snapshot.status
                == InsightSnapshot.Status.GENERATING
            ):
                skipped += 1
                continue

            regenerate_user_insights_task.delay(
                str(
                    snapshot.user_id
                ),
                (
                    snapshot.period_start.isoformat()
                    if snapshot.period_start
                    else None
                ),
                (
                    snapshot.period_end.isoformat()
                    if snapshot.period_end
                    else None
                ),
            )

            queued += 1

    return {
        "found": len(
            stale_snapshot_ids
        ),

        "queued": queued,

        "skipped": skipped,
    }