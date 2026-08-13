from langgraph.graph import (
    END,
    START,
    StateGraph,
)
from langgraph.prebuilt import ToolNode

from ai.agents.aura.context import AuraContext
from ai.agents.aura.nodes import call_model
from ai.agents.aura.routing import (
    route_after_model,
)
from ai.agents.aura.checkpointer import (
    aura_checkpointer,
)
from ai.agents.aura.state import AuraState
from ai.tools.langchain import (
    AURA_TOOLS,
)


def build_aura_graph():
    """
    Build Aura's first agent graph.

    Flow:

        START
          |
          v
        model
        /   \\
    tools   END
      |
      v
    model
    """

    builder = StateGraph(
        AuraState,
        context_schema=AuraContext,
    )

    builder.add_node(
        "model",
        call_model,
    )

    builder.add_node(
        "tools",
        ToolNode(
            AURA_TOOLS
        ),
    )

    builder.add_edge(
        START,
        "model",
    )

    builder.add_conditional_edges(
        "model",
        route_after_model,
        {
            "tools": "tools",
            END: END,
        },
    )

    builder.add_edge(
        "tools",
        "model",
    )

    return builder.compile(
        checkpointer=aura_checkpointer,
    )


aura_graph = build_aura_graph()