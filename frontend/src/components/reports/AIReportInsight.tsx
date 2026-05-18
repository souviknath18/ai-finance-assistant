import { Sparkles } from "lucide-react";

export default function AIReportInsight() {
  return (
    <div className="relative rounded-3xl border border-emerald-200 bg-white p-6 shadow-lg md:col-span-4">
      <div className="mb-5 flex items-center gap-3 text-emerald-700">
        <Sparkles size={20} />
        <h3 className="text-xs font-bold uppercase tracking-widest">
          AI Intelligence Layer
        </h3>
      </div>

      <p className="mb-6 text-sm leading-7 text-black">
        Your Q4 savings rate increased by <strong>4.2%</strong>. However, AI
        detected <span className="text-red-600">unusual spending</span> in the
        Lifestyle category during December, likely due to holiday travel.
      </p>

      <div className="mt-auto space-y-4">
        <div className="rounded-2xl border border-[#c6c6cd] bg-[#e5eeff] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Top Unusual Expense
          </p>

          <div className="flex justify-between gap-4">
            <span className="text-sm font-bold text-black">
              Luxury Travel Gear
            </span>
            <span className="text-sm font-bold text-red-600">$1,240</span>
          </div>
        </div>

        <button className="w-full rounded-xl border border-emerald-700 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
          Apply Q1 Recommendation
        </button>
      </div>
    </div>
  );
}