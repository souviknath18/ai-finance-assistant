import {
  CreateManualSubscriptionPayload,
  SubscriptionDashboardResponse,
  UpdateSubscriptionPreferencePayload,
} from "@/types/subscription";

import { authFetch } from "@/lib/api/authFetch";

export async function getDetectedSubscriptions(): Promise<SubscriptionDashboardResponse> {
  const response = await authFetch("/api/subscriptions/detected/", {
    method: "GET",
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
  const response = await authFetch("/api/subscriptions/manual/", {
    method: "POST",
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
  const response = await authFetch("/api/subscriptions/preference/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}