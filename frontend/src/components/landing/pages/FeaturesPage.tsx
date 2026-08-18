import Link from "next/link";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarCheck,
  FileSearch,
  FolderClock,
  Landmark,
  MessageCircle,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
} from "lucide-react";

import LandingNavbar from "../LandingNavbar";
import LandingFooter from "../LandingFooter";

const features = [
  {
    icon: <Landmark size={20} />,
    title: "Connected Financial Accounts",
    description:
      "Bring account activity into Aura and keep your financial workspace continuously updated without repeatedly uploading statements.",
  },
  {
    icon: <Tags size={20} />,
    title: "AI Transaction Categorization",
    description:
      "Automatically organize transactions into useful categories such as food, shopping, travel, subscriptions, healthcare, and more.",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "Spending Intelligence",
    description:
      "Understand category spending, monthly changes, unusual activity, income patterns, and important financial trends.",
  },
  {
    icon: <CalendarCheck size={20} />,
    title: "Subscription Detection",
    description:
      "Identify recurring payments and understand how subscriptions affect your monthly spending.",
  },
  {
    icon: <Search size={20} />,
    title: "Semantic Transaction Search",
    description:
      "Search your financial history naturally instead of relying only on exact merchant names or traditional filters.",
  },
  {
    icon: <MessageCircle size={20} />,
    title: "Ask Aura",
    description:
      "Ask questions about your spending, transactions, subscriptions, and financial history using natural language.",
  },
  {
    icon: <BrainCircuit size={20} />,
    title: "AI Financial Insights",
    description:
      "Discover spending changes, saving opportunities, recurring behavior, and personalized observations from your financial activity.",
  },
  {
    icon: <Target size={20} />,
    title: "Budgets & Goals",
    description:
      "Track spending limits, savings goals, and progress toward important personal financial milestones.",
  },
  {
    icon: <Receipt size={20} />,
    title: "Flexible Financial Import",
    description:
      "Add historical or additional financial data using bank statements, receipts, invoices, PDFs, images, and CSV files.",
  },
  {
    icon: <FolderClock size={20} />,
    title: "Financial Data History",
    description:
      "Review imported files, processing activity, transactions, and previously added financial information.",
  },
  {
    icon: <FileSearch size={20} />,
    title: "Document Intelligence",
    description:
      "Aura can extract structured financial information from statements, receipts, invoices, and other supported documents.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Private Financial Workspace",
    description:
      "Authenticated access and user-specific data separation help keep each financial workspace private.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <LandingNavbar />

      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#89f5e7]/20 text-[#006a61]">
            <Sparkles size={22} />
          </div>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#006a61]">
            Platform Features
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl">
            One intelligent workspace for your financial life
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-[#565e74]">
            Aura brings financial activity into one place and combines
            automatic organization, intelligent search, spending analytics,
            document processing, and personalized AI insights.
          </p>
        </div>
      </section>

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

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#131b2e] px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <BrainCircuit size={22} className="text-white" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Turn everyday financial activity into useful insights
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#a5aec4]">
            Connect financial data or import existing records and let Aura
            organize, analyze, and help you understand your money.
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