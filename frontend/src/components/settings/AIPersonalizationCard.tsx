import { Brain } from "lucide-react";

export default function AIPersonalizationCard() {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
        <Brain size={17} />
      </div>

      <h2 className="text-[15px] font-bold text-black">
        AI Personalization
      </h2>

      <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
        Aura learns from your behavior to provide better financial insights.
        Manage what the brain remembers.
      </p>

      <button className="mt-5 w-full rounded-xl border border-emerald-200 bg-white py-2.5 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-50">
        Configure Memory
      </button>
    </div>
  );
}