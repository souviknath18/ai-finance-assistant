from celery import shared_task
from django.contrib.auth import (
    get_user_model,
)

from apps.insights.services.snapshot_service import (
    regenerate_insights_snapshot,
)


User = get_user_model()


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True,
    max_retries=3,
)
def regenerate_user_insights_task(
    self,
    user_id,
):
    user = User.objects.get(
        id=user_id
    )

    regenerate_insights_snapshot(
        user
    )

    return {
        "user_id": str(user.id),
        "status": "success",
    }