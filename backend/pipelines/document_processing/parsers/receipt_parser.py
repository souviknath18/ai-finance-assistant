import re
from datetime import datetime
from decimal import Decimal

from .schema import empty_parser_result
from ..normalization.transaction import (
    build_transaction,
    parse_decimal_amount,
)


FINAL_AMOUNT_LABELS = [
    "total amount payable",
    "amount payable",
    "amount paid",
    "total paid",
    "grand total",
    "net total",
    "total amount",
    "total payable",
    "amount due",
    "amount received",
    "balance paid",
    "total",
]

DATE_PATTERNS = [
    r"date\s*[:\-]?\s*([^\n]+)",
    r"paid\s+on\s*[:\-]?\s*([^\n]+)",
    r"transaction\s+date\s*[:\-]?\s*([^\n]+)",
]

DATE_FORMATS = [
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%d %b %Y",
    "%d %B %Y",
    "%d-%b-%Y",
]


def parse_receipt_transactions(
    extracted_text: str,
):
    result = empty_parser_result(
        document_type="receipt",
        parser="receipt_parser_v1",
        confidence=0.20,
    )

    merchant_name = extract_merchant_name(
        extracted_text
    )

    item_name = extract_receipt_item(
        extracted_text
    )

    amount = extract_paid_amount(
        extracted_text
    )

    receipt_date = extract_receipt_date(
        extracted_text
    )

    receipt_number = extract_receipt_number(
        extracted_text
    )

    if amount is None:
        result["warnings"].append(
            {
                "code": "missing_receipt_amount",
                "message": (
                    "A reliable paid amount could not be found."
                ),
            }
        )

        return result

    transaction = build_transaction(
        transaction_date=receipt_date,
        description=build_receipt_description(
            merchant_name,
            item_name,
        ),
        merchant_name=merchant_name,
        amount=amount,
        transaction_type="expense",
        balance_after_transaction=None,
        reference_number=receipt_number,
        raw_text=extracted_text,
    )

    confidence = Decimal("0.35")

    if merchant_name:
        confidence += Decimal("0.20")

    if item_name:
        confidence += Decimal("0.15")

    if receipt_date:
        confidence += Decimal("0.10")
    else:
        result["warnings"].append(
            {
                "code": "missing_receipt_date",
                "message": "Receipt date was not found.",
            }
        )

    if receipt_number:
        confidence += Decimal("0.10")

    if amount is not None:
        confidence += Decimal("0.25")

    result["confidence"] = float(
        min(confidence, Decimal("0.95"))
    )

    result["transactions"] = [transaction]

    result["document_metadata"] = {
        "receipt_number": receipt_number,
        "receipt_date": receipt_date,
        "merchant_name": merchant_name,
        "item_name": item_name,
        "amount_paid": amount,
    }

    return result


