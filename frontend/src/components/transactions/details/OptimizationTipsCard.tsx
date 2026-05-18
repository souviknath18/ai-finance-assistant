import { BellRing, Lightbulb } from "lucide-react";

export default function OptimizationTipsCard() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-[#565e74]">
        Optimization Tips
      </h4>

      <div className="space-y-5">
        <Tip
          icon={<Lightbulb size={20} />}
          text="Consolidate this subscription with ScaleSync to save $45/mo."
        />

        <Tip
          icon={<BellRing size={20} />}
          text="Set an alert for when this merchant charges more than $350."
        />
      </div>
    </div>
  );
}

function Tip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3 text-sm leading-6 text-black">
      <span className="text-emerald-700">{icon}</span>
      <p>{text}</p>
    </div>
  );
}