import {
  ArrowRight,
  LucideIcon,
} from "lucide-react";

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
  billingCycle:
    | "monthly"
    | "yearly";
};

export default function PlanCard({
  plan,
  billingCycle,
}: PlanCardProps) {
  const price =
    billingCycle === "yearly"
      ? plan.yearlyPrice
      : plan.monthlyPrice;

  const BadgeIcon =
    plan.badgeIcon;

  const formattedPrice =
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] ${
        plan.recommended
          ? "border-emerald-200 shadow-[0_10px_32px_rgba(16,185,129,0.10)]"
          : "border-[#e6edf9]"
      }`}
    >
      {plan.recommended && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-50 blur-3xl" />
      )}

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
                plan.recommended
                  ? "border-black bg-black text-white"
                  : "border-[#e6edf9] bg-[#fbfcff] text-[#565e74]"
              }`}
            >
              {BadgeIcon && (
                <BadgeIcon size={12} />
              )}

              {plan.badge}
            </span>

            <h2 className="mt-3 text-[20px] font-bold tracking-tight text-black">
              {plan.title}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-[28px] font-bold tracking-tight text-black">
              {formattedPrice}
            </p>

            <p className="text-[11px] text-[#7c839b]">
              /mo
            </p>
          </div>
        </div>

        <p className="mb-5 text-[12px] leading-5 text-[#565e74]">
          {plan.description}
        </p>

        <div className="mb-6 flex-1 space-y-3">
          {plan.features.map(
            (feature) => {
              const Icon =
                feature.icon;

              return (
                <div
                  key={
                    feature.label
                  }
                  className="flex items-center gap-2.5"
                >
                  <Icon
                    size={16}
                    className="shrink-0 text-emerald-700"
                  />

                  <span
                    className={`text-[12px] ${
                      feature.highlight
                        ? "font-bold text-black"
                        : "font-medium text-[#45464d]"
                    }`}
                  >
                    {
                      feature.label
                    }
                  </span>
                </div>
              );
            }
          )}

          {plan.missingFeatures.map(
            (feature) => {
              const Icon =
                feature.icon;

              return (
                <div
                  key={
                    feature.label
                  }
                  className="flex items-center gap-2.5 opacity-40"
                >
                  <Icon
                    size={16}
                    className="shrink-0"
                  />

                  <span className="text-[12px] font-medium line-through">
                    {
                      feature.label
                    }
                  </span>
                </div>
              );
            }
          )}
        </div>

        {plan.disabled ? (
          <button
            type="button"
            disabled
            className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-[#fbfcff] px-4 text-[12px] font-bold text-[#7c839b]"
          >
            {plan.buttonText}
          </button>
        ) : (
          <Link
            href="/billing/upgrade/checkout"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
          >
            {plan.buttonText}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}








