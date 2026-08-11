import {
  Check,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function SecurityCard() {
  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-[#f8faff] text-black">
          <ShieldCheck size={16} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Data Protection
          </p>

          <h3 className="mt-1 text-[15px] font-bold tracking-tight text-black">
            Secure Data Infrastructure
          </h3>

          <p className="mt-1.5 text-[11px] leading-5 text-[#565e74]">
            Your financial documents are handled through secure processing
            workflows.
          </p>
        </div>
      </div>

      {/* Security details */}
      <div className="mt-4 grid grid-cols-1 gap-2">
        <SecurityItem>
          Secure document processing
        </SecurityItem>

        <SecurityItem>
          Authenticated account access
        </SecurityItem>

        <SecurityItem>
          User-scoped financial data
        </SecurityItem>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-[#edf2fb] pt-3">
        <LockKeyhole
          size={12}
          className="shrink-0 text-emerald-700"
        />

        <p className="text-[9px] font-semibold leading-4 text-[#7c839b]">
          Your financial data remains associated with your authenticated
          account.
        </p>
      </div>
    </section>
  );
}

function SecurityItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <Check
          size={11}
          strokeWidth={2.5}
        />
      </span>

      <span className="text-[10px] font-semibold text-[#565e74]">
        {children}
      </span>
    </div>
  );
}