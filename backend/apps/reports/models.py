from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class GeneratedReport(models.Model):
    class Status(models.TextChoices):
        GENERATED = "generated", "Generated"
        FAILED = "failed", "Failed"

    report_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="generated_reports",
    )

    title = models.CharField(max_length=255, default="Monthly Financial Report")
    interval = models.CharField(max_length=30, default="monthly")
    period_range = models.CharField(max_length=100)

    report_data = models.JSONField(default=dict)
    ai_summary = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.GENERATED,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.report_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_report = (
                    GeneratedReport.objects.select_for_update()
                    .exclude(report_id="")
                    .order_by("-id")
                    .first()
                )

                if last_report and last_report.report_id:
                    try:
                        last_number = int(last_report.report_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.report_id = f"RPT-{today}-{last_number + 1:06d}"

                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "generated_reports"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.report_id} - {self.title}"