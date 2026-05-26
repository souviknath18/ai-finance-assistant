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
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm md:col-span-8">
      <Sparkles size={100} className="absolute right-6 top-6 text-emerald-100" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 text-emerald-700">
          <Star size={16} />

          <span className="text-[11px] font-bold uppercase tracking-wider">
            AI Executive Summary
          </span>
        </div>

        <h2 className="mb-4 max-w-2xl text-2xl font-bold leading-tight text-black">
          {headline}
        </h2>

        <p className="max-w-2xl text-[13px] leading-6 text-[#565e74]">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-xl bg-black px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
            View Growth Strategy
          </button>

          <button className="rounded-xl px-5 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}