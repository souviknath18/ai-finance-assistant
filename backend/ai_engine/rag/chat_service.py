from decouple import config
from openai import OpenAI

from ai_engine.rag.context_builder import build_transaction_context
from ai_engine.rag.rule_answer_service import try_rule_based_answer
from ai_engine.rag.insights_context_builder import (
    build_insights_context,
    is_insights_question,
)
from ai_engine.rag.budget_context_builder import (
    build_budget_context,
    is_budget_question,
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

    budget_context = ""
    budget_sources = []

    if is_budget_question(user_question):
        budget_data = build_budget_context(user)
        budget_context = budget_data["context"]
        budget_sources = budget_data["sources"]

    system_prompt = """
You are Aura, an AI personal finance assistant.

You answer using the user's available financial context:
- Retrieved transaction context
- Insights summary context when available
- Budget context when available

Rules:
- Be clear and helpful.
- Do not invent transactions, scores, categories, budgets, or subscriptions.
- If context is insufficient, say that clearly.
- For budget questions, use budget limits, spent amounts, remaining amounts, usage percentages, and status.
- Mention amounts, categories, dates, health scores, budget status, and patterns when available.
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

Budget context:
{budget_context if budget_context else "No budget context needed for this question."}

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

    combined_sources = transaction_sources + insights_sources + budget_sources

    has_budget = bool(budget_context)
    has_insights = bool(insights_context)

    if has_budget and has_insights:
        source_type = "rag_budget_insights"
    elif has_budget:
        source_type = "rag_budget"
    elif has_insights:
        source_type = "rag_insights"
    else:
        source_type = "rag"

    return {
        "answer": response.output_text.strip(),
        "sources": make_json_safe(combined_sources),
        "source_type": source_type,
    }