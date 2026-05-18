import { Sparkles } from "lucide-react";

export default function OnboardingInfoCard() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-4">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <Sparkles size={20} />
        </div>

        <div>
          <h4 className="text-sm font-bold text-emerald-700">
            AI Personalization
          </h4>

          <p className="mt-1 text-sm leading-6 text-[#565e74]">
            The Aura engine uses this data to personalize budget alerts,
            spending insights, and future financial recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}