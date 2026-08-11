import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bolt,
  Minus,
} from "lucide-react";

import type {
  TransactionDetails,
} from "@/types/transaction";

type AIPulseCardProps = {
  trend: TransactionDetails["trend"];
};

export default function AIPulseCard({
  trend,
}: AIPulseCardProps) {
  if (!trend) {
    return (
      <section className="overflow-hidden rounded-3xl bg-black shadow-[0_10px_32px_rgba(15,23,42,0.12)]">
        <div className="p-5">
          <div className="flex items-center gap-2 text-emerald-300">
            <Bolt size={15} />

            <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
              AI Pulse
            </span>
          </div>

          <h3 className="mt-3 text-[16px] font-bold tracking-tight text-white">
            Spending Trend
          </h3>

          <p className="mt-1.5 text-[12px] leading-5 text-[#bec6e0]">
            Not enough historical transactions are available to calculate a
            spending trend yet.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] leading-5 text-[#bec6e0]">
              Aura will compare this category with previous months as more
              transaction history becomes available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const maxTotal = Math.max(
    trend.previousMonthTotal,
    trend.currentMonthTotal,
    1
  );

  const previousHeight = Math.max(
    12,
    (trend.previousMonthTotal / maxTotal) * 100
  );

  const currentHeight = Math.max(
    12,
    (trend.currentMonthTotal / maxTotal) * 100
  );

  const percentageChange = Math.abs(
    trend.percentageChange ?? 0
  );

  const trendConfig = getTrendConfig(
    trend.direction
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-black shadow-[0_10px_32px_rgba(15,23,42,0.12)]">
      {/* Decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-300">
              <Bolt size={15} />

              <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                AI Pulse
              </span>
            </div>

            <h3 className="mt-3 text-[16px] font-bold tracking-tight text-white">
              Spending Trend
            </h3>

            <p className="mt-1 text-[11px] text-[#9fa8be]">
              {trend.category} activity
            </p>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${trendConfig.badge}`}
          >
            {trendConfig.icon}
            {percentageChange.toFixed(1)}%
          </span>
        </div>

        {/* Summary */}
        <p className="mt-4 text-[12px] leading-5 text-[#bec6e0]">
          Your{" "}
          <span className="font-bold text-white">
            {trend.category}
          </span>{" "}
          spending is{" "}
          <span
            className={`font-bold ${trendConfig.text}`}
          >
            {trend.direction === "down"
              ? "lower"
              : trend.direction === "up"
              ? "higher"
              : "unchanged"}
          </span>{" "}
          by{" "}
          <span
            className={`font-bold ${trendConfig.text}`}
          >
            {percentageChange.toFixed(1)}%
          </span>{" "}
          compared with last month.
        </p>

        {/* Chart */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <div className="flex h-36 items-end gap-5">
            <TrendBar
              label="Last Month"
              amount={
                trend.previousMonthTotal
              }
              height={previousHeight}
              active={false}
            />

            <TrendBar
              label="This Month"
              amount={
                trend.currentMonthTotal
              }
              height={currentHeight}
              active
            />
          </div>
        </div>

        {/* Footer insight */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
          <div
            className={`mt-0.5 shrink-0 ${trendConfig.text}`}
          >
            {trendConfig.icon}
          </div>

          <p className="text-[10px] leading-5 text-[#bec6e0]">
            {getTrendMessage(
              trend.direction,
              percentageChange
            )}
          </p>
        </div>

        <button
          type="button"
          className="group mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-white transition hover:text-emerald-300"
        >
          View Category Insights

          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </section>
  );
}

function TrendBar({
  label,
  amount,
  height,
  active,
}: {
  label: string;
  amount: number;
  height: number;
  active: boolean;
}) {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <p
        className={`mb-2 text-center text-[10px] font-bold ${
          active
            ? "text-white"
            : "text-[#bec6e0]"
        }`}
      >
        ₹
        {amount.toLocaleString(
          "en-IN"
        )}
      </p>

      <div className="flex flex-1 items-end justify-center">
        <div
          className={`w-full max-w-[72px] rounded-t-lg transition-[height] duration-500 ${
            active
              ? "bg-emerald-500 shadow-[0_6px_20px_rgba(16,185,129,0.18)]"
              : "bg-white/15"
          }`}
          style={{
            height: `${height}%`,
          }}
        />
      </div>

      <p
        className={`mt-2 text-center text-[10px] font-medium ${
          active
            ? "text-white"
            : "text-[#9fa8be]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function getTrendConfig(
  direction: string
) {
  if (direction === "down") {
    return {
      icon: (
        <ArrowDownRight size={12} />
      ),
      text: "text-emerald-300",
      badge:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (direction === "up") {
    return {
      icon: (
        <ArrowUpRight size={12} />
      ),
      text: "text-amber-300",
      badge:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
    };
  }

  return {
    icon: <Minus size={12} />,
    text: "text-white",
    badge:
      "border-white/10 bg-white/10 text-white",
  };
}

function getTrendMessage(
  direction: string,
  change: number
) {
  if (direction === "down") {
    return `Spending improved by ${change.toFixed(
      1
    )}% compared with the previous month.`;
  }

  if (direction === "up") {
    return `Spending increased by ${change.toFixed(
      1
    )}%. Review recent transactions for possible drivers.`;
  }

  return "Spending is broadly unchanged compared with the previous month.";
}