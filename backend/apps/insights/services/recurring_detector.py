from decimal import Decimal, InvalidOperation

from apps.subscriptions.services import detect_subscriptions


ZERO = Decimal("0.00")


def to_decimal(value) -> Decimal:
    """
    Safely convert a value to Decimal.
    """

    if value is None:
        return ZERO

    if isinstance(value, Decimal):
        return value

    try:
        return Decimal(str(value))

    except (InvalidOperation, TypeError, ValueError):
        return ZERO


def format_money(
    value,
    currency_symbol: str = "₹",
) -> str:
    """
    Format monetary values for display.
    """

    amount = to_decimal(value)

    sign = "-" if amount < ZERO else ""

    amount = abs(amount)

    return (
        f"{sign}"
        f"{currency_symbol}"
        f"{amount:,.2f}"
    )


def normalize_monthly_amount(
    *,
    amount,
    billing_cycle,
) -> Decimal:
    """
    Convert a subscription amount into an approximate monthly cost.

    Examples:

        Weekly ₹100
        -> ~₹433.00/month

        Monthly ₹500
        -> ₹500/month

        Yearly ₹1,200
        -> ₹100/month
    """

    amount = abs(
        to_decimal(amount)
    )

    cycle = (
        str(billing_cycle or "")
        .strip()
        .lower()
    )

    if cycle == "weekly":
        monthly_amount = (
            amount
            * Decimal("52")
            / Decimal("12")
        )

    elif cycle == "yearly":
        monthly_amount = (
            amount
            / Decimal("12")
        )

    else:
        monthly_amount = amount

    return monthly_amount.quantize(
        Decimal("0.01")
    )


def _build_subscription_item(
    item,
):
    """
    Convert the subscription service response into the stable
    structure used by Aura Insights.
    """

    amount = to_decimal(
        item.get(
            "average_amount",
            ZERO,
        )
    )

    billing_cycle = (
        item.get("billing_cycle")
        or "monthly"
    )

    monthly_amount = (
        normalize_monthly_amount(
            amount=amount,
            billing_cycle=billing_cycle,
        )
    )

    last_payment_date = (
        item.get(
            "last_payment_date"
        )
    )

    next_billing_date = (
        item.get(
            "next_billing_date"
        )
    )

    return {
        "id": item.get("id"),

        "subscription_id": item.get(
            "subscription_id"
        ),

        "merchant": (
            item.get("merchant")
            or "Unknown service"
        ),

        "category": (
            item.get("category")
            or "Subscriptions"
        ),

        "amount": str(
            abs(amount)
        ),

        "amount_display": (
            format_money(
                abs(amount)
            )
        ),

        "monthly_amount": str(
            monthly_amount
        ),

        "monthly_amount_display": (
            format_money(
                monthly_amount
            )
        ),

        "billing_cycle": (
            billing_cycle
        ),

        "transactions_count": (
            item.get(
                "transactions_count",
                0,
            )
            or 0
        ),

        "status": item.get(
            "status"
        ),

        "source": item.get(
            "source"
        ),

        "preference_status": (
            item.get(
                "preference_status"
            )
        ),

        "preference_note": (
            item.get(
                "preference_note"
            )
        ),

        "last_payment_date": (
            last_payment_date.isoformat()
            if hasattr(
                last_payment_date,
                "isoformat",
            )
            else last_payment_date
        ),

        "next_billing_date": (
            next_billing_date.isoformat()
            if hasattr(
                next_billing_date,
                "isoformat",
            )
            else next_billing_date
        ),
    }


def _build_duplicate_items(
    duplicates,
):
    """
    Normalize duplicate subscription groups.
    """

    results = []

    for item in duplicates:
        services = (
            item.get(
                "services",
                [],
            )
            or []
        )

        results.append(
            {
                "group": (
                    item.get("group")
                    or "Similar services"
                ),

                "services": services,

                "count": (
                    item.get("count")
                    or len(services)
                ),
            }
        )

    return results


