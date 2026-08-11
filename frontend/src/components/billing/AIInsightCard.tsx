import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="relative z-10">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700">
          <Sparkles size={17} />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          AI Insight
        </p>

        <h3 className="mt-2 text-[16px] font-bold tracking-tight text-black">
          Save 20% on Yearly
        </h3>

        <p className="mt-2 text-[12px] leading-5 text-[#565e74]">
          Based on your activity, upgrading to the Annual Pro plan would
          save you $69.60 per year while providing unlimited reports.
        </p>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-emerald-700 transition hover:opacity-70"
        >
          View Annual Plans
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100/70 blur-3xl" />
    </div>
  );
}