import json
from decimal import Decimal

from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, Abs
from datetime import timedelta
from django.utils import timezone

from apps.transactions.models import Transaction
from apps.subscriptions.services import detect_subscriptions
from ai_engine.insights.anomaly_detection import detect_anomalies
from ai_engine.insights.financial_health import calculate_financial_health
from .models import ReportDashboardSnapshot


def money(amount):
    amount = amount or Decimal("0")
    return f"₹{abs(amount):,.2f}"


def signed_money(amount):
    amount = amount or Decimal("0")

    if amount < 0:
        return f"-₹{abs(amount):,.2f}"

    return f"₹{amount:,.2f}"


def get_current_period_range():
    today = timezone.now().date()
    start = today.replace(day=1)
    return start, today


def resolve_report_period(
    interval="monthly",
    start_date=None,
    end_date=None,
):
    today = timezone.localdate()

    if interval == "custom":
        if not start_date or not end_date:
            raise ValueError(
                "start_date and end_date are required for a custom report."
            )

        if start_date > end_date:
            raise ValueError(
                "start_date cannot be after end_date."
            )

        return start_date, end_date

    if interval == "monthly":
        return (
            today.replace(day=1),
            today,
        )

    if interval == "quarterly":
        quarter_start_month = (
            ((today.month - 1) // 3) * 3
        ) + 1

        start = today.replace(
            month=quarter_start_month,
            day=1,
        )

        return start, today

    if interval == "annual":
        return (
            today.replace(
                month=1,
                day=1,
            ),
            today,
        )

    raise ValueError(
        f"Unsupported report interval: {interval}"
    )


def get_report_title(interval):
    if interval == "quarterly":
        return "Quarterly Financial Performance"

    if interval == "annual":
        return "Annual Financial Performance"

    if interval == "custom":
        return "Custom Financial Performance"

    return "Monthly Financial Performance"


def build_report_dashboard(
    user,
    start_date=None,
    end_date=None,
    interval="monthly",
):
    if not start_date or not end_date:
        start_date, end_date = resolve_report_period(
            interval=interval,
        )

    income = (
        Transaction.objects.filter(
            user=user,
            transaction_type="income",
            date__gte=start_date,
            date__lte=end_date,
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0")
    )

    expenses = (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
            date__gte=start_date,
            date__lte=end_date,
        ).aggregate(total=Sum("amount"))["total"]
        or Decimal("0")
    )

    income = abs(income)
    expenses = abs(expenses)
    savings = income - expenses

    monthly = (
        Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date,
        )
        .annotate(month=TruncMonth("date"))
        .values("month", "transaction_type")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    chart_map = {}

    for item in monthly:
        if not item["month"]:
            continue

        month_key = item["month"].strftime("%Y-%m")
        month_label = item["month"].strftime("%b %Y")

        if month_key not in chart_map:
            chart_map[month_key] = {
                "month": month_label,
                "income": 0,
                "expense": 0,
            }

        if item["transaction_type"] == "income":
            chart_map[month_key]["income"] = float(
                abs(item["total"] or 0)
            )

        if item["transaction_type"] == "expense":
            chart_map[month_key]["expense"] = float(
                abs(item["total"] or 0)
            )

    chart = list(chart_map.values())

    categories = (
        Transaction.objects.filter(
            user=user,
            transaction_type="expense",
            date__gte=start_date,
            date__lte=end_date,
        )
        .values("category")
        .annotate(
            total=Abs(Sum("amount")),
            count=Count("id"),
        )
        .order_by("-total")[:4]
    )

    category_total = sum(abs(item["total"] or 0) for item in categories)

    category_data = []

    for item in categories:
        amount = abs(item["total"] or 0)
        percent = 0

        if category_total > 0:
            percent = round((amount / category_total) * 100, 2)

        category_data.append({
            "label": item["category"] or "Uncategorized",
            "value": f"{percent}% • {money(amount)}",
            "width": f"{min(percent, 100)}%",
            "amount": float(amount),
            "count": item["count"],
        })

    subscriptions = detect_subscriptions(user)
    recurring = subscriptions["subscriptions"][:3]

    anomalies = detect_anomalies(
                    user,
                    start_date=start_date,
                    end_date=end_date,
                )
    health = calculate_financial_health(
                    user,
                    start_date=start_date,
                    end_date=end_date,
                )

    biggest_expense = anomalies.get("biggest_expense")

    return {
        "period": {
            "title": get_report_title(interval),
            "range": (
                f"{start_date.strftime('%b %d, %Y')} - "
                f"{end_date.strftime('%b %d, %Y')}"
            ),
            "status": (
                "Optimized"
                if health["score"] >= 70
                else "Needs Review"
            ),
        },
        "performance": {
            "income": money(income),
            "expenses": money(expenses),
            "savings": signed_money(savings),
            "chart": chart,
        },
        "ai_insight": {
            "summary": (
                f"Your current financial health score is {health['score']}/100. "
                f"Your savings rate is {health['savings_rate']}%. "
                f"Aura detected {anomalies.get('alert_count', 0)} unusual spending alert(s)."
            ),
            "top_unusual_title": (
                biggest_expense["merchant"]
                if biggest_expense
                else "No unusual expense"
            ),
            "top_unusual_amount": (
                biggest_expense["amount_display"]
                if biggest_expense
                else "₹0.00"
            ),
        },
        "categories": category_data,
        "recurring_payments": recurring,
        "recurring_count": len(subscriptions["subscriptions"]),
    }


def regenerate_report_dashboard_snapshot(user):
    data = build_report_dashboard(user)

    json_safe_data = json.loads(
        json.dumps(data, cls=DjangoJSONEncoder)
    )

    snapshot, _ = ReportDashboardSnapshot.objects.update_or_create(
        user=user,
        defaults={
            "data": json_safe_data,
            "is_stale": False,
            "generated_at": timezone.now(),
        },
    )

    return snapshot.data


def get_report_dashboard(user):
    snapshot, _ = ReportDashboardSnapshot.objects.get_or_create(user=user)

    if snapshot.data and not snapshot.is_stale:
        return snapshot.data

    return regenerate_report_dashboard_snapshot(user)


def mark_report_dashboard_stale(user):
    ReportDashboardSnapshot.objects.update_or_create(
        user=user,
        defaults={
            "is_stale": True,
        },
    )