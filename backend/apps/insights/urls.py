from django.urls import path

from apps.insights.views import (
    InsightsDashboardView,
    RegenerateInsightsView,
    InsightStatusView,
)

app_name = "insights"

urlpatterns = [
    # ------------------------------------------------------------------
    # Dashboard
    # GET /api/insights/
    # ------------------------------------------------------------------
    path(
        "",
        InsightsDashboardView.as_view(),
        name="dashboard",
    ),

    # ------------------------------------------------------------------
    # Manual regeneration
    # POST /api/insights/regenerate/
    # ------------------------------------------------------------------
    path(
        "regenerate/",
        RegenerateInsightsView.as_view(),
        name="regenerate",
    ),

    # ------------------------------------------------------------------
    # Snapshot status
    # GET /api/insights/status/
    # ------------------------------------------------------------------
    path(
        "status/",
        InsightStatusView.as_view(),
        name="status",
    ),
]