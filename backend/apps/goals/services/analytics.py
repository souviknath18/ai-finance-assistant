from decimal import Decimal

from apps.goals.models import Goal


ZERO = Decimal("0.00")


def get_active_goals(
    *,
    user,
) -> list[dict]:
    goals = (
        Goal.objects
        .filter(
            user=user,
            is_active=True,
        )
        .select_related("category")
        .order_by(
            "priority",
            "target_date",
        )
    )

    return [
        _serialize_goal(goal)
        for goal in goals
    ]


def get_goal_status(
    *,
    user,
    goal_id: str,
) -> dict | None:
    goal = (
        Goal.objects
        .filter(
            user=user,
            goal_id=goal_id,
            is_active=True,
        )
        .select_related("category")
        .first()
    )

    if goal is None:
        return None

    return _serialize_goal(
        goal
    )


def find_goal(
    *,
    user,
    query: str,
) -> dict | None:
    query = query.strip()

    if not query:
        return None

    goal = (
        Goal.objects
        .filter(
            user=user,
            is_active=True,
            title__icontains=query,
        )
        .select_related("category")
        .first()
    )

    if goal is None:
        return None

    return _serialize_goal(
        goal
    )


def _serialize_goal(
    goal: Goal,
) -> dict:
    remaining_amount = max(
        goal.target_amount
        - goal.current_amount,
        ZERO,
    )

    if goal.target_amount > ZERO:
        progress_percent = (
            goal.current_amount
            / goal.target_amount
            * Decimal("100")
        )
    else:
        progress_percent = ZERO

    return {
        "goal_id": goal.goal_id,
        "title": goal.title,
        "goal_type": goal.goal_type,

        "category": (
            goal.category.name
            if goal.category
            else None
        ),

        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "remaining_amount": remaining_amount,
        "progress_percent": progress_percent,

        "monthly_average": (
            goal.monthly_average
        ),

        "target_date": (
            goal.target_date
        ),

        "priority": (
            goal.priority
        ),

        "ai_recommendations_enabled": (
            goal.ai_recommendations_enabled
        ),
    }