def _clamp(value, minimum=0, maximum=100):
    return max(
        minimum,
        min(value, maximum),
    )


def calculate_financial_health(
    *,
    metrics,
    spending_trend,
    anomalies,
    recurring,
):
    savings_rate = float(
        metrics.get(
            "savings_rate",
            0,
        )
    )

    income = float(
        metrics.get(
            "total_income",
            0,
        )
    )

    expenses = float(
        metrics.get(
            "total_expense",
            0,
        )
    )

    recurring_total = float(
        recurring.get(
            "monthly_total",
            0,
        )
    )

    anomaly_count = int(
        anomalies.get(
            "alert_count",
            0,
        )
    )

    # -----------------------------
    # Savings score: 0 - 35
    # -----------------------------

    if savings_rate >= 30:
        savings_score = 35

    elif savings_rate >= 20:
        savings_score = 28

    elif savings_rate >= 10:
        savings_score = 20

    elif savings_rate > 0:
        savings_score = 10

    else:
        savings_score = 0

    # -----------------------------
    # Cash-flow score: 0 - 25
    # -----------------------------

    if income <= 0:
        cashflow_score = 5

    elif expenses <= income * 0.60:
        cashflow_score = 25

    elif expenses <= income * 0.80:
        cashflow_score = 20

    elif expenses <= income:
        cashflow_score = 12

    else:
        cashflow_score = 0

    # -----------------------------
    # Stability score: 0 - 20
    # -----------------------------

    change = spending_trend.get(
        "change_percent"
    )

    if change is None:
        stability_score = 12

    elif change <= 5:
        stability_score = 20

    elif change <= 15:
        stability_score = 15

    elif change <= 30:
        stability_score = 10

    else:
        stability_score = 5

    # -----------------------------
    # Recurring burden: 0 - 10
    # -----------------------------

    if income > 0:
        recurring_ratio = (
            recurring_total
            / income
        ) * 100
    else:
        recurring_ratio = 0

    if recurring_ratio <= 10:
        recurring_score = 10

    elif recurring_ratio <= 20:
        recurring_score = 7

    elif recurring_ratio <= 30:
        recurring_score = 4

    else:
        recurring_score = 1

    # -----------------------------
    # Anomaly score: 0 - 10
    # -----------------------------

    if anomaly_count == 0:
        anomaly_score = 10

    elif anomaly_count == 1:
        anomaly_score = 7

    elif anomaly_count <= 3:
        anomaly_score = 4

    else:
        anomaly_score = 1

    total_score = (
        savings_score
        + cashflow_score
        + stability_score
        + recurring_score
        + anomaly_score
    )

    total_score = _clamp(
        round(total_score)
    )

    if total_score >= 85:
        status = "Excellent"

    elif total_score >= 70:
        status = "Healthy"

    elif total_score >= 50:
        status = "Fair"

    elif total_score >= 30:
        status = "Needs Attention"

    else:
        status = "Critical"

    return {
        "score": total_score,
        "status": status,

        "savings_rate": savings_rate,

        "breakdown": {
            "savings": {
                "score": savings_score,
                "max_score": 35,
            },

            "cashflow": {
                "score": cashflow_score,
                "max_score": 25,
            },

            "stability": {
                "score": stability_score,
                "max_score": 20,
            },

            "recurring": {
                "score": recurring_score,
                "max_score": 10,
            },

            "anomalies": {
                "score": anomaly_score,
                "max_score": 10,
            },
        },
    }