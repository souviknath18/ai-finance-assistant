from collections import defaultdict
from datetime import timedelta
from decimal import Decimal

from django.utils.timezone import now

from apps.transactions.models import Transaction


SUBSCRIPTION_KEYWORDS = [
    "netflix",
    "spotify",
    "youtube premium",
    "amazon prime",
    "prime membership",
    "canva",
    "figma",
    "adobe",
    "aws",
    "openai",
    "chatgpt",
    "icloud",
    "google one",
    "subscription",
    "membership",
    "premium",
]


DUPLICATE_GROUPS = {
    "Media Services": [
        "netflix",
        "spotify",
        "youtube premium",
        "amazon prime",
        "prime membership",
    ],
    "Design Tools": [
        "canva",
        "figma",
        "adobe",
    ],
    "Cloud / AI Tools": [
        "aws",
        "openai",
        "chatgpt",
        "google one",
        "icloud",
    ],
}


def detect_subscriptions(user):
    transactions = Transaction.objects.filter(
        user=user,
        transaction_type="expense",
    ).order_by("date")

    grouped = defaultdict(list)

    for transaction in transactions:
        key = normalize_subscription_key(transaction.description)

        if not key:
            continue

        grouped[key].append(transaction)

    detected = []

    for merchant, items in grouped.items():
        if len(items) < 1:
            continue

        total = sum(abs(item.amount) for item in items)
        average_amount = total / Decimal(len(items))

        detected.append(
            {
                "merchant": merchant.title(),
                "transactions_count": len(items),
                "average_amount": str(round(average_amount, 2)),
                "last_payment_date": items[-1].date,
                "last_amount": str(abs(items[-1].amount)),
                "category": items[-1].category,
                "status": "recurring" if len(items) >= 2 else "detected_once",
            }
        )

    detected.sort(key=lambda item: item["last_payment_date"], reverse=True)

    return {
        "subscriptions": detected,
        "duplicates": detect_duplicate_services(detected),
        "upcoming_bills": detect_upcoming_bills(detected),
    }


def normalize_subscription_key(description: str):
    text = description.lower()

    for keyword in SUBSCRIPTION_KEYWORDS:
        if keyword in text:
            return keyword

    return None


def detect_duplicate_services(detected_subscriptions):
    duplicates = []

    merchant_names = [
        item["merchant"].lower()
        for item in detected_subscriptions
    ]

    for group_name, services in DUPLICATE_GROUPS.items():
        matched = []

        for service in services:
            if service in merchant_names:
                matched.append(service.title())

        if len(matched) >= 2:
            duplicates.append(
                {
                    "group": group_name,
                    "services": matched,
                    "count": len(matched),
                }
            )

    return duplicates


def detect_upcoming_bills(detected_subscriptions):
    today = now().date()
    upcoming = []

    for item in detected_subscriptions:
        last_date = item["last_payment_date"]

        next_date = last_date + timedelta(days=30)
        days_remaining = (next_date - today).days

        if 0 <= days_remaining <= 7:
            upcoming.append(
                {
                    "merchant": item["merchant"],
                    "amount": item["average_amount"],
                    "next_date": next_date,
                    "days_remaining": days_remaining,
                }
            )

    return upcoming