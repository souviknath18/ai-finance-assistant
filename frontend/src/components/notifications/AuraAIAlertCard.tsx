import { Brain } from "lucide-react";

export default function AuraAIAlertCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-sm">
      <div className="relative z-10">
        <h2 className="mb-2 text-2xl font-bold text-[#dae2fd]">
          Aura AI
        </h2>

        <p className="mb-6 text-sm leading-6 text-[#bec6e0]">
          I detected a 15% increase in your entertainment spending this month.
          Want to adjust your budget?
        </p>

        <button className="rounded-full bg-emerald-200 px-5 py-2.5 text-xs font-bold text-emerald-950">
          Review Now
        </button>
      </div>

      <Brain
        size={120}
        className="absolute -bottom-6 -right-6 text-white/10"
      />
    </div>
  );
}