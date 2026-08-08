def build_insight_signals(
    *,
    metrics,
    spending_trend,
    category_trends,
    category_spikes,
    anomalies,
    recurring,
    health,
):
    signals = []

    # Spending trend
    change = spending_trend.get(
        "change_percent"
    )

    if change is not None:
        if change >= 20:
            signals.append(
                {
                    "type": "spending_increase",
                    "severity": "warning",
                    "priority": 80,

                    "title": "Spending increased",

                    "description": (
                        f"Your spending increased "
                        f"{change:.1f}% compared "
                        "with the previous month."
                    ),

                    "category": "Overall",

                    "impact": f"+{change:.1f}%",

                    "action": "Review",

                    "tone": "warning",

                    "evidence": spending_trend,
                }
            )

        elif change <= -10:
            signals.append(
                {
                    "type": "spending_decrease",
                    "severity": "positive",
                    "priority": 65,

                    "title": "Spending decreased",

                    "description": (
                        f"Your spending decreased "
                        f"{abs(change):.1f}% compared "
                        "with the previous month."
                    ),

                    "category": "Overall",

                    "impact": f"-{abs(change):.1f}%",

                    "action": "View",

                    "tone": "saving",

                    "evidence": spending_trend,
                }
            )

    # Category spikes
    for spike in category_spikes[:3]:
        change = spike["change_percent"]

        signals.append(
            {
                "type": "category_spike",
                "severity": "warning",
                "priority": 85,

                "title": (
                    f"{spike['category']} spending increased"
                ),

                "description": (
                    f"{spike['category']} spending is "
                    f"{change:.1f}% higher than the "
                    "previous month."
                ),

                "category": spike["category"],

                "impact": f"+{change:.1f}%",

                "action": "Review",

                "tone": "warning",

                "evidence": spike,
            }
        )

    # Anomalies
    for anomaly in anomalies.get(
        "alerts",
        [],
    )[:3]:
        signals.append(
            {
                "type": "unusual_transaction",
                "severity": "warning",
                "priority": 90,

                "title": anomaly["title"],
                "description": anomaly["description"],

                "category": anomaly["category"],

                "impact": anomaly["amount_display"],

                "action": "View",

                "tone": "warning",

                "evidence": anomaly,
            }
        )

    # Recurring duplicate
    duplicates = recurring.get(
        "duplicates",
        [],
    )

    if duplicates:
        duplicate = duplicates[0]

        signals.append(
            {
                "type": "duplicate_subscription",
                "severity": "warning",
                "priority": 75,

                "title": "Possible duplicate services",

                "description": (
                    f"You have {duplicate['count']} "
                    f"similar services in "
                    f"{duplicate['group']}."
                ),

                "category": duplicate["group"],

                "impact": "Review",

                "action": "Compare",

                "tone": "saving",

                "evidence": duplicate,
            }
        )

    # Strong savings
    savings_rate = float(
        metrics.get(
            "savings_rate",
            0,
        )
    )

    if savings_rate >= 25:
        signals.append(
            {
                "type": "strong_savings",
                "severity": "positive",
                "priority": 60,

                "title": "Healthy savings rate",

                "description": (
                    f"You saved approximately "
                    f"{savings_rate:.1f}% "
                    "of your income this period."
                ),

                "category": "Savings",

                "impact": f"{savings_rate:.1f}%",

                "action": "View",

                "tone": "saving",

                "evidence": {
                    "savings_rate": savings_rate,
                },
            }
        )

    # Health
    signals.append(
        {
            "type": "financial_health",
            "severity": "info",
            "priority": 50,

            "title": "Financial health score",

            "description": (
                f"Your Aura Financial Health Score "
                f"is {health['score']}/100."
            ),

            "category": "Health",

            "impact": f"{health['score']}/100",

            "action": "Review",

            "tone": "neutral",

            "evidence": health,
        }
    )

    return sorted(
        signals,
        key=lambda signal: signal["priority"],
        reverse=True,
    )