"use client";

import { useMemo, useState } from "react";
import { Upload, BarChart3, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

type ChartItem = {
  month: string;
  income: number;
  expense: number;
};

type BalanceChartProps = {
  data: ChartItem[];
  hasData: boolean;
};

function formatMoney(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function BalanceChart({ data, hasData }: BalanceChartProps) {
  const router = useRouter();
  const [period, setPeriod] = useState<"6M" | "1Y">("6M");

  const filteredData = useMemo(() => {
    const count = period === "6M" ? 6 : 12;
    const now = new Date();

    return Array.from({ length: count }).map((_, index) => {
      const offset = count - 1 - index;
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const label = date.toLocaleString("en-US", { month: "short" });
      const existing = data.find((item) => item.month === label);

      return existing || { month: label, income: 0, expense: 0 };
    });
  }, [data, period]);

  const chartData = filteredData.map((item) => {
    const balance = Math.max(item.income - item.expense, 0);
    const itemHasData = item.income > 0 || item.expense > 0;

    return {
      ...item,
      balance,
      hasData: itemHasData,
    };
  });

  const maxValue = Math.max(...chartData.map((item) => item.balance), 1);
  const latestBalance = chartData[chartData.length - 1]?.balance || 0;
  const previousBalance = chartData[chartData.length - 2]?.balance || 0;

  const balanceChange =
    previousBalance > 0
      ? ((latestBalance - previousBalance) / previousBalance) * 100
      : 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe5f5] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart3 size={18} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-black">
                Monthly Balance
              </h3>
              <p className="text-[12px] font-medium text-[#565e74]">
                Net movement after income and expenses.
              </p>
            </div>
          </div>

          {hasData && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-black">
                {formatMoney(latestBalance)}
              </h2>

              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  balanceChange >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <TrendingUp size={13} />
                {balanceChange >= 0 ? "+" : ""}
                {balanceChange.toFixed(1)}%
              </span>

              <span className="text-[12px] font-medium text-[#7c839b]">
                vs previous month
              </span>
            </div>
          )}
        </div>

        <div className="inline-flex w-fit rounded-xl border border-[#dbe5f5] bg-[#f8f9ff] p-1">
          {(["6M", "1Y"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                period === item
                  ? "bg-black text-white shadow-sm"
                  : "text-[#565e74] hover:bg-white hover:text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="relative h-[320px] rounded-2xl bg-[#f8f9ff] px-3 pb-8 pt-6 sm:px-5">
          <div className="pointer-events-none absolute inset-x-5 top-6 bottom-8 flex flex-col justify-between">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="border-t border-dashed border-[#dbe5f5]" />
            ))}
          </div>

          <div
            className={`relative z-10 flex h-full items-end ${
              period === "1Y" ? "gap-1.5 sm:gap-3" : "gap-3 sm:gap-5"
            }`}
          >
            {chartData.map((item, index) => {
              const height = item.hasData
                ? `${Math.max((item.balance / maxValue) * 100, 8)}%`
                : "8%";

              return (
                <div
                  key={`${item.month}-${index}`}
                  className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                >
                  <div className="relative flex min-h-0 w-full flex-1 items-end">
                    {item.hasData && (
                      <div className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-black px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                        {formatMoney(item.balance)}
                      </div>
                    )}

                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        item.hasData
                          ? "bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-700 group-hover:to-emerald-500"
                          : "bg-[#e8eef8]"
                      }`}
                      style={{ height }}
                    />
                  </div>

                  <span
                    className={`mt-3 block whitespace-nowrap text-center font-bold text-[#7c839b] ${
                      period === "1Y"
                        ? "text-[9px] max-sm:-rotate-90"
                        : "text-[11px]"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {!hasData && (
          <div className="mt-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-5 text-center">
            <p className="text-[13px] font-bold text-black">
              No financial activity yet
            </p>

            <p className="mx-auto mt-1 max-w-md text-[13px] leading-5 text-[#565e74]">
              Upload a bank statement or CSV to generate your monthly balance
              trend and AI-powered spending analytics.
            </p>

            <button
              onClick={() => router.push("/uploads")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
            >
              <Upload size={15} />
              Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}