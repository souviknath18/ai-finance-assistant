from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Any, TypedDict


class ParsedTransaction(TypedDict):
    date: date | None
    description: str
    merchant_name: str | None
    amount: Decimal
    transaction_type: str
    balance_after_transaction: Decimal | None
    reference_number: str | None
    raw_text: str


class ParserWarning(TypedDict):
    code: str
    message: str


class ParserResult(TypedDict):
    document_type: str
    parser: str
    confidence: float
    transactions: list[ParsedTransaction]
    document_metadata: dict[str, Any]
    line_items: list[dict[str, Any]]
    warnings: list[ParserWarning]


def empty_parser_result(
    *,
    document_type: str = "unknown",
    parser: str = "unknown_parser",
    confidence: float = 0.0,
) -> ParserResult:
    return {
        "document_type": document_type,
        "parser": parser,
        "confidence": confidence,
        "transactions": [],
        "document_metadata": {},
        "line_items": [],
        "warnings": [],
    }