from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscription, SubscriptionPreference
from .serializers import (
    SubscriptionSerializer,
    SubscriptionCreateSerializer,
    SubscriptionPreferenceUpdateSerializer,
)
from .services import detect_subscriptions


class DetectedSubscriptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = detect_subscriptions(request.user)
        return Response(data)


class ManualSubscriptionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubscriptionCreateSerializer(data=request.data)

        if serializer.is_valid():
            subscription = serializer.save(
                user=request.user,
                source=Subscription.Source.MANUAL,
                status=Subscription.Status.RECURRING,
                transactions_count=0,
                is_active=True,
            )

            return Response(
                SubscriptionSerializer(subscription).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubscriptionPreferenceUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubscriptionPreferenceUpdateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        subscription = Subscription.objects.get(
            user=request.user,
            subscription_id=serializer.validated_data["subscription_id"],
        )

        preference, _ = SubscriptionPreference.objects.update_or_create(
            user=request.user,
            subscription=subscription,
            defaults={
                "status": serializer.validated_data["status"],
                "note": serializer.validated_data.get("note", ""),
            },
        )

        return Response(
            {
                "subscription_id": subscription.subscription_id,
                "merchant": subscription.merchant,
                "preference_status": preference.status,
                "preference_note": preference.note,
            },
            status=status.HTTP_200_OK,
        )