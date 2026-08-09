import { PieChart } from "lucide-react";

import IconCircle from "./IconCircle";

import { CategoryBreakdownItem } from "@/types/insights";


type CategoryBreakdownCardProps = {
  items: CategoryBreakdownItem[];
};


export default function CategoryBreakdownCard({
  items,
}: CategoryBreakdownCardProps) {
  const topItems = items.slice(0, 4);

  const topCategory = topItems[0];

  return (
    <div className="flex flex-col rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <IconCircle tone="green">
          <PieChart size={18} />
        </IconCircle>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
            Category Breakdown
          </p>

          <p className="mt-1 text-[13px] font-semibold text-black">
            Where your money is going
          </p>
        </div>
      </div>

      {/* Empty State */}
      {topItems.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center rounded-xl border border-[#e5eeff] bg-[#f8faff] px-5 text-center">
          <p className="max-w-sm text-[13px] leading-6 text-[#565e74]">
            No category spending data is available for this period yet.
          </p>
        </div>
      ) : (
        <>
          {/* Top Category */}
          <div className="mb-5 rounded-xl border border-[#e5eeff] bg-[#f8faff] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                Top Spending Category
              </p>

              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#565e74]">
                {topCategory.percentage.toFixed(1)}%
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-black">
                  {topCategory.category}
                </h3>

                <p className="mt-1 text-[12px] text-[#565e74]">
                  {topCategory.count}{" "}
                  {topCategory.count === 1
                    ? "transaction"
                    : "transactions"}
                </p>
              </div>

              <p className="text-xl font-bold text-black">
                {topCategory.total_display}
              </p>
            </div>
          </div>

          {/* Category Rows */}
          <div className="space-y-4">
            {topItems.map(
              (item, index) => (
                <CategoryRow
                  key={item.category}
                  category={item.category}
                  amount={
                    item.total_display
                  }
                  count={item.count}
                  percentage={
                    item.percentage
                  }
                  isTop={index === 0}
                />
              )
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 border-t border-[#e5eeff] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
                  Top 4 Categories
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Ranked by verified expense totals for the selected period.
                </p>
              </div>

              <a
                href="/transactions"
                className="shrink-0 rounded-xl border border-[#e5eeff] bg-white px-4 py-2.5 text-[11px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
              >
                View Transactions
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


type CategoryRowProps = {
  category: string;
  amount: string;
  count: number;
  percentage: number;
  isTop?: boolean;
};


function CategoryRow({
  category,
  amount,
  count,
  percentage,
  isTop = false,
}: CategoryRowProps) {
  const safePercentage = Math.min(
    Math.max(
      percentage || 0,
      0
    ),
    100
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-[12px] font-bold text-black">
              {category}
            </p>

            {isTop && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                Top
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[10px] text-[#8a92a5]">
            {count}{" "}
            {count === 1
              ? "transaction"
              : "transactions"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[12px] font-bold text-black">
            {amount}
          </p>

          <p className="mt-0.5 text-[10px] font-semibold text-[#8a92a5]">
            {safePercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className={`h-full rounded-full transition-all ${
            isTop
              ? "bg-emerald-700"
              : "bg-[#9fb7d7]"
          }`}
          style={{
            width: `${
              safePercentage > 0
                ? Math.max(
                    safePercentage,
                    3
                  )
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  );
}