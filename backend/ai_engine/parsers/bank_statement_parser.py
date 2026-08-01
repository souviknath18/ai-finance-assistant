import re
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Optional


HORIZONTAL_ROW_PATTERN = re.compile(
    r"""
    ^
    (?P<day>\d{1,2})
    \s+
    (?P<month>
        Jan(?:uary)?|
        Feb(?:ruary)?|
        Mar(?:ch)?|
        Apr(?:il)?|
        May|
        Jun(?:e)?|
        Jul(?:y)?|
        Aug(?:ust)?|
        Sep(?:tember)?|
        Oct(?:ober)?|
        Nov(?:ember)?|
        Dec(?:ember)?
    )
    \s+
    (?P<year>\d{4})
    \s+
    (?P<body>.+)
    $
    """,
    re.IGNORECASE | re.VERBOSE,
)


TYPE_MARKER_PATTERN = re.compile(
    r"\b(?P<marker>Debit|Credit|DR|CR)\b",
    re.IGNORECASE,
)


NUMBER_TOKEN_PATTERN = re.compile(
    r"""
    (?<!\d)
    (?:INR\s*)?
    [-+]?
    \d[\d,]*
    (?:\.\d{1,2})?
    (?!\d)
    """,
    re.IGNORECASE | re.VERBOSE,
)


FULL_DATE_PATTERNS = [
    # 03 May 2024
    re.compile(
        r"^(?P<day>\d{1,2})\s+"
        r"(?P<month>"
        r"Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|"
        r"Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|"
        r"Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|"
        r"Nov(?:ember)?|Dec(?:ember)?"
        r")\s+"
        r"(?P<year>\d{4})$",
        re.IGNORECASE,
    ),

    # May 03, 2024
    re.compile(
        r"^(?P<month>"
        r"Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|"
        r"Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|"
        r"Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|"
        r"Nov(?:ember)?|Dec(?:ember)?"
        r")\s+"
        r"(?P<day>\d{1,2}),?\s+"
        r"(?P<year>\d{4})$",
        re.IGNORECASE,
    ),

    # 03/05/2024 or 03-05-2024
    re.compile(
        r"^(?P<day>\d{1,2})[/-]"
        r"(?P<month_number>\d{1,2})[/-]"
        r"(?P<year>\d{4})$"
    ),
]


AMOUNT_PATTERN = re.compile(
    r"""
    ^
    [-+]?
    (?:
        ₹|
        Rs\.?|
        INR
    )?
    \s*
    \d[\d,]*
    (?:\.\d{1,2})?
    $
    """,
    re.IGNORECASE | re.VERBOSE,
)


TRANSACTION_SECTION_HEADERS = {
    "transactions",
    "transaction details",
    "transaction detail",
    "statement transactions",
}


TABLE_HEADERS = {
    "date",
    "description",
    "narration",
    "particulars",
    "transaction type",
    "type",
    "debit",
    "credit",
    "withdrawal",
    "deposit",
    "amount",
    "balance",
    "running balance",
}


DEBIT_MARKERS = {
    "debit",
    "dr",
    "withdrawal",
}


CREDIT_MARKERS = {
    "credit",
    "cr",
    "deposit",
}


def parse_horizontal_transaction_row(
    line: str,
) -> Optional[dict]:
    row_match = HORIZONTAL_ROW_PATTERN.match(
        normalize_line(line)
    )

    if not row_match:
        return None

    day = int(
        row_match.group("day")
    )

    month_text = (
        row_match.group("month")[:3]
        .title()
    )

    year = int(
        row_match.group("year")
    )

    try:
        month = datetime.strptime(
            month_text,
            "%b",
        ).month

        transaction_date = date(
            year,
            month,
            day,
        )
    except ValueError:
        return None

    body = row_match.group(
        "body"
    ).strip()

    marker_match = TYPE_MARKER_PATTERN.search(
        body
    )

    if not marker_match:
        return None

    marker = marker_match.group(
        "marker"
    ).lower()

    description = normalize_line(
        body[:marker_match.start()]
    )

    if (
        not description
        or should_ignore_description(
            description
        )
    ):
        return None

    remainder = body[
        marker_match.end():
    ]

    # Ignore placeholder hyphens and collect numeric cells.
    amount_tokens = (
        NUMBER_TOKEN_PATTERN.findall(
            remainder
        )
    )

    amounts = [
        parse_decimal_amount(token)
        for token in amount_tokens
    ]

    amounts = [
        amount
        for amount in amounts
        if amount is not None
    ]

    # A real transaction row must have:
    # transaction amount + running balance.
    if len(amounts) < 2:
        return None

    transaction_amount = amounts[0]
    running_balance = amounts[-1]

    transaction_type = (
        "income"
        if marker in {
            "credit",
            "cr",
        }
        else "expense"
    )

    signed_amount = (
        abs(transaction_amount)
        if transaction_type == "income"
        else -abs(transaction_amount)
    )

    return {
        "date": transaction_date,
        "description": description,
        "merchant_name": None,
        "reference_number": None,
        "amount": signed_amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": (
            running_balance
        ),
        "raw_text": line,
    }


