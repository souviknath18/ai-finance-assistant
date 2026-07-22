import re

from datetime import date, datetime
from decimal import Decimal, InvalidOperation


NET_SALARY_PATTERNS = [
    r"net\s+salary\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
    r"net\s+pay\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
    r"take[\s-]*home\s+(?:salary|pay)?\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
    r"salary\s+payable\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
    r"amount\s+payable\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
]

GROSS_SALARY_PATTERNS = [
    r"gross\s+salary\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
    r"gross\s+pay\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
    r"total\s+earnings\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)",
]

EMPLOYER_PATTERNS = [
    r"(?:company|employer|organisation|organization)\s+name\s*[:\-]\s*(.+)",
    r"paid\s+by\s*[:\-]\s*(.+)",
]

PAYMENT_DATE_PATTERNS = [
    r"(?:payment|salary|pay|credited)\s+date\s*[:\-]\s*([^\n]+)",
    r"date\s+of\s+payment\s*[:\-]\s*([^\n]+)",
]

PAY_PERIOD_PATTERNS = [
    r"(?:pay\s+period|salary\s+month|payroll\s+month|month)\s*[:\-]\s*([^\n]+)",
    r"salary\s+slip\s+for\s+([A-Za-z]+\s+\d{4})",
    r"payslip\s+for\s+([A-Za-z]+\s+\d{4})",
]

DATE_FORMATS = [
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%d.%m.%Y",
    "%d %b %Y",
    "%d %B %Y",
    "%b %d, %Y",
    "%B %d, %Y",
]

MONTH_YEAR_FORMATS = [
    "%b %Y",
    "%B %Y",
    "%m/%Y",
    "%m-%Y",
]


def parse_salary_slip_transactions(extracted_text: str):
    """
    Parse one income transaction from a salary slip.

    The transaction amount is based on net salary/net pay.
    Gross salary is only used as a lower-confidence fallback.
    """

    normalized_text = normalize_text(extracted_text)

    net_salary = extract_amount(
        normalized_text,
        NET_SALARY_PATTERNS,
    )

    gross_salary = extract_amount(
        normalized_text,
        GROSS_SALARY_PATTERNS,
    )

    employer_name = extract_employer_name(extracted_text)
    salary_date = extract_salary_date(extracted_text)

    amount = net_salary
    amount_source = "net_salary"

    if amount is None and gross_salary is not None:
        amount = gross_salary
        amount_source = "gross_salary"

    if amount is None or amount <= 0:
        return empty_result()

    description = (
        f"Salary from {employer_name}"
        if employer_name
        else "Salary income"
    )

    confidence = calculate_confidence(
        net_salary=net_salary,
        gross_salary=gross_salary,
        salary_date=salary_date,
        employer_name=employer_name,
    )

    transaction = {
        "date": salary_date or date.today(),
        "description": description[:500],
        "amount": abs(amount),
        "transaction_type": "income",
        "balance_after_transaction": None,
        "raw_text": build_raw_text(
            employer_name=employer_name,
            salary_date=salary_date,
            amount=amount,
            amount_source=amount_source,
        ),
    }

    return {
        "transactions": [transaction],
        "confidence": confidence,
        "parser": "salary_slip_parser_v1",
    }


def normalize_text(value: str) -> str:
    text = str(value or "")

    text = (
        text.replace("₹", " INR ")
        .replace("Rs.", " INR ")
        .replace("Rs", " INR ")
    )

    return re.sub(r"\s+", " ", text).strip()


def parse_decimal_amount(value: str):
    cleaned = (
        str(value)
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


def extract_amount(text: str, patterns: list[str]):
    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        amount = parse_decimal_amount(match.group(1))

        if amount is not None:
            return amount

    return None


def extract_employer_name(extracted_text: str):
    lines = [
        line.strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    for pattern in EMPLOYER_PATTERNS:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if match:
            employer = clean_employer_name(match.group(1))

            if employer:
                return employer

    # Many salary slips show the company name near the beginning.
    for line in lines[:8]:
        lowered = line.lower()

        if any(
            ignored_text in lowered
            for ignored_text in [
                "salary slip",
                "payslip",
                "pay slip",
                "employee id",
                "employee name",
                "pay period",
                "salary month",
            ]
        ):
            continue

        if (
            2 <= len(line.split()) <= 10
            and not re.search(r"\d{4,}", line)
        ):
            return clean_employer_name(line)

    return None


def clean_employer_name(value: str):
    employer = re.sub(
        r"\s+",
        " ",
        str(value),
    ).strip(" :-")

    if not employer:
        return None

    return employer[:255]


def extract_salary_date(extracted_text: str):
    payment_date = extract_date_from_patterns(
        extracted_text,
        PAYMENT_DATE_PATTERNS,
    )

    if payment_date:
        return payment_date

    pay_period = extract_pay_period(extracted_text)

    if pay_period:
        return pay_period

    return None


def extract_date_from_patterns(
    extracted_text: str,
    patterns: list[str],
):
    for pattern in patterns:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        date_text = clean_date_text(match.group(1))
        parsed_date = parse_full_date(date_text)

        if parsed_date:
            return parsed_date

    return None


def extract_pay_period(extracted_text: str):
    for pattern in PAY_PERIOD_PATTERNS:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        pay_period_text = clean_date_text(match.group(1))

        # Try parsing a full date first
        full_date = parse_full_date(pay_period_text)

        if full_date:
            return full_date

        # Otherwise parse a month/year like "Jun 2026"
        for date_format in MONTH_YEAR_FORMATS:
            try:
                parsed = datetime.strptime(
                    pay_period_text,
                    date_format,
                )

                # Return the last day of that month
                if parsed.month == 12:
                    next_month = date(
                        parsed.year + 1,
                        1,
                        1,
                    )
                else:
                    next_month = date(
                        parsed.year,
                        parsed.month + 1,
                        1,
                    )

                return date.fromordinal(
                    next_month.toordinal() - 1
                )

            except ValueError:
                continue

    return None


def clean_date_text(value: str):
    return (
        str(value)
        .splitlines()[0]
        .strip(" :-")
    )


def parse_full_date(value: str):
    for date_format in DATE_FORMATS:
        try:
            return datetime.strptime(
                value.strip(),
                date_format,
            ).date()
        except ValueError:
            continue

    return None


def calculate_confidence(
    net_salary,
    gross_salary,
    salary_date,
    employer_name,
):
    confidence = Decimal("0.20")

    if net_salary is not None:
        confidence += Decimal("0.50")
    elif gross_salary is not None:
        confidence += Decimal("0.25")

    if salary_date is not None:
        confidence += Decimal("0.15")

    if employer_name:
        confidence += Decimal("0.10")

    return float(min(confidence, Decimal("0.95")))


def build_raw_text(
    employer_name,
    salary_date,
    amount,
    amount_source,
):
    return (
        f"Employer: {employer_name or 'Unknown'}; "
        f"Salary date: {salary_date or 'Unknown'}; "
        f"Amount: {amount}; "
        f"Amount source: {amount_source}"
    )


def empty_result():
    return {
        "transactions": [],
        "confidence": 0.20,
        "parser": "salary_slip_parser_v1",
    }