import { DashboardData } from "@/types/dashboard";
import { authFetch } from "@/lib/api/authFetch";

export async function getDashboardData(): Promise<DashboardData> {
  const response = await authFetch("/api/dashboard/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as DashboardData;
}