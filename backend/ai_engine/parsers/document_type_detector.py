def detect_document_type(extracted_text: str) -> dict:
    text = extracted_text.lower()

    scores = {
        "bank_statement": 0,
        "receipt_invoice": 0,
        "salary_slip": 0,
        "subscription_receipt": 0,
        "unknown": 0,
    }

    bank_keywords = [
        "account statement",
        "bank statement",
        "transaction details",
        "opening balance",
        "closing balance",
        "withdrawals",
        "deposits",
        "balance",
        "account number",
        "branch transit",
    ]

    receipt_invoice_keywords = [
        "invoice",
        "receipt",
        "total",
        "total due",
        "amount paid",
        "payment method",
        "merchant",
        "provider",
        "restaurant",
        "order id",
        "billing month",
        "subscription",
        "tax invoice",
        "delivery",
    ]

    salary_keywords = [
        "salary slip",
        "payslip",
        "pay slip",
        "gross salary",
        "net salary",
        "basic salary",
        "hra",
        "deductions",
        "employee id",
    ]

    subscription_keywords = [
        "subscription",
        "recurring billing",
        "billing month",
        "membership",
        "premium",
        "monthly plan",
        "renewal",
        "netflix",
        "spotify",
        "youtube premium",
        "apple icloud",
        "google one",
        "amazon prime",
        "adobe",
        "canva",
        "figma",
        "openai",
        "chatgpt",
    ]

    for keyword in bank_keywords:
        if keyword in text:
            scores["bank_statement"] += 1

    for keyword in receipt_invoice_keywords:
        if keyword in text:
            scores["receipt_invoice"] += 1

    for keyword in salary_keywords:
        if keyword in text:
            scores["salary_slip"] += 1

    for keyword in subscription_keywords:
        if keyword in text:
            scores["subscription_receipt"] += 1

    detected_type = max(scores, key=scores.get)
    confidence = scores[detected_type] / max(len(get_keywords(detected_type)), 1)

    if scores[detected_type] == 0:
        detected_type = "unknown"
        confidence = 0.0

    return {
        "document_type": detected_type,
        "confidence": round(confidence, 2),
        "scores": scores,
    }


def get_keywords(document_type: str):
    keyword_map = {
        "bank_statement": [
            "account statement",
            "bank statement",
            "transaction details",
            "opening balance",
            "closing balance",
            "withdrawals",
            "deposits",
            "balance",
            "account number",
            "branch transit",
        ],
        "receipt_invoice": [
            "invoice",
            "receipt",
            "total",
            "total due",
            "amount paid",
            "payment method",
            "merchant",
            "provider",
            "restaurant",
            "order id",
            "billing month",
            "subscription",
            "tax invoice",
            "delivery",
        ],
        "salary_slip": [
            "salary slip",
            "payslip",
            "pay slip",
            "gross salary",
            "net salary",
            "basic salary",
            "hra",
            "deductions",
            "employee id",
        ],
        "subscription_receipt": [
            "subscription",
            "recurring billing",
            "billing month",
            "membership",
            "premium",
            "monthly plan",
            "renewal",
            "netflix",
            "spotify",
            "youtube premium",
            "apple icloud",
            "google one",
            "amazon prime",
            "adobe",
            "canva",
            "figma",
            "openai",
            "chatgpt",
        ],
    }

    return keyword_map.get(document_type, [])