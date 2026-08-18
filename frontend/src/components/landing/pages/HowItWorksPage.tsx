import Link from "next/link";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  Landmark,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";

import LandingNavbar from "../LandingNavbar";
import LandingFooter from "../LandingFooter";

const steps = [
  {
    number: "01",
    icon: <Landmark size={20} />,
    title: "Connect or import your financial data",
    description:
      "Connect a financial account or import statements, receipts, invoices, images, and CSV files.",
    details: [
      "Connected account support",
      "PDF, CSV, and image import",
      "Historical data import",
    ],
  },
  {
    number: "02",
    icon: <Database size={20} />,
    title: "Aura creates one financial workspace",
    description:
      "Financial activity from different sources is normalized into one consistent transaction history.",
    details: [
      "Unified transactions",
      "Duplicate protection",
      "Structured financial records",
    ],
  },
  {
    number: "03",
    icon: <BrainCircuit size={20} />,
    title: "Transactions are intelligently organized",
    description:
      "Aura categorizes transactions, identifies merchants, analyzes transaction types, and detects recurring activity.",
    details: [
      "Expense categorization",
      "Merchant identification",
      "Recurring payment detection",
    ],
  },
  {
    number: "04",
    icon: <Search size={20} />,
    title: "AI retrieval understands your history",
    description:
      "Transaction embeddings allow Aura to retrieve relevant financial activity using meaning and context.",
    details: [
      "OpenAI embeddings",
      "pgvector storage",
      "Semantic search",
    ],
  },
  {
    number: "05",
    icon: <BarChart3 size={20} />,
    title: "Aura continuously analyzes your finances",
    description:
      "Your dashboard, budgets, subscriptions, reports, and financial insights update as your financial activity changes.",
    details: [
      "Spending analytics",
      "Financial insights",
      "Trend detection",
    ],
  },
  {
    number: "06",
    icon: <MessageCircle size={20} />,
    title: "Ask Aura about your money",
    description:
      "Use natural language to explore transactions, understand spending changes, and discover patterns in your financial history.",
    details: [
      "Natural-language questions",
      "Context-aware answers",
      "Personalized insights",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
            <Sparkles size={22} />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            How Aura Works
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl">
            From financial activity to financial intelligence
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Aura brings financial data together, organizes transactions,
            analyzes patterns, and turns your financial history into
            searchable, personalized intelligence.
          </p>
        </div>
      </section>

      <section className="bg-[#eff4ff] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-5">
          {steps.map((step, index) => (
            <article
              key={step.number}
              className="relative rounded-3xl border border-[#dce9ff] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#006a61] text-white">
                  {step.icon}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-black sm:text-xl">
                      {step.title}
                    </h2>

                    <span className="text-3xl font-black text-[#dce9ff]">
                      {step.number}
                    </span>
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#565e74]">
                    {step.description}
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {step.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-center gap-2 rounded-xl bg-[#f8f9ff] px-3 py-2.5 text-xs font-semibold text-[#45464d]"
                      >
                        <CheckCircle2
                          size={15}
                          className="shrink-0 text-[#006a61]"
                        />

                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {index !== steps.length - 1 && (
                <div className="absolute -bottom-6 left-[43px] hidden h-7 w-px bg-[#b7d0f6] sm:block" />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#131b2e] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Spend less time organizing money and more time understanding it
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a5aec4]">
            Bring your financial activity into Aura and let intelligent
            automation handle organization, analysis, retrieval, and insights.
          </p>

          <Link
            href="/auth/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#006a61] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#005049]"
          >
            Create Your Account
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}