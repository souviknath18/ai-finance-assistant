from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "category_id",
            "name",
            "description",
            "category_type",
            "keywords",
            "is_system",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "category_id",
            "is_system",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Category name is required.")

        if len(value) < 2:
            raise serializers.ValidationError(
                "Category name must be at least 2 characters."
            )

        return value