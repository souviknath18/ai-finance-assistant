from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class Notification(models.Model):
    class Type(models.TextChoices):
        BUDGET = "budget", "Budget"
        GOAL = "goal", "Goal"
        REPORT = "report", "Report"
        SUBSCRIPTION = "subscription", "Subscription"
        AI_ALERT = "ai_alert", "AI Alert"
        TRANSACTION = "transaction", "Transaction"

    class Tone(models.TextChoices):
        RED = "red", "Red"
        GREEN = "green", "Green"
        DARK = "dark", "Dark"
        PURPLE = "purple", "Purple"
        MUTED = "muted", "Muted"

    notification_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    notification_type = models.CharField(max_length=30, choices=Type.choices)
    tone = models.CharField(max_length=20, choices=Tone.choices, default=Tone.DARK)

    action_label = models.CharField(max_length=80, blank=True, null=True)
    action_url = models.CharField(max_length=255, blank=True, null=True)

    progress = models.PositiveIntegerField(null=True, blank=True)

    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.notification_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_notification = (
                    Notification.objects.select_for_update()
                    .exclude(notification_id="")
                    .order_by("-id")
                    .first()
                )

                if last_notification and last_notification.notification_id:
                    try:
                        last_number = int(
                            last_notification.notification_id.split("-")[-1]
                        )
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.notification_id = f"NTF-{today}-{last_number + 1:06d}"

                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notification_id} - {self.title}"