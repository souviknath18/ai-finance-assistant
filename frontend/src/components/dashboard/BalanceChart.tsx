"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Upload,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

type ChartItem = {
  month: string;
  income: number;
  expense: number;
};

type BalanceChartProps = {
  data: ChartItem[];
  hasData: boolean;
};

function formatMoney(
  value: number
) {
  if (value >= 100000) {
    return `₹${(
      value / 100000
    ).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(
      value / 1000
    ).toFixed(0)}K`;
  }

  return `₹${value.toLocaleString(
    "en-IN"
  )}`;
}

export default function BalanceChart({
  data,
  hasData,
}: BalanceChartProps) {
  const router = useRouter();

  const [
    period,
    setPeriod,
  ] =
    useState<"6M" | "1Y">(
      "6M"
    );

  const filteredData =
    useMemo(() => {
      const count =
        period === "6M"
          ? 6
          : 12;

      const now =
        new Date();

      return Array.from({
        length: count,
      }).map(
        (_, index) => {
          const offset =
            count -
            1 -
            index;

          const date =
            new Date(
              now.getFullYear(),
              now.getMonth() -
                offset,
              1
            );

          const label =
            date.toLocaleString(
              "en-US",
              {
                month:
                  "short",
              }
            );

          const existing =
            data.find(
              (item) =>
                item.month ===
                label
            );

          return (
            existing || {
              month: label,
              income: 0,
              expense: 0,
            }
          );
        }
      );
    }, [data, period]);

  const chartData =
    filteredData.map(
      (item) => {
        const balance =
          Math.max(
            item.income -
              item.expense,
            0
          );

        const itemHasData =
          item.income > 0 ||
          item.expense > 0;

        return {
          ...item,
          balance,
          hasData:
            itemHasData,
        };
      }
    );

  const maxValue =
    Math.max(
      ...chartData.map(
        (item) =>
          item.balance
      ),
      1
    );

  const latestBalance =
    chartData[
      chartData.length - 1
    ]?.balance || 0;

  const previousBalance =
    chartData[
      chartData.length - 2
    ]?.balance || 0;

  const balanceChange =
    previousBalance > 0
      ? ((latestBalance -
          previousBalance) /
          previousBalance) *
        100
      : 0;

  const monthsWithData =
    chartData.filter(
      (item) =>
        item.hasData
    );

  const averageBalance =
    monthsWithData.length >
    0
      ? monthsWithData.reduce(
          (
            total,
            item
          ) =>
            total +
            item.balance,
          0
        ) /
        monthsWithData.length
      : 0;

  const highestMonth =
    monthsWithData.length >
    0
      ? monthsWithData.reduce(
          (
            highest,
            item
          ) =>
            item.balance >
            highest.balance
              ? item
              : highest
        )
      : {
          month: "—",
          balance: 0,
          income: 0,
          expense: 0,
          hasData: false,
        };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <BarChart3
                size={17}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                Monthly Balance
              </h3>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                Net movement
                after income and
                expenses.
              </p>
            </div>
          </div>

          {/* Statistics */}
          {hasData && (
            <div className="mt-5 flex flex-wrap items-start gap-x-6 gap-y-4 sm:pl-[52px]">
              {/* Current */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                  Current Balance
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <p className="text-[20px] font-bold tracking-tight text-black">
                    {formatMoney(
                      latestBalance
                    )}
                  </p>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold ${
                      balanceChange >=
                      0
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-red-100 bg-red-50 text-red-600"
                    }`}
                  >
                    <TrendingUp
                      size={10}
                      className={
                        balanceChange <
                        0
                          ? "rotate-180"
                          : ""
                      }
                    />

                    {balanceChange >=
                    0
                      ? "+"
                      : ""}
                    {balanceChange.toFixed(
                      1
                    )}
                    %
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-[#7c839b]">
                  vs previous
                  month
                </p>
              </div>

              <div className="hidden h-11 w-px bg-[#e6edf9] sm:block" />

              {/* Average */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                  Monthly Average
                </p>

                <p className="mt-1.5 text-[16px] font-bold tracking-tight text-black">
                  {formatMoney(
                    averageBalance
                  )}
                </p>

                <p className="mt-1 text-[10px] text-[#7c839b]">
                  Selected period
                </p>
              </div>

              <div className="hidden h-11 w-px bg-[#e6edf9] sm:block" />

              {/* Highest */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                  Highest Month
                </p>

                <p className="mt-1.5 text-[16px] font-bold tracking-tight text-black">
                  {
                    highestMonth.month
                  }
                </p>

                <p className="mt-1 text-[10px] font-semibold text-emerald-700">
                  {formatMoney(
                    highestMonth.balance
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Period */}
        <div className="inline-flex w-fit shrink-0 rounded-xl border border-[#e6edf9] bg-[#fbfcff] p-1">
          {(
            [
              "6M",
              "1Y",
            ] as const
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setPeriod(
                  item
                )
              }
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold transition-[background-color,color,box-shadow] ${
                period ===
                item
                  ? "bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
                  : "text-[#565e74] hover:bg-white hover:text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="relative h-[280px] rounded-2xl bg-gradient-to-b from-[#fbfcff] to-[#f6f9ff] px-3 pb-8 pt-8 sm:px-5">
          <div
            className={`flex h-full items-end ${
              period === "1Y"
                ? "gap-1.5 sm:gap-3"
                : "gap-3 sm:gap-5"
            }`}
          >
            {chartData.map(
              (
                item,
                index
              ) => {
                const height =
                  item.hasData
                    ? `${Math.max(
                        (item.balance /
                          maxValue) *
                          100,
                        8
                      )}%`
                    : "8%";

                return (
                  <div
                    key={`${item.month}-${index}`}
                    className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    {/* Bar area */}
                    <div className="relative flex min-h-0 w-full flex-1 items-end">
                      {/* Hover value */}
                      {item.hasData && (
                        <div className="pointer-events-none absolute left-1/2 top-1 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-[9px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                          {formatMoney(
                            item.balance
                          )}
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`w-full rounded-t-xl transition-[height,background-color] duration-500 ${
                          item.hasData
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                            : "bg-[#e8eef8]"
                        }`}
                        style={{
                          height,
                        }}
                      />
                    </div>

                    {/* Month */}
                    <span
                      className={`mt-3 block whitespace-nowrap text-center font-bold text-[#7c839b] ${
                        period ===
                        "1Y"
                          ? "text-[9px]"
                          : "text-[10px]"
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Empty state */}
        {!hasData && (
          <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 bg-[#fbfffd] p-5 text-center">
            <p className="text-[13px] font-bold text-black">
              No financial
              activity yet
            </p>

            <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-[#565e74]">
              Upload a bank
              statement or CSV
              to generate your
              monthly balance
              trend and
              AI-powered
              spending
              analytics.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/uploads"
                )
              }
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[11px] font-bold text-white transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
            >
              <Upload
                size={14}
              />
              Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}