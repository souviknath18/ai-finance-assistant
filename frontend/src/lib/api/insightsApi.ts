import {
  InsightDashboard,
  InsightRegenerateResponse,
  InsightStatusResponse,
} from "@/types/insights";

import { authFetch } from "@/lib/api/authFetch";


export type InsightPeriod =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "this_year"
  | "custom";


export type InsightPeriodParams = {
  period?: InsightPeriod;
  startDate?: string;
  endDate?: string;
};


function buildPeriodQuery({
  period = "this_month",
  startDate,
  endDate,
}: InsightPeriodParams) {
  const params = new URLSearchParams();

  params.set("period", period);

  if (
    period === "custom" &&
    startDate &&
    endDate
  ) {
    params.set(
      "start_date",
      startDate
    );

    params.set(
      "end_date",
      endDate
    );
  }

  return `?${params.toString()}`;
}


function buildPeriodBody({
  period = "this_month",
  startDate,
  endDate,
}: InsightPeriodParams) {
  const body: Record<string, string> = {
    period,
  };

  if (
    period === "custom" &&
    startDate &&
    endDate
  ) {
    body.start_date = startDate;
    body.end_date = endDate;
  }

  return body;
}


async function parseErrorResponse(
  response: Response
): Promise<never> {
  let message =
    "Something went wrong.";

  try {
    const data =
      await response.json();

    if (
      typeof data?.detail ===
      "string"
    ) {
      message = data.detail;
    } else if (
      typeof data?.error ===
      "string"
    ) {
      message = data.error;
    } else if (
      data &&
      typeof data === "object"
    ) {
      message = JSON.stringify(
        data
      );
    }
  } catch {
    message =
      response.statusText ||
      "Something went wrong.";
  }

  throw new Error(message);
}


export async function getInsightsDashboard(
  params: InsightPeriodParams = {}
): Promise<InsightDashboard> {
  const query =
    buildPeriodQuery(params);

  const response =
    await authFetch(
      `/api/insights/${query}`,
      {
        method: "GET",
      }
    );

  if (!response.ok) {
    return parseErrorResponse(
      response
    );
  }

  return (
    await response.json()
  ) as InsightDashboard;
}


export async function regenerateInsightsDashboard(
  params: InsightPeriodParams = {}
): Promise<InsightRegenerateResponse> {
  const response =
    await authFetch(
      "/api/insights/regenerate/",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          buildPeriodBody(params)
        ),
      }
    );

  if (!response.ok) {
    return parseErrorResponse(
      response
    );
  }

  return (
    await response.json()
  ) as InsightRegenerateResponse;
}


export async function getInsightsStatus(
  params: InsightPeriodParams = {}
): Promise<InsightStatusResponse> {
  const query =
    buildPeriodQuery(params);

  const response =
    await authFetch(
      `/api/insights/status/${query}`,
      {
        method: "GET",
      }
    );

  if (!response.ok) {
    return parseErrorResponse(
      response
    );
  }

  return (
    await response.json()
  ) as InsightStatusResponse;
}


export async function waitForInsightsReady(
  params: InsightPeriodParams = {},
  options?: {
    intervalMs?: number;
    maxAttempts?: number;
  }
): Promise<InsightStatusResponse> {
  const intervalMs =
    options?.intervalMs ?? 2000;

  const maxAttempts =
    options?.maxAttempts ?? 30;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt += 1
  ) {
    const snapshot =
      await getInsightsStatus(
        params
      );

    if (
      snapshot.status === "ready"
    ) {
      return snapshot;
    }

    if (
      snapshot.status === "failed"
    ) {
      throw new Error(
        snapshot.error ||
          "Insight generation failed."
      );
    }

    await new Promise<void>(
      (resolve) => {
        window.setTimeout(
          resolve,
          intervalMs
        );
      }
    );
  }

  throw new Error(
    "Insight generation is taking longer than expected."
  );
}


export async function regenerateAndFetchInsights(
  params: InsightPeriodParams = {}
): Promise<InsightDashboard> {
  await regenerateInsightsDashboard(
    params
  );

  await waitForInsightsReady(
    params
  );

  return getInsightsDashboard(
    params
  );
}