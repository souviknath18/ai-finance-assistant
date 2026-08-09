from decimal import Decimal, InvalidOperation


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


def calculate_percentage_change(
    current,
    previous,
):
    """
    Calculate percentage change between two values.

    Example:
        current = 120
        previous = 100

        result = 20.0

    If previous is zero, return None because percentage change
    cannot be calculated reliably.
    """

    current_value = to_decimal(current)
    previous_value = to_decimal(previous)

    if previous_value == ZERO:
        return None

    change = (
        (current_value - previous_value)
        / previous_value
        * Decimal("100")
    )

    return round(
        float(change),
        2,
    )


def get_direction(
    change_percent,
):
    """
    Convert percentage change into a simple trend direction.
    """

    if change_percent is None:
        return "unknown"

    if change_percent > 0:
        return "up"

    if change_percent < 0:
        return "down"

    return "same"


def analyze_spending_trend(
    *,
    current_metrics,
    previous_metrics,
):
    """
    Compare overall expenses between the current and previous period.
    """

    current_amount = to_decimal(
        current_metrics.get(
            "total_expense",
            ZERO,
        )
    )

    previous_amount = to_decimal(
        previous_metrics.get(
            "total_expense",
            ZERO,
        )
    )

    change_percent = (
        calculate_percentage_change(
            current_amount,
            previous_amount,
        )
    )

    return {
        "current_amount": current_amount,

        "previous_amount": previous_amount,

        "change_percent": (
            change_percent
        ),

        "direction": get_direction(
            change_percent
        ),
    }


def analyze_income_trend(
    *,
    current_metrics,
    previous_metrics,
):
    """
    Compare income between current and previous periods.
    """

    current_amount = to_decimal(
        current_metrics.get(
            "total_income",
            ZERO,
        )
    )

    previous_amount = to_decimal(
        previous_metrics.get(
            "total_income",
            ZERO,
        )
    )

    change_percent = (
        calculate_percentage_change(
            current_amount,
            previous_amount,
        )
    )

    return {
        "current_amount": current_amount,

        "previous_amount": previous_amount,

        "change_percent": (
            change_percent
        ),

        "direction": get_direction(
            change_percent
        ),
    }


def analyze_savings_trend(
    *,
    current_metrics,
    previous_metrics,
):
    """
    Compare total savings and savings rate between periods.
    """

    current_savings = to_decimal(
        current_metrics.get(
            "savings",
            ZERO,
        )
    )

    previous_savings = to_decimal(
        previous_metrics.get(
            "savings",
            ZERO,
        )
    )

    savings_change = (
        calculate_percentage_change(
            current_savings,
            previous_savings,
        )
    )

    current_rate = float(
        current_metrics.get(
            "savings_rate",
            0,
        )
        or 0
    )

    previous_rate = float(
        previous_metrics.get(
            "savings_rate",
            0,
        )
        or 0
    )

    rate_change = round(
        current_rate - previous_rate,
        2,
    )

    return {
        "current_savings": (
            current_savings
        ),

        "previous_savings": (
            previous_savings
        ),

        "change_percent": (
            savings_change
        ),

        "direction": get_direction(
            savings_change
        ),

        "current_savings_rate": (
            current_rate
        ),

        "previous_savings_rate": (
            previous_rate
        ),

        "savings_rate_change": (
            rate_change
        ),
    }


