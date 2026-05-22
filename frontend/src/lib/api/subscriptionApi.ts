import { SubscriptionDashboardResponse } from "@/types/subscription";

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

  return data;
}