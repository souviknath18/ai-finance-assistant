import { Brain } from "lucide-react";

export default function AIPersonalizationCard() {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-[0_0_15px_rgba(0,106,97,0.05)]">
      <div className="mb-5 flex items-center gap-3 text-emerald-700">
        <Brain size={22} />
        <h2 className="text-2xl font-bold">AI Personalization</h2>
      </div>

      <p className="mb-6 text-sm leading-7 text-[#565e74]">
        Aura learns from your behavior to provide better financial insights.
        Manage what the brain remembers.
      </p>

      <button className="w-full rounded-xl border border-emerald-700 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
        Configure Memory
      </button>
    </div>
  );
}