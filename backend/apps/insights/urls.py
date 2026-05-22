from django.urls import path
from .views import InsightsSummaryView

urlpatterns = [
    path("", InsightsSummaryView.as_view(), name="insights-summary"),
]