import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  FileSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const values = [
  {
    icon: <BrainCircuit size={20} />,
    title: "Intelligent Automation",
    description:
      "Aura reduces repetitive financial work by converting documents into organized and searchable records.",
  },
  {
    icon: <FileSearch size={20} />,
    title: "Financial Clarity",
    description:
      "We make transaction data easier to understand through simple dashboards, search and insights.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Privacy First",
    description:
      "Financial information is handled through protected APIs and user-specific data isolation.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Actionable Insights",
    description:
      "Aura helps users understand spending patterns and make better financial decisions.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
            <Sparkles size={22} />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            About Aura
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Making personal finance easier to understand
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Aura Finance is an AI-powered personal finance workspace designed
            to transform financial documents into organized transactions,
            intelligent search and useful insights.
          </p>
        </div>
      </section>

      <section className="bg-[#eff4ff] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#006a61]">
              Our Mission
            </p>

            <h2 className="mt-3 text-2xl font-bold text-black sm:text-3xl">
              Turn financial complexity into clarity
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#565e74]">
              Managing personal finances often requires users to manually
              review statements, categorize transactions and track recurring
              payments across multiple platforms.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#565e74]">
              Aura brings these tasks into one intelligent workspace. Users can
              upload financial files, automatically extract transactions,
              search their financial history and understand their spending
              behavior.
            </p>
          </article>

          <article className="rounded-3xl border border-[#dce9ff] bg-[#131b2e] p-6 text-white shadow-sm sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#89f5e7]">
              Our Vision
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              A smarter financial assistant for everyday decisions
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#a5aec4]">
              Our vision is to make financial data more accessible and useful
              without requiring users to understand complicated spreadsheets
              or financial systems.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#a5aec4]">
              Aura aims to become a trusted AI assistant that helps users
              organize their finances, identify patterns and make more informed
              decisions.
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#006a61]">
              What We Value
            </p>

            <h2 className="mt-3 text-2xl font-bold text-black sm:text-3xl">
              Built around simplicity, intelligence and trust
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-3xl border border-[#dce9ff] bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
                  {value.icon}
                </div>

                <h3 className="mt-4 text-lg font-bold text-black">
                  {value.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#565e74]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#131b2e] px-6 py-10 text-center sm:px-10 sm:py-14">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Experience a smarter way to manage your finances
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a5aec4]">
            Create your account and start organizing your financial documents
            with Aura.
          </p>

          <Link
            href="/auth/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#006a61] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#005049]"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}