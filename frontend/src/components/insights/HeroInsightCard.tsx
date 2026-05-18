import { Sparkles, Star } from "lucide-react";

export default function HeroInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm md:col-span-8">
      <Sparkles
        size={130}
        className="absolute right-8 top-8 text-emerald-100"
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-emerald-700">
          <Star size={18} />

          <span className="text-xs font-bold uppercase tracking-wider">
            AI Executive Summary
          </span>
        </div>

        <h2 className="mb-5 max-w-2xl text-3xl font-bold leading-tight text-black">
          Your wealth is projected to grow by 12% this quarter.
        </h2>

        <p className="max-w-2xl text-sm leading-7 text-[#565e74]">
          Aura analyzed 242 transactions this month. We found 3 major saving
          opportunities in recurring subscriptions and a slight overspend in
          your Dining category compared to your 6-month average.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
            View Growth Strategy
          </button>

          <button className="rounded-xl px-6 py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff]">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}