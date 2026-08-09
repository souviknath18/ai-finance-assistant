from django.conf import settings
from django.db import models, transaction
from django.utils import timezone


class InsightSnapshot(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        GENERATING = "generating", "Generating"
        READY = "ready", "Ready"
        FAILED = "failed", "Failed"

    insight_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="insight_snapshots",
    )

    period_start = models.DateField(
        null=True,
        blank=True,
        db_index=True,
    )

    period_end = models.DateField(
        null=True,
        blank=True,
        db_index=True,
    )

    data = models.JSONField(
        default=dict,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    is_stale = models.BooleanField(
        default=True,
        db_index=True,
    )

    error_message = models.TextField(
        blank=True,
        default="",
    )

    generated_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def save(self, *args, **kwargs):
        if not self.insight_id:
            self.insight_id = self._generate_insight_id()

        super().save(*args, **kwargs)

    @classmethod
    def _generate_insight_id(cls):
        today = timezone.localdate().strftime("%Y%m%d")

        with transaction.atomic():
            last_snapshot = (
                cls.objects
                .select_for_update()
                .filter(
                    insight_id__startswith=f"INS-{today}-"
                )
                .order_by("-id")
                .first()
            )

            last_number = 0

            if last_snapshot and last_snapshot.insight_id:
                try:
                    last_number = int(
                        last_snapshot.insight_id.rsplit("-", 1)[-1]
                    )
                except (ValueError, IndexError):
                    last_number = 0

            return f"INS-{today}-{last_number + 1:04d}"

    def mark_stale(self):
        if self.is_stale:
            return

        self.is_stale = True

        self.save(
            update_fields=[
                "is_stale",
                "updated_at",
            ]
        )

    def mark_generating(self):
        self.status = self.Status.GENERATING
        self.error_message = ""

        self.save(
            update_fields=[
                "status",
                "error_message",
                "updated_at",
            ]
        )

    def mark_ready(self):
        self.status = self.Status.READY
        self.is_stale = False
        self.error_message = ""
        self.generated_at = timezone.now()

        self.save(
            update_fields=[
                "status",
                "is_stale",
                "error_message",
                "generated_at",
                "updated_at",
            ]
        )

    def mark_failed(self, error_message=""):
        self.status = self.Status.FAILED
        self.error_message = str(error_message)[:2000]

        self.save(
            update_fields=[
                "status",
                "error_message",
                "updated_at",
            ]
        )

    @property
    def is_ready(self):
        return (
            self.status == self.Status.READY
            and bool(self.data)
        )

    @property
    def needs_regeneration(self):
        return (
            self.is_stale
            or not self.is_ready
        )

    def __str__(self):
        return (
            f"{self.insight_id} - "
            f"{self.user.email} - "
            f"{self.period_start} to {self.period_end}"
        )

    class Meta:
        db_table = "insight_snapshots"

        ordering = [
            "-generated_at",
            "-created_at",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "period_start",
                    "period_end",
                ],
                name="unique_user_insight_period",
            )
        ]

        indexes = [
            models.Index(
                fields=[
                    "user",
                    "is_stale",
                ],
                name="insight_user_stale_idx",
            ),
            models.Index(
                fields=[
                    "user",
                    "status",
                ],
                name="insight_user_status_idx",
            ),
            models.Index(
                fields=[
                    "user",
                    "period_start",
                    "period_end",
                ],
                name="insight_user_period_idx",
            ),
        ]