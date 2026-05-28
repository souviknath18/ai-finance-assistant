from django.urls import path
from .views import (
    UploadFileView,
    UploadedFileListView,
    UploadedFileDetailView,
    RetryUploadProcessingView,
    UploadAITipView,
    UploadStatsView,
)

urlpatterns = [
    path("", UploadedFileListView.as_view(), name="uploaded-file-list"),
    path("upload/", UploadFileView.as_view(), name="upload-file"),
    path("ai-tip/", UploadAITipView.as_view(), name="upload-ai-tip"),
    path("stats/", UploadStatsView.as_view(), name="upload-stats"),
    path("<int:pk>/", UploadedFileDetailView.as_view(), name="uploaded-file-detail"),
    path("<int:pk>/retry/", RetryUploadProcessingView.as_view(), name="retry-upload"),
]