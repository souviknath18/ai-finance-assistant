from django.conf import settings
from django.db import models


class OnboardingProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="onboarding_profile",
    )

    currency = models.CharField(max_length=10, default="INR")

    monthly_income = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    monthly_savings_target = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    spending_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    housing_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    groceries_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    entertainment_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    priorities = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Onboarding - {self.user.email}"