from ai.tools.transactions import (
    _json_safe,
)

from apps.goals.services.analytics import (
    find_goal,
    get_active_goals,
    get_goal_status,
)


def active_goals_tool(
    *,
    user,
) -> list[dict]:
    return _json_safe(
        get_active_goals(
            user=user,
        )
    )


def goal_status_tool(
    *,
    user,
    goal_id: str,
) -> dict | None:
    return _json_safe(
        get_goal_status(
            user=user,
            goal_id=goal_id,
        )
    )


def find_goal_tool(
    *,
    user,
    query: str,
) -> dict | None:
    return _json_safe(
        find_goal(
            user=user,
            query=query,
        )
    )