def _build_upcoming_items(
    upcoming_bills,
):
    """
    Normalize upcoming bill information.
    """

    results = []

    for item in upcoming_bills:
        amount = abs(
            to_decimal(
                item.get(
                    "amount",
                    ZERO,
                )
            )
        )

        next_date = item.get(
            "next_date"
        )

        results.append(
            {
                "merchant": (
                    item.get("merchant")
                    or "Unknown service"
                ),

                "amount": str(
                    amount
                ),

                "amount_display": (
                    format_money(
                        amount
                    )
                ),

                "next_billing_date": (
                    next_date.isoformat()
                    if hasattr(
                        next_date,
                        "isoformat",
                    )
                    else next_date
                ),

                "days_remaining": (
                    item.get(
                        "days_remaining"
                    )
                ),
            }
        )

    return results


def _build_recommendation(
    *,
    subscriptions,
    duplicates,
    upcoming,
    monthly_total,
):
    """
    Build a deterministic recurring-expense recommendation.

    AI may later improve the wording, but the recommendation here
    remains available when OpenAI is unavailable.
    """

    if duplicates:
        top_duplicate = duplicates[0]

        service_names = ", ".join(
            top_duplicate.get(
                "services",
                [],
            )
        )

        if service_names:
            return (
                f"You may have overlapping services in "
                f"{top_duplicate['group']}: {service_names}. "
                "Review whether you still need all of them."
            )

        return (
            f"You may have multiple similar services in "
            f"{top_duplicate['group']}. "
            "Review them for possible savings."
        )

    if upcoming:
        nearest_bill = min(
            upcoming,
            key=lambda item: (
                item.get(
                    "days_remaining"
                )
                if item.get(
                    "days_remaining"
                )
                is not None
                else 999
            ),
        )

        return (
            f"{nearest_bill['merchant']} may charge "
            f"{nearest_bill['amount_display']} "
            f"in {nearest_bill['days_remaining']} day(s)."
        )

    if subscriptions:
        return (
            f"You have {len(subscriptions)} active recurring "
            f"payment{'s' if len(subscriptions) != 1 else ''} "
            f"with an estimated monthly cost of "
            f"{format_money(monthly_total)}."
        )

    return (
        "No active recurring expenses have been detected yet."
    )


def analyze_recurring_expenses(
    *,
    user,
):
    """
    Build recurring-expense intelligence for the Insights module.

    Source of truth:
        apps.subscriptions.services.detect_subscriptions()

    This service does NOT duplicate subscription detection logic.
    It only converts subscription-domain data into insight-ready
    analytics.
    """

    subscription_data = (
        detect_subscriptions(
            user
        )
    )

    raw_subscriptions = (
        subscription_data.get(
            "subscriptions",
            [],
        )
        or []
    )

    raw_duplicates = (
        subscription_data.get(
            "duplicates",
            [],
        )
        or []
    )

    raw_upcoming = (
        subscription_data.get(
            "upcoming_bills",
            [],
        )
        or []
    )

    subscriptions = [
        _build_subscription_item(
            item
        )
        for item in raw_subscriptions
    ]

    duplicates = (
        _build_duplicate_items(
            raw_duplicates
        )
    )

    upcoming = (
        _build_upcoming_items(
            raw_upcoming
        )
    )

    monthly_total = sum(
        (
            to_decimal(
                item[
                    "monthly_amount"
                ]
            )
            for item in subscriptions
        ),
        ZERO,
    )

    monthly_total = (
        monthly_total.quantize(
            Decimal("0.01")
        )
    )

    recurring_transaction_count = sum(
        item.get(
            "transactions_count",
            0,
        )
        for item in subscriptions
    )

    recommendation = (
        _build_recommendation(
            subscriptions=subscriptions,
            duplicates=duplicates,
            upcoming=upcoming,
            monthly_total=monthly_total,
        )
    )

    return {
        "monthly_total": (
            monthly_total
        ),

        "monthly_total_display": (
            format_money(
                monthly_total
            )
        ),

        "subscription_count": (
            len(subscriptions)
        ),

        "duplicate_count": (
            len(duplicates)
        ),

        "upcoming_count": (
            len(upcoming)
        ),

        "recurring_transaction_count": (
            recurring_transaction_count
        ),

        "subscriptions": (
            subscriptions
        ),

        "duplicates": (
            duplicates
        ),

        "upcoming_bills": (
            upcoming
        ),

        "recommendation": (
            recommendation
        ),
    }