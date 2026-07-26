"use client";

import { BarChart3, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";

type MonthlySpendingItem = {
  month: string;
  amount: number;
};

type SpendingVelocityCardProps = {
  data?: MonthlySpendingItem[];
  currency?: string;
  locale?: string;
  onViewReportAction?: () => void;
};

const defaultData: MonthlySpendingItem[] = [
  { month: "Jan", amount: 9820 },
  { month: "Feb", amount: 11420 },
  { month: "Mar", amount: 7850 },
  { month: "Apr", amount: 13200 },
  { month: "May", amount: 15870 },
  { month: "Jun", amount: 14120 },
];

export default function SpendingVelocityCard({
  data = defaultData,
  currency = "INR",
  locale = "en-IN",
  onViewReportAction,
}: SpendingVelocityCardProps) {
  const safeData = data.length > 0 ? data : defaultData;

  const currentMonth = safeData[safeData.length - 1];
  const previousMonth =
    safeData.length > 1 ? safeData[safeData.length - 2] : null;

  const maximumAmount = Math.max(
    ...safeData.map((item) => item.amount),
    1
  );

  const averageAmount =
    safeData.reduce((total, item) => total + item.amount, 0) /
    safeData.length;

  const highestMonth = safeData.reduce((highest, item) =>
    item.amount > highest.amount ? item : highest
  );

  const percentageChange =
    previousMonth && previousMonth.amount > 0
      ? ((currentMonth.amount - previousMonth.amount) /
          previousMonth.amount) *
        100
      : 0;

  const isLower = percentageChange < 0;
  const isHigher = percentageChange > 0;
  const absoluteChange = Math.abs(percentageChange);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const formatCompactCurrency = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);

  const averagePercentage = Math.min(
    (averageAmount / maximumAmount) * 100,
    100
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfe9fb] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:col-span-2">
      <div className="p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <BarChart3 size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[16px] font-bold tracking-tight text-black sm:text-[17px]">
                Monthly Spending Trend
              </h3>

              <p className="mt-1 text-[12px] leading-5 text-[#6b7280]">
                Spending activity across the last {safeData.length} months
              </p>
            </div>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
              isLower
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : isHigher
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {isLower ? (
              <TrendingDown size={13} />
            ) : isHigher ? (
              <TrendingUp size={13} />
            ) : null}

            {absoluteChange.toFixed(1)}% vs last month
          </div>
        </div>

        {/* CURRENT VALUE */}
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Current month
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
            <p className="text-2xl font-bold tracking-tight text-black sm:text-[28px]">
              {formatCurrency(currentMonth.amount)}
            </p>

            <p className="pb-1 text-[12px] font-semibold text-[#6b7280]">
              {currentMonth.month}
            </p>
          </div>
        </div>

        {/* CHART */}
        <div className="relative mt-7">
          <div
            className="pointer-events-none absolute left-0 right-0 z-10 border-t border-dashed border-[#9fb4d8]"
            style={{
              bottom: `calc(${averagePercentage}% + 27px)`,
            }}
          >
            <span className="absolute -top-5 right-0 rounded-md bg-white px-1.5 text-[9px] font-bold uppercase tracking-wide text-[#7c839b]">
              Average
            </span>
          </div>

          <div className="flex h-48 items-end justify-between gap-2 border-b border-[#e5eeff] px-1 sm:gap-3 sm:px-2">
            {safeData.map((item, index) => {
              const barHeight = Math.max(
                (item.amount / maximumAmount) * 100,
                8
              );

              const isCurrent = index === safeData.length - 1;

              return (
                <div
                  key={`${item.month}-${index}`}
                  className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  <div className="relative flex flex-1 items-end justify-center">
                    {/* TOOLTIP */}
                    <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#111827] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg group-hover:block">
                      <p>{item.month}</p>
                      <p className="mt-0.5 text-[9px] font-medium text-[#d1d5db]">
                        {formatCurrency(item.amount)}
                      </p>

                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#111827]" />
                    </div>

                    {/* CURRENT VALUE LABEL */}
                    {isCurrent && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-emerald-700">
                        {formatCompactCurrency(item.amount)}
                      </span>
                    )}

                    {/* BAR */}
                    <div
                      className={`w-full max-w-[46px] origin-bottom rounded-t-xl transition-all duration-300 group-hover:-translate-y-1 ${
                        isCurrent
                          ? "bg-gradient-to-t from-emerald-700 to-emerald-400 shadow-[0_8px_20px_rgba(16,185,129,0.22)]"
                          : "bg-gradient-to-t from-emerald-100 to-emerald-300 group-hover:from-emerald-200 group-hover:to-emerald-400"
                      }`}
                      style={{
                        height: `${barHeight}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex h-5 items-center justify-center">
                    <span
                      className={`text-[10px] font-bold sm:text-[11px] ${
                        isCurrent
                          ? "text-emerald-700"
                          : "text-[#7c839b]"
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* METRICS */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#e5eeff] bg-[#f8faff] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
              Monthly average
            </p>

            <p className="mt-1 text-[14px] font-bold text-black">
              {formatCurrency(averageAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-[#e5eeff] bg-[#f8faff] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
              Highest month
            </p>

            <p className="mt-1 truncate text-[14px] font-bold text-black">
              {highestMonth.month} ·{" "}
              {formatCompactCurrency(highestMonth.amount)}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col gap-3 border-t border-[#e5eeff] bg-[#fbfcff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-2">
          <CheckCircle2
            size={16}
            className={`mt-0.5 shrink-0 ${
              isLower ? "text-emerald-600" : "text-[#7c839b]"
            }`}
          />

          <p className="text-[12px] leading-5 text-[#565e74]">
            {isLower ? (
              <>
                You spent{" "}
                <span className="font-bold text-emerald-700">
                  {absoluteChange.toFixed(1)}% less
                </span>{" "}
                than {previousMonth?.month}.
              </>
            ) : isHigher ? (
              <>
                You spent{" "}
                <span className="font-bold text-red-600">
                  {absoluteChange.toFixed(1)}% more
                </span>{" "}
                than {previousMonth?.month}.
              </>
            ) : (
              <>Your spending is unchanged from last month.</>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onViewReportAction}
          className="w-fit text-[12px] font-bold text-black transition cursor-pointer hover:text-emerald-700"
        >
          View detailed report
        </button>
      </div>
    </div>
  );
}