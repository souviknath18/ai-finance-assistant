import { Check } from "lucide-react";

export default function SecurityCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5eeff] bg-[#d3e4fe] p-6 shadow-sm">
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#cbdbf5]">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <Check size={24} className="text-emerald-700" />
          </div>

          <p className="text-sm font-bold text-black">
            Secure Data Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}