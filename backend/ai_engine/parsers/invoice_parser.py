import re
import logging
from datetime import date, datetime
from decimal import Decimal
logger = logging.getLogger(__name__)

from .parser_schema import (
    empty_parser_result,
)
from .transaction_normalizer import (
    build_transaction,
    parse_decimal_amount,
)


STRONG_FINAL_TOTAL_LABELS = [
    "grand total",
    "invoice value",
    "total amount payable",
    "amount payable",
    "net amount payable",
    "net payable",
    "total payable",
    "total due",
    "balance due",
    "amount due",
    "amount paid",
    "invoice total",
    "total invoice value",
    "total invoice amount",
]

WEAK_FINAL_TOTAL_LABELS = [
    "total amount",
    "net amount",
]

LEGAL_ENTITY_PATTERNS = [
    r"\bpvt\.?\s*ltd\.?\b",
    r"\bprivate\s+limited\b",
    r"\blimited\b",
    r"\bllp\b",
    r"\binc\.?\b",
    r"\bcorporation\b",
    r"\btechnologies\b",
]

MERCHANT_BUSINESS_PATTERNS = [
    r"\bstore\b",
    r"\brestaurant\b",
    r"\broasters\b",
    r"\bcafe\b",
    r"\bservices\b",
    r"\bsolutions\b",
    r"\bconsulting\b",
    r"\benterprises\b",
    r"\bretail\b",
    r"\btraders\b",
    r"\bsoftware\b",
    r"\bsystems\b",
    r"\bcommunications\b",
    r"\bcompany\b",
]

MERCHANT_REJECTED_TERMS = {
    "tax invoice",
    "invoice",
    "bill to",
    "ship to",
    "invoice number",
    "invoice no",
    "invoice date",
    "reverse charge",
    "place of supply",
    "payment status",
    "payment method",
    "transaction id",
    "gstin",
    "cin:",
    "road",
    "street",
    "floor",
    "sector",
    "layout",
    "address",
    "mobile",
    "phone",
    "email",
    "website",
}


def build_invoice_description(
    merchant_name: str | None,
    service_description: str | None,
) -> str:
    merchant = (
        " ".join(merchant_name.split())
        if merchant_name
        else None
    )

    service = (
        " ".join(service_description.split())
        if service_description
        else None
    )

    if (
        merchant
        and service
        and merchant.lower() != service.lower()
        and merchant.lower() not in service.lower()
    ):
        return f"{service} - {merchant}"[:255]

    if service:
        return service[:255]

    if merchant:
        return merchant[:255]

    return "Invoice Payment"


def parse_invoice_transactions(
    extracted_text: str,
):
    result = empty_parser_result(
        document_type="invoice",
        parser="invoice_parser_v1",
        confidence=0.20,
    )

    merchant_name = extract_merchant_name(
        extracted_text
    )

    amount = extract_final_total(
        extracted_text
    )

    invoice_date = extract_invoice_date(
        extracted_text
    )

    invoice_number = extract_invoice_number(
        extracted_text
    )

    service_description = extract_invoice_service_description(
        extracted_text
    )

    logger.info(
        "Invoice parsing completed",
        extra={
            "merchant_found": bool(merchant_name),
            "service_description_found": bool(
                service_description
            ),
            "amount_found": amount is not None,
            "invoice_date_found": invoice_date is not None,
            "invoice_number_found": invoice_number is not None,
        },
    )

    if amount is None:
        result["warnings"].append(
            {
                "code": "missing_invoice_total",
                "message": (
                    "A reliable final invoice total "
                    "could not be found."
                ),
            }
        )

        return result

    transaction = build_transaction(
        transaction_date=invoice_date,
        description=build_invoice_description(
            merchant_name=merchant_name,
            service_description=service_description,
        ),
        merchant_name=merchant_name,
        amount=amount,
        transaction_type="expense",
        balance_after_transaction=None,
        reference_number=invoice_number,
        raw_text=extracted_text,
    )

    confidence = Decimal("0.30")

    if amount is not None:
        confidence += Decimal("0.25")

    if merchant_name:
        confidence += Decimal("0.15")

    if service_description:
        confidence += Decimal("0.10")

    if invoice_date:
        confidence += Decimal("0.10")
    else:
        result["warnings"].append(
            {
                "code": "missing_invoice_date",
                "message": "Invoice date was not found.",
            }
        )

    if invoice_number:
        confidence += Decimal("0.10")

    result["confidence"] = float(
        min(
            confidence,
            Decimal("0.95"),
        )
    )

    result["transactions"] = [
        transaction
    ]

    result["document_metadata"] = {
        "invoice_number": invoice_number,
        "invoice_date": invoice_date,
        "merchant_name": merchant_name,
        "service_description": service_description,
        "final_total": amount,
        "parser_output": {
            "confidence": result["confidence"],
            "merchant_name": merchant_name,
            "service_description": service_description,
        },
    }

    return result


