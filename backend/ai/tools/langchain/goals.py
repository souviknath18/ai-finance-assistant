from langchain.tools import (
    ToolRuntime,
    tool,
)

from ai.tools.goals import (
    active_goals_tool,
    find_goal_tool,
    goal_status_tool,
)

from ai.tools.langchain.context import (
    AuraToolContext,
)


@tool
def get_active_goals(
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> list[dict]:
    """
    Get the authenticated user's active financial goals.
    """

    return active_goals_tool(
        user=runtime.context.user,
    )


@tool
def get_goal_status(
    goal_id: str,
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> dict | None:
    """
    Get detailed progress for a specific financial goal.
    """

    return goal_status_tool(
        user=runtime.context.user,
        goal_id=goal_id,
    )


@tool
def find_financial_goal(
    query: str,
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> dict | None:
    """
    Find one of the user's financial goals by title
    or natural-language reference.

    Use this when the user refers to a goal naturally,
    such as 'my laptop goal' or 'my travel goal'.
    """

    return find_goal_tool(
        user=runtime.context.user,
        query=query,
    )