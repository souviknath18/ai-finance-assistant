import {
  Database,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function SecuritySection() {
  return (
    <section
      id="security"
      className="border-y border-[#edf2fb] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              Privacy First
            </p>

            <h2 className="mt-2 max-w-xl text-[28px] font-bold tracking-tight text-black sm:text-[34px]">
              Your financial data deserves serious protection.
            </h2>

            <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#565e74]">
              Aura is designed around authenticated access, secure data
              handling, and user-controlled financial information.
            </p>

            <p className="mt-3 max-w-xl text-[11px] leading-5 text-[#8a92a5]">
              Only publish formal compliance claims such as SOC 2, ISO 27001,
              or GDPR certifications after they have actually been obtained.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <SecurityItem
              icon={<Lock size={16} />}
              title="Authenticated Access"
              description="Protected user sessions and authenticated API access."
            />

            <SecurityItem
              icon={<Database size={16} />}
              title="Private Financial Data"
              description="Financial records remain associated with the authenticated user."
            />

            <SecurityItem
              icon={<ShieldCheck size={16} />}
              title="Secure Processing"
              description="Uploaded data is handled through controlled application workflows."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#e6edf9] bg-[#fbfcff] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <div>
        <p className="text-[12px] font-bold text-black">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
          {description}
        </p>
      </div>
    </div>
  );
}