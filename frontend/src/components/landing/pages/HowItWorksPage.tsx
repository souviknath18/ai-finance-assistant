import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  CloudUpload,
  Database,
  FileSearch,
  Search,
  Sparkles,
} from "lucide-react";

import LandingNavbar from "../LandingNavbar";
import LandingFooter from "../LandingFooter";

const steps = [
  {
    number: "01",
    icon: <CloudUpload size={20} />,
    title: "Upload your financial files",
    description:
      "Upload a bank statement, CSV export, receipt, invoice or financial screenshot from your device.",
    details: [
      "PDF, CSV and image support",
      "Secure cloud storage",
      "Real-time upload progress",
    ],
  },
  {
    number: "02",
    icon: <FileSearch size={20} />,
    title: "Aura detects and processes the document",
    description:
      "The system identifies the document type and selects the most appropriate parsing method.",
    details: [
      "Document type detection",
      "Rule-based parsing",
      "AI fallback processing",
    ],
  },
  {
    number: "03",
    icon: <BrainCircuit size={20} />,
    title: "AI extracts and categorizes transactions",
    description:
      "Dates, merchants, amounts and transaction types are converted into structured financial records.",
    details: [
      "Merchant identification",
      "Expense categorization",
      "Transaction validation",
    ],
  },
  {
    number: "04",
    icon: <Database size={20} />,
    title: "Embeddings power intelligent retrieval",
    description:
      "Aura generates vector embeddings that allow transactions to be discovered by meaning and context.",
    details: [
      "OpenAI embeddings",
      "pgvector storage",
      "Semantic similarity search",
    ],
  },
  {
    number: "05",
    icon: <BarChart3 size={20} />,
    title: "Your dashboard updates automatically",
    description:
      "Processed transactions, categories and insights become available through your personal dashboard.",
    details: [
      "Spending analytics",
      "Processing status",
      "Financial insights",
    ],
  },
  {
    number: "06",
    icon: <Search size={20} />,
    title: "Search and understand your finances",
    description:
      "Ask natural-language questions and discover spending patterns, subscriptions and important transactions.",
    details: [
      "Natural-language search",
      "Recurring-payment detection",
      "AI-powered recommendations",
    ],
  },
];

export default function HowItWorksPage() {
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
            How Aura Works
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            From financial documents to intelligent insights
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Aura transforms unstructured financial files into searchable
            transactions, spending insights and personalized recommendations.
          </p>
        </div>
      </section>

      {/* Steps */}

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

      {/* CTA */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#131b2e] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Let Aura do the repetitive financial work
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a5aec4]">
            Spend less time organizing statements and more time understanding
            your financial decisions.
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