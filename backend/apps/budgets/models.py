from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class Budget(models.Model):
    class Period(models.TextChoices):
      WEEKLY = "weekly", "Weekly"
      MONTHLY = "monthly", "Monthly"

    budget_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )

    category = models.CharField(max_length=100)
    limit_amount = models.DecimalField(max_digits=12, decimal_places=2)
    period = models.CharField(
        max_length=20,
        choices=Period.choices,
        default=Period.MONTHLY,
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.budget_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_budget = (
                    Budget.objects.select_for_update()
                    .exclude(budget_id="")
                    .order_by("-id")
                    .first()
                )

                if last_budget and last_budget.budget_id:
                    try:
                        last_number = int(last_budget.budget_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.budget_id = f"BDG-{today}-{last_number + 1:06d}"
                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "budgets"
        ordering = ["category"]
        unique_together = ["user", "category", "period"]

    def __str__(self):
        return f"{self.budget_id} - {self.category}"