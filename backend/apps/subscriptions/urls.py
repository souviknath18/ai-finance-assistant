from django.urls import path
from .views import DetectedSubscriptionsView

urlpatterns = [
    path("detected/", DetectedSubscriptionsView.as_view(), name="detected-subscriptions"),
]