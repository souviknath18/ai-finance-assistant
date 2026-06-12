import { CreateGoalPayload, GoalItem, GoalsDashboard } from "@/types/goal";
import { authFetch } from "@/lib/api/authFetch";

export async function getGoalsDashboard() {
  const response = await authFetch("/api/goals/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as GoalsDashboard;
}

export async function createGoal(payload: CreateGoalPayload) {
  const response = await authFetch("/api/goals/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function updateGoal(
  goalId: string,
  payload: Partial<CreateGoalPayload>
) {
  const response = await authFetch(`/api/goals/${goalId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as GoalItem;
}

export async function deleteGoal(goalId: string) {
  const response = await authFetch(`/api/goals/${goalId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}