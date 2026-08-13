import json
import logging
from calendar import monthrange
from datetime import date, timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.insights.models import InsightSnapshot

from apps.insights.services.analytics_service import (
    build_period_analytics,
    calculate_monthly_spending,
    get_current_month_period,
    get_previous_month_period,
)

from apps.insights.services.trend_analyzer import (
    build_trend_analysis,
)

from apps.insights.services.anomaly_detector import (
    detect_anomalies,
)

from apps.insights.services.recurring_detector import (
    analyze_recurring_expenses,
)

from apps.insights.services.budget_analyzer import (
    analyze_budgets,
)

from apps.insights.services.goal_analyzer import (
    analyze_goals,
)

from apps.insights.services.financial_health import (
    calculate_financial_health,
)

from apps.insights.services.insight_engine import (
    build_insight_signals,
)

from apps.insights.services.evidence_builder import (
    build_evidence_package,
    build_supporting_evidence,
)

from apps.insights.services.insight_generator import (
    enrich_top_signals_with_ai,
    generate_executive_summary,
)


logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------
# Period handling
# ---------------------------------------------------------------------

def _is_full_calendar_month(
    start_date: date,
    end_date: date,
) -> bool:
    """
    Check whether the selected period represents one full calendar month.

    Example:
        2026-08-01 -> 2026-08-31
    """

    if (
        start_date.year != end_date.year
        or start_date.month != end_date.month
    ):
        return False

    last_day = monthrange(
        start_date.year,
        start_date.month,
    )[1]

    return (
        start_date.day == 1
        and end_date.day == last_day
    )


def resolve_period_preset(
    *,
    period="this_month",
    start_date=None,
    end_date=None,
):
    """
    Convert a frontend period preset into concrete dates.

    Supported values:
        this_month
        last_month
        last_3_months
        this_year
        custom
    """

    today = timezone.localdate()

    # -------------------------------------------------------------
    # Custom
    # -------------------------------------------------------------

    if period == "custom":
        if not start_date or not end_date:
            raise ValueError(
                "Custom period requires start_date and end_date."
            )

        if start_date > end_date:
            raise ValueError(
                "start_date cannot be after end_date."
            )

        return start_date, end_date

    # -------------------------------------------------------------
    # This month
    # -------------------------------------------------------------

    if period == "this_month":
        resolved_start = today.replace(
            day=1
        )

        resolved_end = today

        return (
            resolved_start,
            resolved_end,
        )

    # -------------------------------------------------------------
    # Last month
    # -------------------------------------------------------------

    if period == "last_month":
        current_month_start = (
            today.replace(day=1)
        )

        resolved_end = (
            current_month_start
            - timedelta(days=1)
        )

        resolved_start = (
            resolved_end.replace(
                day=1
            )
        )

        return (
            resolved_start,
            resolved_end,
        )

    # -------------------------------------------------------------
    # Last 3 months
    # -------------------------------------------------------------

    if period == "last_3_months":
        month = today.month - 2
        year = today.year

        while month <= 0:
            month += 12
            year -= 1

        resolved_start = date(
            year,
            month,
            1,
        )

        resolved_end = today

        return (
            resolved_start,
            resolved_end,
        )

    # -------------------------------------------------------------
    # This year
    # -------------------------------------------------------------

    if period == "this_year":
        resolved_start = date(
            today.year,
            1,
            1,
        )

        resolved_end = today

        return (
            resolved_start,
            resolved_end,
        )

    raise ValueError(
        f"Unsupported insight period: {period}"
    )


def resolve_insight_periods(
    *,
    start_date=None,
    end_date=None,
):
    """
    Resolve the requested analysis period and comparison period.

    Default:
        current calendar month
        compared with previous calendar month

    Custom range:
        compared with an immediately preceding range
        of the same number of days.
    """

    if start_date is None and end_date is None:
        start_date, end_date = (
            get_current_month_period()
        )

    elif start_date is None or end_date is None:
        raise ValueError(
            "Both start_date and end_date must be provided."
        )

    if start_date > end_date:
        raise ValueError(
            "start_date cannot be after end_date."
        )

    if _is_full_calendar_month(
        start_date,
        end_date,
    ):
        comparison_start, comparison_end = (
            get_previous_month_period(
                start_date
            )
        )

    else:
        period_days = (
            end_date - start_date
        ).days + 1

        comparison_end = (
            start_date
            - timedelta(days=1)
        )

        comparison_start = (
            comparison_end
            - timedelta(
                days=period_days - 1
            )
        )

    return {
        "current": {
            "start": start_date,
            "end": end_date,
        },

        "comparison": {
            "start": comparison_start,
            "end": comparison_end,
        },
    }


