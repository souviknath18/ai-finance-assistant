from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from .models import UploadedFile
from .services import process_uploaded_file


@shared_task(bind=True, max_retries=2)
def process_uploaded_file_task(self, uploaded_file_id):
    try:
        uploaded_file = UploadedFile.objects.get(id=uploaded_file_id)
        process_uploaded_file(uploaded_file)
        return {"status": "success", "uploaded_file_id": uploaded_file_id}

    except UploadedFile.DoesNotExist:
        return {"status": "failed", "reason": "uploaded_file_not_found"}

    except Exception as error:
        try:
            uploaded_file = UploadedFile.objects.get(id=uploaded_file_id)
            uploaded_file.status = UploadedFile.Status.FAILED
            uploaded_file.error_message = str(error)
            uploaded_file.processed_at = timezone.now()
            uploaded_file.save(
                update_fields=[
                    "status",
                    "error_message",
                    "processed_at",
                ]
            )
        except UploadedFile.DoesNotExist:
            pass

        raise self.retry(exc=error, countdown=10)


@shared_task
def cleanup_stuck_uploads_for_user_task(user_id):
    timeout_limit = timezone.now() - timedelta(minutes=15)

    stuck_uploads = UploadedFile.objects.filter(
        user_id=user_id,
        status__in=[
            UploadedFile.Status.PENDING,
            UploadedFile.Status.PROCESSING,
        ],
        uploaded_at__lt=timeout_limit,
    )

    updated_count = stuck_uploads.update(
        status=UploadedFile.Status.FAILED,
        error_message="Processing took too long. Please try uploading the file again.",
        processed_at=timezone.now(),
    )

    return {
        "status": "success",
        "updated_count": updated_count,
        "user_id": user_id,
    }