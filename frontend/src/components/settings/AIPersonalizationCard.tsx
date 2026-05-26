import { Brain } from "lucide-react";

export default function AIPersonalizationCard() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-[0_0_15px_rgba(0,106,97,0.05)]">
      <div className="mb-4 flex items-center gap-2.5 text-emerald-700">
        <Brain size={18} />
        <h2 className="text-lg font-bold">AI Personalization</h2>
      </div>

      <p className="mb-5 text-[13px] leading-6 text-[#565e74]">
        Aura learns from your behavior to provide better financial insights.
        Manage what the brain remembers.
      </p>

      <button className="w-full rounded-xl border border-emerald-700 py-2.5 text-[13px] font-bold text-emerald-700 transition hover:bg-emerald-50">
        Configure Memory
      </button>
    </div>
  );
}