from decimal import Decimal

from apps.subscriptions.services import (
    detect_subscriptions,
)

from apps.insights.services.analytics_service import (
    money,
)


ZERO = Decimal("0.00")


def analyze_recurring_expenses(
    *,
    user,
):
    data = detect_subscriptions(user)

    subscriptions = data.get(
        "subscriptions",
        [],
    )

    duplicates = data.get(
        "duplicates",
        [],
    )

    upcoming = data.get(
        "upcoming_bills",
        [],
    )

    monthly_total = ZERO

    for subscription in subscriptions:
        monthly_total += Decimal(
            str(
                subscription.get(
                    "average_amount",
                    ZERO,
                )
            )
        )

    recommendation = (
        "No major recurring expenses have been detected yet."
    )

    if subscriptions:
        recommendation = (
            f"Aura detected {len(subscriptions)} recurring "
            "service"
            f"{'s' if len(subscriptions) != 1 else ''} "
            f"costing approximately {money(monthly_total)} "
            "per month."
        )

    if duplicates:
        duplicate = duplicates[0]

        recommendation = (
            f"You may have {duplicate['count']} overlapping "
            f"services in {duplicate['group']}. "
            "Consider reviewing them."
        )

    return {
        "subscriptions": subscriptions,
        "duplicates": duplicates,
        "upcoming_bills": upcoming,

        "monthly_total": monthly_total,
        "monthly_total_display": money(
            monthly_total
        ),

        "subscription_count": len(
            subscriptions
        ),

        "duplicate_count": len(
            duplicates
        ),

        "upcoming_count": len(
            upcoming
        ),

        "recommendation": recommendation,
    }