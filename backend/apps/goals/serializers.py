from rest_framework import serializers

from .models import Goal
from apps.categories.models import Category


class GoalSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            "id",
            "goal_id",
            "title",
            "goal_type",
            "category",
            "category_name",
            "target_amount",
            "current_amount",
            "remaining_amount",
            "monthly_average",
            "target_date",
            "priority",
            "is_active",
            "ai_recommendations_enabled",
            "progress",
            "created_at",
            "updated_at",
        ]

    def get_progress(self, obj):
        if obj.target_amount <= 0:
            return 0

        return round((obj.current_amount / obj.target_amount) * 100, 2)

    def get_remaining_amount(self, obj):
        return max(obj.target_amount - obj.current_amount, 0)

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class GoalCreateUpdateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Goal
        fields = [
            "title",
            "goal_type",
            "category",
            "target_amount",
            "current_amount",
            "monthly_average",
            "target_date",
            "priority",
            "is_active",
            "ai_recommendations_enabled",
        ]

    def __init__(self, *args, **kwargs):
        user = kwargs.pop("user", None)
        super().__init__(*args, **kwargs)

        if user:
            self.fields["category"].queryset = Category.objects.filter(
                user=user,
                is_active=True,
            )