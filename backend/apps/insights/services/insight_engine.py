from decimal import Decimal, InvalidOperation

from django.utils.text import slugify


ZERO = Decimal("0.00")


# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------

def to_decimal(value) -> Decimal:
    """
    Safely convert a value into Decimal.
    """

    if value is None:
        return ZERO

    if isinstance(value, Decimal):
        return value

    try:
        return Decimal(str(value))

    except (InvalidOperation, TypeError, ValueError):
        return ZERO


def build_insight_id(
    insight_type: str,
    identifier: str | None = None,
):
    """
    Build a deterministic frontend-safe insight identifier.

    Examples:

        category_spike + Food
        -> category-spike-food

        unusual_transaction + TXN-123
        -> unusual-transaction-txn-123
    """

    base = slugify(
        insight_type
    )

    if not identifier:
        return base

    identifier_slug = slugify(
        str(identifier)
    )

    if not identifier_slug:
        return base

    return f"{base}-{identifier_slug}"


def build_action(
    *,
    label,
    url,
):
    """
    Standard action structure used by frontend components.
    """

    return {
        "label": label,
        "url": url,
    }


def build_impact(
    *,
    value,
    display,
    direction=None,
):
    """
    Standard impact structure.

    The frontend should not need to parse strings such as '+34%'.
    """

    impact = {
        "value": value,
        "display": display,
    }

    if direction:
        impact["direction"] = direction

    return impact


def add_signal(
    signals,
    *,
    insight_type,
    severity,
    priority,
    title,
    description,
    category=None,
    impact=None,
    action=None,
    evidence=None,
    identifier=None,
    confidence=None,
):
    """
    Add one normalized insight signal.
    """

    signal = {
        "id": build_insight_id(
            insight_type,
            identifier,
        ),

        "type": insight_type,

        "severity": severity,

        "priority": int(
            priority
        ),

        "title": title,

        "description": description,
    }

    if category:
        signal["category"] = category

    if impact:
        signal["impact"] = impact

    if action:
        signal["action"] = action

    if evidence:
        signal["evidence"] = evidence

    if confidence is not None:
        signal["confidence"] = float(
            confidence
        )

    signals.append(
        signal
    )


# ---------------------------------------------------------------------
# Spending trend insights
# ---------------------------------------------------------------------

def add_spending_trend_insights(
    *,
    signals,
    trends,
):
    spending = trends.get(
        "spending",
        {},
    )

    change = spending.get(
        "change_percent"
    )

    if change is None:
        return

    if change >= 20:
        add_signal(
            signals,

            insight_type=(
                "spending_increase"
            ),

            severity="warning",

            priority=78,

            title="Overall spending increased",

            description=(
                f"Your spending increased "
                f"{change:.1f}% compared with "
                "the previous period."
            ),

            category="Overall Spending",

            impact=build_impact(
                value=change,
                display=f"+{change:.1f}%",
                direction="up",
            ),

            action=build_action(
                label="View transactions",
                url="/transactions",
            ),

            evidence=spending,
        )

    elif change <= -10:
        add_signal(
            signals,

            insight_type=(
                "spending_decrease"
            ),

            severity="positive",

            priority=58,

            title="Overall spending decreased",

            description=(
                f"Your spending decreased "
                f"{abs(change):.1f}% compared "
                "with the previous period."
            ),

            category="Overall Spending",

            impact=build_impact(
                value=change,
                display=(
                    f"-{abs(change):.1f}%"
                ),
                direction="down",
            ),

            action=build_action(
                label="View trend",
                url="/insights",
            ),

            evidence=spending,
        )


# ---------------------------------------------------------------------
# Category insights
# ---------------------------------------------------------------------

