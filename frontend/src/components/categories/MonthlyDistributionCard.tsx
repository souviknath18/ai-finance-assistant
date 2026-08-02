import {
  CategoryDistributionItem,
} from "@/types/category";

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
    <div className="rounded-2xl border border-[#dfe9fb] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:col-span-8">
      <h2 className="text-lg font-bold text-black">
        Monthly Distribution
      </h2>

      <p className="mt-1.5 text-[13px] text-[#565e74]">
        Relative spending weight across your top 5 categories
        {monthLabel ? ` for ${monthLabel}` : ""}.
      </p>

      {categories.length === 0 ? (
        <p className="mt-6 text-[13px] text-[#565e74]">
          No spending data available for{" "}
          {monthLabel || "this month"}.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {categories.map(
            (category) => {
              const percentage =
                Number(
                  category.percentage
                );

              return (
                <div
                  key={
                    category.name
                  }
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-black">
                        {
                          category.name
                        }
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#76777d]">
                        {
                          category.transactions
                        }{" "}
                        transaction
                        {
                          category.transactions ===
                          1
                            ? ""
                            : "s"
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[13px] font-bold text-black">
                        {formatCurrency(
                          category.spending
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                        {percentage.toFixed(
                          1
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#e5eeff]">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
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