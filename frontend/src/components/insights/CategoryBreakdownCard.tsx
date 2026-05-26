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
    <div className="rounded-2xl border border-transparent bg-white p-5 shadow-sm transition hover:border-[#c6c6cd] hover:shadow-md md:col-span-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <IconCircle tone="green">
              <PieChart size={18} />
            </IconCircle>

            <h3 className="text-[11px] font-bold uppercase tracking-wide text-black">
              Category Breakdown
            </h3>
          </div>

          <p className="mb-4 text-[13px] leading-6 text-[#565e74]">
            {top ? (
              <>
                Your <strong>{top.category}</strong> category has the highest
                spend at <strong>{top.total_display}</strong>.
              </>
            ) : (
              "Upload transactions to generate category breakdown insights."
            )}
          </p>

          <div className="space-y-2.5">
            <div className="h-1.5 w-full rounded-full bg-[#e5eeff]">
              <div className="h-1.5 w-[78%] rounded-full bg-emerald-700" />
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-[#565e74]">
              <span>Top: {top?.total_display || "₹0.00"}</span>
              <span>{top?.count || 0} transactions</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-[#eff4ff] p-5">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            Aura Recommendation
          </p>

          <p className="mb-4 text-[13px] font-bold leading-6 text-black">
            “Review your highest spending category first to find quick savings
            opportunities.”
          </p>

          <button className="rounded-xl border border-black/10 bg-white py-2.5 text-[13px] font-bold text-black transition hover:bg-[#dce9ff]">
            Start Tracker
          </button>
        </div>
      </div>
    </div>
  );
}