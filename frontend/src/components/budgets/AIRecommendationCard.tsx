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
    <div className="mb-8 flex items-start gap-5 rounded-3xl border border-emerald-200 bg-white p-6 shadow-[0_0_15px_rgba(107,216,203,0.18)]">
      <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
        <Lightbulb size={22} />
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          AI Recommendation
        </p>

        <h2 className="text-2xl font-bold text-black">{title}</h2>

        <p className="mt-2 text-sm leading-7 text-[#565e74]">
          {description}
        </p>
      </div>
    </div>
  );
}