import os
from django.db import models, transaction
from django.conf import settings
from django.utils import timezone

def upload_file_path(instance, filename):
    return f"uploads/user_{instance.user.id}/{filename}"


class UploadedFile(models.Model):
    class FileType(models.TextChoices):
        PDF = "pdf", "PDF"
        CSV = "csv", "CSV"
        IMAGE = "image", "Image"
        UNKNOWN = "unknown", "Unknown"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        SUCCESS = "success", "Success"
        FAILED = "failed", "Failed"

    upload_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_files",
    )

    file = models.FileField(upload_to=upload_file_path)

    original_filename = models.CharField(max_length=255)

    file_type = models.CharField(
        max_length=20,
        choices=FileType.choices,
        default=FileType.UNKNOWN,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    file_size = models.PositiveIntegerField(default=0)

    extracted_transactions_count = models.PositiveIntegerField(default=0)

    extracted_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    error_message = models.TextField(blank=True, null=True)
    ai_tip_message = models.TextField(blank=True, null=True)
    ai_tip_source = models.CharField(max_length=20, blank=True, null=True)
    ai_tip_generated_at = models.DateTimeField(null=True, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    processed_at = models.DateTimeField(null=True, blank=True)

    extracted_text = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.upload_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_upload = (
                    UploadedFile.objects.select_for_update()
                    .exclude(upload_id="")
                    .order_by("-id")
                    .first()
                )

                if last_upload and last_upload.upload_id:
                    try:
                        last_number = int(last_upload.upload_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                next_number = last_number + 1
                self.upload_id = f"UPL-{today}-{next_number:04d}"

                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    def __str__(self):
        return self.original_filename

    @property
    def extension(self):
        return os.path.splitext(self.original_filename)[1].lower()

    class Meta:
        db_table = "uploaded_files"