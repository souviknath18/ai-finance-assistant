import json
from django.http import StreamingHttpResponse, JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from ai.agents.aura.service import stream_aura_agent

from django.shortcuts import (
    get_object_or_404,
)

from rest_framework import status
from rest_framework.permissions import (
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatSession
from .serializers import (
    ChatRequestSerializer,
    ChatSessionListSerializer,
    ChatSessionSerializer,
)
from .services import (
    send_chat_message,
)


class ChatMessageView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        serializer = ChatRequestSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            result = send_chat_message(
                user=request.user,
                message=(
                    serializer.validated_data[
                        "message"
                    ]
                ),
                session_id=(
                    serializer.validated_data.get(
                        "session_id"
                    )
                ),
            )

        except Exception as error:
            print(
                "Chat error:",
                repr(error),
            )

            return Response(
                {
                    "detail": str(error),
                },
                status=(
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
            )

        session = result["session"]
        user_message = result[
            "user_message"
        ]
        ai_message = result[
            "ai_message"
        ]

        return Response(
            {
                "session_id": session.id,
                "chat_id": session.chat_id,

                "user_message": {
                    "id": user_message.id,
                    "role": user_message.role,
                    "content": (
                        user_message.content
                    ),
                    "created_at": (
                        user_message.created_at
                    ),
                },

                "ai_message": {
                    "id": ai_message.id,
                    "role": ai_message.role,
                    "content": (
                        ai_message.content
                    ),
                    "sources": (
                        ai_message.sources
                    ),
                    "source_type": (
                        ai_message.source_type
                    ),
                    "created_at": (
                        ai_message.created_at
                    ),
                },

                "answer": ai_message.content,
                "sources": ai_message.sources,
                "source_type": (
                    ai_message.source_type
                ),
            },
            status=status.HTTP_200_OK,
        )


class ChatSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = ChatSession.objects.filter(user=request.user)
        serializer = ChatSessionListSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatSessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        session = get_object_or_404(
            ChatSession,
            id=session_id,
            user=request.user,
        )

        serializer = ChatSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatSessionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, session_id):
        session = get_object_or_404(
            ChatSession,
            id=session_id,
            user=request.user,
        )

        session.delete()

        return Response(
            {"detail": "Chat session deleted successfully."},
            status=status.HTTP_200_OK,
        )


class AuraChatStreamView(APIView):
    """
    Streams Aura LangGraph agent execution over Server-Sent Events (SSE).
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    async def post(self, request, *args, **kwargs):
        try:
            body = json.loads(request.body.decode("utf-8"))
        except Exception:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

        message = body.get("message", "").strip()
        thread_id = body.get("thread_id") or f"user_{request.user.id}_aura"

        if not message:
            return JsonResponse({"error": "Message is required"}, status=400)

        user_id = str(request.user.id)
        event_stream = stream_aura_agent(
            message=message,
            user_id=user_id,
            thread_id=thread_id,
        )

        response = StreamingHttpResponse(
            event_stream,
            content_type="text/event-stream",
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"  # Prevents Nginx from buffering SSE chunks
        return response