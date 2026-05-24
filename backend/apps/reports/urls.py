from django.urls import path
from .views import (
    ReportDashboardView,
    GenerateReportView,
    GeneratedReportDetailView,
    ExportReportPDFView,
)

urlpatterns = [
    path("", ReportDashboardView.as_view(), name="report-dashboard"),
    path("generate/", GenerateReportView.as_view(), name="generate-report"),
    path("generated/<str:report_id>/", GeneratedReportDetailView.as_view(), name="generated-report-detail"),
    path("generated/<str:report_id>/pdf/", ExportReportPDFView.as_view(), name="export-report-pdf"),
]