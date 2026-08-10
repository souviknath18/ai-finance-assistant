"use client";

import { RefreshCcw } from "lucide-react";

type InsightsHeaderProps = {
  startDate: string;
  endDate: string;
  generatedAt?: string | null;
  isStale: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

export default function InsightsHeader({
  startDate,
  endDate,
  generatedAt,
  isStale,
  refreshing,
  onRefresh,
}: InsightsHeaderProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Insights
        </h1>

        <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#565e74]">
          AI-assisted analysis of your spending, budgets,
          recurring expenses, goals, and financial health.
        </p>

        {/* Metadata */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8a92a5]">
          <span>
            {formatPeriod(startDate, endDate)}
          </span>

          {generatedAt && (
            <>
              <span>•</span>

              <span>
                Updated{" "}
                {new Date(
                  generatedAt
                ).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </>
          )}

          {isStale && (
            <>
              <span>•</span>

              <span className="font-semibold text-amber-600">
                Newer financial data available
              </span>
            </>
          )}
        </div>
      </div>

      {/* Refresh */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-4 py-2.5 text-[12px] font-bold text-black shadow-[0_4px_14px_rgba(15,23,42,0.05)] transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCcw
          size={15}
          className={
            refreshing
              ? "animate-spin"
              : ""
          }
        />

        {refreshing
          ? "Refreshing..."
          : "Refresh Insights"}
      </button>
    </section>
  );
}

function formatPeriod(
  start: string,
  end: string
) {
  if (!start || !end) {
    return "";
  }

  const startDate = new Date(
    `${start}T00:00:00`
  );

  const endDate = new Date(
    `${end}T00:00:00`
  );

  return `${startDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )} – ${endDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )}`;
}