from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notification_type = request.GET.get("type", "all")
        search = request.GET.get("search", "").strip()

        notifications = Notification.objects.filter(
            user=request.user,
            is_dismissed=False,
        )

        if notification_type != "all":
            notifications = notifications.filter(
                notification_type=notification_type
            )

        if search:
            notifications = notifications.filter(title__icontains=search)

        serializer = NotificationSerializer(notifications, many=True)

        base_queryset = Notification.objects.filter(
            user=request.user,
            is_dismissed=False,
        )

        counts = {
            "all": base_queryset.count(),
            "budget": base_queryset.filter(notification_type="budget").count(),
            "goal": base_queryset.filter(notification_type="goal").count(),
            "report": base_queryset.filter(notification_type="report").count(),
            "subscription": base_queryset.filter(
                notification_type="subscription"
            ).count(),
            "ai_alert": base_queryset.filter(notification_type="ai_alert").count(),
            "transaction": base_queryset.filter(
                notification_type="transaction"
            ).count(),
        }

        return Response(
            {
                "results": serializer.data,
                "counts": counts,
            },
            status=status.HTTP_200_OK,
        )


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(
            Notification,
            id=pk,
            user=request.user,
        )

        notification.is_read = True
        notification.save(update_fields=["is_read"])

        return Response(
            {"detail": "Notification marked as read."},
            status=status.HTTP_200_OK,
        )


class DismissNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(
            Notification,
            id=pk,
            user=request.user,
        )

        notification.is_dismissed = True
        notification.save(update_fields=["is_dismissed"])

        return Response(
            {"detail": "Notification dismissed."},
            status=status.HTTP_200_OK,
        )
    

class NotificationUnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False,
            is_dismissed=False,
        ).count()

        return Response({
            "unread_count": count
        })