def analyze_category_trends(
    *,
    current_categories,
    previous_categories,
):
    """
    Compare spending for every current category against
    the same category from the previous period.

    Example:

        Food:
            current  = ₹12,400
            previous = ₹9,250
            change   = +34.05%
    """

    previous_lookup = {
        str(
            item.get(
                "category",
                ""
            )
        ).strip().lower(): item
        for item in previous_categories
    }

    trends = []

    for current_item in current_categories:
        category = (
            current_item.get(
                "category"
            )
            or "Uncategorized"
        )

        lookup_key = (
            str(category)
            .strip()
            .lower()
        )

        previous_item = (
            previous_lookup.get(
                lookup_key
            )
        )

        current_amount = to_decimal(
            current_item.get(
                "amount",
                ZERO,
            )
        )

        previous_amount = ZERO

        if previous_item:
            previous_amount = to_decimal(
                previous_item.get(
                    "amount",
                    ZERO,
                )
            )

        change_percent = (
            calculate_percentage_change(
                current_amount,
                previous_amount,
            )
        )

        if (
            previous_amount == ZERO
            and current_amount > ZERO
        ):
            direction = "new"

        else:
            direction = get_direction(
                change_percent
            )

        trends.append(
            {
                "category": category,

                "current_amount": (
                    current_amount
                ),

                "previous_amount": (
                    previous_amount
                ),

                "current_display": (
                    current_item.get(
                        "total_display"
                    )
                ),

                "previous_display": (
                    previous_item.get(
                        "total_display"
                    )
                    if previous_item
                    else "₹0.00"
                ),

                "change_percent": (
                    change_percent
                ),

                "direction": direction,

                "current_transaction_count": (
                    current_item.get(
                        "count",
                        0,
                    )
                ),

                "previous_transaction_count": (
                    previous_item.get(
                        "count",
                        0,
                    )
                    if previous_item
                    else 0
                ),
            }
        )

    return trends


def analyze_merchant_trends(
    *,
    current_merchants,
    previous_merchants,
):
    """
    Compare current merchant spending against the same merchant
    in the previous period.

    Useful for merchant intelligence such as:

        Swiggy spending increased 42%.
    """

    previous_lookup = {
        str(
            item.get(
                "merchant",
                ""
            )
        ).strip().lower(): item
        for item in previous_merchants
    }

    trends = []

    for current_item in current_merchants:
        merchant = (
            current_item.get(
                "merchant"
            )
            or "Unknown merchant"
        )

        lookup_key = (
            str(merchant)
            .strip()
            .lower()
        )

        previous_item = (
            previous_lookup.get(
                lookup_key
            )
        )

        current_amount = to_decimal(
            current_item.get(
                "amount",
                ZERO,
            )
        )

        previous_amount = ZERO

        if previous_item:
            previous_amount = to_decimal(
                previous_item.get(
                    "amount",
                    ZERO,
                )
            )

        change_percent = (
            calculate_percentage_change(
                current_amount,
                previous_amount,
            )
        )

        if (
            previous_amount == ZERO
            and current_amount > ZERO
        ):
            direction = "new"

        else:
            direction = get_direction(
                change_percent
            )

        trends.append(
            {
                "merchant": merchant,

                "current_amount": (
                    current_amount
                ),

                "previous_amount": (
                    previous_amount
                ),

                "current_display": (
                    current_item.get(
                        "amount_display"
                    )
                ),

                "previous_display": (
                    previous_item.get(
                        "amount_display"
                    )
                    if previous_item
                    else "₹0.00"
                ),

                "change_percent": (
                    change_percent
                ),

                "direction": direction,

                "current_transaction_count": (
                    current_item.get(
                        "count",
                        0,
                    )
                ),

                "previous_transaction_count": (
                    previous_item.get(
                        "count",
                        0,
                    )
                    if previous_item
                    else 0
                ),
            }
        )

    return trends


def find_category_spikes(
    trends,
    *,
    minimum_change_percent=30,
    minimum_current_amount=500,
    limit=5,
):
    """
    Return categories whose spending increased significantly.

    A category must satisfy both:
        percentage increase threshold
        minimum current spending threshold

    This avoids highlighting tiny increases such as:
        ₹10 -> ₹20 = +100%
    """

    results = []

    for trend in trends:
        change_percent = (
            trend.get(
                "change_percent"
            )
        )

        current_amount = to_decimal(
            trend.get(
                "current_amount",
                ZERO,
            )
        )

        if change_percent is None:
            continue

        if (
            change_percent
            < minimum_change_percent
        ):
            continue

        if (
            current_amount
            < Decimal(
                str(
                    minimum_current_amount
                )
            )
        ):
            continue

        results.append(trend)

    results.sort(
        key=lambda item: (
            item.get(
                "change_percent"
            )
            or 0
        ),
        reverse=True,
    )

    return results[:limit]


