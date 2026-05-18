from rest_framework import serializers
from .models import UploadedFile
from .services import validate_uploaded_file


class UploadedFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_size_mb = serializers.SerializerMethodField()

    class Meta:
        model = UploadedFile
        fields = [
            "id",
            "upload_id",
            "original_filename",
            "file",
            "file_url",
            "file_type",
            "status",
            "file_size",
            "file_size_mb",
            "extracted_transactions_count",
            "extracted_amount",
            "error_message",
            "uploaded_at",
            "processed_at",
            "extracted_text",
        ]
        read_only_fields = [
            "id",
            "upload_id",
            "original_filename",
            "file_url",
            "file_type",
            "status",
            "file_size",
            "file_size_mb",
            "extracted_transactions_count",
            "extracted_amount",
            "error_message",
            "uploaded_at",
            "processed_at",
            "extracted_text",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")

        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)

        return None

    def get_file_size_mb(self, obj):
        return round(obj.file_size / (1024 * 1024), 2)


class UploadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ["file"]

    def validate_file(self, file):
        try:
            validate_uploaded_file(file)
        except ValueError as error:
            raise serializers.ValidationError(str(error))

        return file