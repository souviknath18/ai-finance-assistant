import {
  Sparkles,
} from "lucide-react";

export default function OnboardingHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
        <Sparkles
          size={12}
          className="text-emerald-700"
        />

        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          Aura Personalization
        </span>
      </div>

      <h1 className="text-[24px] font-bold tracking-tight text-black sm:text-[28px] lg:text-[30px]">
        Personalize Your Financial Workspace
      </h1>

      <p className="mx-auto mt-2 max-w-[620px] text-[12px] leading-5 text-[#565e74] sm:text-[13px] sm:leading-6">
        Tell Aura a little about your income, savings goals, spending limits,
        and financial priorities so your dashboard can generate more relevant
        insights and recommendations from the start.
      </p>

      <p className="mt-2 text-[10px] font-medium text-[#8a92a5]">
        You can update these preferences anytime from Settings or Budgets.
      </p>
    </div>
  );
}