# ---------------------------------------------------------------------
# JSON helpers
# ---------------------------------------------------------------------

def _json_default(value):
    """
    Convert non-JSON-native values safely.
    """

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, (date,)):
        return value.isoformat()

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return str(value)


def make_json_safe(data):
    """
    Convert the complete dashboard payload into values safe
    for Django JSONField and DRF JSON responses.
    """

    return json.loads(
        json.dumps(
            data,
            default=_json_default,
        )
    )


# ---------------------------------------------------------------------
# Response builders
# ---------------------------------------------------------------------

def build_overview_response(
    analytics,
):
    """
    Extract frontend-facing overview metrics.
    """

    metrics = analytics.get(
        "metrics",
        {},
    )

    return {
        "income": str(
            metrics.get(
                "total_income",
                "0.00",
            )
        ),

        "income_display": (
            metrics.get(
                "total_income_display",
                "₹0.00",
            )
        ),

        "expenses": str(
            metrics.get(
                "total_expense",
                "0.00",
            )
        ),

        "expenses_display": (
            metrics.get(
                "total_expense_display",
                "₹0.00",
            )
        ),

        "savings": str(
            metrics.get(
                "savings",
                "0.00",
            )
        ),

        "savings_display": (
            metrics.get(
                "savings_display",
                "₹0.00",
            )
        ),

        "savings_rate": float(
            metrics.get(
                "savings_rate",
                0,
            )
            or 0
        ),

        "transaction_count": int(
            metrics.get(
                "transaction_count",
                0,
            )
            or 0
        ),

        "expense_count": int(
            metrics.get(
                "expense_count",
                0,
            )
            or 0
        ),

        "income_count": int(
            metrics.get(
                "income_count",
                0,
            )
            or 0
        ),
    }


def build_alerts(
    insights,
    *,
    limit=3,
):
    """
    Return only the highest-priority critical/warning insights
    for the alert-card section.

    The full insight collection remains available separately.
    """

    alerts = [
        insight
        for insight in insights
        if insight.get("severity")
        in {
            "critical",
            "warning",
        }
    ]

    alerts.sort(
        key=lambda item: (
            item.get(
                "priority",
                0,
            )
        ),
        reverse=True,
    )

    return alerts[:limit]


def build_spending_trend_response(
    trends,
):
    """
    Normalize the spending trend for the frontend.
    """

    spending = trends.get(
        "spending",
        {},
    )

    return {
        "current": str(
            spending.get(
                "current_amount",
                "0.00",
            )
        ),

        "previous": str(
            spending.get(
                "previous_amount",
                "0.00",
            )
        ),

        "change_percent": (
            spending.get(
                "change_percent"
            )
        ),

        "direction": (
            spending.get(
                "direction",
                "unknown",
            )
        ),
    }


# ---------------------------------------------------------------------
# Core dashboard generation
# ---------------------------------------------------------------------