def extract_paid_amount(
    extracted_text: str,
) -> Decimal | None:
    lines = [
        " ".join(line.split())
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    ignored_terms = (
        "discount",
        "subtotal",
        "sub total",
        "tax",
        "gst",
        "cgst",
        "sgst",
        "igst",
    )

    # Strategy 1:
    # Find final-payment labels and check both:
    # 1. the same line
    # 2. the next one or two lines
    for label in FINAL_AMOUNT_LABELS:
        for index in range(len(lines) - 1, -1, -1):
            line = lines[index]
            lower_line = line.lower()

            if label not in lower_line:
                continue

            if any(
                term in lower_line
                for term in ignored_terms
            ):
                continue

            # Check the label line itself.
            amounts = extract_amounts(line)

            if amounts:
                return amounts[-1]

            # OCR often places the value below the label.
            for offset in (1, 2):
                next_index = index + offset

                if next_index >= len(lines):
                    break

                next_line = lines[next_index]
                next_lower = next_line.lower()

                if any(
                    term in next_lower
                    for term in ignored_terms
                ):
                    continue

                next_amounts = extract_amounts(
                    next_line
                )

                if next_amounts:
                    return next_amounts[-1]

    # Strategy 2:
    # Fallback candidates, excluding subtotal/tax values.
    candidates: list[Decimal] = []

    for index, line in enumerate(lines):
        lower_line = line.lower()

        if any(
            term in lower_line
            for term in ignored_terms
        ):
            continue

        # Also exclude a number immediately below an
        # ignored label such as Subtotal, CGST or SGST.
        if index > 0:
            previous_lower = lines[index - 1].lower()

            if any(
                term in previous_lower
                for term in ignored_terms
            ):
                continue

        amounts = extract_amounts(line)

        if amounts:
            candidates.extend(amounts)

    if candidates:
        return max(candidates)

    return None


def extract_amounts(
    line: str,
) -> list[Decimal]:
    values = re.findall(
        r"(?:₹|INR|Rs\.?)?\s*"
        r"(-?\d[\d,]*\.\d{1,2})",
        line,
        flags=re.IGNORECASE,
    )

    amounts = []

    for value in values:
        parsed = parse_decimal_amount(value)

        if parsed is not None:
            amounts.append(abs(parsed))

    return amounts


def extract_receipt_number(
    extracted_text: str,
) -> str | None:
    patterns = [
        r"receipt\s*(?:number|no\.?|#)\s*[:\-]?\s*([A-Za-z0-9/_\-]+)",
        r"transaction\s*(?:id|number)\s*[:\-]?\s*([A-Za-z0-9/_\-]+)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

    return None


def extract_receipt_date(
    extracted_text: str,
):
    for pattern in DATE_PATTERNS:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        candidate = (
            match.group(1)
            .splitlines()[0]
            .strip(" :-")
        )

        for date_format in DATE_FORMATS:
            try:
                return datetime.strptime(
                    candidate,
                    date_format,
                ).date()
            except ValueError:
                continue

    return None


MERCHANT_STRONG_PATTERNS = [
    r"\bpvt\.?\s*ltd\.?\b",
    r"\bprivate\s+limited\b",
    r"\blimited\b",
    r"\bllp\b",
    r"\binc\.?\b",
    r"\bcorporation\b",
    r"\btechnologies\b",
]

MERCHANT_BUSINESS_PATTERNS = [
    r"\bcafe\b",
    r"\brestaurant\b",
    r"\bstore\b",
    r"\bmart\b",
    r"\bpharmacy\b",
    r"\bhotel\b",
    r"\bbakery\b",
    r"\bservices\b",
    r"\bsolutions\b",
]

MERCHANT_REJECTED_TERMS = {
    "receipt",
    "payment receipt",
    "tax receipt",
    "invoice",
    "thank you",
    "gstin",
    "phone",
    "mobile",
    "website",
    "email",
    "transaction",
    "receipt no",
    "receipt number",
    "payment method",
    "payment successful",
    "paid successfully",
    "customer copy",
    "merchant copy",
    "bill to",
    "ship to",
    "date",
    "time",
}


def clean_merchant_candidate(
    line: str,
) -> str:
    patterns = [
        r"\s+receipt\s*(?:number|no\.?|#)\s*[:\-].*$",
        r"\s+transaction\s*(?:id|number)\s*[:\-].*$",
        r"\s+date\s*[:\-].*$",
        r"\s+payment\s+method\s*[:\-].*$",
    ]

    cleaned = line

    for pattern in patterns:
        cleaned = re.sub(
            pattern,
            "",
            cleaned,
            flags=re.IGNORECASE,
        )

    return cleaned.strip(" ,:-")


def extract_merchant_name(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    candidates: list[tuple[int, str]] = []

    for index, original_line in enumerate(lines[:20]):
        line = clean_merchant_candidate(
            original_line
        )
        lower_line = line.lower()

        if len(line) < 2 or len(line) > 150:
            continue

        if any(
            term in lower_line
            for term in MERCHANT_REJECTED_TERMS
        ):
            continue

        if re.search(
            r"\b\d{5,6}\b",
            line,
        ):
            continue

        if re.search(
            r"\b(?:road|street|sector|layout|floor|"
            r"cross|building|address)\b",
            lower_line,
        ):
            continue

        if re.search(
            r"(?:www\.|https?://|@)",
            lower_line,
        ):
            continue

        strong_match = any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in MERCHANT_STRONG_PATTERNS
        )

        business_match = any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in MERCHANT_BUSINESS_PATTERNS
        )

        # Accept short brand-like lines such as Starbucks,
        # Amazon, IKEA or McDonald's.
        brand_like = (
            1 <= len(line.split()) <= 5
            and re.fullmatch(
                r"[A-Za-z][A-Za-z0-9&.'()\- ]+",
                line,
            )
            is not None
        )

        if not (
            strong_match
            or business_match
            or brand_like
        ):
            continue

        score = max(0, 10 - index)

        if strong_match:
            score += 6

        if business_match:
            score += 4

        if brand_like:
            score += 2

        candidates.append(
            (
                score,
                line[:255],
            )
        )

    if not candidates:
        return None

    return max(
        candidates,
        key=lambda candidate: candidate[0],
    )[1]


ITEM_REJECTED_TERMS = {
    "receipt",
    "invoice",
    "subtotal",
    "sub total",
    "total",
    "amount",
    "tax",
    "gst",
    "cgst",
    "sgst",
    "igst",
    "discount",
    "quantity",
    "qty",
    "unit price",
    "payment method",
    "transaction id",
    "thank you",
}


def extract_receipt_item(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    candidates: list[tuple[int, int, str]] = []

    for index, line in enumerate(lines):
        lower_line = line.lower()

        if any(
            term in lower_line
            for term in ITEM_REJECTED_TERMS
        ):
            continue

        if re.search(
            r"\b(?:gstin|phone|mobile|email|address)\b",
            lower_line,
        ):
            continue

        # Reject currency-only or amount-only lines.
        if re.fullmatch(
            r"(?:₹|INR|Rs\.?)?\s*"
            r"-?\d[\d,]*(?:\.\d{1,2})?",
            line,
            flags=re.IGNORECASE,
        ):
            continue

        # Reject plain quantity values.
        if re.fullmatch(r"\d+", line):
            continue

        # Reject time values.
        if re.fullmatch(
            r"\d{1,2}:\d{2}\s*(?:AM|PM)?",
            line,
            flags=re.IGNORECASE,
        ):
            continue

        # Reject common dates.
        if re.fullmatch(
            r"\d{1,4}[-/]\d{1,2}[-/]\d{1,4}",
            line,
        ):
            continue

        if re.search(
            r"\b\d{5,6}\b",
            line,
        ):
            continue

        if len(line) < 3 or len(line) > 150:
            continue

        cleaned_line = re.sub(
            r"\s+\d+\s+"
            r"(?:₹|INR|Rs\.?)?\s*"
            r"\d[\d,]*\.\d{1,2}\s+"
            r"(?:₹|INR|Rs\.?)?\s*"
            r"\d[\d,]*\.\d{1,2}\s*$",
            "",
            line,
            flags=re.IGNORECASE,
        ).strip()

        cleaned_line = re.sub(
            r"\s+\d+\s+"
            r"(?:₹|INR|Rs\.?)?\s*"
            r"\d[\d,]*\.\d{1,2}\s*$",
            "",
            cleaned_line,
            flags=re.IGNORECASE,
        ).strip()

        if not cleaned_line:
            continue

        word_count = len(cleaned_line.split())

        if not 1 <= word_count <= 12:
            continue

        # Require the candidate to contain letters.
        if not re.search(
            r"[A-Za-z]",
            cleaned_line,
        ):
            continue

        score = 0

        if re.search(
            r"\b(?:service|cleaning|coffee|cappuccino|"
            r"sandwich|brownie|meal|food|medicine|"
            r"repair|subscription|grocery|shirt|book|"
            r"mouse|keyboard)\b",
            cleaned_line,
            flags=re.IGNORECASE,
        ):
            score += 6

        # A text line followed by quantity and price lines
        # is likely an item in vertically extracted tables.
        following_lines = lines[index + 1:index + 4]

        numeric_following_count = sum(
            1
            for following_line in following_lines
            if re.fullmatch(
                r"(?:₹|INR|Rs\.?)?\s*"
                r"-?\d[\d,]*(?:\.\d{1,2})?",
                following_line,
                flags=re.IGNORECASE,
            )
        )

        if numeric_following_count >= 2:
            score += 5

        elif numeric_following_count == 1:
            score += 2

        if 3 <= index <= 30:
            score += 1

        if score > 0:
            candidates.append(
                (
                    score,
                    index,
                    cleaned_line[:255],
                )
            )

    if not candidates:
        return None

    # Highest score wins. For equal scores, the earlier
    # purchased item is preferred.
    return max(
        candidates,
        key=lambda candidate: (
            candidate[0],
            -candidate[1],
        ),
    )[2]


def build_receipt_description(
    merchant_name: str | None,
    item_name: str | None,
) -> str:
    merchant = (
        " ".join(merchant_name.split())
        if merchant_name
        else None
    )
    item = (
        " ".join(item_name.split())
        if item_name
        else None
    )

    if (
        merchant
        and item
        and merchant.lower() != item.lower()
        and merchant.lower() not in item.lower()
    ):
        return f"{item} - {merchant}"[:255]

    if item:
        return item[:255]

    if merchant:
        return merchant[:255]

    return "Receipt Payment"