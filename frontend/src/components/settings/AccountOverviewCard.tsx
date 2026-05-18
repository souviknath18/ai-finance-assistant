import { CalendarDays, BadgeCheck } from "lucide-react";

export default function AccountOverviewCard() {
  return (
    <div className="rounded-3xl border border-[#dce9ff] bg-[#eff4ff] p-6 shadow-sm">
      <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-[#565e74]">
        Account Overview
      </h2>

      <div className="space-y-4">
        <OverviewItem
          label="Active Plan"
          value="Premium AI Plus"
          icon={<BadgeCheck size={18} />}
          highlighted
        />

        <OverviewItem
          label="Next Billing"
          value="Dec 14, 2024"
          icon={<CalendarDays size={18} />}
        />
      </div>
    </div>
  );
}

function OverviewItem({
  label,
  value,
  icon,
  highlighted = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
          {label}
        </p>
        <p className="mt-1 text-sm font-bold text-black">{value}</p>
      </div>

      <div
        className={`rounded-full p-2 ${
          highlighted
            ? "bg-emerald-100 text-emerald-700"
            : "bg-[#e5eeff] text-[#565e74]"
        }`}
      >
        {icon}
      </div>
    </div>
  );
}