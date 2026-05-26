from celery import shared_task

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
            uploaded_file.save(update_fields=["status", "error_message"])
        except UploadedFile.DoesNotExist:
            pass

        raise self.retry(exc=error, countdown=10)