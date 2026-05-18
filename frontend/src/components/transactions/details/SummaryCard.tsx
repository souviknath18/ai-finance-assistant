import { CheckCircle2 } from "lucide-react";

export default function SummaryCard() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <InfoBlock label="Amount" value="-$299.00" helper="Recurring" />
        <InfoBlock label="Date" value="October 24, 2024" />

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Category
          </p>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Software
          </span>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Status
          </p>

          <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 size={18} />
            AI Verified
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <p className="text-xl font-bold text-black">{value}</p>

      {helper && (
        <p className="mt-1 text-sm font-bold text-emerald-700">
          {helper}
        </p>
      )}
    </div>
  );
}