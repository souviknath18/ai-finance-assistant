import { OnboardingPayload } from "@/types/onboarding";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function completeOnboarding(payload: OnboardingPayload) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/onboarding/complete/`, {
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