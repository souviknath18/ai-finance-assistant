import { InsightDashboard } from "@/types/insights";
import { authFetch } from "@/lib/api/authFetch";

export async function getInsightsDashboard() {
  const response = await authFetch("/api/insights/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as InsightDashboard;
}