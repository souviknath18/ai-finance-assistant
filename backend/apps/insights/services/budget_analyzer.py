from calendar import monthrange
from datetime import date, timedelta
from decimal import Decimal, InvalidOperation

from django.db.models import Sum
from django.utils import timezone

from apps.budgets.models import Budget
from apps.insights.selectors.transaction_selector import (
    get_expense_transactions,
)
from apps.insights.services.analytics_service import (
    format_money,
)


ZERO = Decimal("0.00")


# ---------------------------------------------------------------------
# Decimal helpers
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


def normalize_amount(value) -> Decimal:
    """
    Aura may store expense transactions as negative amounts.

    Budget analytics should work with positive spending values.
    """

    return abs(
        to_decimal(value)
    )


# ---------------------------------------------------------------------
# Budget period helpers
# ---------------------------------------------------------------------

def get_budget_period_range(
    *,
    period: str,
    reference_date: date | None = None,
):
    """
    Resolve the active date range for a budget.

    Weekly:
        Monday -> Sunday

    Monthly:
        first day -> last day of month
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    if period == Budget.Period.WEEKLY:
        start_date = (
            reference_date
            - timedelta(
                days=reference_date.weekday()
            )
        )

        end_date = (
            start_date
            + timedelta(days=6)
        )

        return start_date, end_date

    start_date = reference_date.replace(
        day=1
    )

    end_date = date(
        reference_date.year,
        reference_date.month,
        monthrange(
            reference_date.year,
            reference_date.month,
        )[1],
    )

    return start_date, end_date


def get_elapsed_days(
    *,
    start_date: date,
    reference_date: date,
):
    """
    Number of days elapsed in a budget period, including today.
    """

    if reference_date < start_date:
        return 0

    return (
        reference_date - start_date
    ).days + 1


def get_total_period_days(
    *,
    start_date: date,
    end_date: date,
):
    """
    Total number of calendar days in a budget period.
    """

    return (
        end_date - start_date
    ).days + 1


# ---------------------------------------------------------------------
# Budget spending calculation
# ---------------------------------------------------------------------

def calculate_budget_spending(
    *,
    user,
    budget,
    start_date,
    end_date,
):
    """
    Calculate total expense spending against a budget category.
    """

    expenses = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
        .filter(
            category__iexact=(
                budget.category
            )
        )
    )

    raw_total = (
        expenses.aggregate(
            total=Sum("amount")
        )["total"]
        or ZERO
    )

    spent_amount = normalize_amount(
        raw_total
    )

    return {
        "spent_amount": spent_amount,

        "transaction_count": (
            expenses.count()
        ),
    }


# ---------------------------------------------------------------------
# Projection logic
# ---------------------------------------------------------------------

def calculate_projected_spend(
    *,
    spent_amount,
    start_date,
    end_date,
    reference_date=None,
):
    """
    Estimate spending at the end of the current budget period
    using current average daily spending.

    Example:

        spent = ₹6,000
        elapsed = 15 days
        month = 30 days

        projected = ₹12,000

    This is only a simple deterministic projection.
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    spent_amount = normalize_amount(
        spent_amount
    )

    elapsed_days = get_elapsed_days(
        start_date=start_date,
        reference_date=reference_date,
    )

    total_days = get_total_period_days(
        start_date=start_date,
        end_date=end_date,
    )

    if elapsed_days <= 0:
        return ZERO

    daily_average = (
        spent_amount
        / Decimal(elapsed_days)
    )

    projected = (
        daily_average
        * Decimal(total_days)
    )

    return projected.quantize(
        Decimal("0.01")
    )


# ---------------------------------------------------------------------
# Status logic
# ---------------------------------------------------------------------

def determine_budget_status(
    *,
    usage_percent,
    projected_usage_percent,
):
    """
    Determine current budget health.

    Priority:
        exceeded
        critical
        at_risk
        warning
        healthy
    """

    if usage_percent >= 100:
        return "exceeded"

    if usage_percent >= 90:
        return "critical"

    if projected_usage_percent >= 110:
        return "at_risk"

    if usage_percent >= 75:
        return "warning"

    if projected_usage_percent >= 100:
        return "at_risk"

    return "healthy"