def add_category_insights(
    *,
    signals,
    trends,
):
    category_spikes = trends.get(
        "category_spikes",
        [],
    )

    for spike in category_spikes[:3]:
        category = (
            spike.get("category")
            or "Uncategorized"
        )

        change = spike.get(
            "change_percent"
        )

        if change is None:
            continue

        add_signal(
            signals,

            insight_type=(
                "category_spike"
            ),

            severity="warning",

            priority=84,

            title=(
                f"{category} spending increased"
            ),

            description=(
                f"Your {category} spending "
                f"increased {change:.1f}% "
                "compared with the previous period."
            ),

            category=category,

            impact=build_impact(
                value=change,
                display=f"+{change:.1f}%",
                direction="up",
            ),

            action=build_action(
                label="View transactions",
                url=(
                    "/transactions"
                    f"?category={category}"
                ),
            ),

            evidence=spike,

            identifier=category,
        )

    decreases = trends.get(
        "category_decreases",
        [],
    )

    for decrease in decreases[:2]:
        category = (
            decrease.get("category")
            or "Uncategorized"
        )

        change = decrease.get(
            "change_percent"
        )

        if change is None:
            continue

        add_signal(
            signals,

            insight_type=(
                "category_decrease"
            ),

            severity="positive",

            priority=52,

            title=(
                f"{category} spending decreased"
            ),

            description=(
                f"Your {category} spending "
                f"decreased {abs(change):.1f}% "
                "compared with the previous period."
            ),

            category=category,

            impact=build_impact(
                value=change,
                display=(
                    f"-{abs(change):.1f}%"
                ),
                direction="down",
            ),

            action=build_action(
                label="View transactions",
                url=(
                    "/transactions"
                    f"?category={category}"
                ),
            ),

            evidence=decrease,

            identifier=category,
        )

    new_categories = trends.get(
        "new_categories",
        [],
    )

    for item in new_categories[:2]:
        category = (
            item.get("category")
            or "Uncategorized"
        )

        amount = to_decimal(
            item.get(
                "current_amount",
                ZERO,
            )
        )

        add_signal(
            signals,

            insight_type="new_category",

            severity="info",

            priority=48,

            title=(
                f"New spending in {category}"
            ),

            description=(
                f"{category} appeared as a new "
                "spending category this period."
            ),

            category=category,

            impact=build_impact(
                value=str(amount),

                display=(
                    item.get(
                        "current_display"
                    )
                    or str(amount)
                ),
            ),

            action=build_action(
                label="View transactions",
                url=(
                    "/transactions"
                    f"?category={category}"
                ),
            ),

            evidence=item,

            identifier=category,
        )


# ---------------------------------------------------------------------
# Merchant insights
# ---------------------------------------------------------------------

def add_merchant_insights(
    *,
    signals,
    trends,
):
    merchant_spikes = trends.get(
        "merchant_spikes",
        [],
    )

    for spike in merchant_spikes[:2]:
        merchant = (
            spike.get("merchant")
            or "Unknown merchant"
        )

        change = spike.get(
            "change_percent"
        )

        if change is None:
            continue

        add_signal(
            signals,

            insight_type=(
                "merchant_spike"
            ),

            severity="warning",

            priority=72,

            title=(
                f"Spending increased at {merchant}"
            ),

            description=(
                f"Your spending at {merchant} "
                f"increased {change:.1f}% compared "
                "with the previous period."
            ),

            category="Merchant",

            impact=build_impact(
                value=change,
                display=f"+{change:.1f}%",
                direction="up",
            ),

            action=build_action(
                label="View transactions",
                url=(
                    "/transactions"
                    f"?merchant={merchant}"
                ),
            ),

            evidence=spike,

            identifier=merchant,
        )


# ---------------------------------------------------------------------
# Anomaly insights
# ---------------------------------------------------------------------

def add_anomaly_insights(
    *,
    signals,
    anomalies,
):
    items = anomalies.get(
        "items",
        [],
    )

    for anomaly in items[:3]:
        transaction_id = (
            anomaly.get(
                "transaction_id"
            )
        )

        multiplier = anomaly.get(
            "multiplier"
        )

        confidence = None

        if multiplier is not None:
            confidence = min(
                0.99,
                0.60
                + min(
                    float(multiplier)
                    / 10,
                    0.39,
                ),
            )

        add_signal(
            signals,

            insight_type=(
                "unusual_transaction"
            ),

            severity="warning",

            priority=92,

            title=(
                anomaly.get("title")
                or "Unusual spending detected"
            ),

            description=(
                anomaly.get(
                    "description"
                )
                or (
                    "This transaction is unusual "
                    "compared with your historical "
                    "spending pattern."
                )
            ),

            category=(
                anomaly.get(
                    "category"
                )
                or "Uncategorized"
            ),

            impact=build_impact(
                value=(
                    anomaly.get(
                        "amount"
                    )
                ),

                display=(
                    anomaly.get(
                        "amount_display"
                    )
                    or "—"
                ),
            ),

            action=build_action(
                label="Review transaction",
                url=(
                    "/transactions"
                    f"?transaction_id={transaction_id}"
                    if transaction_id
                    else "/transactions"
                ),
            ),

            evidence=anomaly,

            identifier=(
                transaction_id
                or anomaly.get(
                    "merchant"
                )
            ),

            confidence=confidence,
        )


