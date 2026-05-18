from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class Transaction(models.Model):
    class CategorySource(models.TextChoices):
        RULE = "rule", "Rule"
        AI = "ai", "AI"
        USER = "user", "User"
        NONE = "none", "None"

    class TransactionType(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
        TRANSFER = "transfer", "Transfer"
        UNKNOWN = "unknown", "Unknown"

    transaction_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )

    uploaded_file = models.ForeignKey(
        "uploads.UploadedFile",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    date = models.DateField()
    description = models.CharField(max_length=500)

    merchant_name = models.CharField(max_length=255, blank=True, null=True)

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
        default=TransactionType.UNKNOWN,
    )

    category = models.CharField(max_length=100, blank=True, null=True)

    category_source = models.CharField(
        max_length=20,
        choices=CategorySource.choices,
        default=CategorySource.NONE,
    )

    balance_after_transaction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
    )

    is_ai_categorized = models.BooleanField(default=False)

    ai_confidence = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
    )

    ai_reason = models.TextField(blank=True, null=True)

    is_reviewed = models.BooleanField(default=False)

    raw_text = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_transaction = (
                    Transaction.objects.select_for_update()
                    .exclude(transaction_id="")
                    .order_by("-id")
                    .first()
                )

                if last_transaction and last_transaction.transaction_id:
                    try:
                        last_number = int(last_transaction.transaction_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.transaction_id = f"TXN-{today}-{last_number + 1:06d}"
                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "transactions"
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.transaction_id} - {self.description}"