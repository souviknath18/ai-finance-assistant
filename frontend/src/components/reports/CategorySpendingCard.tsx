type Category = {
  label: string;
  value: string;
  width: string;
};

type CategorySpendingCardProps = {
  categories: Category[];
};

const colors = ["bg-black", "bg-emerald-700", "bg-indigo-300", "bg-[#7c839b]"];

export default function CategorySpendingCard({
  categories,
}: CategorySpendingCardProps) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl md:col-span-6">
      <h2 className="mb-8 text-2xl font-bold text-black">
        Spending by Category
      </h2>

      <div className="space-y-6">
        {categories.length === 0 ? (
          <p className="text-sm font-semibold text-[#565e74]">
            No category spending data available yet.
          </p>
        ) : (
          categories.map((category, index) => (
            <div key={category.label} className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-black">
                <span>{category.label}</span>
                <span>{category.value}</span>
              </div>

              <div className="h-2 w-full rounded-full bg-[#e5eeff]">
                <div
                  className={`h-full rounded-full ${
                    colors[index % colors.length]
                  }`}
                  style={{ width: category.width }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}