def find_category_decreases(
    trends,
    *,
    minimum_decrease_percent=20,
    minimum_previous_amount=500,
    limit=5,
):
    """
    Return categories where spending dropped significantly.

    These can later become positive insights.
    """

    results = []

    for trend in trends:
        change_percent = (
            trend.get(
                "change_percent"
            )
        )

        previous_amount = to_decimal(
            trend.get(
                "previous_amount",
                ZERO,
            )
        )

        if change_percent is None:
            continue

        if (
            change_percent
            > -minimum_decrease_percent
        ):
            continue

        if (
            previous_amount
            < Decimal(
                str(
                    minimum_previous_amount
                )
            )
        ):
            continue

        results.append(trend)

    results.sort(
        key=lambda item: (
            item.get(
                "change_percent"
            )
                or 0
        )
    )

    return results[:limit]


def find_merchant_spikes(
    trends,
    *,
    minimum_change_percent=40,
    minimum_current_amount=500,
    limit=5,
):
    """
    Return merchants with a significant spending increase.
    """

    results = []

    for trend in trends:
        change_percent = (
            trend.get(
                "change_percent"
            )
        )

        current_amount = to_decimal(
            trend.get(
                "current_amount",
                ZERO,
            )
        )

        if change_percent is None:
            continue

        if (
            change_percent
            < minimum_change_percent
        ):
            continue

        if (
            current_amount
            < Decimal(
                str(
                    minimum_current_amount
                )
            )
        ):
            continue

        results.append(trend)

    results.sort(
        key=lambda item: (
            item.get(
                "change_percent"
            )
            or 0
        ),
        reverse=True,
    )

    return results[:limit]


def find_new_categories(
    trends,
    *,
    minimum_amount=500,
    limit=5,
):
    """
    Find categories that did not exist in the previous period
    but now contain meaningful spending.
    """

    results = []

    minimum_amount = Decimal(
        str(minimum_amount)
    )

    for trend in trends:
        if (
            trend.get("direction")
            != "new"
        ):
            continue

        current_amount = to_decimal(
            trend.get(
                "current_amount",
                ZERO,
            )
        )

        if (
            current_amount
            < minimum_amount
        ):
            continue

        results.append(trend)

    results.sort(
        key=lambda item: to_decimal(
            item.get(
                "current_amount"
            )
        ),
        reverse=True,
    )

    return results[:limit]


def build_trend_analysis(
    *,
    current_analytics,
    previous_analytics,
):
    """
    Build the complete deterministic trend bundle.

    Expected analytics structure comes directly from
    analytics_service.build_period_analytics().
    """

    current_metrics = (
        current_analytics.get(
            "metrics",
            {},
        )
    )

    previous_metrics = (
        previous_analytics.get(
            "metrics",
            {},
        )
    )

    category_trends = (
        analyze_category_trends(
            current_categories=(
                current_analytics.get(
                    "categories",
                    [],
                )
            ),

            previous_categories=(
                previous_analytics.get(
                    "categories",
                    [],
                )
            ),
        )
    )

    merchant_trends = (
        analyze_merchant_trends(
            current_merchants=(
                current_analytics.get(
                    "merchants",
                    [],
                )
            ),

            previous_merchants=(
                previous_analytics.get(
                    "merchants",
                    [],
                )
            ),
        )
    )

    return {
        "spending": (
            analyze_spending_trend(
                current_metrics=(
                    current_metrics
                ),
                previous_metrics=(
                    previous_metrics
                ),
            )
        ),

        "income": (
            analyze_income_trend(
                current_metrics=(
                    current_metrics
                ),
                previous_metrics=(
                    previous_metrics
                ),
            )
        ),

        "savings": (
            analyze_savings_trend(
                current_metrics=(
                    current_metrics
                ),
                previous_metrics=(
                    previous_metrics
                ),
            )
        ),

        "categories": (
            category_trends
        ),

        "category_spikes": (
            find_category_spikes(
                category_trends
            )
        ),

        "category_decreases": (
            find_category_decreases(
                category_trends
            )
        ),

        "new_categories": (
            find_new_categories(
                category_trends
            )
        ),

        "merchants": (
            merchant_trends
        ),

        "merchant_spikes": (
            find_merchant_spikes(
                merchant_trends
            )
        ),
    }