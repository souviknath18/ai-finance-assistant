import { PieChart } from "lucide-react";
import IconCircle from "./IconCircle";

type CategoryBreakdownItem = {
  category: string;
  total_display: string;
  count: number;
  percentage?: number;
};

type CategoryBreakdownCardProps = {
  items: CategoryBreakdownItem[];
};

export default function CategoryBreakdownCard({
  items,
}: CategoryBreakdownCardProps) {
  const topItems = items.slice(0, 4);

  const topCategory = topItems[0];

  const calculatedItems = topItems.map((item) => {
    const fallbackPercentage =
      topCategory && topCategory.count > 0
        ? Math.min(
            (parseAmount(item.total_display) /
              Math.max(parseAmount(topCategory.total_display), 1)) *
              100,
            100
          )
        : 0;

    return {
      ...item,
      percentage:
        typeof item.percentage === "number"
          ? Math.min(Math.max(item.percentage, 0), 100)
          : fallbackPercentage,
    };
  });

  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm transition hover:border-[#d7e6ff] hover:shadow-md md:col-span-2">
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

      {/* Empty state */}
      {topItems.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center rounded-xl bg-[#f8faff] px-5 text-center">
          <p className="max-w-sm text-[13px] leading-6 text-[#565e74]">
            Upload more transactions to generate your category breakdown.
          </p>
        </div>
      ) : (
        <>
          {/* Top category summary */}
          <div className="mb-5 rounded-xl border border-[#e5eeff] bg-[#f8faff] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              Top Spending Category
            </p>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
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

          {/* Categories */}
          <div className="space-y-4">
            {calculatedItems.map((item, index) => (
              <CategoryRow
                key={`${item.category}-${index}`}
                category={item.category}
                amount={item.total_display}
                count={item.count}
                percentage={item.percentage}
                isTop={index === 0}
              />
            ))}
          </div>

          {/* Recommendation */}
          <div className="mt-5 border-t border-[#e5eeff] pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              Aura Recommendation
            </p>

            <p className="mt-1.5 text-[13px] leading-5 text-[#565e74]">
              Review your highest spending categories first to identify
              practical saving opportunities.
            </p>

            <button
              type="button"
              className="mt-4 rounded-xl border border-[#e5eeff] bg-white px-4 py-2.5 text-[12px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
            >
              View Transactions
            </button>
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
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-black">
            {category}
          </p>

          <p className="mt-0.5 text-[11px] text-[#8a92a5]">
            {count} {count === 1 ? "transaction" : "transactions"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[13px] font-bold text-black">{amount}</p>

          {percentage > 0 && (
            <p className="mt-0.5 text-[10px] font-semibold text-[#8a92a5]">
              {percentage.toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className={`h-full rounded-full transition-all ${
            isTop ? "bg-emerald-700" : "bg-[#9fb7d7]"
          }`}
          style={{
            width: `${Math.max(percentage, percentage > 0 ? 4 : 0)}%`,
          }}
        />
      </div>
    </div>
  );
}

function parseAmount(value: string) {
  const numericValue = Number(
    value.replace(/[₹,\s]/g, "")
  );

  return Number.isFinite(numericValue) ? numericValue : 0;
}