from apps.transactions.models import Transaction


def build_transaction_document(
    transaction: Transaction,
) -> str:
    """
    Build the text representation used for transaction embeddings.

    Keep this representation stable unless embeddings are rebuilt,
    because changing the document structure changes semantic behavior.
    """

    source_file = (
        transaction.uploaded_file.original_filename
        if transaction.uploaded_file
        else "Manual"
    )

    category = (
        transaction.category
        if transaction.category
        else "Uncategorized"
    )

    merchant = (
        transaction.merchant_name
        if transaction.merchant_name
        else "Unknown"
    )

    return "\n".join(
        [
            f"Transaction ID: {transaction.transaction_id}",
            f"User ID: {transaction.user_id}",
            f"Date: {transaction.date}",
            f"Description: {transaction.description or ''}",
            f"Amount: {transaction.amount}",
            f"Type: {transaction.transaction_type}",
            f"Category: {category}",
            f"Merchant: {merchant}",
            f"Source File: {source_file}",
        ]
    )