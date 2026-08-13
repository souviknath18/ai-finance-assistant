from datetime import date

from langchain.tools import (
    ToolRuntime,
    tool,
)

from ai.tools.budgets import (
    active_budgets_tool,
    budget_status_tool,
)
from ai.tools.langchain.context import (
    AuraToolContext,
)


@tool
def get_active_budgets(
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> list[dict]:
    """
    Get all active budgets belonging to the authenticated user.

    Use this when the user asks what budgets they currently have
    or wants an overview of their budget limits.
    """

    return active_budgets_tool(
        user=runtime.context.user,
    )


@tool
def get_budget_status(
    category: str,
    start_date: date,
    end_date: date,
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> dict | None:
    """
    Get spending versus budget for one category during a period.

    Use this when the user asks whether they are over budget,
    how much budget remains, or how much of a category budget
    has been used.
    """

    return budget_status_tool(
        user=runtime.context.user,
        category=category,
        start_date=start_date,
        end_date=end_date,
    )