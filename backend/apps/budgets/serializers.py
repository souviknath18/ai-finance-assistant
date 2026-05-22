from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = [
            "id",
            "budget_id",
            "category",
            "limit_amount",
            "period",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "budget_id", "created_at", "updated_at"]


class BudgetCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["category", "limit_amount", "period", "is_active"]