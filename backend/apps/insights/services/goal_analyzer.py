from datetime import date
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from django.utils import timezone

from apps.goals.models import Goal
from apps.insights.services.analytics_service import (
    format_money,
)


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
    return max(
        minimum,
        min(value, maximum),
    )


def calculate_progress_percent(
    *,
    current_amount,
    target_amount,
):
    """
    Calculate goal completion percentage.
    """

    current_amount = to_decimal(
        current_amount
    )

    target_amount = to_decimal(
        target_amount
    )

    if target_amount <= ZERO:
        return 0.0

    progress = (
        current_amount
        / target_amount
        * Decimal("100")
    )

    return round(
        clamp(
            float(progress)
        ),
        2,
    )


def calculate_remaining_amount(
    *,
    current_amount,
    target_amount,
):
    """
    Calculate remaining amount required to reach a goal.
    """

    current_amount = to_decimal(
        current_amount
    )

    target_amount = to_decimal(
        target_amount
    )

    return max(
        target_amount - current_amount,
        ZERO,
    )


def calculate_days_remaining(
    *,
    target_date,
    reference_date=None,
):
    """
    Calculate number of calendar days until the goal target date.

    Returns None when no target date is configured.
    """

    if not target_date:
        return None

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    return (
        target_date
        - reference_date
    ).days


def calculate_months_remaining(
    *,
    target_date,
    reference_date=None,
):
    """
    Approximate number of months remaining until target date.

    A minimum of one month is returned for future dates
    within the current month.
    """

    if not target_date:
        return None

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    if target_date <= reference_date:
        return 0

    month_difference = (
        (target_date.year - reference_date.year) * 12
        + (
            target_date.month
            - reference_date.month
        )
    )

    if target_date.day > reference_date.day:
        month_difference += 1

    return max(
        month_difference,
        1,
    )


# ---------------------------------------------------------------------
# Goal pace calculations
# ---------------------------------------------------------------------

def calculate_required_monthly_contribution(
    *,
    remaining_amount,
    target_date,
    reference_date=None,
):
    """
    Calculate how much the user needs to contribute each month
    to reach the target by the configured target date.
    """

    remaining_amount = to_decimal(
        remaining_amount
    )

    if remaining_amount <= ZERO:
        return ZERO

    months_remaining = (
        calculate_months_remaining(
            target_date=target_date,
            reference_date=reference_date,
        )
    )

    if months_remaining is None:
        return None

    if months_remaining <= 0:
        return remaining_amount

    required = (
        remaining_amount
        / Decimal(months_remaining)
    )

    return required.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


def calculate_expected_completion_months(
    *,
    remaining_amount,
    monthly_average,
):
    """
    Estimate how many months are required to finish a goal
    at the user's current monthly contribution rate.
    """

    remaining_amount = to_decimal(
        remaining_amount
    )

    monthly_average = to_decimal(
        monthly_average
    )

    if remaining_amount <= ZERO:
        return 0

    if monthly_average <= ZERO:
        return None

    months = (
        remaining_amount
        / monthly_average
    )

    rounded_months = int(
        months.to_integral_value(
            rounding="ROUND_CEILING"
        )
    )

    return max(
        rounded_months,
        1,
    )


# ---------------------------------------------------------------------
# Goal status
# ---------------------------------------------------------------------

