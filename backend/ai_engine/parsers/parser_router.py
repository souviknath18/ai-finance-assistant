from typing import Callable

from .bank_statement_parser import (
    parse_bank_statement_transactions,
)
from .invoice_parser import (
    parse_invoice_transactions,
)
from .parser_schema import empty_parser_result
from .parser_validator import (
    validate_parser_result,
)
from .receipt_parser import (
    parse_receipt_transactions,
)
from .salary_slip_parser import (
    parse_salary_slip_transactions,
)
from .subscription_parser import (
    parse_subscription_transactions,
)
from .utility_bill_parser import (
    parse_utility_bill_transactions,
)


ParserFunction = Callable[[str], dict]


PARSER_MAP: dict[str, ParserFunction] = {
    "bank_statement": (
        parse_bank_statement_transactions
    ),
    "credit_card_statement": (
        parse_bank_statement_transactions
    ),
    "invoice": parse_invoice_transactions,
    "receipt": parse_receipt_transactions,
    "utility_bill": (
        parse_utility_bill_transactions
    ),
    "subscription_receipt": (
        parse_subscription_transactions
    ),
    "salary_slip": (
        parse_salary_slip_transactions
    ),
}


BANK_STATEMENT_TYPES = {
    "bank_statement",
    "credit_card_statement",
}


COMPATIBLE_FALLBACKS: dict[
    str,
    list[ParserFunction],
] = {
    "bank_statement": [
        parse_bank_statement_transactions,
    ],
    "credit_card_statement": [
        parse_bank_statement_transactions,
    ],
    "invoice": [
        parse_invoice_transactions,
        parse_receipt_transactions,
    ],
    "receipt": [
        parse_receipt_transactions,
        parse_invoice_transactions,
    ],
    "utility_bill": [
        parse_utility_bill_transactions,
    ],
    "subscription_receipt": [
        parse_subscription_transactions,
        parse_receipt_transactions,
    ],
    "salary_slip": [
        parse_salary_slip_transactions,
    ],
    "unknown": [
        parse_bank_statement_transactions,
        parse_invoice_transactions,
        parse_receipt_transactions,
        parse_utility_bill_transactions,
        parse_subscription_transactions,
        parse_salary_slip_transactions,
    ],
}


def parse_financial_document(
    extracted_text: str,
    detected_type: str,
) -> dict:
    parser = PARSER_MAP.get(
        detected_type
    )

    if parser:
        primary_result = normalize_legacy_result(
            parser(extracted_text),
            detected_type,
        )

        validation = validate_parser_result(
            primary_result
        )

        if (
            primary_result["transactions"]
            and not validation[
                "has_critical_errors"
            ]
        ):
            return primary_result

        # A bank statement must never be reinterpreted
        # as an invoice, receipt or utility bill.
        if detected_type in BANK_STATEMENT_TYPES:
            return primary_result

    best_result = empty_parser_result(
        document_type=detected_type,
        parser="parser_router",
        confidence=0.0,
    )

    fallback_parsers = (
        COMPATIBLE_FALLBACKS.get(
            detected_type,
            COMPATIBLE_FALLBACKS["unknown"],
        )
    )

    for candidate_parser in fallback_parsers:
        if candidate_parser is parser:
            continue

        candidate_result = normalize_legacy_result(
            candidate_parser(
                extracted_text
            ),
            detected_type,
        )

        validation = validate_parser_result(
            candidate_result
        )

        if validation[
            "has_critical_errors"
        ]:
            continue

        if (
            candidate_result["confidence"]
            > best_result["confidence"]
        ):
            best_result = candidate_result

    return best_result


def normalize_legacy_result(
    parser_result: dict,
    fallback_document_type: str,
) -> dict:
    result = {
        "document_type": parser_result.get(
            "document_type",
            fallback_document_type,
        ),
        "parser": parser_result.get(
            "parser",
            "unknown_parser",
        ),
        "confidence": float(
            parser_result.get(
                "confidence",
                0.0,
            )
        ),
        "transactions": parser_result.get(
            "transactions",
            [],
        ),
        "document_metadata": parser_result.get(
            "document_metadata",
            {},
        ),
        "line_items": parser_result.get(
            "line_items",
            [],
        ),
        "warnings": parser_result.get(
            "warnings",
            [],
        ),
    }

    for transaction in result[
        "transactions"
    ]:
        transaction.setdefault(
            "merchant_name",
            None,
        )
        transaction.setdefault(
            "reference_number",
            None,
        )

    return result