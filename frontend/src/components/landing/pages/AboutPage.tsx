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
    icon: (
      <BrainCircuit size={17} />
    ),
    title: "Intelligent Automation",
    description:
      "Aura reduces repetitive financial work by converting documents into organized and searchable records.",
  },
  {
    icon: (
      <FileSearch size={17} />
    ),
    title: "Financial Clarity",
    description:
      "Understand transactions more easily through structured data, semantic search, and clear financial summaries.",
  },
  {
    icon: (
      <ShieldCheck size={17} />
    ),
    title: "Privacy First",
    description:
      "Financial information is handled through authenticated workflows and user-specific data access.",
  },
  {
    icon: (
      <BarChart3 size={17} />
    ),
    title: "Actionable Insights",
    description:
      "Aura helps surface spending patterns and useful financial observations from your activity.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8faff] text-[#0b1c30]">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 lg:px-8 lg:pt-32">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
            <Sparkles size={18} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            About Aura
          </p>

          <h1 className="mt-2 text-[26px] font-bold tracking-tight text-black sm:text-[32px] lg:text-[36px]">
            Making personal finance easier to understand
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-[12px] leading-5 text-[#565e74] sm:text-[13px] sm:leading-6">
            Aura Finance is an AI-powered personal finance workspace that
            transforms financial documents into organized transactions,
            intelligent search, and useful financial insights.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="border-y border-[#edf2fb] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Mission */}
          <article className="rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <FileSearch size={17} />
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
              Our Mission
            </p>

            <h2 className="mt-1.5 text-[20px] font-bold tracking-tight text-black sm:text-[23px]">
              Turn financial complexity into clarity
            </h2>

            <p className="mt-4 text-[12px] leading-6 text-[#565e74]">
              Managing personal finances often means reviewing statements,
              categorizing transactions, tracking recurring expenses, and
              comparing activity across different sources.
            </p>

            <p className="mt-3 text-[12px] leading-6 text-[#565e74]">
              Aura brings those tasks into one workspace where users can
              import financial documents, organize transactions, search
              their financial history, and understand spending behavior.
            </p>
          </article>

          {/* Vision */}
          <article className="relative overflow-hidden rounded-3xl bg-black p-5 text-white shadow-[0_14px_36px_rgba(15,23,42,0.16)] sm:p-6">
            <div className="relative z-10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-emerald-300">
                <BrainCircuit size={17} />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                Our Vision
              </p>

              <h2 className="mt-1.5 text-[20px] font-bold tracking-tight sm:text-[23px]">
                A smarter assistant for everyday financial decisions
              </h2>

              <p className="mt-4 text-[12px] leading-6 text-[#b7c0d4]">
                Our vision is to make financial information easier to use
                without requiring users to understand complicated
                spreadsheets or traditional finance tools.
              </p>

              <p className="mt-3 text-[12px] leading-6 text-[#b7c0d4]">
                Aura aims to help users organize financial activity,
                recognize meaningful patterns, and make more informed
                decisions with AI-assisted analysis.
              </p>
            </div>

            <BrainCircuit
              size={150}
              className="pointer-events-none absolute -bottom-10 -right-10 opacity-[0.04]"
            />
          </article>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              What We Value
            </p>

            <h2 className="mt-2 text-[24px] font-bold tracking-tight text-black sm:text-[29px]">
              Built around simplicity, intelligence, and trust
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-[12px] leading-6 text-[#565e74]">
              Every Aura feature is designed to make financial information
              clearer, more useful, and easier to act on.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(
              (value) => (
                <article
                  key={value.title}
                  className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-emerald-100 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                    {value.icon}
                  </div>

                  <h3 className="mt-4 text-[14px] font-bold text-black">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#565e74]">
                    {value.description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* Product Philosophy */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 via-white to-[#fbfcff] p-5 shadow-[0_6px_22px_rgba(15,23,42,0.04)] sm:p-6 lg:p-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                Product Philosophy
              </p>

              <h2 className="mt-2 max-w-2xl text-[20px] font-bold tracking-tight text-black sm:text-[23px]">
                Financial tools should reduce complexity, not create more of it.
              </h2>

              <p className="mt-3 max-w-2xl text-[12px] leading-6 text-[#565e74]">
                Aura is built to turn raw financial activity into a structured
                workspace that helps users understand what happened, why it
                matters, and what they may want to review next.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 lg:w-[290px]">
              <PhilosophyMetric
                value="AI"
                label="Assisted"
              />

              <PhilosophyMetric
                value="User"
                label="Controlled"
              />

              <PhilosophyMetric
                value="Clear"
                label="Insights"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] bg-black px-5 py-10 text-center text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:px-8 sm:py-12">
          <div className="relative z-10">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Sparkles size={15} />
            </div>

            <h2 className="mx-auto mt-4 max-w-2xl text-[22px] font-bold tracking-tight sm:text-[27px]">
              Experience a smarter way to understand your finances
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-[12px] leading-6 text-[#b7c0d4]">
              Create your Aura account and start turning financial documents
              into organized, searchable, and useful financial information.
            </p>

            <Link
              href="/auth/signup"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-[12px] font-bold text-black transition hover:bg-emerald-50 sm:w-auto"
            >
              Get Started for Free
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}

function PhilosophyMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6edf9] bg-white p-3 text-center">
      <p className="text-[12px] font-bold text-black">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-medium text-[#7c839b]">
        {label}
      </p>
    </div>
  );
}