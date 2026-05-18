const filters = [
  { label: "All Alerts", count: 12, active: true },
  { label: "Budget Warnings", count: 3 },
  { label: "Goal Updates", count: 5 },
  { label: "Reports", count: 2 },
];

export default function NotificationFilters() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#565e74]">
        Filter By Type
      </h2>

      <div className="space-y-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
              filter.active
                ? "bg-emerald-100 text-emerald-800"
                : "text-[#565e74] hover:bg-[#eff4ff] hover:text-black"
            }`}
          >
            <span>{filter.label}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                filter.active
                  ? "bg-emerald-800 text-white"
                  : "text-[#565e74]"
              }`}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}