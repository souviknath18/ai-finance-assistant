import { Lock, Shield, ShieldCheck } from "lucide-react";

export default function SecuritySection() {
  return (
    <section className="px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#89f5e7]/20 text-[#006a61] sm:h-16 sm:w-16">
          <ShieldCheck size={30} />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-black">
          Your Data, Fortified.
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#565e74] sm:text-base">
          We utilize bank-level encryption and multi-factor authentication. Aura
          Finance never sells your personal data; your financial privacy is our
          singular priority.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 text-[#565e74] sm:grid-cols-3 sm:gap-6">
          <TrustBadge icon={<Shield size={18} />} label="ISO 27001" />
          <TrustBadge icon={<Lock size={18} />} label="SOC 2 Type II" />
          <TrustBadge icon={<ShieldCheck size={18} />} label="GDPR Compliant" />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#dce9ff] bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide shadow-sm sm:border-0 sm:bg-transparent sm:p-0 sm:text-sm sm:shadow-none">
      {icon}
      {label}
    </div>
  );
}