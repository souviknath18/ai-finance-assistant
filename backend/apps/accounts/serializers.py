from rest_framework import serializers

from .models import User
from .services import create_user_account


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "user_code",
            "email",
            "full_name",
            "profile_picture",
            "currency",
            "monthly_income",
            "is_verified",
            "is_onboarded",
            "created_at",
        )


class SignupSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        email = value.lower().strip()

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists.")

        return email

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        return create_user_account(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)