# ---------------------------------------------------------------------
# Recurring expense insights
# ---------------------------------------------------------------------

def add_recurring_insights(
    *,
    signals,
    recurring,
):
    duplicates = recurring.get(
        "duplicates",
        [],
    )

    for duplicate in duplicates[:2]:
        group = (
            duplicate.get("group")
            or "Subscriptions"
        )

        services = (
            duplicate.get(
                "services",
                [],
            )
            or []
        )

        count = int(
            duplicate.get(
                "count",
                len(services),
            )
            or 0
        )

        service_text = ", ".join(
            services
        )

        description = (
            f"You have {count} similar recurring "
            f"services in {group}."
        )

        if service_text:
            description += (
                f" Detected: {service_text}."
            )

        add_signal(
            signals,

            insight_type=(
                "duplicate_subscription"
            ),

            severity="warning",

            priority=76,

            title=(
                "Possible overlapping subscriptions"
            ),

            description=description,

            category=group,

            impact=build_impact(
                value=count,
                display=(
                    f"{count} services"
                ),
            ),

            action=build_action(
                label="Compare subscriptions",
                url="/subscriptions",
            ),

            evidence=duplicate,

            identifier=group,
        )

    upcoming = recurring.get(
        "upcoming_bills",
        [],
    )

    for item in upcoming[:2]:
        merchant = (
            item.get("merchant")
            or "Subscription"
        )

        days_remaining = item.get(
            "days_remaining"
        )

        if days_remaining is None:
            continue

        if days_remaining > 7:
            continue

        add_signal(
            signals,

            insight_type=(
                "upcoming_recurring_payment"
            ),

            severity="info",

            priority=55,

            title=(
                f"{merchant} payment is coming up"
            ),

            description=(
                f"{merchant} may charge "
                f"{item.get('amount_display', '—')} "
                f"in {days_remaining} day(s)."
            ),

            category="Subscriptions",

            impact=build_impact(
                value=item.get(
                    "amount"
                ),
                display=item.get(
                    "amount_display",
                    "—",
                ),
            ),

            action=build_action(
                label="View subscriptions",
                url="/subscriptions",
            ),

            evidence=item,

            identifier=merchant,
        )


# ---------------------------------------------------------------------
# Budget insights
# ---------------------------------------------------------------------

def add_budget_insights(
    *,
    signals,
    budgets,
):
    exceeded = budgets.get(
        "exceeded",
        [],
    )

    for budget in exceeded[:2]:
        category = (
            budget.get("category")
            or "Budget"
        )

        usage = float(
            budget.get(
                "usage_percent",
                0,
            )
            or 0
        )

        overage = (
            budget.get(
                "remaining_display"
            )
        )

        add_signal(
            signals,

            insight_type=(
                "budget_exceeded"
            ),

            severity="critical",

            priority=100,

            title=(
                f"{category} budget exceeded"
            ),

            description=(
                f"You have used {usage:.0f}% of "
                f"your {category} budget."
            ),

            category=category,

            impact=build_impact(
                value=usage,
                display=f"{usage:.0f}%",
                direction="up",
            ),

            action=build_action(
                label="View budget",
                url="/budgets",
            ),

            evidence=budget,

            identifier=(
                budget.get(
                    "budget_id"
                )
                or category
            ),
        )

    at_risk = budgets.get(
        "at_risk",
        [],
    )

    for budget in at_risk[:2]:
        category = (
            budget.get("category")
            or "Budget"
        )

        projected_usage = float(
            budget.get(
                "projected_usage_percent",
                0,
            )
            or 0
        )

        add_signal(
            signals,

            insight_type=(
                "budget_at_risk"
            ),

            severity="warning",

            priority=89,

            title=(
                f"{category} budget is at risk"
            ),

            description=(
                f"At your current pace, "
                f"{category} spending may reach "
                f"{budget.get('projected_spend_display', '—')} "
                "by the end of the budget period."
            ),

            category=category,

            impact=build_impact(
                value=projected_usage,
                display=(
                    f"{projected_usage:.0f}% projected"
                ),
                direction="up",
            ),

            action=build_action(
                label="View budget",
                url="/budgets",
            ),

            evidence=budget,

            identifier=(
                budget.get(
                    "budget_id"
                )
                or category
            ),
        )

    warnings = budgets.get(
        "warnings",
        [],
    )

    for budget in warnings[:1]:
        category = (
            budget.get("category")
            or "Budget"
        )

        usage = float(
            budget.get(
                "usage_percent",
                0,
            )
            or 0
        )

        add_signal(
            signals,

            insight_type=(
                "budget_warning"
            ),

            severity="warning",

            priority=70,

            title=(
                f"Watch your {category} budget"
            ),

            description=(
                f"You have already used "
                f"{usage:.0f}% of this budget "
                f"with {budget.get('days_remaining', 0)} "
                "day(s) remaining."
            ),

            category=category,

            impact=build_impact(
                value=usage,
                display=f"{usage:.0f}%",
                direction="up",
            ),

            action=build_action(
                label="View budget",
                url="/budgets",
            ),

            evidence=budget,

            identifier=(
                budget.get(
                    "budget_id"
                )
                or category
            ),
        )


