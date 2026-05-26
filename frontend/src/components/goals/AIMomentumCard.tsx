import { Sparkles } from "lucide-react";

export default function AIMomentumCard() {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
          <Sparkles size={22} />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-black">
            AI Momentum Insight
          </h2>

          <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
            Based on your current spending, you can reach your Emergency Fund
            goal 14 days earlier by rounding up your daily transactions this
            month.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-700 px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
          Apply Strategy
        </button>
      </div>
    </section>
  );
}