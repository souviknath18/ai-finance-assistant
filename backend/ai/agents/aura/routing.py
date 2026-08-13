from typing import Literal

from langgraph.graph import END

from ai.agents.aura.state import AuraState


def route_after_model(
    state: AuraState,
) -> Literal["tools", "__end__"]:
    """
    Decide whether Aura should execute tools or finish.
    """

    messages = state["messages"]

    if not messages:
        return END

    last_message = messages[-1]

    tool_calls = getattr(
        last_message,
        "tool_calls",
        None,
    )

    if tool_calls:
        return "tools"

    return END