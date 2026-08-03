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
            raise serializers.ValidationError(
                "Category name is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Category name must be at least 2 characters."
            )

        request = self.context.get("request")

        if request:
            duplicate_query = Category.objects.filter(
                user=request.user,
                name__iexact=value,
            )

            if self.instance:
                duplicate_query = duplicate_query.exclude(
                    id=self.instance.id
                )

            if duplicate_query.exists():
                raise serializers.ValidationError(
                    "A category with this name already exists."
                )

        return value


class MergeCategorySerializer(serializers.Serializer):
    source_category_id = serializers.CharField(
        max_length=40
    )

    destination_category_id = serializers.CharField(
        max_length=40
    )

    def validate(self, attrs):
        if (
            attrs["source_category_id"]
            == attrs["destination_category_id"]
        ):
            raise serializers.ValidationError(
                {
                    "destination_category_id": (
                        "A category cannot be merged into itself."
                    )
                }
            )

        return attrs