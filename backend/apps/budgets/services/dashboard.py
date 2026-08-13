from apps.budgets.models import Budget

from apps.budgets.services.analysis import (
    analyze_budget_usage,
    generate_budget_recommendation,
)
from apps.notifications.services import (
    create_notification_once,
)


def get_budget_dashboard(user):
    budgets = Budget.objects.filter(
        user=user,
        is_active=True,
    )

    budget_items = [
        analyze_budget_usage(
            user,
            budget,
        )
        for budget in budgets
    ]

    for item in budget_items:
        usage = float(
            item.get(
                "usage_percentage",
                0,
            )
        )

        if usage >= 90:
            create_notification_once(
                user=user,
                title=(
                    f"Budget Warning: "
                    f"{item['category']}"
                ),
                description=(
                    f"You have used {usage}% of your "
                    f"{item['category']} budget."
                ),
                notification_type="budget",
                tone="red",
                action_label="Adjust Budget",
                action_url="/budgets",
                progress=int(
                    min(
                        usage,
                        100,
                    )
                ),
            )

    total_limit = sum(
        float(item["limit_amount"])
        for item in budget_items
    )

    total_spent = sum(
        float(item["spent_amount"])
        for item in budget_items
    )

    overall_usage = 0

    if total_limit > 0:
        overall_usage = round(
            (
                total_spent
                / total_limit
            )
            * 100,
            2,
        )

    return {
        "summary": {
            "total_limit": total_limit,
            "total_spent": total_spent,
            "overall_usage": min(
                overall_usage,
                100,
            ),
            "active_budgets": len(
                budget_items
            ),
        },
        "recommendation": (
            generate_budget_recommendation(
                budget_items
            )
        ),
        "budgets": budget_items,
    }