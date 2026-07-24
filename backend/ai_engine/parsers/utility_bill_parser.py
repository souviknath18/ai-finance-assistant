import re
from datetime import datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Optional


UTILITY_PROVIDER_KEYWORDS = {
    "electricity": [
        "electricity",
        "power supply",
        "energy charges",
        "meter reading",
        "units consumed",
        "kwh",
        "bescom",
        "mescom",
        "hescom",
        "gescom",
        "tangedco",
        "torrent power",
        "adani electricity",
        "tata power",
    ],
    "water": [
        "water bill",
        "water supply",
        "water charges",
        "water board",
        "bwssb",
        "jal board",
        "municipal water",
        "water consumption",
    ],
    "gas": [
        "gas bill",
        "gas consumption",
        "png bill",
        "piped natural gas",
        "indraprastha gas",
        "mahanagar gas",
        "adani gas",
        "gail gas",
    ],
    "internet": [
        "broadband",
        "internet bill",
        "fiber bill",
        "wifi bill",
        "airtel xstream",
        "jiofiber",
        "act fibernet",
        "bsnl broadband",
    ],
    "telephone": [
        "mobile bill",
        "telephone bill",
        "postpaid bill",
        "billing cycle",
        "airtel",
        "vodafone idea",
        "reliance jio",
        "bsnl",
    ],
}


FINAL_AMOUNT_PATTERNS = [
    # Highest-priority payable labels
    r"\btotal\s+amount\s+payable\b\s*(?:\(.*?\))?\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\bnet\s+amount\s+payable\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\bnet\s+payable\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\bamount\s+payable\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\btotal\s+payable\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\bgrand\s+total\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\btotal\s+amount\s+due\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\bamount\s+due\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",

    # Lower-priority fallback labels
    r"\bcurrent\s+bill\s+amount\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
    r"\bbill\s+amount\b\s*[:\-]?\s*[₹rsinr.\s]*([\d,]+(?:\.\d{1,2})?)",
]


DATE_VALUE_PATTERN = (
    r"("
    r"[0-3]?\d[\/\-.][01]?\d[\/\-.](?:\d{2}|\d{4})"
    r"|"
    r"[0-3]?\d(?:\s+|[-/.])[A-Za-z]{3,9}"
    r"(?:\s+|[-/.])\d{2,4}"
    r")"
)


DATE_PATTERNS = [
    rf"\bbill\s+date\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
    rf"\binvoice\s+date\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
    rf"\bstatement\s+date\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
    rf"\breading\s+date\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
]


DUE_DATE_PATTERNS = [
    rf"\bdue\s+date\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
    rf"\blast\s+date\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
    rf"\bpayment\s+due\b\s*[:=\-]?\s*{DATE_VALUE_PATTERN}",
]


REFERENCE_PATTERNS = [
    r"\bbill\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
    r"\binvoice\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
    r"\bconsumer\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
    r"\baccount\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
    r"\bca\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
    r"\brr\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
    r"\bservice\s+(?:number|no\.?)\b\s*[:\-]?\s*([A-Z0-9\/\-]+)",
]


PROVIDER_PATTERNS = [
    r"([A-Z][A-Za-z&.,\- ]{3,80}(?:Electricity|Power|Water|Gas|Broadband|Telecom)[A-Za-z&.,\- ]{0,60})",
    r"\b(BESCOM|MESCOM|HESCOM|GESCOM|BWSSB|TANGEDCO|JIOFIBER|AIRTEL|BSNL)\b",
]


DATE_FORMATS = [
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%d.%m.%Y",
    "%d-%m-%y",
    "%d/%m/%y",

    "%d %b %Y",
    "%d %B %Y",

    "%d-%b-%Y",
    "%d-%B-%Y",

    "%d %b %y",
    "%d %B %y",
    "%d-%b-%y",
    "%d-%B-%y",
]


def clean_text(text: str) -> str:
    """Normalize OCR spacing while preserving line structure."""
    if not text:
        return ""

    text = text.replace("\u00a0", " ")
    text = text.replace("₹", " ₹ ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def parse_decimal(value: Any) -> Optional[Decimal]:
    if value is None:
        return None

    cleaned = str(value).strip()
    cleaned = cleaned.replace(",", "")
    cleaned = cleaned.replace("₹", "")
    cleaned = re.sub(r"(?i)\b(?:rs\.?|inr)\b", "", cleaned)
    cleaned = cleaned.strip()

    match = re.search(r"-?\d+(?:\.\d{1,2})?", cleaned)

    if not match:
        return None

    try:
        return Decimal(match.group(0)).quantize(
            Decimal("0.01")
        )
    except InvalidOperation:
        return None


def parse_date_value(value: str):
    if not value:
        return None

    cleaned = re.sub(
        r"\s+",
        " ",
        value.strip(),
    )

    for date_format in DATE_FORMATS:
        try:
            return datetime.strptime(
                cleaned,
                date_format,
            ).date()
        except ValueError:
            continue

    return None


def extract_first_match(
    text: str,
    patterns: list[str],
) -> Optional[str]:
    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE | re.MULTILINE,
        )

        if match:
            return match.group(1).strip()

    return None


