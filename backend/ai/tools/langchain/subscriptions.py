from langchain.tools import (
    ToolRuntime,
    tool,
)

from ai.tools.langchain.context import (
    AuraToolContext,
)
from ai.tools.subscriptions import (
    active_subscriptions_tool,
    cancel_candidates_tool,
    subscription_summary_tool,
)


@tool
def get_active_subscriptions(
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> list[dict]:
    """
    Get the authenticated user's active subscriptions.

    Use this when the user asks what recurring subscriptions
    they currently have.
    """

    return active_subscriptions_tool(
        user=runtime.context.user,
    )


@tool
def get_subscription_summary(
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> dict:
    """
    Get estimated monthly and yearly subscription costs.

    Use this when the user asks how much subscriptions cost
    overall.
    """

    return subscription_summary_tool(
        user=runtime.context.user,
    )


@tool
def get_subscription_cancel_candidates(
    runtime: ToolRuntime[
        AuraToolContext
    ],
) -> list[dict]:
    """
    Get subscriptions the user has marked as possible
    cancellation candidates.
    """

    return cancel_candidates_tool(
        user=runtime.context.user,
    )