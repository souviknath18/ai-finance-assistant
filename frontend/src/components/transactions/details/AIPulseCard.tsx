import { Bolt } from "lucide-react";
import type { TransactionDetails } from "@/types/transaction";

type AIPulseCardProps = {
  trend: TransactionDetails["trend"];
};

export default function AIPulseCard({
  trend,
}: AIPulseCardProps) {
  if (!trend) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-black p-5 text-white shadow-sm">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2 text-emerald-300">
            <Bolt size={16} />

            <span className="text-[11px] font-bold uppercase tracking-widest">
              AI Pulse
            </span>
          </div>

          <h3 className="mb-2 text-lg font-bold">
            Spending Trend
          </h3>

          <p className="text-[13px] leading-6 text-[#bec6e0]">
            Not enough historical transactions are available to calculate a
            spending trend.
          </p>
        </div>
      </div>
    );
  }

  const maxTotal = Math.max(
    trend.previousMonthTotal,
    trend.currentMonthTotal,
    1,
  );

  const previousHeight = Math.max(
    15,
    (trend.previousMonthTotal / maxTotal) * 100,
  );

  const currentHeight = Math.max(
    15,
    (trend.currentMonthTotal / maxTotal) * 100,
  );

  const percentageChange = Math.abs(
    trend.percentageChange ?? 0,
  );

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black p-5 text-white shadow-sm">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-emerald-300">
          <Bolt size={16} />

          <span className="text-[11px] font-bold uppercase tracking-widest">
            AI Pulse
          </span>
        </div>

        <h3 className="mb-2 text-lg font-bold">
          Spending Trend
        </h3>

        <p className="mb-5 text-[13px] leading-6 text-[#bec6e0]">
          Your {trend.category} spending is{" "}
          <span
            className={`font-bold ${
              trend.direction === "down"
                ? "text-emerald-300"
                : trend.direction === "up"
                  ? "text-amber-300"
                  : "text-white"
            }`}
          >
            {trend.direction} {percentageChange}%
          </span>{" "}
          compared to last month.
        </p>

        <div className="rounded-xl bg-white/10 p-4">
          <div className="flex h-24 items-end gap-6">
            <div className="flex flex-1 flex-col items-center">
              <span className="mb-2 text-[11px] text-[#bec6e0]">
                ₹{trend.previousMonthTotal.toLocaleString()}
              </span>

              <div
                className="w-full rounded-t-md bg-white/20 transition-all"
                style={{
                  height: `${previousHeight}%`,
                }}
              />

              <span className="mt-2 text-[11px] text-[#bec6e0]">
                Last Month
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center">
              <span className="mb-2 text-[11px] text-[#bec6e0]">
                ₹{trend.currentMonthTotal.toLocaleString()}
              </span>

              <div
                className="w-full rounded-t-md bg-emerald-500 transition-all"
                style={{
                  height: `${currentHeight}%`,
                }}
              />

              <span className="mt-2 text-[11px] text-[#bec6e0]">
                This Month
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}