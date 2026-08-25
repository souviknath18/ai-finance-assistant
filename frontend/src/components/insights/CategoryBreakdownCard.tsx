"use client";

import { PieChart } from "lucide-react";

import { CategoryBreakdownItem } from "@/types/insights";

type CategoryBreakdownCardProps = {
  items: CategoryBreakdownItem[];
};

const CHART_COLORS = [
  "#059669",
  "#6366f1",
  "#f59e0b",
  "#e11d48",
];

export default function CategoryBreakdownCard({
  items,
}: CategoryBreakdownCardProps) {
  const topItems = items.slice(0, 4);

  const topCategory = topItems[0];

  const totalPercentage = topItems.reduce(
    (sum, item) => sum + Math.max(item.percentage || 0, 0),
    0
  );

  return (
    <div className="h-full min-w-0 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <PieChart size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              Category Breakdown
            </h3>

            <p className="text-[12px] text-[#565e74]">
              Where your money is going
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {topItems.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-5 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <PieChart size={18} />
              </div>

              <p className="text-[13px] font-bold text-black">
                No category data yet
              </p>

              <p className="mx-auto mt-1 max-w-sm text-[12px] leading-5 text-[#565e74]">
                Upload transactions to let Aura analyze your spending
                distribution.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Main visualization */}
            <div className="grid min-w-0 grid-cols-1 gap-7 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
              {/* Donut */}
              <div className="flex flex-col items-center justify-center">
                <DonutChart items={topItems} />

                <div className="mt-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
                    Top Category
                  </p>

                  <p className="mt-1 text-[15px] font-bold text-black">
                    {topCategory.category}
                  </p>

                  <p className="mt-1 text-[12px] text-[#565e74]">
                    {topCategory.total_display}
                  </p>
                </div>
              </div>

              {/* Ranked categories */}
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <CategoryRow
                    key={`${item.category}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#edf2fb] pt-5">
              <div className="rounded-2xl border border-[#e8eefb] bg-[#fbfcff] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Categories Shown
                </p>

                <p className="mt-1.5 text-[18px] font-bold text-black">
                  {topItems.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e8eefb] bg-[#fbfcff] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Share Covered
                </p>

                <p className="mt-1.5 text-[18px] font-bold text-emerald-700">
                  {Math.min(totalPercentage, 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 border-t border-[#edf2fb] pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-[#7c839b]">
                  Ranked by verified expense totals for the selected period.
                </p>

                <a
                  href="/transactions"
                  className="inline-flex w-fit shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-4 py-2.5 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
                >
                  View Transactions
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryRow({
  item,
  index,
}: {
  item: CategoryBreakdownItem;
  index: number;
}) {
  const percentage = Math.min(
    Math.max(item.percentage || 0, 0),
    100
  );

  return (
    <div className="group rounded-2xl border border-[#e8eefb] bg-white p-3.5 transition-[border-color,box-shadow,transform] duration-200 hover:border-emerald-200 hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{
              backgroundColor: CHART_COLORS[index] ?? "#94a3b8",
            }}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-[13px] font-bold text-black">
                {item.category}
              </p>

              {index === 0 && (
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                  Top
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[10px] text-[#7c839b]">
              {item.count}{" "}
              {item.count === 1
                ? "transaction"
                : "transactions"}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[13px] font-bold text-black">
            {item.total_display}
          </p>

          <p className="mt-0.5 text-[10px] font-bold text-[#7c839b]">
            {percentage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#edf2fb]">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${percentage > 0 ? Math.max(percentage, 3) : 0}%`,
            backgroundColor: CHART_COLORS[index] ?? "#94a3b8",
          }}
        />
      </div>
    </div>
  );
}

function DonutChart({
  items,
}: {
  items: CategoryBreakdownItem[];
}) {
  const radius = 48;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  const normalizedItems = items.map((item) => ({
    ...item,
    percentage: Math.max(item.percentage || 0, 0),
  }));

  const total = normalizedItems.reduce(
    (sum, item) => sum + item.percentage,
    0
  );

  let accumulated = 0;

  const topCategory = normalizedItems[0];

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#edf2fb"
          strokeWidth={strokeWidth}
        />

        {normalizedItems.map((item, index) => {
          const percentage =
            total > 100
              ? (item.percentage / total) * 100
              : item.percentage;

          const segmentLength =
            (percentage / 100) * circumference;

          const gap = 3;

          const dashLength = Math.max(
            segmentLength - gap,
            0
          );

          const dashOffset =
            -(accumulated / 100) * circumference;

          accumulated += percentage;

          return (
            <circle
              key={`${item.category}-${index}`}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={CHART_COLORS[index] ?? "#94a3b8"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${
                circumference - dashLength
              }`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-2xl font-bold tracking-tight text-black">
          {topCategory
            ? `${Math.min(
                Math.max(topCategory.percentage || 0, 0),
                100
              ).toFixed(0)}%`
            : "0%"}
        </p>

        <p className="mt-0.5 max-w-[80px] truncate text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
          {topCategory?.category ?? "Top"}
        </p>
      </div>
    </div>
  );
}