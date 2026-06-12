import { OnboardingPayload } from "@/types/onboarding";
import { authFetch } from "@/lib/api/authFetch";

export async function completeOnboarding(
  payload: OnboardingPayload
) {
  const response = await authFetch(
    "/api/onboarding/complete/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}