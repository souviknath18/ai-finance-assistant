from django.db import models, transaction
from django.conf import settings
from django.utils import timezone
from apps.categories.models import Category

class Goal(models.Model):
    class GoalType(models.TextChoices):
      SAVINGS = "savings", "Savings"
      DEBT = "debt", "Debt"
      PURCHASE = "purchase", "Purchase"
      TRAVEL = "travel", "Travel"
      INVESTMENT = "investment", "Investment"
      OTHER = "other", "Other"

    class Priority(models.TextChoices):
      HIGH = "high", "High"
      MEDIUM = "medium", "Medium"
      LOW = "low", "Low"

    goal_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals",
    )

    title = models.CharField(max_length=255)
    category = models.ForeignKey(
      Category,
      on_delete=models.SET_NULL,
      null=True,
      blank=True,
      related_name="goals",
    )
    goal_type = models.CharField(
      max_length=30,
      choices=GoalType.choices,
      default=GoalType.SAVINGS,
    )

    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    monthly_average = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    target_date = models.DateField(null=True, blank=True)
    priority = models.CharField(
      max_length=10,
      choices=Priority.choices,
      default=Priority.MEDIUM,
    )
    is_active = models.BooleanField(default=True)
    ai_recommendations_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.goal_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_goal = (
                    Goal.objects.select_for_update()
                    .exclude(goal_id="")
                    .order_by("-id")
                    .first()
                )

                last_number = 0

                if last_goal and last_goal.goal_id:
                    try:
                        last_number = int(last_goal.goal_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0

                self.goal_id = f"GOL-{today}-{last_number + 1:06d}"

                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "goals"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.goal_id} - {self.title}"