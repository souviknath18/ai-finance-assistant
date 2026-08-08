from decimal import Decimal
from statistics import mean, pstdev

from apps.insights.selectors.transaction_selector import (
    get_expense_transactions,
)
from apps.insights.services.analytics_service import money


MINIMUM_ANOMALY_AMOUNT = Decimal("1500.00")
Z_SCORE_THRESHOLD = 2.0


FIXED_COST_KEYWORDS = {
    "rent",
    "mortgage",
    "emi",
    "loan",
    "insurance",
    "sip",
    "investment",
}


def _is_fixed_cost(transaction):
    text = (
        f"{transaction.description or ''} "
        f"{transaction.merchant_name or ''} "
        f"{transaction.category or ''}"
    ).lower()

    return any(
        keyword in text
        for keyword in FIXED_COST_KEYWORDS
    )


def detect_anomalies(
    *,
    user,
    start_date,
    end_date,
):
    queryset = list(
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    candidates = [
        transaction
        for transaction in queryset
        if not _is_fixed_cost(transaction)
    ]

    amounts = [
        float(abs(transaction.amount))
        for transaction in candidates
        if transaction.amount
    ]

    if not amounts:
        return {
            "alerts": [],
            "alert_count": 0,
            "biggest_expense": None,
            "primary_alert": {
                "title": "Spending looks stable",
                "description": (
                    "No unusual spending was detected "
                    "for this period."
                ),
            },
        }

    average = mean(amounts)

    deviation = (
        pstdev(amounts)
        if len(amounts) >= 2
        else 0
    )

    alerts = []

    for transaction in candidates:
        amount = abs(transaction.amount)

        if amount < MINIMUM_ANOMALY_AMOUNT:
            continue

        z_score = 0

        if deviation > 0:
            z_score = (
                float(amount) - average
            ) / deviation

        if (
            z_score < Z_SCORE_THRESHOLD
            and float(amount) <= average * 2
        ):
            continue

        merchant = (
            transaction.merchant_name
            or transaction.description
            or "Unknown merchant"
        )

        alerts.append(
            {
                "title": "Unusual Spending Detected",
                "description": (
                    f"{merchant} is higher than "
                    "your typical expense."
                ),

                "merchant": merchant,

                "amount": str(amount),
                "amount_display": money(amount),

                "category": (
                    transaction.category
                    or "Uncategorized"
                ),

                "transaction_id": (
                    transaction.transaction_id
                ),

                "date": (
                    transaction.date.isoformat()
                    if transaction.date
                    else None
                ),

                "score": round(
                    max(z_score, 0),
                    2,
                ),

                "reason": (
                    "amount_above_normal_range"
                ),
            }
        )

    alerts.sort(
        key=lambda item: Decimal(
            item["amount"]
        ),
        reverse=True,
    )

    alerts = alerts[:5]

    biggest_expense = (
        alerts[0]
        if alerts
        else None
    )

    if biggest_expense:
        primary_alert = {
            "title": "Unusual spending detected",
            "description": (
                f"{biggest_expense['merchant']} "
                f"at {biggest_expense['amount_display']} "
                "stands out from your normal spending."
            ),
        }

    else:
        primary_alert = {
            "title": "Spending looks stable",
            "description": (
                "No major unusual transactions "
                "were detected for this period."
            ),
        }

    return {
        "alerts": alerts,
        "alert_count": len(alerts),
        "biggest_expense": biggest_expense,
        "primary_alert": primary_alert,
        "average_expense": round(
            average,
            2,
        ),
    }