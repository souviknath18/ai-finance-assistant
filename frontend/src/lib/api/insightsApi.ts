import { InsightDashboard } from "@/types/insights";

import { authFetch } from "@/lib/api/authFetch";


export async function getInsightsDashboard(
  startDate?: string,
  endDate?: string
): Promise<InsightDashboard> {
  const params = new URLSearchParams();

  if (startDate && endDate) {
    params.set("start_date", startDate);
    params.set("end_date", endDate);
  }

  const query = params.toString();

  const url = query
    ? `/api/insights/?${query}`
    : "/api/insights/";

  const response = await authFetch(url, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Failed to load financial insights."
    );
  }

  return data as InsightDashboard;
}


export async function regenerateInsightsDashboard(): Promise<InsightDashboard> {
  const response = await authFetch(
    "/api/insights/regenerate/",
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Failed to regenerate financial insights."
    );
  }

  return data as InsightDashboard;
}