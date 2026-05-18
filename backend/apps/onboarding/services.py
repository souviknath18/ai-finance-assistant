from django.db import transaction

from .models import OnboardingProfile


@transaction.atomic
def complete_onboarding(*, user, data):
    profile, created = OnboardingProfile.objects.update_or_create(
        user=user,
        defaults=data,
    )

    user.currency = data["currency"]
    user.monthly_income = data["monthly_income"]
    user.is_onboarded = True
    user.save(update_fields=["currency", "monthly_income", "is_onboarded"])

    return profile