const categories = [
  { label: "Housing & Utilities", value: "35% • $6,373", width: "35%", color: "bg-black" },
  { label: "Food & Dining", value: "22% • $4,006", width: "22%", color: "bg-emerald-700" },
  { label: "Investments", value: "20% • $3,642", width: "20%", color: "bg-indigo-300" },
  { label: "Transportation", value: "12% • $2,185", width: "12%", color: "bg-[#7c839b]" },
];

export default function CategorySpendingCard() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl md:col-span-6">
      <h2 className="mb-8 text-2xl font-bold text-black">
        Spending by Category
      </h2>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.label} className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-black">
              <span>{category.label}</span>
              <span>{category.value}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#e5eeff]">
              <div
                className={`h-full rounded-full ${category.color}`}
                style={{ width: category.width }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}