def determine_risk_level(
    status,
):
    """
    Normalize status into a broader risk level.
    """

    if status == "exceeded":
        return "critical"

    if status == "critical":
        return "high"

    if status == "at_risk":
        return "high"

    if status == "warning":
        return "medium"

    return "low"


# ---------------------------------------------------------------------
# Single budget analysis
# ---------------------------------------------------------------------

def analyze_budget(
    *,
    user,
    budget,
    reference_date=None,
):
    """
    Analyze one active budget.

    Returns:
        limit
        spent
        remaining
        usage
        projected spend
        projected usage
        days remaining
        status
        risk
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    start_date, end_date = (
        get_budget_period_range(
            period=budget.period,
            reference_date=reference_date,
        )
    )

    spending = (
        calculate_budget_spending(
            user=user,
            budget=budget,
            start_date=start_date,
            end_date=end_date,
        )
    )

    spent_amount = (
        spending["spent_amount"]
    )

    limit_amount = to_decimal(
        budget.limit_amount
    )

    remaining_amount = (
        limit_amount
        - spent_amount
    )

    if limit_amount > ZERO:
        usage_percent = (
            spent_amount
            / limit_amount
            * Decimal("100")
        )
    else:
        usage_percent = ZERO

    usage_percent = round(
        float(usage_percent),
        2,
    )

    projected_spend = (
        calculate_projected_spend(
            spent_amount=spent_amount,
            start_date=start_date,
            end_date=end_date,
            reference_date=reference_date,
        )
    )

    if limit_amount > ZERO:
        projected_usage_percent = (
            projected_spend
            / limit_amount
            * Decimal("100")
        )
    else:
        projected_usage_percent = ZERO

    projected_usage_percent = round(
        float(projected_usage_percent),
        2,
    )

    projected_overage = max(
        projected_spend
        - limit_amount,
        ZERO,
    )

    days_remaining = max(
        (
            end_date
            - reference_date
        ).days,
        0,
    )

    status = determine_budget_status(
        usage_percent=usage_percent,
        projected_usage_percent=(
            projected_usage_percent
        ),
    )

    risk_level = determine_risk_level(
        status
    )

    return {
        "id": budget.id,

        "budget_id": (
            budget.budget_id
        ),

        "category": (
            budget.category
        ),

        "period": (
            budget.period
        ),

        "period_start": (
            start_date.isoformat()
        ),

        "period_end": (
            end_date.isoformat()
        ),

        "limit_amount": str(
            limit_amount
        ),

        "limit_display": (
            format_money(
                limit_amount
            )
        ),

        "spent_amount": str(
            spent_amount
        ),

        "spent_display": (
            format_money(
                spent_amount
            )
        ),

        "remaining_amount": str(
            remaining_amount
        ),

        "remaining_display": (
            format_money(
                remaining_amount
            )
        ),

        "usage_percent": (
            usage_percent
        ),

        "projected_spend": str(
            projected_spend
        ),

        "projected_spend_display": (
            format_money(
                projected_spend
            )
        ),

        "projected_usage_percent": (
            projected_usage_percent
        ),

        "projected_overage": str(
            projected_overage
        ),

        "projected_overage_display": (
            format_money(
                projected_overage
            )
        ),

        "transaction_count": (
            spending[
                "transaction_count"
            ]
        ),

        "days_remaining": (
            days_remaining
        ),

        "status": status,

        "risk_level": (
            risk_level
        ),
    }


# ---------------------------------------------------------------------
# Recommendation logic
# ---------------------------------------------------------------------

def build_budget_recommendation(
    budget_items,
):
    """
    Build a deterministic budget recommendation.

    AI can later rewrite or enrich this, but this always gives
    Aura a safe fallback.
    """

    if not budget_items:
        return {
            "title": (
                "Create your first budget"
            ),

            "description": (
                "Set category spending limits so Aura can "
                "track budget usage and warn you before "
                "you exceed them."
            ),
        }

    exceeded = [
        item
        for item in budget_items
        if item["status"] == "exceeded"
    ]

    if exceeded:
        item = max(
            exceeded,
            key=lambda row: (
                row[
                    "usage_percent"
                ]
            ),
        )

        return {
            "title": (
                f"{item['category']} budget exceeded"
            ),

            "description": (
                f"You have used "
                f"{item['usage_percent']:.0f}% of your "
                f"{item['category']} budget. "
                f"You are over the limit by "
                f"{format_money(abs(to_decimal(item['remaining_amount'])))}."
            ),
        }

    at_risk = [
        item
        for item in budget_items
        if item["status"]
        in {
            "critical",
            "at_risk",
        }
    ]

    if at_risk:
        item = max(
            at_risk,
            key=lambda row: (
                row[
                    "projected_usage_percent"
                ]
            ),
        )

        if (
            item[
                "projected_overage"
            ]
            != "0.00"
        ):
            description = (
                f"At your current pace, "
                f"{item['category']} spending may reach "
                f"{item['projected_spend_display']}, "
                f"about {item['projected_overage_display']} "
                "above your budget."
            )

        else:
            description = (
                f"You have already used "
                f"{item['usage_percent']:.0f}% of your "
                f"{item['category']} budget with "
                f"{item['days_remaining']} day(s) remaining."
            )

        return {
            "title": (
                f"{item['category']} budget is at risk"
            ),

            "description": description,
        }

    warning = [
        item
        for item in budget_items
        if item["status"] == "warning"
    ]

    if warning:
        item = max(
            warning,
            key=lambda row: (
                row[
                    "usage_percent"
                ]
            ),
        )

        return {
            "title": (
                f"Watch your {item['category']} budget"
            ),

            "description": (
                f"You have used "
                f"{item['usage_percent']:.0f}% of this budget "
                f"with {item['days_remaining']} day(s) "
                "remaining in the period."
            ),
        }

    return {
        "title": (
            "Your budgets look healthy"
        ),

        "description": (
            "Your active budgets are currently within "
            "their expected spending limits."
        ),
    }


# ---------------------------------------------------------------------
# Complete budget analysis
# ---------------------------------------------------------------------

def analyze_budgets(
    *,
    user,
    reference_date=None,
):
    """
    Build the complete budget intelligence bundle consumed by
    the Aura Insight Engine.
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    budgets = list(
        Budget.objects
        .filter(
            user=user,
            is_active=True,
        )
        .order_by(
            "category"
        )
    )

    budget_items = [
        analyze_budget(
            user=user,
            budget=budget,
            reference_date=reference_date,
        )
        for budget in budgets
    ]

    total_limit = sum(
        (
            to_decimal(
                item[
                    "limit_amount"
                ]
            )
            for item in budget_items
        ),
        ZERO,
    )

    total_spent = sum(
        (
            to_decimal(
                item[
                    "spent_amount"
                ]
            )
            for item in budget_items
        ),
        ZERO,
    )

    total_remaining = (
        total_limit
        - total_spent
    )

    if total_limit > ZERO:
        overall_usage = (
            total_spent
            / total_limit
            * Decimal("100")
        )

    else:
        overall_usage = ZERO

    overall_usage = round(
        float(overall_usage),
        2,
    )

    exceeded_items = [
        item
        for item in budget_items
        if item["status"] == "exceeded"
    ]

    at_risk_items = [
        item
        for item in budget_items
        if item["status"]
        in {
            "critical",
            "at_risk",
        }
    ]

    warning_items = [
        item
        for item in budget_items
        if item["status"] == "warning"
    ]

    healthy_items = [
        item
        for item in budget_items
        if item["status"] == "healthy"
    ]

    recommendation = (
        build_budget_recommendation(
            budget_items
        )
    )

    return {
        "summary": {
            "active_budgets": (
                len(budget_items)
            ),

            "total_limit": str(
                total_limit
            ),

            "total_limit_display": (
                format_money(
                    total_limit
                )
            ),

            "total_spent": str(
                total_spent
            ),

            "total_spent_display": (
                format_money(
                    total_spent
                )
            ),

            "total_remaining": str(
                total_remaining
            ),

            "total_remaining_display": (
                format_money(
                    total_remaining
                )
            ),

            "overall_usage_percent": (
                overall_usage
            ),

            "exceeded_count": (
                len(exceeded_items)
            ),

            "at_risk_count": (
                len(at_risk_items)
            ),

            "warning_count": (
                len(warning_items)
            ),

            "healthy_count": (
                len(healthy_items)
            ),
        },

        "items": budget_items,

        "exceeded": exceeded_items,

        "at_risk": at_risk_items,

        "warnings": warning_items,

        "healthy": healthy_items,

        "recommendation": (
            recommendation
        ),
    }