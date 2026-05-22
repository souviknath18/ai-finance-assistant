from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    uploaded_file_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            "id",
            "transaction_id",
            "uploaded_file",
            "uploaded_file_name",
            "date",
            "description",
            "merchant_name",
            "amount",
            "transaction_type",
            "category",
            "category_source",
            "balance_after_transaction",
            "is_ai_categorized",
            "ai_confidence",
            "ai_reason",
            "is_reviewed",
            "raw_text",
            "is_vectorized",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "transaction_id",
            "created_at",
            "updated_at",
        ]

    def get_uploaded_file_name(self, obj):
        if obj.uploaded_file:
            return obj.uploaded_file.original_filename
        return None


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "date",
            "description",
            "merchant_name",
            "amount",
            "transaction_type",
            "category",
            "balance_after_transaction",
            "raw_text",
        ]