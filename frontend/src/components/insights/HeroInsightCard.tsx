import { Sparkles, Star } from "lucide-react";

type HeroInsightCardProps = {
  headline: string;
  description: string;
};

export default function HeroInsightCard({
  headline,
  description,
}: HeroInsightCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e5eeff] bg-white p-6 shadow-sm md:col-span-8">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#eff4ff]" />

      <div className="pointer-events-none absolute bottom-5 right-6 text-[#dce9ff]">
        <Sparkles size={74} strokeWidth={1.2} />
      </div>

      <div className="relative z-10">
        {/* Label */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Star size={15} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            AI Executive Summary
          </span>
        </div>

        {/* Headline */}
        <h2 className="max-w-2xl text-[22px] font-bold leading-[1.35] tracking-tight text-black md:text-2xl">
          {headline}
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#565e74]">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-xl bg-black px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
          >
            Ask Aura About This
          </button>

          <button
            type="button"
            className="rounded-xl border border-[#e5eeff] bg-white px-5 py-2.5 text-[13px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}