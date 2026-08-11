import {
  CategoryDistributionItem,
} from "@/types/category";

import {
  getCategoryStyles,
} from "@/lib/utils/categoryStyles";

type Props = {
  categories: CategoryDistributionItem[];
  monthLabel: string;
};

function formatCurrency(
  value: string
) {
  return `₹${Number(
    value
  ).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function MonthlyDistributionCard({
  categories,
  monthLabel,
}: Props) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] lg:col-span-7">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Monthly Distribution
        </p>

        <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
          Spending by Category
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
          Relative spending weight across your top 5 categories
          {monthLabel
            ? ` for ${monthLabel}`
            : ""}
          .
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-5 text-center">
          <div>
            <p className="text-[13px] font-bold text-black">
              No spending data
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
              No spending activity is available for{" "}
              {monthLabel ||
                "this month"}
              .
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(
            (category) => {
              const percentage =
                Math.min(
                  Math.max(
                    Number(
                      category.percentage
                    ) || 0,
                    0
                  ),
                  100
                );

              const styles =
                getCategoryStyles(
                  category.name
                );

              return (
                <div
                  key={
                    category.name
                  }
                  className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5"
                >
                  <div className="mb-2.5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-black">
                        {
                          category.name
                        }
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#7c839b]">
                        {
                          category.transactions
                        }{" "}
                        transaction
                        {category.transactions ===
                        1
                          ? ""
                          : "s"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[12px] font-bold text-black">
                        {formatCurrency(
                          category.spending
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] font-bold text-emerald-700">
                        {percentage.toFixed(
                          1
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${styles.progress} transition-[width] duration-500`}
                      style={{
                        width: `${Math.max(
                          percentage,
                          2
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}