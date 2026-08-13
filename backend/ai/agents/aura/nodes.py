from langchain.messages import SystemMessage
from langgraph.runtime import Runtime

from ai.agents.aura.context import AuraContext
from ai.agents.aura.memory import (
    get_trimmed_messages,
)
from ai.agents.aura.prompts import (
    AURA_SYSTEM_PROMPT,
)
from ai.agents.aura.state import AuraState
from ai.llm.tool_model import (
    get_aura_tool_model,
)


def call_model(
    state: AuraState,
    runtime: Runtime[AuraContext],
):
    """
    Invoke Aura's model with a bounded conversation window.

    The full history remains persisted by LangGraph's checkpointer,
    while only recent relevant messages are sent to the LLM.
    """

    model = get_aura_tool_model()

    conversation_messages = (
        get_trimmed_messages(
            state["messages"]
        )
    )

    messages = [
        SystemMessage(
            content=AURA_SYSTEM_PROMPT,
        ),
        *conversation_messages,
    ]

    response = model.invoke(
        messages
    )

    return {
        "messages": [
            response
        ]
    }