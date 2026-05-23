from rest_framework import serializers
from .models import Subscription, SubscriptionPreference


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            "id",
            "subscription_id",
            "merchant",
            "category",
            "amount",
            "billing_cycle",
            "next_billing_date",
            "last_payment_date",
            "transactions_count",
            "source",
            "status",
            "smart_reminder",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "subscription_id",
            "source",
            "status",
            "transactions_count",
            "created_at",
            "updated_at",
        ]


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            "merchant",
            "category",
            "amount",
            "billing_cycle",
            "next_billing_date",
            "smart_reminder",
        ]


class SubscriptionPreferenceUpdateSerializer(serializers.Serializer):
    subscription_id = serializers.CharField(max_length=40)
    status = serializers.ChoiceField(
        choices=SubscriptionPreference.Status.choices
    )
    note = serializers.CharField(required=False, allow_blank=True)