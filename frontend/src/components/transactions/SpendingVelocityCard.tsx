"use client";

import {
  BarChart3,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

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
  const safeData =
    data.length > 0
      ? data
      : defaultData;

  const currentMonth =
    safeData[
      safeData.length - 1
    ];

  const previousMonth =
    safeData.length > 1
      ? safeData[
          safeData.length - 2
        ]
      : null;

  const maximumAmount = Math.max(
    ...safeData.map(
      (item) => item.amount
    ),
    1
  );

  const averageAmount =
    safeData.reduce(
      (total, item) =>
        total + item.amount,
      0
    ) / safeData.length;

  const highestMonth =
    safeData.reduce(
      (highest, item) =>
        item.amount >
        highest.amount
          ? item
          : highest
    );

  const percentageChange =
    previousMonth &&
    previousMonth.amount > 0
      ? ((currentMonth.amount -
          previousMonth.amount) /
          previousMonth.amount) *
        100
      : 0;

  const isLower =
    percentageChange < 0;

  const isHigher =
    percentageChange > 0;

  const absoluteChange =
    Math.abs(
      percentageChange
    );

  const formatCurrency = (
    amount: number
  ) =>
    new Intl.NumberFormat(
      locale,
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }
    ).format(amount);

  const formatCompactCurrency = (
    amount: number
  ) =>
    new Intl.NumberFormat(
      locale,
      {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
      }
    ).format(amount);
    

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:col-span-2">
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <BarChart3
                size={17}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
                Spending Activity
              </p>

              <h3 className="mt-1 text-[16px] font-bold tracking-tight text-black">
                Monthly Spending Trend
              </h3>

              <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                Spending across the
                last{" "}
                {safeData.length}{" "}
                months.
              </p>
            </div>
          </div>

          <TrendBadge
            isLower={isLower}
            isHigher={isHigher}
            change={
              absoluteChange
            }
          />
        </div>

        {/* Current spending */}
        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
            Current Month
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-2">
            <p className="text-[24px] font-bold leading-none tracking-tight text-black">
              {formatCurrency(
                currentMonth.amount
              )}
            </p>

            <p className="pb-0.5 text-[11px] font-semibold text-[#7c839b]">
              {
                currentMonth.month
              }
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative mt-7 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] px-4 pb-3 pt-5">

          <div className="flex h-44 items-end justify-between gap-2 border-b border-[#e6edf9] sm:gap-3">
            {safeData.map(
              (item, index) => {
                const barHeight =
                  Math.max(
                    (item.amount /
                      maximumAmount) *
                      100,
                    8
                  );

                const isCurrent =
                  index ===
                  safeData.length -
                    1;

                return (
                  <div
                    key={`${item.month}-${index}`}
                    className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                  >
                    <div className="relative flex flex-1 items-end justify-center">
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1.5 text-[10px] font-bold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] group-hover:block">
                        <p>
                          {
                            item.month
                          }
                        </p>

                        <p className="mt-0.5 text-[9px] font-medium text-white/70">
                          {formatCurrency(
                            item.amount
                          )}
                        </p>

                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-black" />
                      </div>

                      {/* Bar */}
                      <div
                        className="relative flex w-full max-w-[42px] items-end justify-center"
                        style={{
                          height: `${barHeight}%`,
                        }}
                      >
                        {/* Current amount */}
                        {isCurrent && (
                          <span className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-emerald-700">
                            {formatCompactCurrency(item.amount)}
                          </span>
                        )}

                        <div
                          className={`h-full w-full origin-bottom rounded-t-lg transition-[transform,background-color] duration-300 group-hover:-translate-y-1 ${
                            isCurrent
                              ? "bg-emerald-700 shadow-[0_6px_18px_rgba(4,120,87,0.18)]"
                              : "bg-emerald-200 group-hover:bg-emerald-300"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex h-5 items-center justify-center">
                      <span
                        className={`text-[10px] font-bold ${
                          isCurrent
                            ? "text-emerald-700"
                            : "text-[#7c839b]"
                        }`}
                      >
                        {
                          item.month
                        }
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricBox
            label="Monthly Average"
            value={formatCurrency(
              averageAmount
            )}
          />

          <MetricBox
            label="Highest Month"
            value={`${
              highestMonth.month
            } · ${formatCompactCurrency(
              highestMonth.amount
            )}`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <CheckCircle2
            size={14}
            className={`mt-0.5 shrink-0 ${
              isLower
                ? "text-emerald-600"
                : isHigher
                ? "text-red-500"
                : "text-[#7c839b]"
            }`}
          />

          <p className="text-[11px] leading-5 text-[#565e74]">
            {isLower ? (
              <>
                Spending is{" "}
                <span className="font-bold text-emerald-700">
                  {absoluteChange.toFixed(
                    1
                  )}
                  % lower
                </span>{" "}
                than{" "}
                {
                  previousMonth?.month
                }
                .
              </>
            ) : isHigher ? (
              <>
                Spending is{" "}
                <span className="font-bold text-red-600">
                  {absoluteChange.toFixed(
                    1
                  )}
                  % higher
                </span>{" "}
                than{" "}
                {
                  previousMonth?.month
                }
                .
              </>
            ) : (
              <>
                Spending is
                unchanged from the
                previous month.
              </>
            )}
          </p>
        </div>

        {onViewReportAction && (
          <button
            type="button"
            onClick={
              onViewReportAction
            }
            className="shrink-0 text-[11px] font-bold text-black transition hover:text-emerald-700"
          >
            View Detailed Report
          </button>
        )}
      </div>
    </div>
  );
}

function TrendBadge({
  isLower,
  isHigher,
  change,
}: {
  isLower: boolean;
  isHigher: boolean;
  change: number;
}) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        isLower
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : isHigher
          ? "border-red-100 bg-red-50 text-red-600"
          : "border-[#e6edf9] bg-[#fbfcff] text-[#565e74]"
      }`}
    >
      {isLower ? (
        <TrendingDown
          size={12}
        />
      ) : isHigher ? (
        <TrendingUp
          size={12}
        />
      ) : null}

      {change.toFixed(1)}% vs
      last month
    </span>
  );
}

function MetricBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#edf2fb] bg-[#fbfcff] p-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
        {label}
      </p>

      <p className="mt-1.5 truncate text-[13px] font-bold text-black">
        {value}
      </p>
    </div>
  );
}