from rest_framework import serializers

from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "role",
            "content",
            "sources",
            "source_type",
            "created_at",
        ]


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = [
            "id",
            "chat_id",
            "title",
            "created_at",
            "updated_at",
            "messages",
        ]


class ChatSessionListSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            "id",
            "chat_id",
            "title",
            "last_message",
            "created_at",
            "updated_at",
        ]

    def get_last_message(self, obj):
        message = obj.messages.last()

        if not message:
            return None

        return {
            "role": message.role,
            "content": message.content,
            "created_at": message.created_at,
        }


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=True,
        allow_blank=False,
        max_length=1000,
    )
    session_id = serializers.IntegerField(required=False)