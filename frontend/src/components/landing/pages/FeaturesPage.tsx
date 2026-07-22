import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CalendarCheck,
  FileSearch,
  FolderClock,
  MessageCircle,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
  UploadCloud,
} from "lucide-react";

import LandingNavbar from "../LandingNavbar";
import LandingFooter from "../LandingFooter";

const features = [
  {
    icon: <UploadCloud size={20} />,
    title: "Smart Document Upload",
    description:
      "Upload PDF bank statements, CSV files, receipts, invoices and financial screenshots from one secure workspace.",
  },
  {
    icon: <FileSearch size={20} />,
    title: "Automatic Data Extraction",
    description:
      "Aura extracts transaction dates, merchants, amounts, balances and transaction types automatically.",
  },
  {
    icon: <Tags size={20} />,
    title: "AI Expense Categorization",
    description:
      "Transactions are intelligently classified into food, shopping, travel, subscriptions, healthcare and other categories.",
  },
  {
    icon: <Search size={20} />,
    title: "Semantic Transaction Search",
    description:
      "Search your financial history using natural language instead of relying only on merchant names or exact keywords.",
  },
  {
    icon: <MessageCircle size={20} />,
    title: "Financial Chat Assistant",
    description:
      "Ask questions about your expenses, savings and recurring payments using your actual financial data.",
  },
  {
    icon: <CalendarCheck size={20} />,
    title: "Subscription Detection",
    description:
      "Identify recurring payments and forgotten subscriptions before they continue affecting your monthly budget.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Spending Analytics",
    description:
      "Understand spending trends, category distribution and unusual changes through clear financial visualizations.",
  },
  {
    icon: <Target size={20} />,
    title: "Goal Tracking",
    description:
      "Create financial goals and track your progress using automated updates based on income and expenses.",
  },
  {
    icon: <FolderClock size={20} />,
    title: "Upload History",
    description:
      "Review previously uploaded files, processing states, extracted transactions and failed upload details.",
  },
  {
    icon: <BrainCircuit size={20} />,
    title: "AI Financial Insights",
    description:
      "Receive personalized recommendations based on spending patterns, subscriptions, income and savings behavior.",
  },
  {
    icon: <Receipt size={20} />,
    title: "Receipt & Invoice Support",
    description:
      "Convert receipts and invoices into organized financial records automatically.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Private Financial Workspace",
    description:
      "User-specific data isolation keeps every financial workspace secure and private.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      {/* Hero */}

      <section className="px-4 pt-28 pb-16 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
            <Sparkles size={22} />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            Platform Features
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl">
            Everything you need to manage your finances
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Aura Finance combines AI document processing, intelligent expense
            categorization, semantic search and powerful financial analytics in
            one modern workspace.
          </p>
        </div>
      </section>

      {/* Features */}

      <section className="bg-[#eff4ff] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-[#dce9ff] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
                {feature.icon}
              </div>

              <h2 className="mt-4 text-lg font-bold text-black">
                {feature.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#565e74]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#131b2e] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Bot size={22} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Turn financial documents into actionable insights
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a5aec4]">
            Upload your financial documents once and let Aura automatically
            organize, categorize and analyze every transaction for you.
          </p>

          <Link
            href="/auth/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#006a61] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#005049]"
          >
            Start for Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}