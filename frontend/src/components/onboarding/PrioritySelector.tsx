import {
  BarChart3,
  Check,
  ShieldAlert,
  ShoppingCart,
  TrendingDown,
  Umbrella,
} from "lucide-react";

const priorities = [
  {
    label: "Debt Reduction",
    value: "debt_reduction",
    icon: TrendingDown,
    description: "Reduce outstanding debt and interest costs.",
  },
  {
    label: "Wealth Building",
    value: "wealth_building",
    icon: BarChart3,
    description: "Grow savings and long-term financial assets.",
  },
  {
    label: "Emergency Fund",
    value: "emergency_fund",
    icon: ShieldAlert,
    description: "Build a financial safety buffer for unexpected costs.",
  },
  {
    label: "Retirement",
    value: "retirement",
    icon: Umbrella,
    description: "Prepare for long-term retirement goals.",
  },
  {
    label: "Large Purchase",
    value: "large_purchase",
    icon: ShoppingCart,
    description: "Plan savings for a major future purchase.",
  },
];

type PrioritySelectorProps = {
  selectedPriorities: string[];
  onToggleAction: (
    value: string
  ) => void;
};

export default function PrioritySelector({
  selectedPriorities,
  onToggleAction,
}: PrioritySelectorProps) {
  return (
    <section>
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
            Financial Focus
          </p>

          <span className="rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2 py-0.5 text-[9px] font-bold text-[#7c839b]">
            Select one or more
          </span>
        </div>

        <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
          Main Financial Priorities
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
          Choose the areas you want Aura to prioritize when generating insights,
          alerts, and recommendations.
        </p>
      </div>

      {/* Priority cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {priorities.map((priority) => {
          const Icon =
            priority.icon;

          const active =
            selectedPriorities.includes(
              priority.value
            );

          return (
            <button
              key={priority.value}
              type="button"
              onClick={() =>
                onToggleAction(
                  priority.value
                )
              }
              aria-pressed={active}
              className={`group relative flex min-h-[108px] items-start gap-3 rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-200 ${
                active
                  ? "border-emerald-200 bg-emerald-50/60 shadow-[0_4px_14px_rgba(16,185,129,0.05)]"
                  : "border-[#e6edf9] bg-[#fbfcff] hover:border-emerald-100 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  active
                    ? "border-emerald-100 bg-white text-emerald-700"
                    : "border-[#e6edf9] bg-white text-[#565e74] group-hover:border-emerald-100 group-hover:text-emerald-700"
                }`}
              >
                <Icon size={15} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[12px] font-bold ${
                    active
                      ? "text-emerald-800"
                      : "text-black"
                  }`}
                >
                  {priority.label}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#7c839b]">
                  {priority.description}
                </p>
              </div>

              {/* Selected indicator */}
              <div
                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  active
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-[#d8e0ed] bg-white text-transparent"
                }`}
              >
                <Check size={11} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected count */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-medium text-[#8a92a5]">
          You can update these priorities later from Settings.
        </p>

        <span className="shrink-0 text-[10px] font-bold text-emerald-700">
          {selectedPriorities.length} selected
        </span>
      </div>
    </section>
  );
}