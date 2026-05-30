from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class InsightSnapshot(models.Model):
    insight_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="insight_snapshot",
    )

    data = models.JSONField(default=dict)
    is_stale = models.BooleanField(default=True)

    generated_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.insight_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_insight = (
                    InsightSnapshot.objects.select_for_update()
                    .exclude(insight_id="")
                    .order_by("-id")
                    .first()
                )

                if last_insight and last_insight.insight_id:
                    try:
                        last_number = int(last_insight.insight_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                next_number = last_number + 1
                self.insight_id = f"INS-{today}-{next_number:04d}"

                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.insight_id} - {self.user.email}"

    class Meta:
        db_table = "insight_snapshots"