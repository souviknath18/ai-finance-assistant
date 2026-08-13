import re
from copy import deepcopy

from .ai_invoice_extractor import (
    extract_invoice_fields,
)


SUSPICIOUS_DESCRIPTION_TERMS = (
    "net amount",
    "total amount",
    "grand total",
    "subtotal",
    "tax",
    "taxable value",
    "invoice date",
    "invoice number",
    "description qty",
    "track your order",
    "customer support",
    "authorized signatory",
    "authorised signatory",
)


def is_suspicious_description(
    description: str | None,
) -> bool:
    if not description:
        return True

    description = description.lower().strip()

    if len(description.split()) <= 1:
        return True

    money_values = re.findall(
        r"(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*(?:\.\d{1,2})?",
        description,
        flags=re.IGNORECASE,
    )

    if len(money_values) >= 2:
        return True

    if any(
        term in description
        for term in SUSPICIOUS_DESCRIPTION_TERMS
    ):
        return True

    return False


def is_suspicious_merchant(
    merchant: str | None,
) -> bool:
    if not merchant:
        return True

    merchant = merchant.lower()

    rejected_terms = (
        "invoice",
        "bill to",
        "ship to",
        "address",
        "gstin",
        "invoice number",
        "invoice date",
    )

    return any(
        term in merchant
        for term in rejected_terms
    )


def needs_ai_invoice_enhancement(
    parser_result: dict,
) -> bool:
    confidence = parser_result.get(
        "confidence",
        0.0,
    )

    metadata = parser_result.get(
        "document_metadata",
        {},
    )

    merchant = metadata.get(
        "merchant_name"
    )

    description = metadata.get(
        "service_description"
    )

    if confidence < 0.80:
        return True

    if is_suspicious_merchant(
        merchant
    ):
        return True

    if is_suspicious_description(
        description
    ):
        return True

    return False


def merge_invoice_result(
    parser_result: dict,
    ai_result: dict,
) -> dict:
    result = deepcopy(
        parser_result
    )

    metadata = result.setdefault(
        "document_metadata",
        {},
    )

    transactions = result.get(
        "transactions",
        [],
    )

    if not transactions:
        return result

    transaction = transactions[0]

    ai_confidence = ai_result.get(
        "confidence",
        0.0,
    )

    if ai_confidence < 0.70:
        metadata["ai_enhancement"] = {
            "used": False,
            "confidence": ai_confidence,
            "reason": ai_result.get(
                "reason"
            ),
        }

        return result

    ai_merchant = ai_result.get(
        "merchant_name"
    )

    ai_description = ai_result.get(
        "service_description"
    )

    parser_merchant = metadata.get(
        "merchant_name"
    )

    parser_description = metadata.get(
        "service_description"
    )

    if (
        ai_merchant
        and is_suspicious_merchant(
            parser_merchant
        )
    ):
        metadata["merchant_name"] = (
            ai_merchant
        )

        transaction[
            "merchant_name"
        ] = ai_merchant

    if (
        ai_description
        and (
            is_suspicious_description(parser_description)
            or (
                parser_description
                and len(parser_description.split()) <= 2
            )
        )
    ):
        metadata[
            "service_description"
        ] = ai_description

    merchant = metadata.get(
        "merchant_name"
    )

    description = metadata.get(
        "service_description"
    )

    if merchant and description:
        if (
            merchant.lower()
            not in description.lower()
        ):
            transaction[
                "description"
            ] = (
                f"{description} - {merchant}"
            )[:255]
        else:
            transaction[
                "description"
            ] = description[:255]

    elif description:
        transaction[
            "description"
        ] = description[:255]

    elif merchant:
        transaction[
            "description"
        ] = merchant[:255]

    metadata["ai_enhancement"] = {
        "used": True,
        "confidence": ai_confidence,
        "reason": ai_result.get(
            "reason"
        ),
    }

    return result


def enhance_invoice_result(
    parser_result: dict,
    extracted_text: str,
) -> dict:
    if not needs_ai_invoice_enhancement(
        parser_result
    ):
        parser_result.setdefault(
            "document_metadata",
            {},
        )["ai_enhancement"] = {
            "used": False,
            "confidence": parser_result.get(
                "confidence",
                0.0,
            ),
            "reason": (
                "Rule-based parser produced a reliable result."
            ),
        }

        return parser_result

    ai_result = (
        extract_invoice_fields(
            extracted_text
        )
    )

    return merge_invoice_result(
        parser_result,
        ai_result,
    )