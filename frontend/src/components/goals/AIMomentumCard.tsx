import { Sparkles } from "lucide-react";

export default function AIMomentumCard() {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
        <div className="rounded-full bg-emerald-50 p-4 text-emerald-700">
          <Sparkles size={30} />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">
            AI Momentum Insight
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#565e74]">
            Based on your current spending, you can reach your Emergency Fund
            goal 14 days earlier by rounding up your daily transactions this
            month.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
          Apply Strategy
        </button>
      </div>
    </section>
  );
}