def normalize_line(line: str) -> str:
    return re.sub(
        r"\s+",
        " ",
        str(line or ""),
    ).strip()


def parse_transaction_date(
    value: str,
) -> Optional[date]:
    value = normalize_line(value)

    for pattern in FULL_DATE_PATTERNS:
        match = pattern.match(value)

        if not match:
            continue

        values = match.groupdict()

        try:
            year = int(values["year"])
            day = int(values["day"])

            if values.get("month_number"):
                month = int(
                    values["month_number"]
                )
            else:
                month_text = values[
                    "month"
                ][:3].title()

                month = datetime.strptime(
                    month_text,
                    "%b",
                ).month

            return date(
                year,
                month,
                day,
            )

        except (
            ValueError,
            TypeError,
        ):
            return None

    return None


def parse_decimal_amount(
    value: str,
) -> Optional[Decimal]:
    cleaned = (
        str(value or "")
        .replace("₹", "")
        .replace("Rs.", "")
        .replace("Rs", "")
        .replace("INR", "")
        .replace(",", "")
        .replace(" ", "")
        .strip()
    )

    if not cleaned:
        return None

    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def is_amount_line(line: str) -> bool:
    return bool(
        AMOUNT_PATTERN.match(
            normalize_line(line)
        )
    )


def should_ignore_description(
    description: str,
) -> bool:
    normalized = normalize_line(
        description
    ).lower()

    ignored_phrases = {
        "opening balance",
        "closing balance",
        "brought forward",
        "balance brought forward",
        "carried forward",
        "balance carried forward",
    }

    return any(
        phrase in normalized
        for phrase in ignored_phrases
    )


def find_transaction_section(
    lines: list[str],
) -> list[str]:
    """
    Return only the portion after the transaction-table heading.

    If no heading is found, keep the complete text so other bank
    formats can still be attempted.
    """

    for index, line in enumerate(lines):
        normalized = line.lower().strip()

        if normalized in TRANSACTION_SECTION_HEADERS:
            return lines[index + 1:]

    return lines


def remove_table_headers(
    lines: list[str],
) -> list[str]:
    cleaned: list[str] = []

    for line in lines:
        normalized = line.lower().strip()

        if normalized in TABLE_HEADERS:
            continue

        if normalized.startswith("--- page"):
            continue

        cleaned.append(line)

    return cleaned


def split_transaction_blocks(
    lines: list[str],
) -> list[tuple[date, list[str]]]:
    """
    Split the transaction table into blocks beginning with a full date.

    Example block:

    03 May 2024
    UPI Payment to Amazon
    Debit
    1,250.00
    23,750.00
    """

    blocks: list[tuple[date, list[str]]] = []

    current_date: Optional[date] = None
    current_lines: list[str] = []

    for line in lines:
        parsed_date = parse_transaction_date(
            line
        )

        if parsed_date:
            if current_date is not None:
                blocks.append(
                    (
                        current_date,
                        current_lines,
                    )
                )

            current_date = parsed_date
            current_lines = []
            continue

        if current_date is not None:
            current_lines.append(line)

    if current_date is not None:
        blocks.append(
            (
                current_date,
                current_lines,
            )
        )

    return blocks


def detect_type_from_marker(
    marker: Optional[str],
    description: str,
) -> str:
    normalized_marker = normalize_line(
        marker or ""
    ).lower()

    if normalized_marker in CREDIT_MARKERS:
        return "income"

    if normalized_marker in DEBIT_MARKERS:
        return "expense"

    description_text = description.lower()

    income_keywords = {
        "salary",
        "credit",
        "credited",
        "deposit",
        "refund",
        "reversal",
        "cashback",
        "interest",
        "received",
        "upi received",
        "neft from",
        "imps from",
        "rtgs from",
    }

    expense_keywords = {
        "debit",
        "debited",
        "withdrawal",
        "payment",
        "purchase",
        "paid",
        "fee",
        "charge",
        "upi payment",
        "bill payment",
        "neft to",
        "imps to",
        "rtgs to",
        "transfer to",
        "recharge",
    }

    if any(
        keyword in description_text
        for keyword in income_keywords
    ):
        return "income"

    if any(
        keyword in description_text
        for keyword in expense_keywords
    ):
        return "expense"

    return "expense"


