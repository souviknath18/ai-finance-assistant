from decimal import Decimal, InvalidOperation


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


def clamp(
    value,
    minimum=0,
    maximum=100,
):
    """
    Keep a numeric value inside the requested range.
    """

    return max(
        minimum,
        min(value, maximum),
    )


def normalize_component_score(
    score,
    max_score,
):
    """
    Convert a component score into a 0-100 percentage.

    Example:
        28 / 35 -> 80
    """

    if max_score <= 0:
        return 0

    return round(
        clamp(
            (score / max_score) * 100
        ),
        1,
    )


def component_status(
    score_percent,
):
    """
    Convert a 0-100 component score into a simple status.
    """

    if score_percent >= 80:
        return "good"

    if score_percent >= 60:
        return "fair"

    return "low"


# ---------------------------------------------------------------------
# Savings score
# Maximum: 25
# ---------------------------------------------------------------------

def calculate_savings_score(
    *,
    savings_rate,
):
    """
    Score based on how much of income is retained.

    Max: 25 points.
    """

    savings_rate = float(
        savings_rate or 0
    )

    if savings_rate >= 30:
        score = 25

    elif savings_rate >= 20:
        score = 21

    elif savings_rate >= 15:
        score = 17

    elif savings_rate >= 10:
        score = 13

    elif savings_rate > 0:
        score = 7

    else:
        score = 0

    return {
        "score": score,
        "max_score": 25,
        "percentage": normalize_component_score(
            score,
            25,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                25,
            )
        ),
    }


# ---------------------------------------------------------------------
# Cash-flow score
# Maximum: 20
# ---------------------------------------------------------------------

def calculate_cashflow_score(
    *,
    total_income,
    total_expense,
):
    """
    Score based on expense-to-income ratio.

    Max: 20 points.
    """

    income = to_decimal(
        total_income
    )

    expenses = to_decimal(
        total_expense
    )

    if income <= ZERO:
        score = 4

        return {
            "score": score,
            "max_score": 20,
            "percentage": normalize_component_score(
                score,
                20,
            ),
            "status": component_status(
                normalize_component_score(
                    score,
                    20,
                )
            ),
            "expense_to_income_percent": None,
        }

    ratio = (
        expenses
        / income
        * Decimal("100")
    )

    ratio_float = round(
        float(ratio),
        2,
    )

    if ratio_float <= 60:
        score = 20

    elif ratio_float <= 70:
        score = 17

    elif ratio_float <= 80:
        score = 14

    elif ratio_float <= 90:
        score = 10

    elif ratio_float <= 100:
        score = 6

    else:
        score = 0

    return {
        "score": score,
        "max_score": 20,
        "percentage": normalize_component_score(
            score,
            20,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                20,
            )
        ),
        "expense_to_income_percent": (
            ratio_float
        ),
    }


# ---------------------------------------------------------------------
# Spending stability score
# Maximum: 15
# ---------------------------------------------------------------------

def calculate_stability_score(
    *,
    spending_trend,
):
    """
    Score based on month-over-month spending movement.

    Large spending increases reduce the score.
    Lower or stable spending improves it.

    Max: 15 points.
    """

    change = spending_trend.get(
        "change_percent"
    )

    if change is None:
        score = 9

    elif change <= -10:
        score = 15

    elif change <= 5:
        score = 14

    elif change <= 15:
        score = 11

    elif change <= 25:
        score = 8

    elif change <= 40:
        score = 5

    else:
        score = 2

    return {
        "score": score,
        "max_score": 15,
        "percentage": normalize_component_score(
            score,
            15,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                15,
            )
        ),
        "spending_change_percent": (
            change
        ),
    }


# ---------------------------------------------------------------------
# Recurring burden score
# Maximum: 10
# ---------------------------------------------------------------------

def calculate_recurring_score(
    *,
    total_income,
    recurring,
):
    """
    Score based on estimated recurring monthly expenses
    relative to monthly income.

    Max: 10 points.
    """

    income = to_decimal(
        total_income
    )

    recurring_total = to_decimal(
        recurring.get(
            "monthly_total",
            ZERO,
        )
    )

    if income <= ZERO:
        score = 6
        ratio_float = None

    else:
        ratio = (
            recurring_total
            / income
            * Decimal("100")
        )

        ratio_float = round(
            float(ratio),
            2,
        )

        if ratio_float <= 10:
            score = 10

        elif ratio_float <= 20:
            score = 8

        elif ratio_float <= 30:
            score = 6

        elif ratio_float <= 40:
            score = 3

        else:
            score = 1

    duplicate_count = int(
        recurring.get(
            "duplicate_count",
            0,
        )
        or 0
    )

    if duplicate_count > 0:
        score = max(
            score - 1,
            0,
        )

    return {
        "score": score,
        "max_score": 10,
        "percentage": normalize_component_score(
            score,
            10,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                10,
            )
        ),
        "recurring_to_income_percent": (
            ratio_float
        ),
        "duplicate_count": (
            duplicate_count
        ),
    }


