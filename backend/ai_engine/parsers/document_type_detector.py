import re


DOCUMENT_SIGNALS = {
    "bank_statement": {
        "strong": [
            "account statement",
            "statement of account",
            "opening balance",
            "closing balance",
            "transaction details",
        ],
        "medium": [
            "account number",
            "debit",
            "credit",
            "withdrawal",
            "deposit",
            "balance",
        ],
    },
    "credit_card_statement": {
        "strong": [
            "credit card statement",
            "minimum amount due",
            "payment due date",
            "credit limit",
            "available credit",
        ],
        "medium": [
            "card number",
            "previous balance",
            "new charges",
            "total amount due",
        ],
    },
    "invoice": {
        "strong": [
            "tax invoice",
            "invoice number",
            "invoice no",
            "invoice date",
            "bill to",
            "ship to",
        ],
        "medium": [
            "gstin",
            "taxable value",
            "unit price",
            "quantity",
            "hsn",
            "sac",
        ],
    },
    "utility_bill": {
        "strong": [
            "units consumed",
            "meter number",
            "meter no",
            "tariff category",
            "consumer number",
            "service number",
        ],
        "medium": [
            "billing period",
            "due date",
            "amount payable",
            "energy charges",
            "electricity duty",
        ],
    },
    "receipt": {
        "strong": [
            "payment receipt",
            "receipt number",
            "receipt no",
            "payment received",
            "payment method",
        ],
        "medium": [
            "amount paid",
            "subtotal",
            "cash",
            "card",
            "change",
        ],
    },
    "salary_slip": {
        "strong": [
            "salary slip",
            "payslip",
            "pay slip",
            "net salary",
            "net pay",
        ],
        "medium": [
            "gross salary",
            "basic salary",
            "hra",
            "deductions",
            "employee id",
        ],
    },
    "subscription_receipt": {
        "strong": [
            "subscription",
            "membership renewal",
            "recurring billing",
            "monthly plan",
            "annual plan",
        ],
        "medium": [
            "netflix",
            "spotify",
            "youtube premium",
            "amazon prime",
            "openai",
            "chatgpt",
            "adobe",
            "canva",
            "figma",
        ],
    },
    "travel_receipt": {
        "strong": [
            "boarding pass",
            "booking reference",
            "pnr",
            "ticket number",
            "fare summary",
        ],
        "medium": [
            "departure",
            "arrival",
            "passenger",
            "flight",
            "train",
            "hotel",
        ],
    },
}


def count_signal_matches(
    text: str,
    signals: list[str],
) -> list[str]:
    return [
        signal
        for signal in signals
        if signal in text
    ]


def calculate_structural_bonus(
    document_type: str,
    text: str,
) -> int:
    bonus = 0

    if document_type in {
        "bank_statement",
        "credit_card_statement",
    }:
        date_count = len(
            re.findall(
                r"\b\d{1,2}[-/ ]"
                r"(?:\d{1,2}|[A-Za-z]{3,9})"
                r"[-/ ]\d{2,4}\b",
                text,
            )
        )

        amount_count = len(
            re.findall(
                r"(?:INR\s*)?"
                r"[-+]?\d[\d,]*\.\d{2}",
                text,
                flags=re.IGNORECASE,
            )
        )

        if date_count >= 3:
            bonus += 3

        if amount_count >= 6:
            bonus += 3

    if document_type == "invoice":
        if "invoice" in text:
            bonus += 2

        if re.search(
            r"\bqty\b|\bquantity\b",
            text,
        ):
            bonus += 2

    if document_type == "utility_bill":
        if re.search(
            r"\bunits?\b.*\b(?:kwh|consumed)\b",
            text,
        ):
            bonus += 3

    return bonus


def detect_document_type(
    extracted_text: str,
) -> dict:
    text = str(
        extracted_text or ""
    ).lower()

    ranked_results = []

    for document_type, groups in (
        DOCUMENT_SIGNALS.items()
    ):
        strong_matches = (
            count_signal_matches(
                text,
                groups["strong"],
            )
        )

        medium_matches = (
            count_signal_matches(
                text,
                groups["medium"],
            )
        )

        score = (
            len(strong_matches) * 3
            + len(medium_matches)
            + calculate_structural_bonus(
                document_type,
                text,
            )
        )

        ranked_results.append(
            {
                "document_type": document_type,
                "score": score,
                "strong_matches": strong_matches,
                "medium_matches": medium_matches,
            }
        )

    ranked_results.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    winner = ranked_results[0]
    runner_up = ranked_results[1]

    if winner["score"] == 0:
        return {
            "document_type": "unknown",
            "confidence": 0.0,
            "scores": ranked_results,
            "alternatives": [],
        }

    score_gap = (
        winner["score"]
        - runner_up["score"]
    )

    confidence = min(
        0.99,
        0.45
        + winner["score"] * 0.04
        + score_gap * 0.03,
    )

    if (
        score_gap == 0
        and winner["score"] < 6
    ):
        detected_type = "unknown"
        confidence = 0.35
    else:
        detected_type = winner[
            "document_type"
        ]

    return {
        "document_type": detected_type,
        "confidence": round(
            confidence,
            2,
        ),
        "scores": ranked_results,
        "alternatives": [
            {
                "document_type": item[
                    "document_type"
                ],
                "score": item["score"],
            }
            for item in ranked_results[1:4]
            if item["score"] > 0
        ],
    }