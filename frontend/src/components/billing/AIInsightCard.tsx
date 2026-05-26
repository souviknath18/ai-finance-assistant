import { Sparkles, ArrowRight } from "lucide-react";

export default function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 text-emerald-700">
          <Sparkles size={16} />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            AI Insight
          </span>
        </div>

        <h3 className="text-lg font-bold text-black">
          Save 20% on Yearly
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-[#565e74]">
          Based on your activity, upgrading to the Annual Pro plan would save
          you $69.60 per year while providing unlimited reports.
        </p>

        <button className="mt-5 flex items-center gap-2 text-[13px] font-bold text-emerald-700 transition hover:gap-3">
          View Annual Plans
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-100/50 blur-3xl" />
    </div>
  );
}