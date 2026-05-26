import { Lightbulb } from "lucide-react";

type AIRecommendationCardProps = {
  title: string;
  description: string;
};

export default function AIRecommendationCard({
  title,
  description,
}: AIRecommendationCardProps) {
  return (
    <div className="mb-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-[0_0_15px_rgba(107,216,203,0.18)]">
      <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
        <Lightbulb size={18} />
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          AI Recommendation
        </p>

        <h2 className="text-lg font-bold text-black">{title}</h2>

        <p className="mt-1.5 text-[13px] leading-5 text-[#565e74]">
          {description}
        </p>
      </div>
    </div>
  );
}