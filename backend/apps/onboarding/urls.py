from django.urls import path

from .views import CompleteOnboardingAPIView, OnboardingProfileAPIView

urlpatterns = [
    path("complete/", CompleteOnboardingAPIView.as_view(), name="complete-onboarding"),
    path("profile/", OnboardingProfileAPIView.as_view(), name="onboarding-profile"),
]