from ai_engine.embeddings.generate_embeddings import generate_embedding
from apps.transactions.models import TransactionEmbedding


def build_transaction_document(transaction):
    return f"""
Transaction ID: {transaction.transaction_id}
User ID: {transaction.user.id}
Date: {transaction.date}
Description: {transaction.description}
Amount: {transaction.amount}
Type: {transaction.transaction_type}
Category: {transaction.category}
Merchant: {transaction.merchant_name or "Unknown"}
Source File: {transaction.uploaded_file.original_filename if transaction.uploaded_file else "Manual"}
""".strip()


def store_transaction_vector(transaction):
    document = build_transaction_document(transaction)
    embedding = generate_embedding(document)

    TransactionEmbedding.objects.update_or_create(
        transaction=transaction,
        defaults={
            "user": transaction.user,
            "embedding": embedding,
            "document": document,
        },
    )

    transaction.is_vectorized = True
    transaction.save(update_fields=["is_vectorized", "updated_at"])


def delete_transaction_vector(transaction_id: str):
    TransactionEmbedding.objects.filter(
        transaction__transaction_id=transaction_id
    ).delete()