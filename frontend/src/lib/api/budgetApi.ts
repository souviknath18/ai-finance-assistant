import { BudgetDashboard, CreateBudgetPayload } from "@/types/budget";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getBudgetDashboard() {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/budgets/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as BudgetDashboard;
}

export async function createBudget(payload: CreateBudgetPayload) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/budgets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function updateBudget(
  budgetId: string,
  payload: Partial<CreateBudgetPayload>
) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/budgets/${budgetId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteBudget(budgetId: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/budgets/${budgetId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}