def is_total_table_heading(
    line: str,
) -> bool:
    lower_line = " ".join(
        line.lower().split()
    )

    heading_terms = (
        "net amount",
        "tax rate",
        "tax type",
        "tax amount",
        "total amount",
        "unit price",
        "qty",
        "quantity",
    )

    matched_terms = sum(
        1
        for term in heading_terms
        if term in lower_line
    )

    return matched_terms >= 2


def extract_final_total(
    extracted_text: str,
) -> Decimal | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    for line in lines:
      print(line)

    rejected_terms = {
        "taxable value",
        "tax amount",
        "subtotal",
        "sub total",
        "discount",
        "previous paid",
        "previous balance",
        "cgst",
        "sgst",
        "igst",
    }

    # Strategy 1:
    # Look for final-total labels and check:
    # - the same line
    # - the next one or two lines
    for labels in (
        STRONG_FINAL_TOTAL_LABELS,
        WEAK_FINAL_TOTAL_LABELS,
    ):
        for label in labels:
            for index in range(
                len(lines) - 1,
                -1,
                -1,
            ):
                line = lines[index]
                lower_line = line.lower()
                if is_total_table_heading(line):
                    continue

                if label not in lower_line:
                    continue

                if any(
                    rejected in lower_line
                    for rejected in rejected_terms
                ):
                    continue

                same_line_amounts = extract_amounts(
                    line,
                    allow_integer=True,
                )
                print(
                    "Matched label:",
                    label,
                )

                print(
                    "Matched line:",
                    line,
                )

                print(
                    "Amounts:",
                    same_line_amounts,
                )

                if same_line_amounts:
                    return same_line_amounts[-1]

                for offset in (1, 2):
                    next_index = index + offset

                    if next_index >= len(lines):
                        break

                    next_line = lines[next_index]
                    next_lower = next_line.lower()

                    if any(
                        rejected in next_lower
                        for rejected in rejected_terms
                    ):
                        continue

                    next_amounts = extract_amounts(
                        next_line,
                        allow_integer=False,
                    )

                    print(next_line)
                    print(next_amounts)

                    if next_amounts:
                        return next_amounts[-1]

    # Strategy 2:
    # Use values near strong payment words.
    strong_payment_terms = (
        "payable",
        "amount due",
        "amount paid",
        "invoice total",
        "grand total",
    )

    contextual_candidates: list[Decimal] = []

    for index, line in enumerate(lines):
        lower_line = line.lower()

        if not any(
            term in lower_line
            for term in strong_payment_terms
        ):
            continue

        if any(
            rejected in lower_line
            for rejected in rejected_terms
        ):
            continue

        contextual_candidates.extend(
            extract_amounts(
                lines[index + 1],
                allow_integer=False,
            )
        )

        if index + 1 < len(lines):
            contextual_candidates.extend(
                extract_amounts(
                    lines[index + 1],
                    allow_integer=False,
                )
            )

    if contextual_candidates:
        return contextual_candidates[-1]

    # Strategy 3:
    # Safe fallback—ignore tax/subtotal values and their
    # immediately following numeric lines.
    candidates: list[Decimal] = []

    for index, line in enumerate(lines):
        lower_line = line.lower()

        if any(
            rejected in lower_line
            for rejected in rejected_terms
        ):
            continue

        if index > 0:
            previous_lower = lines[index - 1].lower()

            if any(
                rejected in previous_lower
                for rejected in rejected_terms
            ):
                continue

        amounts = extract_amounts(line)

        if amounts:
            candidates.extend(amounts)

    return None


