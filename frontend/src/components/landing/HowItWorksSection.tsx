import {
  Brain,
  Landmark,
  LineChart,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Landmark,
    title: "Connect or Import",
    description:
      "Connect a financial account or import statements, receipts, invoices, images, and CSV files.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Aura Organizes Everything",
    description:
      "Transactions are normalized, categorized, indexed, and analyzed automatically.",
  },
  {
    number: "03",
    icon: LineChart,
    title: "Understand Your Money",
    description:
      "Discover spending trends, recurring payments, anomalies, budgets, goals, and personalized AI insights.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-y border-[#edf2fb] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Simple by Design
          </p>

          <h2 className="mt-2 text-[28px] font-bold tracking-tight text-black sm:text-[34px]">
            From financial activity to financial clarity
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-[#565e74]">
            Aura brings your financial activity together and turns it
            into useful intelligence in three simple steps.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-5 transition hover:border-emerald-100 hover:bg-white hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                    <Icon size={17} />
                  </div>

                  <span className="text-[11px] font-bold text-[#c1c7d2]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-[15px] font-bold text-black">
                  {step.title}
                </h3>

                <p className="mt-2 text-[12px] leading-5 text-[#565e74]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}