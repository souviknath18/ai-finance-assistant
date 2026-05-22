from decimal import Decimal

from apps.subscriptions.services import detect_subscriptions
from ai_engine.insights.spending_analysis import money


def analyze_recurring_expenses(user):
    data = detect_subscriptions(user)

    subscriptions = data.get("subscriptions", [])
    duplicates = data.get("duplicates", [])
    upcoming_bills = data.get("upcoming_bills", [])

    monthly_total = Decimal("0.00")

    for item in subscriptions:
        monthly_total += Decimal(str(item.get("average_amount", "0")))

    recommendation = (
        f"Review {len(subscriptions)} detected recurring services for possible savings."
        if subscriptions
        else "Upload more transactions to discover recurring payment insights."
    )

    if duplicates:
        first = duplicates[0]
        recommendation = (
            f"You have {first['count']} similar services in {first['group']}. "
            "Review them to reduce overlapping subscriptions."
        )

    return {
        "subscriptions": subscriptions,
        "duplicates": duplicates,
        "upcoming_bills": upcoming_bills,
        "monthly_total": str(monthly_total),
        "monthly_total_display": money(monthly_total),
        "subscription_count": len(subscriptions),
        "duplicate_count": len(duplicates),
        "upcoming_count": len(upcoming_bills),
        "recommendation": recommendation,
    }