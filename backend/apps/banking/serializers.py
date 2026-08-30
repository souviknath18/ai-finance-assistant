from rest_framework import serializers

from .models import (
    BankConnection,
)


class BankConnectionSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = BankConnection

        fields = [
            "id",
            "provider",
            "institution_name",
            "institution_code",
            "account_name",
            "account_type",
            "masked_account_number",
            "balance",
            "currency",
            "status",
            "last_synced_at",
            "created_at",
        ]


class ConnectBankSerializer(
    serializers.Serializer
):
    institution_code = (
        serializers.CharField(
            max_length=50
        )
    )