import { Sparkles, ArrowRight } from "lucide-react";

export default function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-emerald-700">
          <Sparkles size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            AI Insight
          </span>
        </div>

        <h3 className="text-2xl font-bold text-black">
          Save 20% on Yearly
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#565e74]">
          Based on your activity, upgrading to the Annual Pro plan would save
          you $69.60 per year while providing unlimited reports.
        </p>

        <button className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:gap-3">
          View Annual Plans
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl" />
    </div>
  );
}