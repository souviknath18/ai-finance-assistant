import { CreateGoalPayload, GoalItem, GoalsDashboard } from "@/types/goal";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getGoalsDashboard() {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/goals/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as GoalsDashboard;
}

export async function createGoal(payload: CreateGoalPayload) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/goals/`, {
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

export async function updateGoal(
  goalId: string,
  payload: Partial<CreateGoalPayload>
) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/goals/${goalId}/`, {
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

  return data as GoalItem;
}

export async function deleteGoal(goalId: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/goals/${goalId}/`, {
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