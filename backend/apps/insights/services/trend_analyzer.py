from decimal import Decimal


ZERO = Decimal("0.00")


def percentage_change(
    current,
    previous,
):
    current = Decimal(str(current or ZERO))
    previous = Decimal(str(previous or ZERO))

    if previous == ZERO:
        return None

    change = (
        (current - previous)
        / previous
        * Decimal("100")
    )

    return round(
        float(change),
        2,
    )


def analyze_overall_spending_trend(
    *,
    current_metrics,
    previous_metrics,
):
    current = Decimal(
        str(
            current_metrics.get(
                "total_expense",
                ZERO,
            )
        )
    )

    previous = Decimal(
        str(
            previous_metrics.get(
                "total_expense",
                ZERO,
            )
        )
    )

    change = percentage_change(
        current,
        previous,
    )

    if change is None:
        direction = "unknown"
    elif change > 0:
        direction = "up"
    elif change < 0:
        direction = "down"
    else:
        direction = "same"

    return {
        "current_amount": current,
        "previous_amount": previous,
        "change_percent": change,
        "direction": direction,
    }


def analyze_category_trends(
    *,
    current_categories,
    previous_categories,
):
    previous_lookup = {
        item["category"].lower(): item
        for item in previous_categories
    }

    trends = []

    for current in current_categories:
        category = current["category"]

        previous = previous_lookup.get(
            category.lower(),
            {},
        )

        current_amount = Decimal(
            str(
                current.get(
                    "amount",
                    ZERO,
                )
            )
        )

        previous_amount = Decimal(
            str(
                previous.get(
                    "amount",
                    ZERO,
                )
            )
        )

        change = percentage_change(
            current_amount,
            previous_amount,
        )

        if change is None:
            direction = "new"
        elif change > 0:
            direction = "up"
        elif change < 0:
            direction = "down"
        else:
            direction = "same"

        trends.append(
            {
                "category": category,

                "current_amount": current_amount,
                "previous_amount": previous_amount,

                "change_percent": change,
                "direction": direction,

                "current_display": current.get(
                    "total_display"
                ),

                "previous_display": previous.get(
                    "total_display",
                    "₹0.00",
                ),
            }
        )

    return trends


def find_category_spikes(
    trends,
    threshold=30,
):
    spikes = []

    for trend in trends:
        change = trend.get(
            "change_percent"
        )

        if change is None:
            continue

        if change >= threshold:
            spikes.append(trend)

    return sorted(
        spikes,
        key=lambda item: item["change_percent"],
        reverse=True,
    )