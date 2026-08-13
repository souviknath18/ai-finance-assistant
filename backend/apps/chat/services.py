from django.shortcuts import get_object_or_404

from ai.agents.aura.service import (
    ask_aura,
)

from apps.chat.models import (
    ChatMessage,
    ChatSession,
)


def send_chat_message(
    *,
    user,
    message: str,
    session_id: int | None = None,
) -> dict:
    """
    Process one Aura Chat message.

    Responsibilities:
    - resolve/create chat session
    - persist user message
    - invoke Aura agent
    - persist Aura response
    - return API-ready result
    """

    session = _get_or_create_session(
        user=user,
        message=message,
        session_id=session_id,
    )

    user_message = ChatMessage.objects.create(
        session=session,
        role=ChatMessage.Role.USER,
        content=message,
    )

    try:
        thread_id = (
            f"aura-user-{user.id}-"
            f"chat-{session.id}"
        )

        result = ask_aura(
            user=user,
            message=message,
            thread_id=thread_id,
        )

    except Exception:
        _save_error_message(
            session=session,
        )

        raise

    ai_message = ChatMessage.objects.create(
        session=session,
        role=ChatMessage.Role.AI,
        content=result.get(
            "answer",
            "",
        ),
        sources=result.get(
            "sources",
            [],
        ),
        source_type=result.get(
            "source_type",
            "agent",
        ),
    )

    # Triggers auto_now on updated_at.
    session.save(
        update_fields=[
            "updated_at",
        ]
    )

    return {
        "session": session,
        "user_message": user_message,
        "ai_message": ai_message,
        "agent_result": result,
    }


def _get_or_create_session(
    *,
    user,
    message: str,
    session_id: int | None,
) -> ChatSession:
    if session_id:
        return get_object_or_404(
            ChatSession,
            id=session_id,
            user=user,
        )

    return ChatSession.objects.create(
        user=user,
        title=message[:60],
    )


def _save_error_message(
    *,
    session: ChatSession,
) -> None:
    ChatMessage.objects.create(
        session=session,
        role=ChatMessage.Role.AI,
        content=(
            "Sorry, I could not generate "
            "an answer right now."
        ),
        source_type="error",
    )