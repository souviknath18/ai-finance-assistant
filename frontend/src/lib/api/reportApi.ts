import { ReportDashboard } from "@/types/report";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getReportDashboard() {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/reports/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as ReportDashboard;
}

export async function generateReport(interval: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/reports/generate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ interval }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as {
    report_id: string;
    report: ReportDashboard;
  };
}

export async function getGeneratedReport(reportId: string) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/reports/generated/${reportId}/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as {
    report_id: string;
    title: string;
    interval: string;
    period_range: string;
    ai_summary: string;
    report: ReportDashboard;
    created_at: string;
  };
}

export async function exportReportPDF(reportId: string) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/reports/generated/${reportId}/pdf/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw await response.json();
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `Aura_Report_${reportId}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}