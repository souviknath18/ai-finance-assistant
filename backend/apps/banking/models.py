import uuid

from django.conf import settings
from django.db import models


class BankConnection(models.Model):
    class Status(models.TextChoices):
        CONNECTED = "connected", "Connected"
        SYNCING = "syncing", "Syncing"
        ERROR = "error", "Error"
        DISCONNECTED = "disconnected", "Disconnected"

    class AccountType(models.TextChoices):
        SAVINGS = "savings", "Savings"
        CURRENT = "current", "Current"
        CREDIT = "credit", "Credit"
        OTHER = "other", "Other"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bank_connections",
    )

    institution_code = models.CharField(
        max_length=50,
    )

    institution_name = models.CharField(
        max_length=150,
    )

    account_name = models.CharField(
        max_length=150,
    )

    account_type = models.CharField(
        max_length=30,
        choices=AccountType.choices,
        default=AccountType.SAVINGS,
    )

    masked_account_number = models.CharField(
        max_length=20,
    )

    external_account_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    balance = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        blank=True,
        null=True,
    )

    currency = models.CharField(
        max_length=10,
        default="INR",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CONNECTED,
    )

    last_synced_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    last_sync_error = models.TextField(
        blank=True,
        null=True,
    )

    is_demo = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "bank_connections"

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "institution_code",
                    "external_account_id",
                ],
                name="unique_user_bank_account",
            ),
        ]

    def __str__(self):
        return (
            f"{self.user.email} - "
            f"{self.institution_name} "
            f"{self.masked_account_number}"
        )