def determine_goal_status(
    *,
    progress_percent,
    current_amount,
    target_amount,
    target_date,
    monthly_average,
    required_monthly_contribution,
    reference_date=None,
):
    """
    Determine whether a goal is completed, overdue, on track,
    slightly behind, or at risk.
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    current_amount = to_decimal(
        current_amount
    )

    target_amount = to_decimal(
        target_amount
    )

    monthly_average = to_decimal(
        monthly_average
    )

    if (
        target_amount > ZERO
        and current_amount >= target_amount
    ):
        return "completed"

    if (
        target_date
        and target_date < reference_date
    ):
        return "overdue"

    if (
        required_monthly_contribution is None
        or target_date is None
    ):
        if progress_percent >= 75:
            return "on_track"

        if progress_percent >= 40:
            return "progressing"

        return "needs_attention"

    required_monthly_contribution = (
        to_decimal(
            required_monthly_contribution
        )
    )

    if required_monthly_contribution <= ZERO:
        return "on_track"

    if monthly_average >= required_monthly_contribution:
        return "on_track"

    ratio = (
        monthly_average
        / required_monthly_contribution
    )

    if ratio >= Decimal("0.75"):
        return "slightly_behind"

    return "at_risk"


def determine_goal_risk_level(
    status,
):
    """
    Convert detailed goal status into a generic risk level.
    """

    if status in {
        "completed",
        "on_track",
    }:
        return "low"

    if status in {
        "progressing",
        "slightly_behind",
    }:
        return "medium"

    if status in {
        "needs_attention",
        "at_risk",
        "overdue",
    }:
        return "high"

    return "low"


# ---------------------------------------------------------------------
# Single goal analysis
# ---------------------------------------------------------------------

def analyze_goal(
    *,
    goal,
    reference_date=None,
):
    """
    Analyze one Goal model instance.
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    target_amount = to_decimal(
        goal.target_amount
    )

    current_amount = to_decimal(
        goal.current_amount
    )

    monthly_average = to_decimal(
        goal.monthly_average
    )

    remaining_amount = (
        calculate_remaining_amount(
            current_amount=current_amount,
            target_amount=target_amount,
        )
    )

    progress_percent = (
        calculate_progress_percent(
            current_amount=current_amount,
            target_amount=target_amount,
        )
    )

    days_remaining = (
        calculate_days_remaining(
            target_date=goal.target_date,
            reference_date=reference_date,
        )
    )

    months_remaining = (
        calculate_months_remaining(
            target_date=goal.target_date,
            reference_date=reference_date,
        )
    )

    required_monthly = (
        calculate_required_monthly_contribution(
            remaining_amount=remaining_amount,
            target_date=goal.target_date,
            reference_date=reference_date,
        )
    )

    expected_completion_months = (
        calculate_expected_completion_months(
            remaining_amount=remaining_amount,
            monthly_average=monthly_average,
        )
    )

    status = determine_goal_status(
        progress_percent=progress_percent,
        current_amount=current_amount,
        target_amount=target_amount,
        target_date=goal.target_date,
        monthly_average=monthly_average,
        required_monthly_contribution=required_monthly,
        reference_date=reference_date,
    )

    risk_level = (
        determine_goal_risk_level(
            status
        )
    )

    monthly_gap = None

    if required_monthly is not None:
        monthly_gap = max(
            required_monthly
            - monthly_average,
            ZERO,
        )

    category_name = (
        goal.category.name
        if goal.category
        else None
    )

    return {
        "id": goal.id,

        "goal_id": goal.goal_id,

        "title": goal.title,

        "goal_type": goal.goal_type,

        "priority": goal.priority,

        "category": (
            goal.category_id
        ),

        "category_name": (
            category_name
        ),

        "target_amount": str(
            target_amount
        ),

        "target_amount_display": (
            format_money(
                target_amount
            )
        ),

        "current_amount": str(
            current_amount
        ),

        "current_amount_display": (
            format_money(
                current_amount
            )
        ),

        "remaining_amount": str(
            remaining_amount
        ),

        "remaining_amount_display": (
            format_money(
                remaining_amount
            )
        ),

        "monthly_average": str(
            monthly_average
        ),

        "monthly_average_display": (
            format_money(
                monthly_average
            )
        ),

        "progress_percent": (
            progress_percent
        ),

        "target_date": (
            goal.target_date.isoformat()
            if goal.target_date
            else None
        ),

        "days_remaining": (
            days_remaining
        ),

        "months_remaining": (
            months_remaining
        ),

        "required_monthly_contribution": (
            str(required_monthly)
            if required_monthly is not None
            else None
        ),

        "required_monthly_contribution_display": (
            format_money(
                required_monthly
            )
            if required_monthly is not None
            else None
        ),

        "monthly_gap": (
            str(monthly_gap)
            if monthly_gap is not None
            else None
        ),

        "monthly_gap_display": (
            format_money(
                monthly_gap
            )
            if monthly_gap is not None
            else None
        ),

        "expected_completion_months": (
            expected_completion_months
        ),

        "status": status,

        "risk_level": risk_level,

        "ai_recommendations_enabled": (
            goal.ai_recommendations_enabled
        ),
    }


# ---------------------------------------------------------------------
# Recommendation generation
# ---------------------------------------------------------------------

