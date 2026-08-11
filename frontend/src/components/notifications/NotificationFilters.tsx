import { NotificationResponse } from "@/types/notification";

type NotificationFiltersProps = {
  counts: NotificationResponse["counts"];
  activeFilter: string;
  onFilterAction: (filter: string) => void;
};

export default function NotificationFilters({
  counts,
  activeFilter,
  onFilterAction,
}: NotificationFiltersProps) {
  const filters = [
    {
      label: "All Alerts",
      value: "all",
      count: counts.all,
    },
    {
      label: "Budget Warnings",
      value: "budget",
      count: counts.budget,
    },
    {
      label: "Goal Updates",
      value: "goal",
      count: counts.goal,
    },
    {
      label: "Reports",
      value: "report",
      count: counts.report,
    },
    {
      label: "Subscriptions",
      value: "subscription",
      count: counts.subscription,
    },
    {
      label: "AI Alerts",
      value: "ai_alert",
      count: counts.ai_alert,
    },
  ];

  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
        Filter By Type
      </p>

      <div className="space-y-1.5">
        {filters.map((filter) => {
          const active =
            activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onFilterAction(filter.value)
              }
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[12px] font-semibold transition-[background-color,color] duration-200 ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-[#565e74] hover:bg-[#f8f9ff] hover:text-black"
              }`}
            >
              <span>{filter.label}</span>

              <span
                className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "bg-[#f3f6fc] text-[#7c839b]"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}