def extract_amount_after_label(
    text: str,
    label_pattern: str,
) -> Optional[Decimal]:
    """
    Search close to a high-priority label instead of allowing
    regex matching across the entire document.
    """
    label_match = re.search(
        label_pattern,
        text,
        flags=re.IGNORECASE | re.MULTILINE,
    )

    if not label_match:
        return None

    nearby_text = text[
        label_match.start():
        min(label_match.end() + 120, len(text))
    ]

    number_matches = re.findall(
        r"(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
        nearby_text,
        flags=re.IGNORECASE,
    )

    for value in number_matches:
        amount = parse_decimal(value)

        if amount is not None and amount > 0:
            return amount

    return None


def extract_final_payable_amount(
    text: str,
) -> Optional[Decimal]:
    """
    Extract the final payable amount in strict priority order.

    Handles clean text such as:
        TOTAL AMOUNT PAYABLE 1,266.09

    and corrupted OCR such as:
        TOTAL AMCUNTIEAYAELE < 1,266.09
    """

    high_priority_patterns = [
        r"\btotal\s+amount\s+payable\b",
        r"\bnet\s+amount\s+payable\b",
        r"\bnet\s+payable\b",
        r"\bamount\s+payable\b",
        r"\btotal\s+payable\b",
        r"\bgrand\s+total\b",
        r"\btotal\s+amount\s+due\b",
        r"\bamount\s+due\b",
    ]

    # 1. Try clean, high-priority labels.
    for label_pattern in high_priority_patterns:
        amount = extract_amount_after_label(
            text,
            label_pattern,
        )

        if amount is not None:
            return amount

    # 2. Handle OCR-corrupted payable lines.
    #
    # Example:
    # TOTAL AMCUNTIEAYAELE < 1,266.09
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    for line in lines:
        normalized_line = line.lower()

        has_total_word = re.search(
            r"\bt[o0]tal\b",
            normalized_line,
        )

        # OCR may corrupt "amount payable", but the line normally
        # still begins with TOTAL and contains the final amount.
        looks_like_final_total = (
            has_total_word
            and not re.search(
                r"\b(?:sub\s*total|tax\s+total)\b",
                normalized_line,
            )
        )

        if not looks_like_final_total:
            continue

        amounts = re.findall(
            r"(?<!\d)([\d,]+\.\d{1,2})(?!\d)",
            line,
        )

        if amounts:
            amount = parse_decimal(amounts[-1])

            if (
                amount is not None
                and Decimal("0") < amount < Decimal("10000000")
            ):
                return amount

    # 3. Try OCR-tolerant versions of "amount payable".
    ocr_tolerant_patterns = [
        r"\btotal\b.{0,35}\b(?:payable|payab[e3]le|paya\w*)\b",
        r"\btotal\b.{0,35}\b(?:amount|am[o0]unt|amcunt)\b",
    ]

    for pattern in ocr_tolerant_patterns:
        amount = extract_amount_after_label(
            text,
            pattern,
        )

        if amount is not None:
            return amount

    # 4. Only use Bill Amount as a last resort.
    fallback_patterns = [
        r"\bcurrent\s+bill\s+amount\b",
        r"\bbill\s+amount\b",
    ]

    for label_pattern in fallback_patterns:
        amount = extract_amount_after_label(
            text,
            label_pattern,
        )

        if amount is not None:
            return amount

    return None


def extract_bill_date(text: str):
    raw_date = extract_first_match(
        text,
        DATE_PATTERNS,
    )

    return parse_date_value(raw_date)


def extract_due_date(text: str):
    raw_date = extract_first_match(
        text,
        DUE_DATE_PATTERNS,
    )

    return parse_date_value(raw_date)


def extract_reference_number(
    text: str,
) -> Optional[str]:
    reference = extract_first_match(
        text,
        REFERENCE_PATTERNS,
    )

    if not reference:
        return None

    reference = reference.strip(" .:-")

    return reference[:100] or None


def detect_utility_type(text: str) -> str:
    normalized_text = text.lower()

    scores = {}

    for utility_type, keywords in (
        UTILITY_PROVIDER_KEYWORDS.items()
    ):
        scores[utility_type] = sum(
            1
            for keyword in keywords
            if keyword in normalized_text
        )

    best_type = max(
        scores,
        key=scores.get,
    )

    if scores[best_type] == 0:
        return "utility"

    return best_type


