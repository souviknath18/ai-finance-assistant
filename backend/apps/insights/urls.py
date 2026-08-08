from django.urls import path

from apps.insights.views import (
    InsightsSummaryView,
    RegenerateInsightsView,
)


urlpatterns = [
    path("", InsightsSummaryView.as_view(), name="insights-summary"),
    path("regenerate/", RegenerateInsightsView.as_view(), name="insights-regenerate"),
]