import { Bolt } from "lucide-react";

export default function AIPulseCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-sm">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-emerald-300">
          <Bolt size={18} />

          <span className="text-xs font-bold uppercase tracking-widest">
            AI Pulse
          </span>
        </div>

        <h3 className="mb-2 text-2xl font-bold">Spending Trend</h3>

        <p className="mb-6 text-sm leading-6 text-[#bec6e0]">
          Your Software spending is up{" "}
          <span className="font-bold text-emerald-300">12%</span> compared to
          last month.
        </p>

        <div className="flex h-24 items-end gap-2 rounded-2xl bg-white/10 p-3">
          {["50%", "65%", "35%", "80%"].map((height, index) => (
            <div
              key={`${height}-${index}`}
              className={`w-full rounded-sm ${
                index === 3 ? "bg-emerald-500" : "bg-white/20"
              }`}
              style={{ height }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}