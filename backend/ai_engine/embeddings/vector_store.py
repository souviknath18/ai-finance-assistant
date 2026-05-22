from decouple import config
import chromadb

from ai_engine.embeddings.generate_embeddings import generate_embedding

CHROMA_DB_PATH = config("CHROMA_DB_PATH", default="./chroma_db")

print("CHROMA_DB_PATH:", CHROMA_DB_PATH)

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

transaction_collection = client.get_or_create_collection(
    name="transactions"
)


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
    print("Preparing vector for:", transaction.transaction_id)

    document = build_transaction_document(transaction)
    embedding = generate_embedding(document)

    print("Embedding generated for:", transaction.transaction_id)

    transaction_collection.upsert(
        ids=[transaction.transaction_id],
        embeddings=[embedding],
        documents=[document],
        metadatas=[
            {
                "user_id": str(transaction.user.id),
                "transaction_id": transaction.transaction_id,
                "category": transaction.category or "Uncategorized",
                "transaction_type": transaction.transaction_type,
                "amount": str(transaction.amount),
                "date": str(transaction.date),
                "merchant": transaction.merchant_name or "Unknown",
                "description": transaction.description or "",
            }
        ],
    )

    transaction.is_vectorized = True
    transaction.save(update_fields=["is_vectorized", "updated_at"])

    print("Stored vector:", transaction.transaction_id)
    print("Vector count now:", transaction_collection.count())


def delete_transaction_vector(transaction_id: str):
    transaction_collection.delete(ids=[transaction_id])
    print("Deleted vector:", transaction_id)