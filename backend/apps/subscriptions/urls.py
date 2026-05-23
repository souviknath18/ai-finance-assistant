from django.urls import path
from .views import (
    DetectedSubscriptionsView,
    ManualSubscriptionCreateView,
    SubscriptionPreferenceUpdateView,
)

urlpatterns = [
    path("detected/", DetectedSubscriptionsView.as_view(), name="detected-subscriptions"),
    path("manual/", ManualSubscriptionCreateView.as_view(), name="manual-subscription-create"),
    path("preference/", SubscriptionPreferenceUpdateView.as_view(), name="subscription-preference"),
]