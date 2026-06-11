from rest_framework import serializers
from django.utils.timesince import timesince
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "notification_id",
            "title",
            "description",
            "notification_type",
            "tone",
            "action_label",
            "action_url",
            "progress",
            "is_read",
            "is_dismissed",
            "created_at",
            "time",
        ]

    def get_time(self, obj):
        return f"{timesince(obj.created_at)} ago"