def extract_amounts(
    line: str,
    allow_integer: bool = False,
) -> list[Decimal]:
    if allow_integer:
        pattern = (
            r"(?:₹|INR|Rs\.?)?\s*"
            r"(-?\d[\d,]*(?:\.\d{1,2})?)"
        )
    else:
        pattern = (
            r"(?:₹|INR|Rs\.?)?\s*"
            r"(-?\d[\d,]*\.\d{1,2})"
        )

    values = re.findall(
        pattern,
        line,
        flags=re.IGNORECASE,
    )

    amounts: list[Decimal] = []

    for value in values:
        parsed = parse_decimal_amount(value)

        if parsed is None:
            continue

        parsed = abs(parsed)

        if parsed == 0:
            continue

        amounts.append(parsed)

    return amounts


def extract_invoice_number(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    same_line_patterns = [
        r"invoice\s*(?:number|no\.?|#)\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9/_\-]+)",
        r"bill\s*(?:number|no\.?|#)\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9/_\-]+)",
        r"document\s*(?:number|no\.?)\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9/_\-]+)",
    ]

    for pattern in same_line_patterns:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if match:
            value = match.group(1).strip(" :-")

            if is_valid_invoice_number(value):
                return value[:100]

    label_patterns = (
        r"invoice\s*(?:number|no\.?|#)",
        r"bill\s*(?:number|no\.?|#)",
        r"document\s*(?:number|no\.?)",
    )

    for index, line in enumerate(lines):
        if not any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in label_patterns
        ):
            continue

        for offset in (1, 2):
            next_index = index + offset

            if next_index >= len(lines):
                break

            candidate = lines[next_index].strip(" :-")

            if is_valid_invoice_number(candidate):
                return candidate[:100]

    return None


def is_valid_invoice_number(
    value: str,
) -> bool:
    if len(value) < 3 or len(value) > 100:
        return False

    if not re.search(r"[A-Za-z0-9]", value):
        return False
    
    if not re.search(r"\d", value):
        return False

    if re.fullmatch(
        r"\d[\d,]*\.\d{1,2}",
        value,
    ):
        return False

    if re.fullmatch(
        r"\d{1,2}[-/]\d{1,2}[-/]\d{2,4}",
        value,
    ):
        return False

    return (
        re.fullmatch(
            r"[A-Za-z0-9/_\-]+",
            value,
        )
        is not None
    )


def extract_invoice_date(
    extracted_text: str,
) -> date | None:
    normalized_text = str(
        extracted_text or ""
    )

    ocr_replacements = (
        (r"\bwrcice\b", "invoice"),
        (r"\blnvoice\b", "invoice"),
        (r"\binv0ice\b", "invoice"),
        (r"\binv0lce\b", "invoice"),
        (r"\binvo1ce\b", "invoice"),
        (r"\binvolce\b", "invoice"),
    )

    for pattern, replacement in ocr_replacements:
        normalized_text = re.sub(
            pattern,
            replacement,
            normalized_text,
            flags=re.IGNORECASE,
        )

    lines = [
        " ".join(line.split()).strip()
        for line in normalized_text.splitlines()
        if line.strip()
    ]

    date_labels = (
        "invoice date",
        "bill date",
        "date of invoice",
        "issued on",
        "issue date",
    )

    # Strategy 1: label and date on the same line.
    for line in lines:
        lower_line = line.lower()

        if not any(
            label in lower_line
            for label in date_labels
        ):
            continue

        parsed_date = extract_date_from_text(
            line
        )

        if parsed_date:
            return parsed_date

    # Strategy 2: date appears below the label.
    for index, line in enumerate(lines):
        lower_line = line.lower()

        if not any(
            label in lower_line
            for label in date_labels
        ):
            continue

        for offset in (1, 2):
            next_index = index + offset

            if next_index >= len(lines):
                break

            parsed_date = extract_date_from_text(
                lines[next_index]
            )

            if parsed_date:
                return parsed_date

    # Strategy 3: generic date pattern.
    excluded_date_contexts = (
        "order date",
        "shipping date",
        "ship date",
        "delivery date",
        "due date",
        "payment date",
        "transaction date",
        "statement date",
    )

    for line in lines[:40]:
        lower_line = line.lower()

        if any(
            term in lower_line
            for term in excluded_date_contexts
        ):
            continue

        parsed_date = extract_date_from_text(line)

        if parsed_date:
            return parsed_date

    return None


