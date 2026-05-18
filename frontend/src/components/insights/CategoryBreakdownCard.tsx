import { PieChart } from "lucide-react";
import IconCircle from "./IconCircle";

export default function CategoryBreakdownCard() {
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
            Your <strong>Dining & Drinks</strong> category increased by 28%
            compared to your average.
          </p>

          <div className="space-y-3">
            <div className="h-2 w-full rounded-full bg-[#e5eeff]">
              <div className="h-2 w-[78%] rounded-full bg-emerald-700" />
            </div>

            <div className="flex justify-between text-xs font-semibold text-[#565e74]">
              <span>Current: ₹98,000</span>
              <span>Limit: ₹1,25,000</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-[#eff4ff] p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
            Aura Recommendation
          </p>

          <p className="mb-5 text-sm font-bold leading-7 text-black">
            “Meal prepping 3 days a week could save you ₹21,000 monthly.”
          </p>

          <button className="rounded-xl border border-black/10 bg-white py-3 text-sm font-bold text-black transition hover:bg-[#dce9ff]">
            Start Tracker
          </button>
        </div>
      </div>
    </div>
  );
}