# ---------------------------------------------------------------------
# Anomaly score
# Maximum: 10
# ---------------------------------------------------------------------

def calculate_anomaly_score(
    *,
    anomalies,
):
    """
    Penalize repeated unusual spending.

    Max: 10 points.
    """

    count = int(
        anomalies.get(
            "count",
            0,
        )
        or 0
    )

    if count == 0:
        score = 10

    elif count == 1:
        score = 8

    elif count == 2:
        score = 6

    elif count <= 4:
        score = 3

    else:
        score = 1

    return {
        "score": score,
        "max_score": 10,
        "percentage": normalize_component_score(
            score,
            10,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                10,
            )
        ),
        "anomaly_count": count,
    }


# ---------------------------------------------------------------------
# Budget score
# Maximum: 10
# ---------------------------------------------------------------------

def calculate_budget_score(
    *,
    budgets,
):
    """
    Score based on budget adherence and projected risk.

    Max: 10 points.
    """

    summary = budgets.get(
        "summary",
        {},
    )

    active_budgets = int(
        summary.get(
            "active_budgets",
            0,
        )
        or 0
    )

    if active_budgets == 0:
        score = 6

        return {
            "score": score,
            "max_score": 10,
            "percentage": normalize_component_score(
                score,
                10,
            ),
            "status": component_status(
                normalize_component_score(
                    score,
                    10,
                )
            ),
            "active_budgets": 0,
            "exceeded_count": 0,
            "at_risk_count": 0,
            "warning_count": 0,
        }

    exceeded_count = int(
        summary.get(
            "exceeded_count",
            0,
        )
        or 0
    )

    at_risk_count = int(
        summary.get(
            "at_risk_count",
            0,
        )
        or 0
    )

    warning_count = int(
        summary.get(
            "warning_count",
            0,
        )
        or 0
    )

    healthy_count = int(
        summary.get(
            "healthy_count",
            0,
        )
        or 0
    )

    if exceeded_count > 0:
        score = max(
            2 - (exceeded_count - 1),
            0,
        )

    elif at_risk_count > 0:
        score = max(
            6 - (at_risk_count - 1),
            3,
        )

    elif warning_count > 0:
        score = 8

    elif healthy_count == active_budgets:
        score = 10

    else:
        score = 7

    return {
        "score": score,
        "max_score": 10,
        "percentage": normalize_component_score(
            score,
            10,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                10,
            )
        ),
        "active_budgets": active_budgets,
        "exceeded_count": exceeded_count,
        "at_risk_count": at_risk_count,
        "warning_count": warning_count,
    }


# ---------------------------------------------------------------------
# Goal score
# Maximum: 10
# ---------------------------------------------------------------------

def calculate_goal_score(
    *,
    goals,
):
    """
    Score based on active goal progress and risk.

    Max: 10 points.
    """

    summary = goals.get(
        "summary",
        {},
    )

    active_goals = int(
        summary.get(
            "active_goals",
            0,
        )
        or 0
    )

    if active_goals == 0:
        score = 6

        return {
            "score": score,
            "max_score": 10,
            "percentage": normalize_component_score(
                score,
                10,
            ),
            "status": component_status(
                normalize_component_score(
                    score,
                    10,
                )
            ),
            "active_goals": 0,
            "at_risk_count": 0,
            "overdue_count": 0,
            "on_track_count": 0,
        }

    overdue_count = int(
        summary.get(
            "overdue_count",
            0,
        )
        or 0
    )

    at_risk_count = int(
        summary.get(
            "at_risk_count",
            0,
        )
        or 0
    )

    slightly_behind_count = int(
        summary.get(
            "slightly_behind_count",
            0,
        )
        or 0
    )

    on_track_count = int(
        summary.get(
            "on_track_count",
            0,
        )
        or 0
    )

    completed_count = int(
        summary.get(
            "completed_count",
            0,
        )
        or 0
    )

    if overdue_count > 0:
        score = max(
            2 - (overdue_count - 1),
            0,
        )

    elif at_risk_count > 0:
        score = 4

    elif slightly_behind_count > 0:
        score = 7

    elif (
        on_track_count
        + completed_count
        >= active_goals
    ):
        score = 10

    else:
        score = 8

    return {
        "score": score,
        "max_score": 10,
        "percentage": normalize_component_score(
            score,
            10,
        ),
        "status": component_status(
            normalize_component_score(
                score,
                10,
            )
        ),
        "active_goals": active_goals,
        "at_risk_count": at_risk_count,
        "overdue_count": overdue_count,
        "on_track_count": on_track_count,
    }


