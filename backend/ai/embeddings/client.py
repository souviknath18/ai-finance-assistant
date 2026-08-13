from django.conf import settings
from openai import OpenAI


def get_openai_client() -> OpenAI:
    """
    Create an OpenAI client using Django configuration.
    """
    return OpenAI(
        api_key=settings.OPENAI_API_KEY,
    )


def generate_embedding(text: str) -> list[float]:
    """
    Generate an embedding for the supplied text.

    Aura currently uses text-embedding-3-small, which produces
    1536-dimensional vectors matching TransactionEmbedding.
    """
    if not text or not text.strip():
        raise ValueError("Cannot generate an embedding for empty text.")

    client = get_openai_client()

    response = client.embeddings.create(
        model=settings.OPENAI_EMBEDDING_MODEL,
        input=text.strip(),
    )

    return response.data[0].embedding