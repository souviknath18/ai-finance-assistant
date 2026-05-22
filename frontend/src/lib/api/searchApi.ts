import { SemanticSearchResult } from "@/types/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function semanticSearchTransactions(query: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/search/semantic/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      n_results: 10,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.results as SemanticSearchResult[];
}

export async function findSimilarTransactions(transactionId: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/search/similar/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      transaction_id: transactionId,
      n_results: 5,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.results as SemanticSearchResult[];
}