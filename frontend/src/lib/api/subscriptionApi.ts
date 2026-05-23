import {
  CreateManualSubscriptionPayload,
  SubscriptionDashboardResponse,
  UpdateSubscriptionPreferencePayload,
} from "@/types/subscription";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getDetectedSubscriptions(): Promise<SubscriptionDashboardResponse> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/subscriptions/detected/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as SubscriptionDashboardResponse;
}

export async function createManualSubscription(
  payload: CreateManualSubscriptionPayload
) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/subscriptions/manual/`, {
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

export async function updateSubscriptionPreference(
  payload: UpdateSubscriptionPreferencePayload
) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/subscriptions/preference/`, {
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