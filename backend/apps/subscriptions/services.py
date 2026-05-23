from collections import defaultdict
from datetime import timedelta
from decimal import Decimal

from django.utils.timezone import now

from apps.transactions.models import Transaction
from .models import Subscription, SubscriptionPreference


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
    "Design Tools": ["canva", "figma", "adobe"],
    "Cloud / AI Tools": ["aws", "openai", "chatgpt", "google one", "icloud"],
}


def sync_detected_subscriptions(user):
    transactions = Transaction.objects.filter(
        user=user,
        transaction_type="expense",
    ).order_by("date")

    grouped = defaultdict(list)

    for transaction in transactions:
        key = normalize_subscription_key(transaction.description)

        if key:
            grouped[key].append(transaction)

    for merchant, items in grouped.items():
        total = sum(abs(item.amount) for item in items)
        average_amount = total / Decimal(len(items))
        last_payment_date = items[-1].date
        next_billing_date = last_payment_date + timedelta(days=30)

        Subscription.objects.update_or_create(
            user=user,
            merchant=merchant.title(),
            defaults={
                "category": items[-1].category,
                "amount": round(average_amount, 2),
                "billing_cycle": Subscription.BillingCycle.MONTHLY,
                "next_billing_date": next_billing_date,
                "last_payment_date": last_payment_date,
                "transactions_count": len(items),
                "source": Subscription.Source.DETECTED,
                "status": (
                    Subscription.Status.RECURRING
                    if len(items) >= 2
                    else Subscription.Status.DETECTED_ONCE
                ),
                "is_active": True,
            },
        )


def detect_subscriptions(user):
    sync_detected_subscriptions(user)

    subscriptions = Subscription.objects.filter(
        user=user,
        is_active=True,
    ).order_by("-last_payment_date", "merchant")

    preferences = {
        item.subscription.subscription_id: item
        for item in SubscriptionPreference.objects.filter(user=user).select_related("subscription")
        if item.subscription
    }

    detected = []

    for item in subscriptions:
        preference = preferences.get(item.subscription_id)

        detected.append(
            {
                "id": item.id,
                "subscription_id": item.subscription_id,
                "merchant": item.merchant,
                "transactions_count": item.transactions_count,
                "average_amount": str(item.amount),
                "last_payment_date": item.last_payment_date,
                "last_amount": str(item.amount),
                "next_billing_date": item.next_billing_date,
                "category": item.category,
                "status": item.status,
                "source": item.source,
                "billing_cycle": item.billing_cycle,
                "preference_status": (
                    preference.status
                    if preference
                    else SubscriptionPreference.Status.ACTIVE
                ),
                "preference_note": preference.note if preference else None,
            }
        )

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
    merchant_names = [item["merchant"].lower() for item in detected_subscriptions]

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
        next_date = item.get("next_billing_date")

        if not next_date:
            continue

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