import { Brain } from "lucide-react";

export default function AuraAIAlertCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black p-5 text-white shadow-sm">
      <div className="relative z-10">
        <h2 className="mb-1.5 text-lg font-bold text-[#dae2fd]">
          Aura AI
        </h2>

        <p className="mb-5 text-[13px] leading-5 text-[#bec6e0]">
          I detected a 15% increase in your entertainment spending this month.
          Want to adjust your budget?
        </p>

        <button className="rounded-full bg-emerald-200 px-4 py-2 text-[11px] font-bold text-emerald-950">
          Review Now
        </button>
      </div>

      <Brain
        size={96}
        className="absolute -bottom-5 -right-5 text-white/10"
      />
    </div>
  );
}