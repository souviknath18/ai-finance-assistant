from django.conf import settings

from langchain.messages import trim_messages

from ai.llm.langchain_client import (
    get_aura_chat_model,
)


def get_trimmed_messages(
    messages: list,
) -> list:
    if not messages:
        return []

    model = get_aura_chat_model()

    return trim_messages(
        messages,
        max_tokens=settings.AURA_HISTORY_TOKEN_LIMIT,
        strategy="last",
        token_counter=model,
        include_system=False,
        start_on="human",
        allow_partial=False,
    )

def get_memory_stats(
    messages: list,
) -> dict:
    trimmed = get_trimmed_messages(
        messages
    )

    return {
        "stored_message_count": len(messages),
        "model_message_count": len(trimmed),
        "trimmed_message_count": (
            len(messages)
            - len(trimmed)
        ),
    }