def build_insights_dashboard(
    *,
    user,
    start_date=None,
    end_date=None,
):
    """
    Build Aura's complete Insights dashboard.

    Pipeline:

        Transactions
            ↓
        Analytics
            ↓
        Trends
            ↓
        Anomalies
        Recurring
        Budgets
        Goals
            ↓
        Financial Health
            ↓
        Insight Engine
            ↓
        Evidence Builder
            ↓
        OpenAI
            ↓
        Final Dashboard Payload
    """

    periods = resolve_insight_periods(
        start_date=start_date,
        end_date=end_date,
    )

    current_period = periods[
        "current"
    ]

    comparison_period = periods[
        "comparison"
    ]

    # -----------------------------------------------------------------
    # Current deterministic analytics
    # -----------------------------------------------------------------

    current_analytics = (
        build_period_analytics(
            user=user,
            start_date=(
                current_period["start"]
            ),
            end_date=(
                current_period["end"]
            ),
        )
    )

    # -----------------------------------------------------------------
    # Previous/comparison analytics
    # -----------------------------------------------------------------

    previous_analytics = (
        build_period_analytics(
            user=user,
            start_date=(
                comparison_period["start"]
            ),
            end_date=(
                comparison_period["end"]
            ),
        )
    )

    # -----------------------------------------------------------------
    # Trends
    # -----------------------------------------------------------------

    trends = build_trend_analysis(
        current_analytics=(
            current_analytics
        ),
        previous_analytics=(
            previous_analytics
        ),
    )

    # -----------------------------------------------------------------
    # Anomaly detection
    # -----------------------------------------------------------------

    anomalies = detect_anomalies(
        user=user,
        start_date=(
            current_period["start"]
        ),
        end_date=(
            current_period["end"]
        ),
    )

    # -----------------------------------------------------------------
    # Recurring expenses
    # -----------------------------------------------------------------

    recurring = (
        analyze_recurring_expenses(
            user=user
        )
    )

    # -----------------------------------------------------------------
    # Budgets
    # -----------------------------------------------------------------

    budgets = analyze_budgets(
        user=user,
        reference_date=(
            current_period["end"]
        ),
    )

    # -----------------------------------------------------------------
    # Goals
    # -----------------------------------------------------------------

    goals = analyze_goals(
        user=user,
        reference_date=(
            current_period["end"]
        ),
    )

    # -----------------------------------------------------------------
    # Financial Health
    # -----------------------------------------------------------------

    metrics = current_analytics.get(
        "metrics",
        {},
    )

    financial_health = (
        calculate_financial_health(
            metrics=metrics,
            trends=trends,
            anomalies=anomalies,
            recurring=recurring,
            budgets=budgets,
            goals=goals,
        )
    )

    # -----------------------------------------------------------------
    # Deterministic Insight Engine
    # -----------------------------------------------------------------

    deterministic_insights = (
        build_insight_signals(
            analytics=(
                current_analytics
            ),
            trends=trends,
            anomalies=anomalies,
            recurring=recurring,
            budgets=budgets,
            goals=goals,
            health=(
                financial_health
            ),
        )
    )

    # -----------------------------------------------------------------
    # Verified AI evidence
    # -----------------------------------------------------------------

    evidence = (
        build_evidence_package(
            period=(
                current_period
            ),
            comparison_period=(
                comparison_period
            ),
            analytics=(
                current_analytics
            ),
            previous_analytics=(
                previous_analytics
            ),
            trends=trends,
            anomalies=anomalies,
            recurring=recurring,
            budgets=budgets,
            goals=goals,
            health=(
                financial_health
            ),
            signals=(
                deterministic_insights
            ),
        )
    )

    # -----------------------------------------------------------------
    # Supporting semantic RAG evidence
    # -----------------------------------------------------------------

    analysis = {
        "analytics": current_analytics,
        "trends": trends,
        "anomalies": anomalies,
        "recurring": recurring,
        "budgets": budgets,
        "goals": goals,
        "health": financial_health,
    }

    supporting_evidence = (
        build_supporting_evidence(
            user=user,
            analysis=analysis,
        )
    )

    # -----------------------------------------------------------------
    # AI Executive Summary
    # -----------------------------------------------------------------

    executive_summary = (
        generate_executive_summary(
            evidence=evidence,
            supporting_evidence=(
                supporting_evidence
            ),
        )
    )

    # -----------------------------------------------------------------
    # AI-enrich only highest-priority eligible signals.
    # Deterministic signals remain source of truth.
    # -----------------------------------------------------------------

    insights = (
        enrich_top_signals_with_ai(
            deterministic_insights,
            supporting_evidence=(
                supporting_evidence
            ),
            limit=3,
        )
    )

    # -----------------------------------------------------------------
    # Monthly history chart
    # -----------------------------------------------------------------

    monthly_spending = (
        calculate_monthly_spending(
            user=user,
            months=6,
        )
    )

    # -----------------------------------------------------------------
    # Final production API shape
    # -----------------------------------------------------------------

    dashboard = {
        "period": {
            "start": (
                current_period[
                    "start"
                ].isoformat()
            ),

            "end": (
                current_period[
                    "end"
                ].isoformat()
            ),

            "comparison_start": (
                comparison_period[
                    "start"
                ].isoformat()
            ),

            "comparison_end": (
                comparison_period[
                    "end"
                ].isoformat()
            ),
        },

        "generated_at": (
            timezone.now().isoformat()
        ),

        "overview": (
            build_overview_response(
                current_analytics
            )
        ),

        "executive_summary": (
            executive_summary
        ),

        "spending_trend": (
            build_spending_trend_response(
                trends
            )
        ),

        "alerts": (
            build_alerts(
                insights,
                limit=3,
            )
        ),

        "categories": (
            current_analytics.get(
                "categories",
                [],
            )
        ),

        "top_merchants": (
            current_analytics.get(
                "merchants",
                [],
            )[:5]
        ),

        "monthly_spending": (
            monthly_spending
        ),

        "anomalies": (
            anomalies
        ),

        "recurring": (
            recurring
        ),

        "budgets": (
            budgets
        ),

        "goals": (
            goals
        ),

        "financial_health": (
            financial_health
        ),

        "insights": (
            insights
        ),
    }

    return make_json_safe(
        dashboard
    )


