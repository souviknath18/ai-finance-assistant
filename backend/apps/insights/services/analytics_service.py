from calendar import monthrange
from datetime import date
from decimal import Decimal, InvalidOperation

from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth

from apps.insights.selectors.transaction_selector import (
    get_expense_transactions,
    get_income_transactions,
    get_user_transactions,
)


ZERO = Decimal("0.00")


# ---------------------------------------------------------------------
# Amount helpers
# ---------------------------------------------------------------------

def to_decimal(value) -> Decimal:
    """
    Safely convert values into Decimal.

    Financial calculations should use Decimal rather than float
    to avoid floating-point precision issues.
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
    Convert a signed transaction amount into its absolute monetary value.

    Aura may store expenses as negative values, for example:

        -1250.00

    For analytics we usually want:

        1250.00
    """

    return abs(
        to_decimal(value)
    )


def format_money(
    value,
    currency_symbol: str = "₹",
) -> str:
    """
    Format a monetary value for display.

    Example:
        Decimal("12500.5")
        -> ₹12,500.50

    Currency formatting can later be moved to a dedicated currency
    utility when Aura supports multiple currencies more deeply.
    """

    amount = to_decimal(value)

    sign = "-" if amount < ZERO else ""

    amount = abs(amount)

    return (
        f"{sign}"
        f"{currency_symbol}"
        f"{amount:,.2f}"
    )


# ---------------------------------------------------------------------
# Period helpers
# ---------------------------------------------------------------------

def get_current_month_period():
    """
    Return the first and last date of the current month.
    """

    today = date.today()

    start_date = today.replace(
        day=1,
    )

    end_date = date(
        today.year,
        today.month,
        monthrange(
            today.year,
            today.month,
        )[1],
    )

    return start_date, end_date


def get_previous_month_period(
    reference_date: date,
):
    """
    Return the full month immediately before the month containing
    reference_date.

    Example:

        reference_date = 2026-08-01

        returns:
            2026-07-01
            2026-07-31
    """

    if reference_date.month == 1:
        previous_year = (
            reference_date.year - 1
        )

        previous_month = 12

    else:
        previous_year = (
            reference_date.year
        )

        previous_month = (
            reference_date.month - 1
        )

    start_date = date(
        previous_year,
        previous_month,
        1,
    )

    end_date = date(
        previous_year,
        previous_month,
        monthrange(
            previous_year,
            previous_month,
        )[1],
    )

    return start_date, end_date


# ---------------------------------------------------------------------
# Main period analytics
# ---------------------------------------------------------------------

