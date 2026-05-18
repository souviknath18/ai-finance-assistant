from django.urls import path
from .views import (
    UploadFileView,
    UploadedFileListView,
    UploadedFileDetailView,
    RetryUploadProcessingView,
)

urlpatterns = [
    path("", UploadedFileListView.as_view(), name="uploaded-file-list"),
    path("upload/", UploadFileView.as_view(), name="upload-file"),
    path("<int:pk>/", UploadedFileDetailView.as_view(), name="uploaded-file-detail"),
    path("<int:pk>/retry/", RetryUploadProcessingView.as_view(), name="retry-upload"),
]