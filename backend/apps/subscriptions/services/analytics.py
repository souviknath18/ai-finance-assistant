from decimal import Decimal

from django.db.models import Sum

from apps.subscriptions.models import (
    Subscription,
    SubscriptionPreference,
)


ZERO = Decimal("0.00")


def get_active_subscriptions(
    *,
    user,
) -> list[dict]:
    subscriptions = (
        Subscription.objects
        .filter(
            user=user,
            is_active=True,
        )
        .order_by("-amount")
    )

    return [
        _serialize_subscription(
            subscription
        )
        for subscription in subscriptions
    ]


def get_subscription_summary(
    *,
    user,
) -> dict:
    subscriptions = (
        Subscription.objects
        .filter(
            user=user,
            is_active=True,
        )
    )

    monthly_total = ZERO
    yearly_total = ZERO

    for subscription in subscriptions:
        amount = subscription.amount

        if (
            subscription.billing_cycle
            == Subscription.BillingCycle.WEEKLY
        ):
            monthly_equivalent = (
                amount
                * Decimal("52")
                / Decimal("12")
            )

        elif (
            subscription.billing_cycle
            == Subscription.BillingCycle.YEARLY
        ):
            monthly_equivalent = (
                amount
                / Decimal("12")
            )

        else:
            monthly_equivalent = amount

        monthly_total += (
            monthly_equivalent
        )

    yearly_total = (
        monthly_total
        * Decimal("12")
    )

    return {
        "active_count": (
            subscriptions.count()
        ),
        "estimated_monthly_cost": (
            monthly_total
        ),
        "estimated_yearly_cost": (
            yearly_total
        ),
    }


def get_cancel_candidates(
    *,
    user,
) -> list[dict]:
    preferences = (
        SubscriptionPreference.objects
        .filter(
            user=user,
            status=(
                SubscriptionPreference
                .Status
                .CANCEL_CANDIDATE
            ),
            subscription__is_active=True,
        )
        .select_related(
            "subscription"
        )
    )

    return [
        {
            **_serialize_subscription(
                preference.subscription
            ),
            "preference_status": (
                preference.status
            ),
            "note": (
                preference.note
            ),
        }
        for preference in preferences
    ]


def _serialize_subscription(
    subscription: Subscription,
) -> dict:
    return {
        "subscription_id": (
            subscription.subscription_id
        ),
        "merchant": (
            subscription.merchant
        ),
        "category": (
            subscription.category
        ),
        "amount": (
            subscription.amount
        ),
        "billing_cycle": (
            subscription.billing_cycle
        ),
        "next_billing_date": (
            subscription.next_billing_date
        ),
        "last_payment_date": (
            subscription.last_payment_date
        ),
        "transactions_count": (
            subscription.transactions_count
        ),
        "status": (
            subscription.status
        ),
        "source": (
            subscription.source
        ),
    }