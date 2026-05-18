from django.contrib import admin

from .models import OnboardingProfile


@admin.register(OnboardingProfile)
class OnboardingProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "currency",
        "monthly_income",
        "monthly_savings_target",
        "spending_limit",
        "created_at",
    )

    search_fields = (
        "user__email",
        "user__full_name",
        "user__user_code",
    )

    list_filter = (
        "currency",
        "created_at",
    )