# ---------------------------------------------------------------------
# Snapshot helpers
# ---------------------------------------------------------------------

def get_or_create_snapshot(
    *,
    user,
    start_date=None,
    end_date=None,
):
    """
    Get/create the snapshot corresponding to one analysis period.
    """

    periods = resolve_insight_periods(
        start_date=start_date,
        end_date=end_date,
    )

    period = periods["current"]

    snapshot, _ = (
        InsightSnapshot.objects.get_or_create(
            user=user,
            period_start=(
                period["start"]
            ),
            period_end=(
                period["end"]
            ),
        )
    )

    return snapshot


def get_cached_insights(
    *,
    user,
    start_date=None,
    end_date=None,
):
    """
    Return cached insight data only when the snapshot is
    READY and not stale.

    Returns None otherwise.
    """

    snapshot = get_or_create_snapshot(
        user=user,
        start_date=start_date,
        end_date=end_date,
    )

    if (
        snapshot.is_ready
        and not snapshot.is_stale
    ):
        return snapshot.data

    return None


# ---------------------------------------------------------------------
# Regeneration
# ---------------------------------------------------------------------

def regenerate_insights_snapshot(
    user,
    *,
    start_date=None,
    end_date=None,
):
    """
    Fully regenerate one user's insight snapshot.

    The snapshot lifecycle becomes:

        PENDING / READY / FAILED
                ↓
            GENERATING
                ↓
              READY

    or:

            GENERATING
                ↓
              FAILED
    """

    periods = resolve_insight_periods(
        start_date=start_date,
        end_date=end_date,
    )

    period = periods["current"]

    # Lock/update the snapshot state before doing expensive work.
    with transaction.atomic():
        snapshot, _ = (
            InsightSnapshot.objects.select_for_update()
            .get_or_create(
                user=user,
                period_start=(
                    period["start"]
                ),
                period_end=(
                    period["end"]
                ),
            )
        )

        snapshot.status = (
            InsightSnapshot.Status.GENERATING
        )

        snapshot.error_message = ""

        snapshot.save(
            update_fields=[
                "status",
                "error_message",
                "updated_at",
            ]
        )

    try:
        dashboard = (
            build_insights_dashboard(
                user=user,
                start_date=(
                    period["start"]
                ),
                end_date=(
                    period["end"]
                ),
            )
        )

        # Store the actual generation timestamp.
        generated_at = timezone.now()

        dashboard[
            "generated_at"
        ] = generated_at.isoformat()

        dashboard["status"] = (
            InsightSnapshot.Status.READY
        )

        dashboard["is_stale"] = False

        with transaction.atomic():
            snapshot = (
                InsightSnapshot.objects
                .select_for_update()
                .get(pk=snapshot.pk)
            )

            snapshot.data = (
                make_json_safe(
                    dashboard
                )
            )

            snapshot.status = (
                InsightSnapshot.Status.READY
            )

            snapshot.is_stale = False

            snapshot.generated_at = (
                generated_at
            )

            snapshot.error_message = ""

            snapshot.save(
                update_fields=[
                    "data",
                    "status",
                    "is_stale",
                    "generated_at",
                    "error_message",
                    "updated_at",
                ]
            )

        return snapshot.data

    except Exception as exc:
        logger.exception(
            "Failed to generate insights for user=%s period=%s to %s",
            user.pk,
            period["start"],
            period["end"],
        )

        with transaction.atomic():
            snapshot = (
                InsightSnapshot.objects
                .select_for_update()
                .get(pk=snapshot.pk)
            )

            snapshot.status = (
                InsightSnapshot.Status.FAILED
            )

            snapshot.error_message = (
                str(exc)[:2000]
            )

            # Keep stale=True because the snapshot could not
            # be successfully regenerated.
            snapshot.is_stale = True

            snapshot.save(
                update_fields=[
                    "status",
                    "error_message",
                    "is_stale",
                    "updated_at",
                ]
            )

        raise