def normalize_provider_name(
    provider: Optional[str],
) -> Optional[str]:
    if not provider:
        return None

    provider = re.sub(
        r"\s+",
        " ",
        provider,
    ).strip(" .,:;-")

    provider_aliases = {
        "bescom": (
            "Bangalore Electricity Supply "
            "Company Limited"
        ),
        "mescom": (
            "Mangalore Electricity Supply "
            "Company Limited"
        ),
        "hescom": (
            "Hubli Electricity Supply "
            "Company Limited"
        ),
        "gescom": (
            "Gulbarga Electricity Supply "
            "Company Limited"
        ),
        "bwssb": (
            "Bangalore Water Supply and "
            "Sewerage Board"
        ),
        "tangedco": (
            "Tamil Nadu Generation and "
            "Distribution Corporation"
        ),
        "jiofiber": "JioFiber",
        "airtel": "Airtel",
        "bsnl": "BSNL",
    }

    alias = provider_aliases.get(
        provider.lower()
    )

    if alias:
        return alias

    return provider[:255]


def extract_provider_name(
    text: str,
) -> Optional[str]:
    normalized_text = text.lower()

    # Always prefer known provider aliases.
    known_aliases = [
        "bescom",
        "mescom",
        "hescom",
        "gescom",
        "bwssb",
        "tangedco",
        "jiofiber",
        "airtel",
        "bsnl",
    ]

    for alias in known_aliases:
        if re.search(
            rf"\b{re.escape(alias)}\b",
            normalized_text,
        ):
            return normalize_provider_name(alias)

    # Use broad provider patterns only when no known alias exists.
    for pattern in PROVIDER_PATTERNS:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE | re.MULTILINE,
        )

        if match:
            return normalize_provider_name(
                match.group(1)
            )

    return None


def calculate_confidence(
    *,
    amount: Optional[Decimal],
    bill_date,
    provider_name: Optional[str],
    reference_number: Optional[str],
    utility_type: str,
) -> float:
    confidence = 0.0

    if amount is not None:
        confidence += 0.45

    if bill_date is not None:
        confidence += 0.20

    if provider_name:
        confidence += 0.15

    if reference_number:
        confidence += 0.10

    if utility_type != "utility":
        confidence += 0.10

    return round(
        min(confidence, 1.0),
        2,
    )


def build_description(
    provider_name: Optional[str],
    utility_type: str,
) -> str:
    readable_type = utility_type.replace(
        "_",
        " ",
    ).title()

    if provider_name:
        return (
            f"{readable_type} bill payment "
            f"to {provider_name}"
        )

    return f"{readable_type} bill payment"


def parse_utility_bill_transactions(
    extracted_text: str,
) -> dict[str, Any]:
    """
    Parse one utility bill into one expense transaction.

    The final amount is stored as a negative value because
    utility payments represent expenses.
    """

    text = clean_text(
        extracted_text
    )

    warnings = []

    if not text:
        return {
            "parser": "utility_bill_parser",
            "document_type": "utility_bill",
            "confidence": 0.0,
            "transactions": [],
            "warnings": [
                "No utility bill text was provided."
            ],
        }

    utility_type = detect_utility_type(text)
    provider_name = extract_provider_name(text)
    reference_number = extract_reference_number(
        text
    )
    bill_date = extract_bill_date(text)
    due_date = extract_due_date(text)
    payable_amount = extract_final_payable_amount(
        text
    )

    if payable_amount is None:
        warnings.append(
            "Final payable amount could not be extracted."
        )

    if bill_date is None:
        warnings.append(
            "Bill date could not be extracted."
        )

    if provider_name is None:
        warnings.append(
            "Utility provider could not be extracted."
        )

    if reference_number is None:
        warnings.append(
            "Bill or account reference could not be extracted."
        )

    confidence = calculate_confidence(
        amount=payable_amount,
        bill_date=bill_date,
        provider_name=provider_name,
        reference_number=reference_number,
        utility_type=utility_type,
    )

    if payable_amount is None:
        transactions = []
    else:
        description = build_description(
            provider_name=provider_name,
            utility_type=utility_type,
        )

        transactions = [
            {
                "date": bill_date,
                "description": description,
                "merchant_name": provider_name,
                "reference_number": reference_number,
                "amount": -abs(payable_amount),
                "transaction_type": "expense",
                "balance_after_transaction": None,
                "raw_text": text,
                "metadata": {
                    "utility_type": utility_type,
                    "due_date": (
                        due_date.isoformat()
                        if due_date
                        else None
                    ),
                    "bill_amount": str(
                        payable_amount
                    ),
                },
            }
        ]

    return {
        "parser": "utility_bill_parser",
        "document_type": "utility_bill",
        "confidence": confidence,
        "transactions": transactions,
        "warnings": warnings,
        "metadata": {
            "utility_type": utility_type,
            "provider_name": provider_name,
            "reference_number": reference_number,
            "bill_date": (
                bill_date.isoformat()
                if bill_date
                else None
            ),
            "due_date": (
                due_date.isoformat()
                if due_date
                else None
            ),
            "final_payable_amount": (
                str(payable_amount)
                if payable_amount is not None
                else None
            ),
        },
    }