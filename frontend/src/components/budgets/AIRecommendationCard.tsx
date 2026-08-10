import {
  Lightbulb,
  Sparkles,
} from "lucide-react";

type AIRecommendationCardProps = {
  title: string;
  description: string;
};

export default function AIRecommendationCard({
  title,
  description,
}: AIRecommendationCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-50/70 blur-2xl" />

      <div className="relative flex items-start gap-4 p-5 sm:p-6">
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <Lightbulb size={19} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Label */}
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles
              size={12}
              className="text-emerald-700"
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Aura Recommendation
            </p>
          </div>

          {/* Title */}
          <h2 className="text-[16px] font-bold leading-6 tracking-tight text-black sm:text-[17px]">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-1.5 max-w-4xl text-[13px] leading-6 text-[#565e74]">
            {description}
          </p>
        </div>

        {/* AI badge */}
        <div className="hidden shrink-0 sm:block">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Aura AI
          </span>
        </div>
      </div>
    </section>
  );
}