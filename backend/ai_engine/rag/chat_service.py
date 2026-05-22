from decouple import config
from openai import OpenAI

from ai_engine.rag.context_builder import build_transaction_context
from ai_engine.rag.rule_answer_service import try_rule_based_answer
from ai_engine.rag.insights_context_builder import (
    build_insights_context,
    is_insights_question,
)
from ai_engine.rag.json_utils import make_json_safe

client = OpenAI(api_key=config("OPENAI_API_KEY"))


def answer_finance_question(user, user_question: str):
    rule_answer = try_rule_based_answer(user, user_question)

    if rule_answer:
        return rule_answer

    transaction_rag_data = build_transaction_context(
        user=user,
        user_question=user_question,
    )

    transaction_context = transaction_rag_data["context"]
    transaction_sources = transaction_rag_data["sources"]

    insights_context = ""
    insights_sources = []

    if is_insights_question(user_question):
        insights_data = build_insights_context(user)
        insights_context = insights_data["context"]
        insights_sources = insights_data["sources"]

    system_prompt = """
You are Aura, an AI personal finance assistant.

You answer using the user's available financial context:
- Retrieved transaction context
- Insights summary context when available

Rules:
- Be clear and helpful.
- Do not invent transactions, scores, categories, or subscriptions.
- If context is insufficient, say that clearly.
- Mention amounts, categories, dates, health scores, and patterns when available.
- Do not give legal, tax, or investment advice.
- Keep answers under 120 words unless the user asks for detailed analysis.
"""

    user_prompt = f"""
User question:
{user_question}

Retrieved transaction context:
{transaction_context}

Insights context:
{insights_context if insights_context else "No insights context needed for this question."}

Answer the user's question using only the provided context.
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    )

    combined_sources = transaction_sources + insights_sources

    return {
        "answer": response.output_text.strip(),
        "sources": make_json_safe(combined_sources),
        "source_type": "rag_insights" if insights_context else "rag",
    }