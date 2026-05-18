from rest_framework import serializers

from .models import OnboardingProfile


class OnboardingProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnboardingProfile
        fields = (
            "id",
            "currency",
            "monthly_income",
            "monthly_savings_target",
            "spending_limit",
            "housing_budget",
            "groceries_budget",
            "entertainment_budget",
            "priorities",
            "created_at",
            "updated_at",
        )

    def validate_currency(self, value):
        allowed = ["INR", "USD", "EUR", "GBP"]

        if value not in allowed:
            raise serializers.ValidationError("Please select a valid currency.")

        return value

    def validate_priorities(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Priorities must be a list.")

        if len(value) == 0:
            raise serializers.ValidationError(
                "Please select at least one financial priority."
            )

        return value

    def validate(self, attrs):
        monthly_income = attrs.get("monthly_income")
        monthly_savings_target = attrs.get("monthly_savings_target")
        spending_limit = attrs.get("spending_limit")

        if monthly_income <= 0:
            raise serializers.ValidationError(
                {"monthly_income": "Monthly income must be greater than 0."}
            )

        if monthly_savings_target < 0:
            raise serializers.ValidationError(
                {
                    "monthly_savings_target": "Monthly savings target cannot be negative."
                }
            )

        if spending_limit <= 0:
            raise serializers.ValidationError(
                {"spending_limit": "Spending limit must be greater than 0."}
            )

        if monthly_savings_target > monthly_income:
            raise serializers.ValidationError(
                {
                    "monthly_savings_target": "Savings target cannot be greater than monthly income."
                }
            )

        if spending_limit > monthly_income:
            raise serializers.ValidationError(
                {
                    "spending_limit": "Spending limit cannot be greater than monthly income."
                }
            )

        return attrs