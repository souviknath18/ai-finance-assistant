import {
  BarChart3,
  CalendarDays,
  Landmark,
  MessageCircle,
  Search,
  Target,
  Upload,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Aura Intelligence
          </p>

          <h2 className="mt-2 text-[28px] font-bold tracking-tight text-black sm:text-[34px]">
            One intelligent workspace for your money
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-[#565e74]">
            Bring financial activity together, understand your spending,
            uncover patterns, and ask questions using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Landmark size={18} />}
            title="Connected Accounts"
            description="Bring account activity into Aura and keep your financial picture continuously updated."
          />

          <FeatureCard
            icon={<BarChart3 size={18} />}
            title="Spending Intelligence"
            description="Understand where your money goes with category breakdowns, trends, anomalies, and monthly comparisons."
          />

          <FeatureCard
            icon={<CalendarDays size={18} />}
            title="Subscription Detection"
            description="Identify recurring payments and understand how subscriptions affect your monthly spending."
          />

          <FeatureCard
            icon={<Search size={18} />}
            title="Semantic Search"
            description="Search your financial history naturally instead of relying only on transaction names or filters."
          />

          <FeatureCard
            icon={<Target size={18} />}
            title="Budgets & Goals"
            description="Track spending limits, savings goals, and progress toward important financial milestones."
          />

          <DarkFeatureCard />
        </div>

        <div className="mt-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 via-white to-[#fbfcff] p-5 shadow-[0_6px_20px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700">
                <Upload size={19} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                  Flexible Data Import
                </p>

                <h3 className="mt-1 text-[18px] font-bold text-black">
                  Import financial documents when needed
                </h3>

                <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
                  Upload bank statements, receipts, invoices, images,
                  PDFs, or CSV files to add historical or additional
                  financial data to Aura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] hover:border-emerald-100 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <h3 className="mt-4 text-[15px] font-bold text-black">
        {title}
      </h3>

      <p className="mt-2 text-[12px] leading-5 text-[#565e74]">
        {description}
      </p>
    </div>
  );
}

function DarkFeatureCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-black p-5 text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)]">
      <div className="relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
          <MessageCircle size={18} />
        </div>

        <h3 className="mt-4 text-[15px] font-bold">
          Ask Aura
        </h3>

        <p className="mt-2 text-[12px] leading-5 text-[#b7c0d4]">
          Ask questions about spending, transactions, recurring payments,
          trends, and your financial history using natural language.
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <p className="text-[11px] italic leading-5 text-[#d8deeb]">
            “Why did I spend more this month?”
          </p>
        </div>
      </div>

      <MessageCircle
        size={120}
        className="absolute -bottom-8 -right-8 opacity-[0.05]"
      />
    </div>
  );
}