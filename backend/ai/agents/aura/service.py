import json
from typing import Any

from langchain.messages import (
    AIMessage,
    HumanMessage,
    ToolMessage,
)

from ai.agents.aura.context import AuraContext
from ai.agents.aura.graph import aura_graph


SEMANTIC_TOOL_NAMES = {
    "search_transactions",
}

ANALYTICS_TOOL_NAMES = {
    "get_total_spending",
    "get_total_income",
    "get_category_spending",
    "get_category_breakdown",
    "get_top_spending_category",
    "get_largest_expense",
    "get_transaction_counts",
    "compare_spending_periods",
    "get_cash_flow",
    "get_monthly_spending_trend",
}


def ask_aura(
    *,
    user,
    message: str,
    thread_id: str,
) -> dict:
    """
    Execute one Aura agent request for an authenticated user.

    Returns a stable result that can be consumed by Django Chat
    without exposing LangGraph internals.
    """

    message = message.strip()

    if not message:
        raise ValueError(
            "Message cannot be empty."
        )

    result = aura_graph.invoke(
        {
            "messages": [
                HumanMessage(
                    content=message,
                )
            ]
        },
        context=AuraContext(
            user=user,
        ),
        config={
            "configurable": {
                "thread_id": thread_id,
            },
            "recursion_limit": 10,
        },
    )

    messages = result.get(
        "messages",
        [],
    )

    if not messages:
        return {
            "answer": (
                "I couldn't generate a response."
            ),
            "sources": [],
            "source_type": "agent",
            "tool_calls": [],
        }

    final_message = _find_final_ai_message(
        messages
    )

    tool_calls = _collect_tool_calls(
        messages
    )

    sources = _collect_sources(
        messages
    )

    source_type = _determine_source_type(
        tool_calls
    )

    return {
        "answer": (
            final_message.content
            if final_message
            else "I couldn't generate a response."
        ),
        "sources": sources,
        "source_type": source_type,

        # Useful during development.
        # Do not expose this directly through the production API.
        "tool_calls": tool_calls,
    }


def _find_final_ai_message(
    messages: list,
) -> AIMessage | None:
    """
    Find the most recent AI message that is not just a tool call.
    """

    for message in reversed(messages):
        if not isinstance(
            message,
            AIMessage,
        ):
            continue

        if getattr(
            message,
            "tool_calls",
            None,
        ):
            continue

        if message.content:
            return message

    return None


def _collect_tool_calls(
    messages: list,
) -> list[dict]:
    """
    Collect model-requested tool calls for debugging and
    source classification.
    """

    tool_calls = []

    for message in messages:
        if not isinstance(
            message,
            AIMessage,
        ):
            continue

        calls = getattr(
            message,
            "tool_calls",
            None,
        )

        if not calls:
            continue

        for call in calls:
            tool_calls.append(
                {
                    "name": call.get("name"),
                    "args": call.get(
                        "args",
                        {},
                    ),
                    "id": call.get("id"),
                }
            )

    return tool_calls


def _collect_sources(
    messages: list,
) -> list[dict]:
    """
    Extract supporting transaction evidence from semantic
    retrieval tool results.

    Exact analytics tools do not currently need to expose
    transaction-level sources.
    """

    sources = []

    seen = set()

    for message in messages:
        if not isinstance(
            message,
            ToolMessage,
        ):
            continue

        tool_name = getattr(
            message,
            "name",
            None,
        )

        if tool_name not in SEMANTIC_TOOL_NAMES:
            continue

        payload = _parse_tool_content(
            message.content
        )

        if not isinstance(
            payload,
            dict,
        ):
            continue

        evidence_items = payload.get(
            "evidence",
            [],
        )

        for evidence in evidence_items:
            if not isinstance(
                evidence,
                dict,
            ):
                continue

            source_id = evidence.get(
                "source_id"
            )

            if not source_id:
                continue

            if source_id in seen:
                continue

            seen.add(source_id)

            sources.append(
                {
                    "source_type": evidence.get(
                        "source_type",
                        "transaction",
                    ),
                    "source_id": source_id,
                    "content": evidence.get(
                        "content",
                        "",
                    ),
                    "metadata": evidence.get(
                        "metadata",
                        {},
                    ),
                    "score": evidence.get(
                        "score"
                    ),
                }
            )

    return sources


def _parse_tool_content(
    content: Any,
) -> Any:
    """
    Parse ToolMessage content safely.

    Depending on the LangChain/tool version, content can be
    returned as a dict, list, JSON string, or plain string.
    """

    if isinstance(
        content,
        (dict, list),
    ):
        return content

    if not isinstance(
        content,
        str,
    ):
        return None

    try:
        return json.loads(
            content
        )
    except json.JSONDecodeError:
        return None


def _determine_source_type(
    tool_calls: list[dict],
) -> str:
    names = {
        call.get("name")
        for call in tool_calls
        if call.get("name")
    }

    used_semantic = bool(
        names & SEMANTIC_TOOL_NAMES
    )

    used_analytics = bool(
        names & ANALYTICS_TOOL_NAMES
    )

    if (
        used_semantic
        and used_analytics
    ):
        return "agent_hybrid"

    if used_semantic:
        return "agent_rag"

    if used_analytics:
        return "agent_tools"

    return "agent"