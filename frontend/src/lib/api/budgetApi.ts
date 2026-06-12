import { BudgetDashboard, CreateBudgetPayload } from "@/types/budget";
import { authFetch } from "@/lib/api/authFetch";

export async function getBudgetDashboard() {
  const response = await authFetch("/api/budgets/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as BudgetDashboard;
}

export async function createBudget(payload: CreateBudgetPayload) {
  const response = await authFetch("/api/budgets/", {
    method: "POST",
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
  const response = await authFetch(`/api/budgets/${budgetId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteBudget(budgetId: string) {
  const response = await authFetch(`/api/budgets/${budgetId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}