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
    { label: "All Alerts", value: "all", count: counts.all },
    { label: "Budget Warnings", value: "budget", count: counts.budget },
    { label: "Goal Updates", value: "goal", count: counts.goal },
    { label: "Reports", value: "report", count: counts.report },
    {
      label: "Subscriptions",
      value: "subscription",
      count: counts.subscription,
    },
    { label: "AI Alerts", value: "ai_alert", count: counts.ai_alert },
  ];

  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <h2 className="mb-3.5 text-[11px] font-bold uppercase tracking-widest text-[#565e74]">
        Filter By Type
      </h2>

      <div className="space-y-2">
        {filters.map((filter) => {
          const active = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              onClick={() => onFilterAction(filter.value)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition ${
                active
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-[#565e74] hover:bg-[#eff4ff] hover:text-black"
              }`}
            >
              <span>{filter.label}</span>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  active ? "bg-emerald-800 text-white" : "text-[#565e74]"
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