import { Check } from "lucide-react";

export default function SecurityCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5eeff] bg-[#d3e4fe] p-5 shadow-sm">
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-[#eff4ff] to-[#cbdbf5]">
        <div className="text-center">
          <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Check size={20} className="text-emerald-700" />
          </div>

          <p className="text-[13px] font-bold text-black">
            Secure Data Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}