def extract_date_from_text(
    value: str,
) -> date | None:
    date_value_patterns = [
        r"\b\d{4}-\d{1,2}-\d{1,2}\b",
        r"\b\d{1,2}-\d{1,2}-\d{2,4}\b",
        r"\b\d{1,2}\.\d{1,2}\.\d{2,4}\b",
        r"\b\d{1,2}/\d{1,2}/\d{2,4}\b",
        r"\b\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\b",
        r"\b\d{1,2}-[A-Za-z]{3,9}-\d{4}\b",
    ]

    supported_formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d-%m-%y",
        "%d/%m/%Y",
        "%d/%m/%y",
        "%d %b %Y",
        "%d %B %Y",
        "%d-%b-%Y",
        "%d-%B-%Y",
        "%d.%m.%Y",
        "%d.%m.%y",
    ]

    for pattern in date_value_patterns:
        match = re.search(
            pattern,
            value,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        candidate = match.group(0)

        for date_format in supported_formats:
            try:
                parsed_date = datetime.strptime(
                    candidate,
                    date_format,
                ).date()

                today = date.today()

                if parsed_date > today:
                    continue

                if parsed_date.year < 1990:
                    continue

                return parsed_date

            except ValueError:
                continue

    return None


def clean_merchant_candidate(
    line: str,
) -> str:
    cleaned = " ".join(
        str(line or "").split()
    ).strip()

    if not cleaned:
        return ""

    # Normalize common OCR mistakes before removing metadata.
    ocr_replacements = (
        (r"\blnvoice\b", "invoice"),
        (r"\binv0ice\b", "invoice"),
        (r"\binv0lce\b", "invoice"),
        (r"\binvo1ce\b", "invoice"),
        (r"\binvolce\b", "invoice"),
        (r"\bwrcice\b", "invoice"),
    )

    for pattern, replacement in ocr_replacements:
        cleaned = re.sub(
            pattern,
            replacement,
            cleaned,
            flags=re.IGNORECASE,
        )

    metadata_patterns = (
        r"\s+tax\s+invoice\b.*$",

        r"\s+invoice\s+date\s*[:\-]?\s*.*$",

        r"\s+invoice\s+"
        r"(?:number|no\.?|#)\s*[:\-]?\s*.*$",

        r"\s+bill\s+date\s*[:\-]?\s*.*$",

        r"\s+bill\s+"
        r"(?:number|no\.?|#)\s*[:\-]?\s*.*$",

        r"\s+order\s+"
        r"(?:number|no\.?|id|#)\s*[:\-]?\s*.*$",

        r"\s+place\s+of\s+supply\s*[:\-]?\s*.*$",

        r"\s+reverse\s+charge\s*[:\-]?\s*.*$",

        r"\s+payment\s+"
        r"(?:status|method)\s*[:\-]?\s*.*$",

        r"\s+gstin\s*[:\-]?\s*.*$",

        r"\s+cin\s*[:\-]?\s*.*$",

        r"\s+pan\s*[:\-]?\s*.*$",
    )

    for pattern in metadata_patterns:
        cleaned = re.sub(
            pattern,
            "",
            cleaned,
            flags=re.IGNORECASE,
        )

    return cleaned.strip(" ,:-|")


def is_meaningful_merchant_candidate(
    value: str,
) -> bool:
    cleaned = " ".join(value.split()).strip(
        " ,:-|"
    )

    if len(cleaned) < 3:
        return False

    meaningful_words = re.findall(
        r"[A-Za-z]{2,}",
        cleaned,
    )

    if not meaningful_words:
        return False

    alphabetic_count = sum(
        character.isalpha()
        for character in cleaned
    )

    if alphabetic_count < 3:
        return False

    all_words = re.findall(
        r"\b[A-Za-z]+\b",
        cleaned,
    )

    single_letter_words = [
        word
        for word in all_words
        if len(word) == 1
    ]

    if (
        all_words
        and len(single_letter_words)
        == len(all_words)
    ):
        return False

    return True


def extract_merchant_name(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    candidates: list[tuple[int, str]] = []

    for index, original_line in enumerate(
        lines[:25]
    ):
        line = clean_merchant_candidate(
            original_line
        )

        lower_line = line.lower()

        suspicious_metadata_terms = (
            "invoice date",
            "invoice number",
            "invoice no",
            "bill date",
            "bill number",
            "order id",
            "payment status",
            "payment method",
            "place of supply",
            "gstin",
        )

        if any(
            term in lower_line
            for term in suspicious_metadata_terms
        ):
            continue

        if len(line) < 2 or len(line) > 180:
            continue

        if not is_meaningful_merchant_candidate(
            line
        ):
            continue

        legal_entity_match = any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in LEGAL_ENTITY_PATTERNS
        )

        business_name_match = any(
            re.search(
                pattern,
                line,
                flags=re.IGNORECASE,
            )
            for pattern in MERCHANT_BUSINESS_PATTERNS
        )

        if any(
            rejected_term in lower_line
            for rejected_term in MERCHANT_REJECTED_TERMS
        ):
            continue

        if re.search(
            r"\b(?:gstin|pan|cin|sac|hsn)\b",
            lower_line,
        ):
            continue

        if re.search(
            r"(?:www\.|https?://|@)",
            lower_line,
        ):
            continue

        if re.search(
            r"\b\d{5,6}\b",
            line,
        ):
            continue

        if re.fullmatch(
            r"(?:₹|INR|Rs\.?)?\s*"
            r"\d[\d,]*(?:\.\d{1,2})?",
            line,
            flags=re.IGNORECASE,
        ):
            continue

        if extract_date_from_text(line):
            continue

        brand_like = (
            1 <= len(line.split()) <= 10
            and re.fullmatch(
                r"[A-Za-z][A-Za-z0-9&.,'()\- ]+",
                line,
            )
            is not None
        )

        if not (
            legal_entity_match
            or business_name_match
            or brand_like
        ):
            continue

        score = max(
            0,
            12 - index,
        )

        if legal_entity_match:
            score += 10

        if business_name_match:
            score += 5

        if brand_like:
            score += 2

        if index <= 3:
            score += 3

        # Prefer complete names over tiny OCR fragments.
        meaningful_word_count = len(
            re.findall(
                r"[A-Za-z]{2,}",
                line,
            )
        )

        score += min(
            meaningful_word_count,
            5,
        )

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


def extract_invoice_service_description(
    extracted_text: str,
) -> str | None:
    lines = [
        " ".join(line.split()).strip()
        for line in extracted_text.splitlines()
        if line.strip()
    ]

    explicit_patterns = [
        r"service\s+type\s*[:\-]\s*([^\n]+)",
        r"service\s+description\s*[:\-]\s*([^\n]+)",
        r"item\s+description\s*[:\-]\s*([^\n]+)",
        r"product\s+description\s*[:\-]\s*([^\n]+)",
        r"particulars\s*[:\-]\s*([^\n]+)",
    ]

    for pattern in explicit_patterns:
        match = re.search(
            pattern,
            extracted_text,
            flags=re.IGNORECASE,
        )

        if match:
            value = match.group(1).strip(" :-")
            value = remove_invoice_item_columns(value)

            if is_valid_service_description(value):
                return value[:255]

    rejected_exact_terms = {
        "description",
        "item",
        "items",
        "product",
        "service",
        "particulars",
        "sac",
        "hsn",
        "qty",
        "quantity",
        "rate",
        "amount",
        "unit price",
        "subtotal",
        "cgst",
        "sgst",
        "igst",
        "discount",
        "grand total",
        "total amount",
        "invoice number",
        "invoice date",
        "place of supply",
        "payment status",
        "bill to",
        "service address",
    }

    rejected_footer_terms = (
        "thank you for shopping",
        "track your order",
        "your-orders",
        "original products",
        "easy returns",
        "amazon support",
        "customer support",
        "authorized signatory",
        "authorised signatory",
        "page 1 of",
        "amount in words",
        "whether tax is payable",
        "reverse charge",
        "customers desirous",
        "create a business account",
        "not a demand for payment",
    )

    candidates: list[tuple[int, int, str]] = []

    for index, line in enumerate(lines):
        line = remove_invoice_item_columns(line)

        if not line:
            continue
        lower_line = line.lower().strip()

        if any(
            term in lower_line
            for term in rejected_footer_terms
        ):
            continue

        if lower_line in rejected_exact_terms:
            continue

        if any(
            term in lower_line
            for term in (
                "gstin",
                "invoice no",
                "invoice number",
                "payment method",
                "transaction id",
                "phone",
                "email",
                "www.",
                "http",
            )
        ):
            continue

        if re.fullmatch(
            r"(?:₹|INR|Rs\.?)?\s*"
            r"-?\d[\d,]*(?:\.\d{1,2})?",
            line,
            flags=re.IGNORECASE,
        ):
            continue

        if re.fullmatch(r"\d+", line):
            continue

        if extract_date_from_text(line):
            continue

        if not is_valid_service_description(line):
            continue

        score = 0

        service_keywords = (
            "cleaning",
            "repair",
            "maintenance",
            "consulting",
            "subscription",
            "license",
            "hosting",
            "software",
            "installation",
            "delivery",
            "training",
            "plan",
            "package",
            "headphone",
            "headphones",
            "earphone",
            "earphones",
            "bluetooth",
            "laptop",
            "keyboard",
            "mouse",
            "monitor",
            "phone",
            "smartphone",
            "charger",
            "cable",
            "adapter",
            "speaker",
            "watch",
            "shirt",
            "shoes",
            "book",
        )

        if any(
            keyword in lower_line
            for keyword in service_keywords
        ):
            score += 8

        # Invoice products/services usually appear shortly
        # after Description, Item or Particulars headings.
        previous_lines = [
            value.lower()
            for value in lines[max(0, index - 6):index]
        ]

        if any(
            any(
                heading in previous
                for heading in (
                    "description",
                    "item description",
                    "product description",
                    "particulars",
                    "service description",
                )
            )
            for previous in previous_lines
        ):
            score += 7

        # A service line is often followed by SAC, quantity,
        # rate and amount values.
        following_lines = lines[index + 1:index + 6]
        following_text = " ".join(
            following_lines
        ).lower()

        if re.search(
            r"\b(?:hsn|sac)\b",
            following_text,
        ):
            score += 8

        numeric_count = sum(
            1
            for following_line in following_lines
            if re.fullmatch(
                r"(?:₹|INR|Rs\.?)?\s*"
                r"\d[\d,]*(?:\.\d{1,2})?",
                following_line,
                flags=re.IGNORECASE,
            )
        )

        if numeric_count >= 3:
            score += 5
        elif numeric_count >= 1:
            score += 2

        word_count = len(line.split())

        if 2 <= word_count <= 10:
            score += 2

        if score > 0:
            candidates.append(
                (
                    score,
                    index,
                    line[:255],
                )
            )

    if not candidates:
        return None

    candidates.sort(
        key=lambda candidate: (
            -candidate[0],
            candidate[1],
        )
    )

    return candidates[0][2]


def is_valid_service_description(
    value: str,
) -> bool:
    value = " ".join(value.split()).strip()

    if len(value) < 3 or len(value) > 255:
        return False

    if not re.search(r"[A-Za-z]", value):
        return False

    if re.fullmatch(
        r"(?:₹|INR|Rs\.?)?\s*"
        r"-?\d[\d,]*(?:\.\d{1,2})?",
        value,
        flags=re.IGNORECASE,
    ):
        return False

    rejected_values = {
        "tax invoice",
        "invoice",
        "customer copy",
        "thank you",
        "paid",
        "karnataka",
        "india",
    }

    return value.lower() not in rejected_values


def remove_invoice_item_columns(
    line: str,
) -> str:
    cleaned = " ".join(line.split()).strip()

    cleaned = re.sub(
        r"\s+\d{4,8}\s+"
        r"\d+(?:\.\d+)?\s+"
        r"(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*\.\d{1,2}\s+"
        r"(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*\.\d{1,2}\s*$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s+\d+(?:\.\d+)?\s+"
        r"(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*\.\d{1,2}\s+"
        r"(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*\.\d{1,2}\s*$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s+(?:₹|INR|Rs\.?)?\s*"
        r"\d[\d,]*\.\d{1,2}\s*$",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    return cleaned.strip(" :-")