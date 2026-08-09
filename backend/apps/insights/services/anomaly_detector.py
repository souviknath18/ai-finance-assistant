from decimal import Decimal, InvalidOperation
from statistics import mean, pstdev

from apps.insights.selectors.transaction_selector import (
    get_expense_transactions,
    get_historical_expenses,
    get_historical_merchant_expenses,
    get_historical_category_expenses,
)
from apps.insights.services.analytics_service import (
    format_money,
)


ZERO = Decimal("0.00")

MINIMUM_ANOMALY_AMOUNT = Decimal("500.00")

MINIMUM_MERCHANT_HISTORY = 3
MINIMUM_CATEGORY_HISTORY = 5
MINIMUM_GENERAL_HISTORY = 8

Z_SCORE_THRESHOLD = 2.0
MULTIPLIER_THRESHOLD = Decimal("2.50")


FIXED_COST_KEYWORDS = {
    "rent",
    "mortgage",
    "emi",
    "loan",
    "insurance",
    "sip",
    "investment",
    "mutual fund",
}


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
    Return an absolute monetary amount.

    Aura may store expenses as negative amounts.
    """

    return abs(
        to_decimal(value)
    )


def _transaction_text(transaction) -> str:
    """
    Build normalized text used to recognize predictable fixed costs.
    """

    return " ".join(
        filter(
            None,
            [
                transaction.merchant_name,
                transaction.description,
                transaction.category,
            ],
        )
    ).lower()


def _is_predictable_fixed_cost(
    transaction,
) -> bool:
    """
    Avoid flagging common predictable expenses as unusual merely
    because their value is large.

    Example:
        Rent ₹20,000 every month
    """

    text = _transaction_text(
        transaction
    )

    return any(
        keyword in text
        for keyword in FIXED_COST_KEYWORDS
    )


def _build_amount_statistics(
    amounts,
):
    """
    Calculate basic historical statistics.

    Returns:
        count
        average
        standard_deviation
        minimum
        maximum
    """

    normalized = [
        normalize_amount(amount)
        for amount in amounts
        if normalize_amount(amount) > ZERO
    ]

    if not normalized:
        return {
            "count": 0,
            "average": ZERO,
            "standard_deviation": ZERO,
            "minimum": ZERO,
            "maximum": ZERO,
        }

    numeric_values = [
        float(value)
        for value in normalized
    ]

    average_value = Decimal(
        str(
            mean(
                numeric_values
            )
        )
    )

    if len(numeric_values) >= 2:
        deviation_value = Decimal(
            str(
                pstdev(
                    numeric_values
                )
            )
        )
    else:
        deviation_value = ZERO

    return {
        "count": len(
            normalized
        ),

        "average": (
            average_value
        ),

        "standard_deviation": (
            deviation_value
        ),

        "minimum": min(
            normalized
        ),

        "maximum": max(
            normalized
        ),
    }


def _calculate_z_score(
    *,
    amount,
    average,
    deviation,
):
    """
    Calculate standard z-score for an amount.
    """

    amount = to_decimal(amount)
    average = to_decimal(average)
    deviation = to_decimal(deviation)

    if deviation <= ZERO:
        return None

    return round(
        float(
            (amount - average)
            / deviation
        ),
        2,
    )


def _calculate_multiplier(
    *,
    amount,
    average,
):
    """
    Determine how many times larger the current transaction is
    than the historical average.

    Example:
        current = 7500
        average = 1500

        multiplier = 5.0
    """

    amount = to_decimal(amount)
    average = to_decimal(average)

    if average <= ZERO:
        return None

    return round(
        float(
            amount / average
        ),
        2,
    )


def _analyze_against_history(
    *,
    amount,
    statistics,
):
    """
    Evaluate one amount against a historical distribution.

    A transaction can be considered unusual if either:
        z-score is high enough
        OR
        it is several times larger than the historical average
    """

    amount = to_decimal(
        amount
    )

    average = statistics[
        "average"
    ]

    deviation = statistics[
        "standard_deviation"
    ]

    z_score = _calculate_z_score(
        amount=amount,
        average=average,
        deviation=deviation,
    )

    multiplier = (
        _calculate_multiplier(
            amount=amount,
            average=average,
        )
    )

    unusual_by_z_score = (
        z_score is not None
        and z_score >= Z_SCORE_THRESHOLD
    )

    unusual_by_multiplier = (
        multiplier is not None
        and multiplier
        >= float(
            MULTIPLIER_THRESHOLD
        )
    )

    is_unusual = (
        unusual_by_z_score
        or unusual_by_multiplier
    )

    return {
        "is_unusual": is_unusual,

        "z_score": z_score,

        "multiplier": multiplier,

        "average": average,

        "standard_deviation": (
            deviation
        ),

        "history_count": (
            statistics[
                "count"
            ]
        ),
    }


def _merchant_history(
    *,
    user,
    transaction,
):
    """
    Compare a transaction with previous transactions from
    the same merchant.

    This is the preferred anomaly evidence source.
    """

    if (
        not transaction.date
        or not transaction.merchant_name
    ):
        return None

    queryset = (
        get_historical_merchant_expenses(
            user=user,
            merchant_name=(
                transaction.merchant_name
            ),
            before_date=(
                transaction.date
            ),
        )
    )

    amounts = list(
        queryset.values_list(
            "amount",
            flat=True,
        )
    )

    statistics = (
        _build_amount_statistics(
            amounts
        )
    )

    if (
        statistics["count"]
        < MINIMUM_MERCHANT_HISTORY
    ):
        return None

    result = (
        _analyze_against_history(
            amount=(
                normalize_amount(
                    transaction.amount
                )
            ),
            statistics=statistics,
        )
    )

    result["basis"] = (
        "merchant_history"
    )

    return result


def _category_history(
    *,
    user,
    transaction,
):
    """
    Fall back to historical spending from the same category when
    merchant history is insufficient.
    """

    if (
        not transaction.date
        or not transaction.category
    ):
        return None

    queryset = (
        get_historical_category_expenses(
            user=user,
            category=(
                transaction.category
            ),
            before_date=(
                transaction.date
            ),
        )
    )

    amounts = list(
        queryset.values_list(
            "amount",
            flat=True,
        )
    )

    statistics = (
        _build_amount_statistics(
            amounts
        )
    )

    if (
        statistics["count"]
        < MINIMUM_CATEGORY_HISTORY
    ):
        return None

    result = (
        _analyze_against_history(
            amount=(
                normalize_amount(
                    transaction.amount
                )
            ),
            statistics=statistics,
        )
    )

    result["basis"] = (
        "category_history"
    )

    return result


def _general_history(
    *,
    user,
    transaction,
):
    """
    Final fallback: compare the transaction against all historical
    expense transactions before this transaction's date.
    """

    if not transaction.date:
        return None

    queryset = (
        get_historical_expenses(
            user=user,
            before_date=(
                transaction.date
            ),
        )
    )

    amounts = list(
        queryset.values_list(
            "amount",
            flat=True,
        )
    )

    statistics = (
        _build_amount_statistics(
            amounts
        )
    )

    if (
        statistics["count"]
        < MINIMUM_GENERAL_HISTORY
    ):
        return None

    result = (
        _analyze_against_history(
            amount=(
                normalize_amount(
                    transaction.amount
                )
            ),
            statistics=statistics,
        )
    )

    result["basis"] = (
        "general_history"
    )

    return result


def _get_transaction_baseline(
    *,
    user,
    transaction,
):
    """
    Determine the strongest available historical baseline.

    Priority:

        merchant history
            ↓
        category history
            ↓
        general expense history
    """

    merchant_result = (
        _merchant_history(
            user=user,
            transaction=transaction,
        )
    )

    if merchant_result:
        return merchant_result

    category_result = (
        _category_history(
            user=user,
            transaction=transaction,
        )
    )

    if category_result:
        return category_result

    return _general_history(
        user=user,
        transaction=transaction,
    )


def _build_reason(
    *,
    transaction,
    analysis,
):
    """
    Build a human-readable deterministic anomaly explanation.

    This is not AI-generated.
    """

    merchant = (
        transaction.merchant_name
        or transaction.description
        or "This transaction"
    )

    multiplier = analysis.get(
        "multiplier"
    )

    basis = analysis.get(
        "basis"
    )

    if (
        multiplier is not None
        and multiplier >= 2
    ):
        if basis == "merchant_history":
            return (
                f"{merchant} is about "
                f"{multiplier:.1f}× higher than "
                "your usual spending with this merchant."
            )

        if basis == "category_history":
            return (
                f"This transaction is about "
                f"{multiplier:.1f}× higher than "
                f"your usual {transaction.category or 'category'} spending."
            )

        return (
            f"This transaction is about "
            f"{multiplier:.1f}× higher than "
            "your typical expense."
        )

    if basis == "merchant_history":
        return (
            f"{merchant} is significantly higher than "
            "your previous spending with this merchant."
        )

    if basis == "category_history":
        return (
            "This transaction is significantly higher than "
            f"your historical {transaction.category or 'category'} expenses."
        )

    return (
        "This transaction is significantly higher than "
        "your normal expense pattern."
    )


def _build_anomaly_item(
    *,
    transaction,
    analysis,
):
    """
    Convert a flagged Transaction into the structured anomaly shape
    consumed by the Insight Engine and frontend.
    """

    amount = normalize_amount(
        transaction.amount
    )

    merchant = (
        transaction.merchant_name
        or transaction.description
        or "Unknown merchant"
    )

    return {
        "transaction_id": (
            transaction.transaction_id
        ),

        "merchant": merchant,

        "category": (
            transaction.category
            or "Uncategorized"
        ),

        "date": (
            transaction.date.isoformat()
            if transaction.date
            else None
        ),

        "amount": str(
            amount
        ),

        "amount_display": (
            format_money(
                amount
            )
        ),

        "title": (
            "Unusual spending detected"
        ),

        "description": (
            _build_reason(
                transaction=transaction,
                analysis=analysis,
            )
        ),

        "reason": (
            "amount_above_historical_pattern"
        ),

        "basis": (
            analysis.get(
                "basis"
            )
        ),

        "z_score": (
            analysis.get(
                "z_score"
            )
        ),

        "multiplier": (
            analysis.get(
                "multiplier"
            )
        ),

        "historical_average": str(
            analysis.get(
                "average",
                ZERO,
            )
        ),

        "historical_average_display": (
            format_money(
                analysis.get(
                    "average",
                    ZERO,
                )
            )
        ),

        "history_count": (
            analysis.get(
                "history_count",
                0,
            )
        ),
    }


def detect_anomalies(
    *,
    user,
    start_date,
    end_date,
    limit=5,
):
    """
    Detect unusual expense transactions for a period.

    Strategy:

        1. Ignore tiny expenses.
        2. Ignore predictable fixed-cost transactions.
        3. Compare against historical merchant behavior.
        4. Fall back to category history.
        5. Fall back to general expense history.
        6. Return the strongest anomalies.

    No OpenAI is used here.
    """

    expenses = list(
        get_expense_transactions(
            user=user,
            start_date=start_date,
            end_date=end_date,
        )
    )

    anomalies = []

    for transaction in expenses:
        amount = normalize_amount(
            transaction.amount
        )

        if (
            amount
            < MINIMUM_ANOMALY_AMOUNT
        ):
            continue

        if _is_predictable_fixed_cost(
            transaction
        ):
            continue

        analysis = (
            _get_transaction_baseline(
                user=user,
                transaction=transaction,
            )
        )

        if not analysis:
            continue

        if not analysis.get(
            "is_unusual"
        ):
            continue

        anomalies.append(
            _build_anomaly_item(
                transaction=transaction,
                analysis=analysis,
            )
        )

    anomalies.sort(
        key=lambda item: (
            item.get(
                "multiplier"
            )
            or 0,
            item.get(
                "z_score"
            )
            or 0,
            to_decimal(
                item.get(
                    "amount"
                )
            ),
        ),
        reverse=True,
    )

    safe_limit = max(
        1,
        min(limit, 20),
    )

    anomalies = anomalies[
        :safe_limit
    ]

    biggest_expense = None

    if anomalies:
        biggest_expense = max(
            anomalies,
            key=lambda item: (
                to_decimal(
                    item.get(
                        "amount"
                    )
                )
            ),
        )

    if anomalies:
        top_anomaly = anomalies[0]

        primary_alert = {
            "title": (
                "Unusual spending detected"
            ),

            "description": (
                top_anomaly[
                    "description"
                ]
            ),
        }

    else:
        primary_alert = {
            "title": (
                "Spending looks stable"
            ),

            "description": (
                "Aura did not detect any major "
                "unusual expenses in this period."
            ),
        }

    return {
        "count": len(
            anomalies
        ),

        "items": anomalies,

        "biggest_expense": (
            biggest_expense
        ),

        "primary_alert": (
            primary_alert
        ),
    }