def calculate_period_metrics(
    *,
    user,
    start_date: date,
    end_date: date,
):
    """
    Calculate the core financial metrics for one period.

    Returns:
        income
        expenses
        savings
        savings rate
        transaction counts

    Transfers are excluded because expense and income selectors only
    return their respective transaction types.
    """

    all_transactions = (
        get_user_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    expenses = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    income = (
        get_income_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    raw_expense_total = (
        expenses.aggregate(
            total=Sum("amount"),
        )["total"]
        or ZERO
    )

    raw_income_total = (
        income.aggregate(
            total=Sum("amount"),
        )["total"]
        or ZERO
    )

    total_expense = normalize_amount(
        raw_expense_total
    )

    total_income = normalize_amount(
        raw_income_total
    )

    savings = (
        total_income
        - total_expense
    )

    savings_rate = ZERO

    if total_income > ZERO:
        savings_rate = (
            savings
            / total_income
            * Decimal("100")
        )

    savings_rate = savings_rate.quantize(
        Decimal("0.01")
    )

    return {
        "period_start": (
            start_date.isoformat()
        ),

        "period_end": (
            end_date.isoformat()
        ),

        "total_income": total_income,
        "total_income_display": format_money(
            total_income
        ),

        "total_expense": total_expense,
        "total_expense_display": format_money(
            total_expense
        ),

        "savings": savings,
        "savings_display": format_money(
            savings
        ),

        "savings_rate": float(
            savings_rate
        ),

        "transaction_count": (
            all_transactions.count()
        ),

        "expense_count": (
            expenses.count()
        ),

        "income_count": (
            income.count()
        ),
    }


# ---------------------------------------------------------------------
# Category analytics
# ---------------------------------------------------------------------

def calculate_category_breakdown(
    *,
    user,
    start_date: date,
    end_date: date,
    limit: int | None = None,
):
    """
    Calculate category-level spending.

    Example output:

    [
        {
            "category": "Food",
            "amount": Decimal("12400.00"),
            "total_display": "₹12,400.00",
            "count": 17,
            "percentage": 24.31
        }
    ]
    """

    expenses = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    rows = (
        expenses
        .values("category")
        .annotate(
            total=Sum("amount"),
            count=Count("id"),
        )
    )

    categories = []

    total_spending = ZERO

    for row in rows:
        category = (
            row.get("category")
            or "Uncategorized"
        )

        amount = normalize_amount(
            row.get("total")
        )

        total_spending += amount

        categories.append(
            {
                "category": category,
                "amount": amount,
                "total_display": (
                    format_money(amount)
                ),
                "count": row["count"],
            }
        )

    categories.sort(
        key=lambda item: item["amount"],
        reverse=True,
    )

    for category in categories:
        if total_spending > ZERO:
            percentage = (
                category["amount"]
                / total_spending
                * Decimal("100")
            )

        else:
            percentage = ZERO

        category["percentage"] = round(
            float(percentage),
            2,
        )

    if limit is not None:
        safe_limit = max(
            1,
            min(limit, 100),
        )

        categories = categories[
            :safe_limit
        ]

    return categories


def get_top_spending_category(
    *,
    user,
    start_date: date,
    end_date: date,
):
    """
    Return the user's highest-spending category for a period.
    """

    categories = (
        calculate_category_breakdown(
            user=user,
            start_date=start_date,
            end_date=end_date,
            limit=1,
        )
    )

    if not categories:
        return None

    return categories[0]


# ---------------------------------------------------------------------
# Merchant analytics
# ---------------------------------------------------------------------

def calculate_merchant_breakdown(
    *,
    user,
    start_date: date,
    end_date: date,
    limit: int = 10,
):
    """
    Calculate spending grouped by merchant.

    Useful for insights such as:

        "You spent ₹4,850 across 11 Swiggy transactions."
    """

    expenses = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    rows = (
        expenses
        .exclude(
            merchant_name__isnull=True
        )
        .exclude(
            merchant_name=""
        )
        .values("merchant_name")
        .annotate(
            total=Sum("amount"),
            count=Count("id"),
        )
    )

    merchants = []

    for row in rows:
        amount = normalize_amount(
            row["total"]
        )

        merchants.append(
            {
                "merchant": (
                    row["merchant_name"]
                ),

                "amount": amount,

                "amount_display": (
                    format_money(amount)
                ),

                "count": row["count"],
            }
        )

    merchants.sort(
        key=lambda item: item["amount"],
        reverse=True,
    )

    safe_limit = max(
        1,
        min(limit, 100),
    )

    return merchants[
        :safe_limit
    ]


def get_top_merchant(
    *,
    user,
    start_date: date,
    end_date: date,
):
    """
    Return the highest-spending merchant for a period.
    """

    merchants = (
        calculate_merchant_breakdown(
            user=user,
            start_date=start_date,
            end_date=end_date,
            limit=1,
        )
    )

    if not merchants:
        return None

    return merchants[0]


# ---------------------------------------------------------------------
# Monthly spending history
# ---------------------------------------------------------------------

def calculate_monthly_spending(
    *,
    user,
    months: int = 6,
):
    """
    Return monthly expense totals for charting.

    Example:

    [
        {
            "month": "Mar 2026",
            "month_key": "2026-03",
            "amount": "32000.00",
            "amount_display": "₹32,000.00"
        }
    ]
    """

    safe_months = max(
        1,
        min(months, 24),
    )

    expenses = (
        get_expense_transactions(
            user=user,
        )
        .exclude(
            date__isnull=True
        )
    )

    rows = (
        expenses
        .annotate(
            month=TruncMonth("date")
        )
        .values("month")
        .annotate(
            total=Sum("amount"),
            transaction_count=Count("id"),
        )
        .order_by("-month")[
            :safe_months
        ]
    )

    rows = list(
        reversed(
            list(rows)
        )
    )

    result = []

    for row in rows:
        month_value = row["month"]

        amount = normalize_amount(
            row["total"]
        )

        result.append(
            {
                "month": (
                    month_value.strftime(
                        "%b %Y"
                    )
                ),

                "month_key": (
                    month_value.strftime(
                        "%Y-%m"
                    )
                ),

                "amount": str(
                    amount
                ),

                "amount_display": (
                    format_money(amount)
                ),

                "transaction_count": (
                    row[
                        "transaction_count"
                    ]
                ),
            }
        )

    return result


# ---------------------------------------------------------------------
# Average expense analytics
# ---------------------------------------------------------------------

def calculate_average_expense(
    *,
    user,
    start_date: date,
    end_date: date,
):
    """
    Calculate average expense amount without relying on database AVG
    over signed negative values.

    This keeps the logic explicit and consistent with Aura's signed
    transaction convention.
    """

    expenses = (
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    transaction_count = (
        expenses.count()
    )

    if transaction_count == 0:
        return {
            "amount": ZERO,
            "amount_display": (
                format_money(ZERO)
            ),
            "transaction_count": 0,
        }

    raw_total = (
        expenses.aggregate(
            total=Sum("amount"),
        )["total"]
        or ZERO
    )

    total = normalize_amount(
        raw_total
    )

    average = (
        total
        / Decimal(
            transaction_count
        )
    )

    average = average.quantize(
        Decimal("0.01")
    )

    return {
        "amount": average,
        "amount_display": (
            format_money(
                average
            )
        ),
        "transaction_count": (
            transaction_count
        ),
    }


# ---------------------------------------------------------------------
# Dashboard analytics bundle
# ---------------------------------------------------------------------

def build_period_analytics(
    *,
    user,
    start_date: date,
    end_date: date,
):
    """
    Build the verified analytics bundle consumed by the Insight Engine.

    This function contains no AI logic.

    Everything returned here should be deterministic and reproducible
    directly from the user's financial records.
    """

    metrics = (
        calculate_period_metrics(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    categories = (
        calculate_category_breakdown(
            user=user,
            start_date=start_date,
            end_date=end_date,
            limit=10,
        )
    )

    merchants = (
        calculate_merchant_breakdown(
            user=user,
            start_date=start_date,
            end_date=end_date,
            limit=10,
        )
    )

    average_expense = (
        calculate_average_expense(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    return {
        "metrics": metrics,

        "categories": categories,

        "top_category": (
            categories[0]
            if categories
            else None
        ),

        "merchants": merchants,

        "top_merchant": (
            merchants[0]
            if merchants
            else None
        ),

        "average_expense": (
            average_expense
        ),
    }