# ---------------------------------------------------------------------
# Public read service
# ---------------------------------------------------------------------

def get_insights_summary(
    user,
    *,
    period="this_month",
    start_date=None,
    end_date=None,
    regenerate_if_stale=True,
):
    """
    Public service used by the Insights API.

    Preset periods are resolved here before looking up
    the corresponding InsightSnapshot.

    Examples:
        this_month
        last_month
        last_3_months
        this_year
        custom
    """

    resolved_start_date, resolved_end_date = (
        resolve_period_preset(
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
    )

    snapshot = get_or_create_snapshot(
        user=user,
        start_date=resolved_start_date,
        end_date=resolved_end_date,
    )

    if (
        snapshot.is_ready
        and not snapshot.is_stale
    ):
        return snapshot.data

    if not regenerate_if_stale:
        if snapshot.data:
            response = dict(
                snapshot.data
            )

            response["status"] = (
                snapshot.status
            )

            response["is_stale"] = True

            return response

        return None

    return regenerate_insights_snapshot(
        user,
        start_date=resolved_start_date,
        end_date=resolved_end_date,
    )


# ---------------------------------------------------------------------
# Staleness management
# ---------------------------------------------------------------------

def mark_insights_stale(
    user,
):
    """
    Mark every stored insight period for a user as stale.

    Call this after changes that can affect financial insights:

        new transactions
        edited transaction category
        deleted transaction
        changed budget
        changed goal
        subscription changes
    """

    InsightSnapshot.objects.filter(
        user=user,
    ).update(
        is_stale=True,
        updated_at=timezone.now(),
    )


def mark_insight_period_stale(
    *,
    user,
    start_date,
    end_date,
):
    """
    Mark only one specific period as stale.
    """

    InsightSnapshot.objects.filter(
        user=user,
        period_start=start_date,
        period_end=end_date,
    ).update(
        is_stale=True,
        updated_at=timezone.now(),
    )


# ---------------------------------------------------------------------
# Snapshot status
# ---------------------------------------------------------------------

def get_insight_snapshot_status(
    *,
    user,
    period="this_month",
    start_date=None,
    end_date=None,
):
    """
    Return generation status for the requested Insights period.

    Used by the frontend while polling after async regeneration.
    """

    resolved_start_date, resolved_end_date = (
        resolve_period_preset(
            period=period,
            start_date=start_date,
            end_date=end_date,
        )
    )

    snapshot = get_or_create_snapshot(
        user=user,
        start_date=resolved_start_date,
        end_date=resolved_end_date,
    )

    return {
        "insight_id": (
            snapshot.insight_id
        ),

        "status": (
            snapshot.status
        ),

        "is_stale": (
            snapshot.is_stale
        ),

        "has_data": bool(
            snapshot.data
        ),

        "generated_at": (
            snapshot.generated_at.isoformat()
            if snapshot.generated_at
            else None
        ),

        "period": {
            "start": (
                snapshot.period_start.isoformat()
                if snapshot.period_start
                else None
            ),

            "end": (
                snapshot.period_end.isoformat()
                if snapshot.period_end
                else None
            ),
        },

        "error": (
            snapshot.error_message
            if (
                snapshot.status
                == InsightSnapshot.Status.FAILED
            )
            else None
        ),
    }