def build_goal_recommendation(
    goals,
):
    """
    Build deterministic goal guidance.

    OpenAI can later improve the wording, but the system always
    has a safe fallback recommendation.
    """

    if not goals:
        return {
            "title": (
                "Create your first financial goal"
            ),

            "description": (
                "Set a savings, purchase, travel, debt, "
                "or investment goal so Aura can track "
                "your progress and required monthly pace."
            ),
        }

    overdue = [
        goal
        for goal in goals
        if goal["status"] == "overdue"
    ]

    if overdue:
        goal = sorted(
            overdue,
            key=lambda item: (
                item["priority"] != Goal.Priority.HIGH,
                -float(
                    item["remaining_amount"]
                ),
            ),
        )[0]

        return {
            "title": (
                f"{goal['title']} needs attention"
            ),

            "description": (
                f"The target date has passed and "
                f"{goal['remaining_amount_display']} "
                "is still needed to complete this goal."
            ),
        }

    at_risk = [
        goal
        for goal in goals
        if goal["status"] == "at_risk"
    ]

    if at_risk:
        goal = sorted(
            at_risk,
            key=lambda item: (
                item["priority"] != Goal.Priority.HIGH,
                -float(
                    item["remaining_amount"]
                ),
            ),
        )[0]

        required_display = (
            goal[
                "required_monthly_contribution_display"
            ]
            or "a higher monthly contribution"
        )

        return {
            "title": (
                f"{goal['title']} may fall behind"
            ),

            "description": (
                f"You may need approximately "
                f"{required_display} per month "
                "to reach this goal by its target date."
            ),
        }

    slightly_behind = [
        goal
        for goal in goals
        if goal["status"]
        == "slightly_behind"
    ]

    if slightly_behind:
        goal = slightly_behind[0]

        return {
            "title": (
                f"{goal['title']} is slightly behind"
            ),

            "description": (
                f"Your current monthly pace is close to "
                f"the required "
                f"{goal['required_monthly_contribution_display']}."
            ),
        }

    active_goals = [
        goal
        for goal in goals
        if goal["status"] != "completed"
    ]

    if active_goals:
        priority_order = {
            Goal.Priority.HIGH: 0,
            Goal.Priority.MEDIUM: 1,
            Goal.Priority.LOW: 2,
        }

        goal = sorted(
            active_goals,
            key=lambda item: (
                priority_order.get(
                    item["priority"],
                    3,
                ),
                -item[
                    "progress_percent"
                ],
            ),
        )[0]

        return {
            "title": (
                f"{goal['title']} is making progress"
            ),

            "description": (
                f"You have completed "
                f"{goal['progress_percent']:.1f}% "
                f"of this goal with "
                f"{goal['remaining_amount_display']} remaining."
            ),
        }

    return {
        "title": (
            "Your active goals are complete"
        ),

        "description": (
            "You have reached all currently active "
            "financial goal targets."
        ),
    }


# ---------------------------------------------------------------------
# Complete goal analysis
# ---------------------------------------------------------------------

def analyze_goals(
    *,
    user,
    reference_date=None,
):
    """
    Build the complete goal intelligence bundle consumed
    by the Aura Insight Engine.
    """

    reference_date = (
        reference_date
        or timezone.localdate()
    )

    goals = list(
        Goal.objects
        .filter(
            user=user,
            is_active=True,
        )
        .select_related(
            "category"
        )
        .order_by(
            "priority",
            "target_date",
            "-created_at",
        )
    )

    analyzed_goals = [
        analyze_goal(
            goal=goal,
            reference_date=reference_date,
        )
        for goal in goals
    ]

    completed = [
        goal
        for goal in analyzed_goals
        if goal["status"] == "completed"
    ]

    on_track = [
        goal
        for goal in analyzed_goals
        if goal["status"] == "on_track"
    ]

    progressing = [
        goal
        for goal in analyzed_goals
        if goal["status"] == "progressing"
    ]

    slightly_behind = [
        goal
        for goal in analyzed_goals
        if goal["status"]
        == "slightly_behind"
    ]

    at_risk = [
        goal
        for goal in analyzed_goals
        if goal["status"] == "at_risk"
    ]

    overdue = [
        goal
        for goal in analyzed_goals
        if goal["status"] == "overdue"
    ]

    needs_attention = [
        goal
        for goal in analyzed_goals
        if goal["status"]
        == "needs_attention"
    ]

    total_target = sum(
        (
            to_decimal(
                goal[
                    "target_amount"
                ]
            )
            for goal in analyzed_goals
        ),
        ZERO,
    )

    total_current = sum(
        (
            to_decimal(
                goal[
                    "current_amount"
                ]
            )
            for goal in analyzed_goals
        ),
        ZERO,
    )

    total_remaining = sum(
        (
            to_decimal(
                goal[
                    "remaining_amount"
                ]
            )
            for goal in analyzed_goals
        ),
        ZERO,
    )

    if total_target > ZERO:
        overall_progress = (
            total_current
            / total_target
            * Decimal("100")
        )
    else:
        overall_progress = ZERO

    overall_progress = round(
        clamp(
            float(
                overall_progress
            )
        ),
        2,
    )

    recommendation = (
        build_goal_recommendation(
            analyzed_goals
        )
    )

    return {
        "summary": {
            "active_goals": (
                len(analyzed_goals)
            ),

            "completed_count": (
                len(completed)
            ),

            "on_track_count": (
                len(on_track)
            ),

            "progressing_count": (
                len(progressing)
            ),

            "slightly_behind_count": (
                len(
                    slightly_behind
                )
            ),

            "at_risk_count": (
                len(at_risk)
            ),

            "overdue_count": (
                len(overdue)
            ),

            "needs_attention_count": (
                len(
                    needs_attention
                )
            ),

            "total_target": str(
                total_target
            ),

            "total_target_display": (
                format_money(
                    total_target
                )
            ),

            "total_current": str(
                total_current
            ),

            "total_current_display": (
                format_money(
                    total_current
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

            "overall_progress_percent": (
                overall_progress
            ),
        },

        "items": analyzed_goals,

        "completed": completed,

        "on_track": on_track,

        "progressing": progressing,

        "slightly_behind": (
            slightly_behind
        ),

        "at_risk": at_risk,

        "overdue": overdue,

        "needs_attention": (
            needs_attention
        ),

        "recommendation": (
            recommendation
        ),
    }