import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

type PlanFeature = {
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
};

type Plan = {
  title: string;
  badge: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  buttonText: string;
  disabled: boolean;
  recommended: boolean;
  badgeIcon?: LucideIcon;
  features: PlanFeature[];
  missingFeatures: PlanFeature[];
};

type PlanCardProps = {
  plan: Plan;
  billingCycle: "monthly" | "yearly";
};

export default function PlanCard({ plan, billingCycle }: PlanCardProps) {
  const price =
    billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  const BadgeIcon = plan.badgeIcon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition ${
        plan.recommended
          ? "border-emerald-300 shadow-[0_16px_50px_rgba(16,185,129,0.12)]"
          : "border-[#dce9ff]"
      }`}
    >
      {plan.recommended && (
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />
      )}

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                plan.recommended
                  ? "bg-black text-white"
                  : "bg-[#eff4ff] text-[#565e74]"
              }`}
            >
              {BadgeIcon && <BadgeIcon size={13} />}
              {plan.badge}
            </span>

            <h2 className="mt-4 text-2xl font-bold text-black">
              {plan.title}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-black">${price}</p>
            <p className="text-[12px] text-[#565e74]">/mo</p>
          </div>
        </div>

        <p className="mb-6 text-[13px] leading-6 text-[#565e74]">
          {plan.description}
        </p>

        <div className="mb-8 flex-1 space-y-3">
          {plan.features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.label} className="flex items-center gap-2.5">
                <Icon size={17} className="text-emerald-700" />

                <span
                  className={`text-[13px] ${
                    feature.highlight
                      ? "font-bold text-black"
                      : "font-medium text-black"
                  }`}
                >
                  {feature.label}
                </span>
              </div>
            );
          })}

          {plan.missingFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.label}
                className="flex items-center gap-2.5 opacity-45"
              >
                <Icon size={17} />

                <span className="text-[13px] font-medium line-through">
                  {feature.label}
                </span>
              </div>
            );
          })}
        </div>

        {plan.disabled ? (
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#c6c6cd] px-4 py-3 text-[13px] font-bold text-[#565e74]"
          >
            {plan.buttonText}
          </button>
        ) : (
          <Link
            href="/billing/upgrade/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.99]"
          >
            {plan.buttonText}
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}