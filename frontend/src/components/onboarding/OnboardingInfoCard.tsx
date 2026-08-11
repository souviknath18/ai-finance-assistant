import {
  BellRing,
  Brain,
  Sparkles,
  Target,
} from "lucide-react";

export default function OnboardingInfoCard() {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-[#fbfcff] p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <Brain size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            AI Personalization
          </p>

          <h3 className="mt-1 text-[14px] font-bold tracking-tight text-black">
            Help Aura understand you
          </h3>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-[#565e74]">
        Aura uses these preferences to make your financial workspace more
        relevant from the first day.
      </p>

      {/* Personalization points */}
      <div className="mt-4 space-y-3">
        <InfoItem
          icon={<BellRing size={13} />}
          title="Smarter Alerts"
          description="Get spending and budget warnings based on your own limits."
        />

        <InfoItem
          icon={<Target size={13} />}
          title="Better Goals"
          description="Align savings recommendations with the priorities you choose."
        />

        <InfoItem
          icon={<Sparkles size={13} />}
          title="Personalized Insights"
          description="Generate more useful AI observations from your financial activity."
        />
      </div>

      {/* Footer note */}
      <div className="mt-4 border-t border-emerald-100 pt-3">
        <p className="text-[9px] font-medium leading-4 text-[#7c839b]">
          These preferences can be updated later as your financial situation
          changes.
        </p>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold text-black">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] leading-4 text-[#7c839b]">
          {description}
        </p>
      </div>
    </div>
  );
}