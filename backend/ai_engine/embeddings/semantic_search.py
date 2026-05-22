from ai_engine.embeddings.generate_embeddings import generate_embedding
from ai_engine.embeddings.vector_store import transaction_collection


def semantic_search_transactions(user, query: str, n_results: int = 5):
    query_embedding = generate_embedding(query)

    results = transaction_collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where={"user_id": str(user.id)},
        include=["documents", "metadatas", "distances"],
    )

    matches = []

    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for index, transaction_id in enumerate(ids):
        matches.append(
            {
                "transaction_id": transaction_id,
                "document": documents[index],
                "metadata": metadatas[index],
                "distance": distances[index],
            }
        )

    return matches


def find_similar_transactions(user, transaction_id: str, n_results: int = 5):
    original = transaction_collection.get(
        ids=[transaction_id],
        where={"user_id": str(user.id)},
        include=["embeddings", "documents", "metadatas"],
    )

    if not original["ids"]:
        return []

    embedding = original["embeddings"][0]

    results = transaction_collection.query(
        query_embeddings=[embedding],
        n_results=n_results + 1,
        where={"user_id": str(user.id)},
        include=["documents", "metadatas", "distances"],
    )

    matches = []

    ids = results.get("ids", [[]])[0]
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for index, result_id in enumerate(ids):
        if result_id == transaction_id:
            continue

        matches.append(
            {
                "transaction_id": result_id,
                "document": documents[index],
                "metadata": metadatas[index],
                "distance": distances[index],
            }
        )

    return matches[:n_results]