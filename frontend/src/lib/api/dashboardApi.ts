import { DashboardData } from "@/types/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getDashboardData(): Promise<DashboardData> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/dashboard/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as DashboardData;
}