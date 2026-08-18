import Link from "next/link";

import {
  ArrowRight,
  Check,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";

import LandingNavbar from "../LandingNavbar";
import LandingFooter from "../LandingFooter";

const plans = [
  {
    name: "Free",
    description:
      "Explore Aura and start understanding your personal finances.",
    price: "₹0",
    period: "/month",
    icon: <Sparkles size={17} />,
    highlighted: false,
    buttonText: "Get Started",
    features: [
      "Demo financial account connection",
      "Basic transaction dashboard",
      "Automatic expense categorization",
      "Basic spending analytics",
      "Basic semantic search",
      "5 financial document imports per month",
    ],
  },
  {
    name: "Pro",
    description:
      "For users who want deeper AI-powered financial intelligence.",
    price: "₹499",
    period: "/month",
    icon: <Zap size={17} />,
    highlighted: true,
    buttonText: "Start Pro",
    features: [
      "Everything included in Free",
      "AI financial chat assistant",
      "Full semantic transaction search",
      "Subscription detection",
      "Personalized financial insights",
      "Budgets and financial goals",
      "Monthly financial reports",
      "50 document imports per month",
    ],
  },
  {
    name: "Premium",
    description:
      "For advanced financial tracking, automation, and analysis.",
    price: "₹999",
    period: "/month",
    icon: <Crown size={17} />,
    highlighted: false,
    buttonText: "Choose Premium",
    features: [
      "Everything included in Pro",
      "Advanced spending analytics",
      "Budget forecasting",
      "Financial goal recommendations",
      "Advanced financial reports",
      "Unlimited document imports",
      "Early access to new AI features",
      "Priority support",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 top-12 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <Sparkles size={18} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            Simple Pricing
          </p>

          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-black sm:text-[32px] lg:text-[36px]">
            Choose the plan that fits your financial journey
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[12px] leading-5 text-[#565e74] sm:text-[13px] sm:leading-6">
            Start free and upgrade when you want deeper AI insights,
            advanced analytics, and more financial automation.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col rounded-3xl border p-5 transition-[border-color,box-shadow] duration-200 sm:p-6 ${
                plan.highlighted
                  ? "border-emerald-300 bg-black text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
                  : "border-[#e6edf9] bg-white text-black shadow-[0_6px_22px_rgba(15,23,42,0.05)] hover:border-emerald-100 hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-800 shadow-sm">
                  Most Popular
                </span>
              )}

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  plan.highlighted
                    ? "border-white/10 bg-white/10 text-emerald-300"
                    : "border-emerald-100 bg-emerald-50 text-emerald-700"
                }`}
              >
                {plan.icon}
              </div>

              <div className="mt-4">
                <h2 className="text-[18px] font-bold">
                  {plan.name}
                </h2>

                <p
                  className={`mt-2 min-h-[52px] text-[12px] leading-5 ${
                    plan.highlighted
                      ? "text-[#b7c0d4]"
                      : "text-[#565e74]"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mt-5 flex items-end gap-1.5">
                <span className="text-[32px] font-bold tracking-tight">
                  {plan.price}
                </span>

                <span
                  className={`pb-1 text-[11px] ${
                    plan.highlighted
                      ? "text-[#9fa9bc]"
                      : "text-[#7c839b]"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <Link
                href="/auth/signup"
                className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-[12px] font-bold transition ${
                  plan.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-black text-white hover:opacity-90"
                }`}
              >
                {plan.buttonText}

                <ArrowRight size={13} />
              </Link>

              <div
                className={`my-5 h-px ${
                  plan.highlighted
                    ? "bg-white/10"
                    : "bg-[#edf2fb]"
                }`}
              />

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-[11px] leading-5 ${
                      plan.highlighted
                        ? "text-[#d8deeb]"
                        : "text-[#45464d]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        plan.highlighted
                          ? "border-emerald-500/20 bg-emerald-500/15 text-emerald-300"
                          : "border-emerald-100 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <Check size={11} />
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-2xl text-center text-[10px] leading-5 text-[#8a92a5]">
          Pricing is currently shown as a product preview. Payment integration,
          real bank connectivity, and subscription controls are not yet
          available.
        </p>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] bg-black px-5 py-10 text-center text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:px-8 sm:py-12">
          <div className="relative z-10">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Sparkles size={15} />
            </div>

            <h2 className="mx-auto mt-4 max-w-2xl text-[22px] font-bold tracking-tight sm:text-[27px]">
              Start understanding your finances more intelligently
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-[12px] leading-6 text-[#b7c0d4]">
              Create your free account and explore Aura&apos;s transaction,
              analytics, search, and financial intelligence tools.
            </p>

            <Link
              href="/auth/signup"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-[12px] font-bold text-black transition hover:bg-emerald-50 sm:w-auto"
            >
              Get Started for Free

              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}