# ---------------------------------------------------------------------
# Overall status
# ---------------------------------------------------------------------

def determine_health_status(
    score,
):
    """
    Human-readable overall financial health status.
    """

    if score >= 85:
        return "Excellent"

    if score >= 70:
        return "Healthy"

    if score >= 50:
        return "Fair"

    if score >= 30:
        return "Needs Attention"

    return "Critical"


# ---------------------------------------------------------------------
# Strengths / concerns
# ---------------------------------------------------------------------

def build_health_strengths(
    breakdown,
):
    """
    Return the strongest financial health areas.
    """

    labels = {
        "savings": "Savings",
        "cashflow": "Cash Flow",
        "stability": "Spending Stability",
        "recurring": "Recurring Costs",
        "anomalies": "Spending Consistency",
        "budgets": "Budget Management",
        "goals": "Goal Progress",
    }

    ranked = sorted(
        breakdown.items(),
        key=lambda item: (
            item[1]["percentage"]
        ),
        reverse=True,
    )

    return [
        {
            "key": key,
            "label": labels[key],
            "score_percent": data[
                "percentage"
            ],
        }
        for key, data in ranked
        if data["percentage"] >= 75
    ][:3]


def build_health_concerns(
    breakdown,
):
    """
    Return the weakest financial health areas.
    """

    labels = {
        "savings": "Savings",
        "cashflow": "Cash Flow",
        "stability": "Spending Stability",
        "recurring": "Recurring Costs",
        "anomalies": "Spending Consistency",
        "budgets": "Budget Management",
        "goals": "Goal Progress",
    }

    ranked = sorted(
        breakdown.items(),
        key=lambda item: (
            item[1]["percentage"]
        ),
    )

    return [
        {
            "key": key,
            "label": labels[key],
            "score_percent": data[
                "percentage"
            ],
        }
        for key, data in ranked
        if data["percentage"] < 60
    ][:3]


# ---------------------------------------------------------------------
# Overall financial health calculation
# ---------------------------------------------------------------------

def calculate_financial_health(
    *,
    metrics,
    trends,
    anomalies,
    recurring,
    budgets,
    goals,
):
    """
    Calculate Aura's explainable Financial Health Score.

    Total possible score: 100

        Savings             25
        Cash Flow           20
        Spending Stability  15
        Recurring Costs     10
        Anomalies           10
        Budgets             10
        Goals               10
        ----------------------
        Total              100
    """

    savings = calculate_savings_score(
        savings_rate=(
            metrics.get(
                "savings_rate",
                0,
            )
        )
    )

    cashflow = (
        calculate_cashflow_score(
            total_income=(
                metrics.get(
                    "total_income",
                    ZERO,
                )
            ),
            total_expense=(
                metrics.get(
                    "total_expense",
                    ZERO,
                )
            ),
        )
    )

    stability = (
        calculate_stability_score(
            spending_trend=(
                trends.get(
                    "spending",
                    {},
                )
            )
        )
    )

    recurring_score = (
        calculate_recurring_score(
            total_income=(
                metrics.get(
                    "total_income",
                    ZERO,
                )
            ),
            recurring=recurring,
        )
    )

    anomaly_score = (
        calculate_anomaly_score(
            anomalies=anomalies
        )
    )

    budget_score = (
        calculate_budget_score(
            budgets=budgets
        )
    )

    goal_score = (
        calculate_goal_score(
            goals=goals
        )
    )

    breakdown = {
        "savings": savings,

        "cashflow": cashflow,

        "stability": stability,

        "recurring": (
            recurring_score
        ),

        "anomalies": (
            anomaly_score
        ),

        "budgets": (
            budget_score
        ),

        "goals": (
            goal_score
        ),
    }

    total_score = sum(
        component["score"]
        for component
        in breakdown.values()
    )

    total_score = int(
        clamp(
            round(
                total_score
            )
        )
    )

    status = (
        determine_health_status(
            total_score
        )
    )

    strengths = (
        build_health_strengths(
            breakdown
        )
    )

    concerns = (
        build_health_concerns(
            breakdown
        )
    )

    return {
        "score": (
            total_score
        ),

        "status": status,

        "savings_rate": float(
            metrics.get(
                "savings_rate",
                0,
            )
            or 0
        ),

        "breakdown": breakdown,

        "strengths": strengths,

        "concerns": concerns,

        "methodology": {
            "savings_max": 25,
            "cashflow_max": 20,
            "stability_max": 15,
            "recurring_max": 10,
            "anomalies_max": 10,
            "budgets_max": 10,
            "goals_max": 10,
            "total_max": 100,
        },
    }