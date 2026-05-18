import {
  TrendingDown,
  BarChart3,
  ShieldAlert,
  Umbrella,
  ShoppingCart,
} from "lucide-react";

const priorities = [
  { label: "Debt Reduction", value: "debt_reduction", icon: TrendingDown },
  { label: "Wealth Building", value: "wealth_building", icon: BarChart3 },
  { label: "Emergency Fund", value: "emergency_fund", icon: ShieldAlert },
  { label: "Retirement", value: "retirement", icon: Umbrella },
  { label: "Large Purchase", value: "large_purchase", icon: ShoppingCart },
];

type PrioritySelectorProps = {
  selectedPriorities: string[];
  onToggleAction: (value: string) => void;
};

export default function PrioritySelector({
  selectedPriorities,
  onToggleAction,
}: PrioritySelectorProps) {
  return (
    <div className="space-y-4">
      <label className="ml-1 text-sm text-[#565e74]">
        Main Financial Priorities
      </label>

      <div className="flex flex-wrap gap-3">
        {priorities.map((priority) => {
          const Icon = priority.icon;
          const active = selectedPriorities.includes(priority.value);

          return (
            <button
              key={priority.value}
              type="button"
              onClick={() => onToggleAction(priority.value)}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition ${
                active
                  ? "border-emerald-700 bg-emerald-50 font-semibold text-emerald-700"
                  : "border-[#c6c6cd] text-[#45464d] hover:border-emerald-600 hover:text-emerald-700"
              }`}
            >
              <Icon size={17} />
              {priority.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}