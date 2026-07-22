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
    description: "Explore Aura and organize your personal finances.",
    price: "₹0",
    period: "/month",
    icon: <Sparkles size={20} />,
    highlighted: false,
    buttonText: "Get Started",
    features: [
      "5 financial file uploads per month",
      "Basic transaction extraction",
      "Automatic expense categorization",
      "Transaction dashboard",
      "Basic semantic search",
      "Upload history",
    ],
  },
  {
    name: "Pro",
    description: "For users who want complete AI-powered financial clarity.",
    price: "₹499",
    period: "/month",
    icon: <Crown size={20} />,
    highlighted: true,
    buttonText: "Start Pro",
    features: [
      "50 financial file uploads per month",
      "Advanced AI extraction",
      "AI financial chat assistant",
      "Full semantic transaction search",
      "Subscription detection",
      "Personalized financial insights",
      "Monthly financial reports",
      "Priority processing",
    ],
  },
  {
    name: "Premium",
    description: "For advanced personal finance tracking and automation.",
    price: "₹999",
    period: "/month",
    icon: <Zap size={20} />,
    highlighted: false,
    buttonText: "Choose Premium",
    features: [
      "Unlimited financial file uploads",
      "Everything included in Pro",
      "Budget forecasting",
      "Advanced spending analytics",
      "Financial goal recommendations",
      "Exportable financial reports",
      "Early access to new AI features",
      "Priority support",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      {/* Hero */}

      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
            <Sparkles size={22} />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            Simple Pricing
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Choose the right plan for your finances
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Start free and upgrade when you need more uploads, deeper AI
            insights and complete financial automation.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}

      <section className="bg-[#eff4ff] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                plan.highlighted
                  ? "border-2 border-[#006a61] bg-[#131b2e] text-white"
                  : "border border-[#dce9ff] bg-white text-black"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#89f5e7] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#004d46]">
                  Most Popular
                </span>
              )}

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  plan.highlighted
                    ? "bg-white/10 text-[#89f5e7]"
                    : "bg-[#89f5e7]/20 text-[#006a61]"
                }`}
              >
                {plan.icon}
              </div>

              <h2 className="mt-4 text-xl font-bold">{plan.name}</h2>

              <p
                className={`mt-2 min-h-12 text-sm leading-6 ${
                  plan.highlighted ? "text-[#a5aec4]" : "text-[#565e74]"
                }`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-3xl font-black">{plan.price}</span>

                <span
                  className={`pb-1 text-xs ${
                    plan.highlighted ? "text-[#a5aec4]" : "text-[#565e74]"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <Link
                href="/auth/signup"
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  plan.highlighted
                    ? "bg-[#006a61] text-white hover:bg-[#005049]"
                    : "bg-black text-white hover:opacity-90"
                }`}
              >
                {plan.buttonText}
                <ArrowRight size={15} />
              </Link>

              <div
                className={`my-6 h-px ${
                  plan.highlighted ? "bg-white/10" : "bg-[#dce9ff]"
                }`}
              />

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-sm leading-6 ${
                      plan.highlighted ? "text-[#d7def0]" : "text-[#45464d]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.highlighted
                          ? "bg-[#006a61] text-white"
                          : "bg-[#89f5e7]/25 text-[#006a61]"
                      }`}
                    >
                      <Check size={12} />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-2xl text-center text-[11px] leading-5 text-[#72798d]">
          Pricing is currently shown as a preview until payment integration and
          subscription controls are implemented.
        </p>
      </section>

      {/* Bottom CTA */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-black sm:text-3xl">
            Start managing your finances intelligently
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#565e74]">
            Create your free account and experience AI-powered transaction
            organization without entering payment information.
          </p>

          <Link
            href="/auth/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Get Started for Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}