# ---------------------------------------------------------------------
# Goal insights
# ---------------------------------------------------------------------

def add_goal_insights(
    *,
    signals,
    goals,
):
    overdue = goals.get(
        "overdue",
        [],
    )

    for goal in overdue[:1]:
        add_signal(
            signals,

            insight_type=(
                "goal_overdue"
            ),

            severity="critical",

            priority=96,

            title=(
                f"{goal['title']} is overdue"
            ),

            description=(
                f"The target date has passed and "
                f"{goal['remaining_amount_display']} "
                "is still needed."
            ),

            category="Goals",

            impact=build_impact(
                value=goal.get(
                    "remaining_amount"
                ),
                display=goal.get(
                    "remaining_amount_display",
                    "—",
                ),
            ),

            action=build_action(
                label="View goal",
                url="/goals",
            ),

            evidence=goal,

            identifier=(
                goal.get(
                    "goal_id"
                )
                or goal.get(
                    "title"
                )
            ),
        )

    at_risk = goals.get(
        "at_risk",
        [],
    )

    for goal in at_risk[:2]:
        required = (
            goal.get(
                "required_monthly_contribution_display"
            )
            or "a higher monthly contribution"
        )

        add_signal(
            signals,

            insight_type=(
                "goal_at_risk"
            ),

            severity="warning",

            priority=82,

            title=(
                f"{goal['title']} may fall behind"
            ),

            description=(
                f"You may need approximately "
                f"{required} per month to reach "
                "this goal by its target date."
            ),

            category="Goals",

            impact=build_impact(
                value=goal.get(
                    "progress_percent",
                    0,
                ),
                display=(
                    f"{goal.get('progress_percent', 0):.1f}% complete"
                ),
            ),

            action=build_action(
                label="View goal",
                url="/goals",
            ),

            evidence=goal,

            identifier=(
                goal.get(
                    "goal_id"
                )
                or goal.get(
                    "title"
                )
            ),
        )

    on_track = goals.get(
        "on_track",
        [],
    )

    if on_track:
        goal = max(
            on_track,
            key=lambda item: (
                item.get(
                    "progress_percent",
                    0,
                )
            ),
        )

        progress = float(
            goal.get(
                "progress_percent",
                0,
            )
            or 0
        )

        if progress >= 50:
            add_signal(
                signals,

                insight_type=(
                    "goal_progress"
                ),

                severity="positive",

                priority=46,

                title=(
                    f"{goal['title']} is on track"
                ),

                description=(
                    f"You have completed "
                    f"{progress:.1f}% of this goal."
                ),

                category="Goals",

                impact=build_impact(
                    value=progress,
                    display=(
                        f"{progress:.1f}%"
                    ),
                    direction="up",
                ),

                action=build_action(
                    label="View goal",
                    url="/goals",
                ),

                evidence=goal,

                identifier=(
                    goal.get(
                        "goal_id"
                    )
                    or goal.get(
                        "title"
                    )
                ),
            )


# ---------------------------------------------------------------------
# Savings / health insights
# ---------------------------------------------------------------------

