from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class Subscription(models.Model):
    class Source(models.TextChoices):
        DETECTED = "detected", "Detected"
        MANUAL = "manual", "Manual"

    class Status(models.TextChoices):
        DETECTED_ONCE = "detected_once", "Detected Once"
        RECURRING = "recurring", "Recurring"

    class BillingCycle(models.TextChoices):
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    subscription_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions",
    )

    merchant = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    billing_cycle = models.CharField(
        max_length=20,
        choices=BillingCycle.choices,
        default=BillingCycle.MONTHLY,
    )

    next_billing_date = models.DateField(null=True, blank=True)
    last_payment_date = models.DateField(null=True, blank=True)
    transactions_count = models.PositiveIntegerField(default=0)

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.DETECTED,
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.DETECTED_ONCE,
    )

    smart_reminder = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.subscription_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_subscription = (
                    Subscription.objects.select_for_update()
                    .exclude(subscription_id="")
                    .order_by("-id")
                    .first()
                )

                if last_subscription and last_subscription.subscription_id:
                    try:
                        last_number = int(
                            last_subscription.subscription_id.split("-")[-1]
                        )
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.subscription_id = f"SUB-{today}-{last_number + 1:06d}"
                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "subscriptions"
        unique_together = ["user", "merchant"]
        ordering = ["merchant"]

    def __str__(self):
        return f"{self.subscription_id} - {self.merchant}"


class SubscriptionPreference(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        CONFIRMED = "confirmed", "Confirmed"
        IGNORED = "ignored", "Ignored"
        CANCEL_CANDIDATE = "cancel_candidate", "Cancel Candidate"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscription_preferences",
    )

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name="preferences",
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    note = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "subscription_preferences"
        unique_together = ["user", "subscription"]

    def __str__(self):
        return f"{self.subscription.subscription_id} - {self.status}"