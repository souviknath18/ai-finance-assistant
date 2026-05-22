import { PieChart } from "lucide-react";
import IconCircle from "./IconCircle";

type CategoryBreakdownItem = {
  category: string;
  total_display: string;
  count: number;
};

type CategoryBreakdownCardProps = {
  items: CategoryBreakdownItem[];
};

export default function CategoryBreakdownCard({
  items,
}: CategoryBreakdownCardProps) {
  const top = items[0];

  return (
    <div className="rounded-3xl border border-transparent bg-white p-6 shadow-sm transition hover:border-[#c6c6cd] hover:shadow-md md:col-span-2">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <IconCircle tone="green">
              <PieChart size={20} />
            </IconCircle>

            <h3 className="text-xs font-bold uppercase tracking-wide text-black">
              Category Breakdown
            </h3>
          </div>

          <p className="mb-5 text-sm leading-7 text-[#565e74]">
            {top ? (
              <>
                Your <strong>{top.category}</strong> category has the highest
                spend at <strong>{top.total_display}</strong>.
              </>
            ) : (
              "Upload transactions to generate category breakdown insights."
            )}
          </p>

          <div className="space-y-3">
            <div className="h-2 w-full rounded-full bg-[#e5eeff]">
              <div className="h-2 w-[78%] rounded-full bg-emerald-700" />
            </div>

            <div className="flex justify-between text-xs font-semibold text-[#565e74]">
              <span>Top: {top?.total_display || "₹0.00"}</span>
              <span>{top?.count || 0} transactions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-[#eff4ff] p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
            Aura Recommendation
          </p>

          <p className="mb-5 text-sm font-bold leading-7 text-black">
            “Review your highest spending category first to find quick savings
            opportunities.”
          </p>

          <button className="rounded-xl border border-black/10 bg-white py-3 text-sm font-bold text-black transition hover:bg-[#dce9ff]">
            Start Tracker
          </button>
        </div>
      </div>
    </div>
  );
}