def parse_transaction_block(
    transaction_date: date,
    block_lines: list[str],
) -> Optional[dict]:
    normalized_lines = [
        normalize_line(line)
        for line in block_lines
        if normalize_line(line)
    ]

    if not normalized_lines:
        return None

    marker: Optional[str] = None
    marker_index: Optional[int] = None

    for index, line in enumerate(
        normalized_lines
    ):
        normalized = line.lower()

        if (
            normalized in DEBIT_MARKERS
            or normalized in CREDIT_MARKERS
        ):
            marker = normalized
            marker_index = index
            break

    amount_indexes = [
        index
        for index, line in enumerate(
            normalized_lines
        )
        if is_amount_line(line)
    ]

    # Opening balances normally contain only one amount.
    if len(amount_indexes) < 2:
        description = " ".join(
            line
            for line in normalized_lines
            if not is_amount_line(line)
        )

        if should_ignore_description(
            description
        ):
            return None

        return None

    if marker_index is not None:
        description_lines = normalized_lines[
            :marker_index
        ]

        numeric_after_marker = [
            line
            for line in normalized_lines[
                marker_index + 1:
            ]
            if is_amount_line(line)
        ]
    else:
        first_amount_index = amount_indexes[0]

        description_lines = normalized_lines[
            :first_amount_index
        ]

        numeric_after_marker = [
            normalized_lines[index]
            for index in amount_indexes
        ]

    description = normalize_line(
        " ".join(description_lines)
    )

    if (
        not description
        or should_ignore_description(
            description
        )
    ):
        return None

    if len(numeric_after_marker) < 2:
        return None

    transaction_amount = parse_decimal_amount(
        numeric_after_marker[0]
    )

    balance = parse_decimal_amount(
        numeric_after_marker[1]
    )

    if (
        transaction_amount is None
        or transaction_amount == 0
    ):
        return None

    transaction_type = detect_type_from_marker(
        marker=marker,
        description=description,
    )

    # Keep your existing signed-amount convention.
    signed_amount = (
        abs(transaction_amount)
        if transaction_type == "income"
        else -abs(transaction_amount)
    )

    return {
        "date": transaction_date,
        "description": description,
        "merchant_name": None,
        "reference_number": None,
        "amount": signed_amount,
        "transaction_type": transaction_type,
        "balance_after_transaction": balance,
        "raw_text": "\n".join(
            [
                transaction_date.strftime(
                    "%d %b %Y"
                ),
                *normalized_lines,
            ]
        ),
    }


def calculate_parser_confidence(
    candidate_count: int,
    transactions: list[dict],
) -> float:
    if candidate_count == 0:
        return 0.20

    parsed_count = len(transactions)

    coverage = (
        parsed_count / candidate_count
    )

    if (
        candidate_count >= 2
        and coverage >= 0.95
    ):
        return 0.98

    if coverage >= 0.80:
        return 0.90

    if coverage >= 0.60:
        return 0.70

    if coverage >= 0.30:
        return 0.50

    return 0.25


def parse_bank_statement_transactions(
    extracted_text: str,
) -> dict:
    all_lines = [
        normalize_line(line)
        for line in extracted_text.splitlines()
        if normalize_line(line)
    ]

    transaction_lines = find_transaction_section(
        all_lines
    )

    transaction_lines = remove_table_headers(
        transaction_lines
    )

    horizontal_transactions = []

    for line in transaction_lines:
        transaction = (
            parse_horizontal_transaction_row(
                line
            )
        )

        if transaction:
            horizontal_transactions.append(
                transaction
            )

    # OCR commonly returns one complete transaction per line.
    if horizontal_transactions:
        candidate_count = len(
            horizontal_transactions
        )

        return {
            "document_type": (
                "bank_statement"
            ),
            "transactions": (
                horizontal_transactions
            ),
            "confidence": 0.98,
            "parser": (
                "horizontal_ocr_bank_"
                "statement_parser_v4"
            ),
            "document_metadata": {
                "candidate_transaction_count": (
                    candidate_count
                ),
                "parsed_transaction_count": len(
                    horizontal_transactions
                ),
                "layout": "horizontal_ocr",
            },
            "warnings": [],
        }

    # Fall back to vertically extracted PDF layout.
    blocks = split_transaction_blocks(
        transaction_lines
    )

    transactions = []

    for transaction_date, block_lines in blocks:
        transaction = parse_transaction_block(
            transaction_date,
            block_lines,
        )

        if transaction:
            transactions.append(
                transaction
            )

    candidate_count = sum(
        1
        for _, block_lines in blocks
        if not should_ignore_description(
            " ".join(block_lines)
        )
    )

    confidence = calculate_parser_confidence(
        candidate_count=candidate_count,
        transactions=transactions,
    )

    return {
        "document_type": "bank_statement",
        "transactions": transactions,
        "confidence": confidence,
        "parser": (
            "vertical_bank_statement_parser_v4"
        ),
        "document_metadata": {
            "candidate_transaction_count": (
                candidate_count
            ),
            "parsed_transaction_count": len(
                transactions
            ),
            "layout": "vertical",
        },
        "warnings": [],
    }