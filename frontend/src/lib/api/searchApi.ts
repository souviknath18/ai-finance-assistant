import { SemanticSearchResult } from "@/types/search";
import { authFetch } from "@/lib/api/authFetch";

export async function semanticSearchTransactions(
  query: string
) {
  const response = await authFetch(
    "/api/search/semantic/",
    {
      method: "POST",
      body: JSON.stringify({
        query,
        n_results: 10,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.results as SemanticSearchResult[];
}

export async function findSimilarTransactions(
  transactionId: string
) {
  const response = await authFetch(
    "/api/search/similar/",
    {
      method: "POST",
      body: JSON.stringify({
        transaction_id: transactionId,
        n_results: 5,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.results as SemanticSearchResult[];
}