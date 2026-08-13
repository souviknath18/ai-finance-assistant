from decimal import Decimal

from django.utils import timezone

from apps.goals.models import Goal


def money(amount):
    amount = amount or Decimal("0")
    return f"₹{amount:,.0f}"


def get_goals_dashboard(user):
    goals = (
        Goal.objects
        .filter(
            user=user,
            is_active=True,
        )
        .select_related("category")
    )

    goal_items = []

    for goal in goals:
        progress = 0

        if goal.target_amount > 0:
            progress = round(
                (
                    goal.current_amount
                    / goal.target_amount
                )
                * 100,
                2,
            )

        remaining = max(
            goal.target_amount
            - goal.current_amount,
            Decimal("0"),
        )

        days_left = None

        if goal.target_date:
            days_left = (
                goal.target_date
                - timezone.now().date()
            ).days

        goal_items.append(
            {
                "id": goal.id,
                "goal_id": goal.goal_id,
                "title": goal.title,
                "goal_type": goal.goal_type,

                "category": (
                    goal.category.id
                    if goal.category
                    else None
                ),

                "category_name": (
                    goal.category.name
                    if goal.category
                    else None
                ),

                "target_amount": float(
                    goal.target_amount
                ),

                "current_amount": float(
                    goal.current_amount
                ),

                "remaining_amount": float(
                    remaining
                ),

                "monthly_average": float(
                    goal.monthly_average
                ),

                "target_amount_display": money(
                    goal.target_amount
                ),

                "current_amount_display": money(
                    goal.current_amount
                ),

                "remaining_amount_display": money(
                    remaining
                ),

                "monthly_average_display": money(
                    goal.monthly_average
                ),

                "target_date": (
                    goal.target_date
                ),

                "days_left": days_left,

                "priority": (
                    goal.priority
                ),

                "ai_recommendations_enabled": (
                    goal.ai_recommendations_enabled
                ),

                "progress": min(
                    progress,
                    100,
                ),

                "created_at": (
                    goal.created_at
                ),
            }
        )

    priority_goal = (
        next(
            (
                goal
                for goal in goal_items
                if goal["priority"] == "high"
            ),
            None,
        )
        or next(
            (
                goal
                for goal in goal_items
                if goal["priority"] == "medium"
            ),
            None,
        )
        or (
            goal_items[0]
            if goal_items
            else None
        )
    )

    if priority_goal:
        ai_message = (
            "Based on your current progress, "
            "Aura can help you stay on track for your "
            f"{priority_goal['title']} goal."
        )
    else:
        ai_message = (
            "Create your first financial goal so Aura "
            "can start tracking your progress."
        )

    return {
        "ai_momentum": {
            "message": ai_message,
            "action_label": "Apply Strategy",
        },
        "goals": goal_items,
    }