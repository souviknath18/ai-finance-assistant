from django.conf import settings

from langchain_openai import ChatOpenAI


def get_aura_chat_model() -> ChatOpenAI:
    """
    Return the LangChain OpenAI chat model used by Aura.
    """

    return ChatOpenAI(
        api_key=settings.OPENAI_API_KEY,
        model=settings.OPENAI_INSIGHTS_MODEL,
        temperature=0,
    )