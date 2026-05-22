import chromadb

CHROMA_DB_PATH = "C:/Users/souvi/Desktop/AI-Finance/ai-finance-assistant/backend/chroma_db"

client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

collection = client.get_or_create_collection("transactions")

print("Total vectors:", collection.count())

results = collection.get()
print(results)