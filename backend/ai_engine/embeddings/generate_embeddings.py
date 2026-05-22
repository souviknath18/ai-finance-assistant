from decouple import config
from openai import OpenAI

client = OpenAI(api_key=config("OPENAI_API_KEY"))


def generate_embedding(text: str):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )

    return response.data[0].embedding