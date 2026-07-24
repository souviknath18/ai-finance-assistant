from decimal import Decimal
from typing import Any


SINGLE_TRANSACTION_DOCUMENT_TYPES = {
    "invoice",
    "receipt",
    "utility_bill",
    "subscription_receipt",
    "salary_slip",
    "travel_receipt",
}


def validate_parser_result(
    parser_result: dict[str, Any],
) -> dict[str, Any]:
    warnings = list(
        parser_result.get("warnings", [])
    )

    critical_errors = []

    transactions = parser_result.get(
        "transactions",
        [],
    )

    document_type = parser_result.get(
        "document_type",
        "unknown",
    )

    if not isinstance(transactions, list):
        critical_errors.append(
            "Parser transactions must be a list."
        )

        transactions = []

    for index, transaction in enumerate(
        transactions,
        start=1,
    ):
        prefix = f"Transaction {index}"

        if not transaction.get("description"):
            critical_errors.append(
                f"{prefix} has no description."
            )

        amount = transaction.get("amount")

        if amount is None:
            critical_errors.append(
                f"{prefix} has no amount."
            )

        elif amount == Decimal("0"):
            critical_errors.append(
                f"{prefix} has a zero amount."
            )

        if transaction.get(
            "transaction_type"
        ) not in {
            "income",
            "expense",
        }:
            critical_errors.append(
                f"{prefix} has an invalid transaction type."
            )

        if transaction.get("date") is None:
            warnings.append(
                {
                    "code": "missing_transaction_date",
                    "message": (
                        f"{prefix} does not have a reliable date."
                    ),
                }
            )

    if (
        document_type
        in SINGLE_TRANSACTION_DOCUMENT_TYPES
        and len(transactions) > 1
    ):
        warnings.append(
            {
                "code": "unexpected_multiple_transactions",
                "message": (
                    f"{document_type} normally represents "
                    "one final payment transaction."
                ),
            }
        )

    return {
        "is_valid": not critical_errors,
        "has_critical_errors": bool(
            critical_errors
        ),
        "critical_errors": critical_errors,
        "warnings": warnings,
        "transaction_count": len(transactions),
    }


def should_use_ai_fallback(
    parser_result: dict[str, Any],
    validation_result: dict[str, Any],
) -> bool:
    transactions = parser_result.get(
        "transactions",
        [],
    )

    confidence = float(
        parser_result.get(
            "confidence",
            0.0,
        )
    )

    return (
        not transactions
        or confidence < 0.55
        or validation_result[
            "has_critical_errors"
        ]
    )


def should_use_ai_repair(
    parser_result: dict[str, Any],
    validation_result: dict[str, Any],
) -> bool:
    confidence = float(
        parser_result.get(
            "confidence",
            0.0,
        )
    )

    return (
        bool(parser_result.get("transactions"))
        and not validation_result[
            "has_critical_errors"
        ]
        and confidence < 0.80
    )