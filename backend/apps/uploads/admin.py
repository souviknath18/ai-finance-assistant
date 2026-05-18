from django.contrib import admin
from .models import UploadedFile


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "original_filename",
        "file_type",
        "status",
        "extracted_transactions_count",
        "uploaded_at",
    ]

    list_filter = ["file_type", "status", "uploaded_at"]

    search_fields = [
        "original_filename",
        "user__email",
    ]

    readonly_fields = [
        "uploaded_at",
        "processed_at",
    ]