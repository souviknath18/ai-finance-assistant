from ai.tools.transactions import (
    _json_safe,
)

from apps.subscriptions.services.analytics import (
    get_active_subscriptions,
    get_cancel_candidates,
    get_subscription_summary,
)


def active_subscriptions_tool(
    *,
    user,
) -> list[dict]:
    return _json_safe(
        get_active_subscriptions(
            user=user,
        )
    )


def subscription_summary_tool(
    *,
    user,
) -> dict:
    return _json_safe(
        get_subscription_summary(
            user=user,
        )
    )


def cancel_candidates_tool(
    *,
    user,
) -> list[dict]:
    return _json_safe(
        get_cancel_candidates(
            user=user,
        )
    )