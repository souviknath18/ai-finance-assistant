import { CategorySummary } from "@/types/category";

type Props = {
  categories: CategorySummary[];
};

export default function MonthlyDistributionCard({ categories }: Props) {
  const topCategories = categories
    .filter((category) => Number(category.spending) > 0)
    .slice(0, 5);

  const maxSpending = Math.max(
    ...topCategories.map((category) => Number(category.spending)),
    1
  );

  return (
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm lg:col-span-8">
      <h2 className="text-lg font-bold text-black">Monthly Distribution</h2>

      <p className="mt-1.5 text-[13px] text-[#565e74]">
        Relative spending weight across your top 5 categories.
      </p>

      {topCategories.length === 0 ? (
        <p className="mt-6 text-[13px] text-[#565e74]">
          No spending data available yet.
        </p>
      ) : (
        <div className="mt-6 flex h-36 items-end gap-4">
          {topCategories.map((category, index) => {
            const height = `${Math.max(
              (Number(category.spending) / maxSpending) * 100,
              12
            )}%`;

            return (
              <div
                key={category.name}
                className="group flex flex-1 flex-col items-center gap-2.5"
              >
                <div
                  className={`w-full rounded-t-xl transition group-hover:opacity-80 ${
                    index % 2 === 0 ? "bg-emerald-700" : "bg-emerald-300"
                  }`}
                  style={{ height }}
                />

                <span className="text-center text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}