def add_health_insights(
    *,
    signals,
    metrics,
    health,
):
    savings_rate = float(
        metrics.get(
            "savings_rate",
            0,
        )
        or 0
    )

    if savings_rate >= 25:
        add_signal(
            signals,

            insight_type=(
                "strong_savings"
            ),

            severity="positive",

            priority=62,

            title="Healthy savings rate",

            description=(
                f"You saved approximately "
                f"{savings_rate:.1f}% of your income "
                "during this period."
            ),

            category="Savings",

            impact=build_impact(
                value=savings_rate,
                display=(
                    f"{savings_rate:.1f}%"
                ),
                direction="up",
            ),

            action=build_action(
                label="View financial health",
                url="/insights",
            ),

            evidence={
                "savings_rate": (
                    savings_rate
                ),

                "savings": (
                    metrics.get(
                        "savings"
                    )
                ),

                "savings_display": (
                    metrics.get(
                        "savings_display"
                    )
                ),
            },
        )

    elif savings_rate < 0:
        add_signal(
            signals,

            insight_type=(
                "negative_savings"
            ),

            severity="critical",

            priority=98,

            title="Expenses exceeded income",

            description=(
                "Your expenses were higher than "
                "your income during this period."
            ),

            category="Cash Flow",

            impact=build_impact(
                value=savings_rate,
                display=(
                    f"{savings_rate:.1f}%"
                ),
                direction="down",
            ),

            action=build_action(
                label="Review spending",
                url="/transactions",
            ),

            evidence={
                "savings_rate": (
                    savings_rate
                ),

                "total_income": (
                    metrics.get(
                        "total_income"
                    )
                ),

                "total_expense": (
                    metrics.get(
                        "total_expense"
                    )
                ),
            },
        )

    score = int(
        health.get(
            "score",
            0,
        )
        or 0
    )

    status = (
        health.get(
            "status"
        )
        or "Unknown"
    )

    add_signal(
        signals,

        insight_type=(
            "financial_health"
        ),

        severity=(
            "positive"
            if score >= 70
            else (
                "warning"
                if score >= 50
                else "critical"
            )
        ),

        priority=40,

        title=(
            "Aura Financial Health Score"
        ),

        description=(
            f"Your financial health score is "
            f"{score}/100 and is currently "
            f"rated {status}."
        ),

        category="Financial Health",

        impact=build_impact(
            value=score,
            display=f"{score}/100",
        ),

        action=build_action(
            label="View score breakdown",
            url="/insights",
        ),

        evidence=health,
    )


# ---------------------------------------------------------------------
# Deduplication and prioritization
# ---------------------------------------------------------------------

def deduplicate_signals(
    signals,
):
    """
    Remove duplicate IDs while keeping the highest-priority version.
    """

    best = {}

    for signal in signals:
        signal_id = signal["id"]

        existing = best.get(
            signal_id
        )

        if (
            existing is None
            or signal["priority"]
            > existing["priority"]
        ):
            best[signal_id] = signal

    return list(
        best.values()
    )


def sort_signals(
    signals,
):
    """
    Highest-priority insights appear first.

    Severity is used as a secondary ordering factor.
    """

    severity_rank = {
        "critical": 4,
        "warning": 3,
        "positive": 2,
        "info": 1,
    }

    return sorted(
        signals,
        key=lambda signal: (
            signal.get(
                "priority",
                0,
            ),

            severity_rank.get(
                signal.get(
                    "severity"
                ),
                0,
            ),
        ),
        reverse=True,
    )


# ---------------------------------------------------------------------
# Public orchestration function
# ---------------------------------------------------------------------

def build_insight_signals(
    *,
    analytics,
    trends,
    anomalies,
    recurring,
    budgets,
    goals,
    health,
):
    """
    Convert all verified financial analytics into structured,
    prioritized Aura insights.

    No OpenAI is used here.

    Inputs:
        analytics
        trends
        anomalies
        recurring
        budgets
        goals
        health

    Output:
        list[InsightSignal]
    """

    signals = []

    metrics = analytics.get(
        "metrics",
        {},
    )

    add_spending_trend_insights(
        signals=signals,
        trends=trends,
    )

    add_category_insights(
        signals=signals,
        trends=trends,
    )

    add_merchant_insights(
        signals=signals,
        trends=trends,
    )

    add_anomaly_insights(
        signals=signals,
        anomalies=anomalies,
    )

    add_recurring_insights(
        signals=signals,
        recurring=recurring,
    )

    add_budget_insights(
        signals=signals,
        budgets=budgets,
    )

    add_goal_insights(
        signals=signals,
        goals=goals,
    )

    add_health_insights(
        signals=signals,
        metrics=metrics,
        health=health,
    )

    signals = deduplicate_signals(
        signals
    )

    signals = sort_signals(
        signals
    )

    return signals