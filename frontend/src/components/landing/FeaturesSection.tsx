import {
  BarChart3,
  CalendarX,
  Flag,
  FolderKanban,
  MessageCircle,
  Tags,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-[#eff4ff] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            Powerful Intelligence for Your Pocket
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#565e74]">
            Precision-engineered tools to automate your financial life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
          <FeatureCard
            className="md:col-span-2 lg:col-span-2"
            icon={<Tags size={22} />}
            iconClass="bg-[#89f5e7]/20 text-[#006a61]"
            title="AI Expense Categorization"
            description="Aura accurately groups every transaction into granular categories, learning your unique spending habits over time."
          >
            <div className="mt-6 flex flex-wrap gap-2 border-t border-[#dce9ff] pt-4">
              <Chip>Starbucks → Dining</Chip>
              <Chip>Uber → Transport</Chip>
              <Chip>Netflix → Entertainment</Chip>
            </div>
          </FeatureCard>

          <FeatureCard
            className="md:col-span-1 lg:col-span-2"
            icon={<BarChart3 size={22} />}
            iconClass="bg-[#dae2fd] text-black"
            title="Spending Insights"
            description="Visual snapshots of where your money flows. Detect anomalies and trend shifts before they impact your balance."
          >
            <div className="mt-5 flex h-24 items-end gap-1">
              {["40%", "60%", "90%", "50%", "75%"].map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={`w-full rounded-t ${
                    index === 2 ? "bg-[#006a61]" : "bg-[#89f5e7]"
                  }`}
                  style={{ height }}
                />
              ))}
            </div>
          </FeatureCard>

          <DarkFeatureCard />

          <FeatureCard
            icon={<CalendarX size={22} />}
            iconClass="bg-red-50 text-red-600"
            title="Subscription Detection"
            description="Find and cancel forgotten recurring charges instantly."
          />

          <FeatureCard
            icon={<Flag size={22} />}
            iconClass="bg-indigo-100 text-indigo-700"
            title="Goal Tracking"
            description="Set and monitor milestones with automated progress alerts."
          />

          <div className="rounded-3xl bg-[#006a61] p-6 text-white shadow-sm md:col-span-2 lg:col-span-4">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <FolderKanban size={22} />
                </div>

                <h3 className="text-2xl font-bold">
                  Automated Monthly Reports
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/90">
                  Get a beautiful executive-style summary of your financial
                  health delivered every month. No manual data entry required.
                </p>
              </div>

              <button className="whitespace-nowrap rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#006a61]">
                View Sample Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  iconClass,
  title,
  description,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm ${className}`}
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold text-current">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-current/70">
        {description}
      </p>

      {children}
    </div>
  );
}

function DarkFeatureCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1b2740] bg-[#0f172a] p-6 text-white shadow-sm lg:col-span-2">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
        <MessageCircle size={22} />
      </div>

      <h3 className="text-xl font-bold">
        Financial Chat Assistant
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#c7d2fe]">
        Ask questions like "Can I afford a vacation?" and get real-time answers
        based on your actual budget and projected income.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <p className="text-sm italic leading-6 text-[#dae2fd]">
          “Based on your savings rate, you can afford a trip by June while
          maintaining your emergency fund.”
        </p>
      </div>

      <div className="absolute -bottom-6 -right-6 opacity-10">
        <MessageCircle size={120} />
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#eff4ff] px-3 py-1 text-[11px] font-bold text-[#565e74]">
      {children}
    </span>
  );
}