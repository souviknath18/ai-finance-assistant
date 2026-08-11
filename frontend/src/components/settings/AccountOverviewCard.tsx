import {
  BadgeCheck,
  CalendarDays,
} from "lucide-react";

export default function AccountOverviewCard() {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <h2 className="mb-4 text-[15px] font-bold text-black">
        Account Overview
      </h2>

      <div className="space-y-3">
        <OverviewItem
          label="Active Plan"
          value="Premium AI Plus"
          icon={<BadgeCheck size={15} />}
          highlighted
        />

        <OverviewItem
          label="Next Billing"
          value="Dec 14, 2024"
          icon={<CalendarDays size={15} />}
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
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
          {label}
        </p>

        <p
          className={`mt-1 text-[13px] font-bold ${
            highlighted
              ? "text-emerald-700"
              : "text-black"
          }`}
        >
          {value}
        </p>
      </div>

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          highlighted
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : "border-[#e6edf9] bg-white text-[#565e74]"
        }`}
      >
        {icon}
      </div>
    </div>
  );
}