import { Lock, Shield, ShieldCheck } from "lucide-react";

export default function SecuritySection() {
  return (
    <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#89f5e7]/20 text-[#006a61]">
          <ShieldCheck size={34} />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-black">
          Your Data, Fortified.
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[#565e74]">
          We utilize bank-level encryption and multi-factor authentication. Aura
          Finance never sells your personal data; your financial privacy is our
          singular priority.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[#565e74]">
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
    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
      {icon}
      {label}
    </div>
  );
}