import { Sparkles } from "lucide-react";

const categories = [
  "Utilities",
  "Health",
  "Education",
  "Entertainment",
];

export default function BudgetIntelligenceSection() {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr]">
        {/* Left */}
        <div className="relative overflow-hidden border-b border-[#edf2fb] bg-[#0b0b0b] p-6 lg:border-b-0 lg:border-r">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
              <Sparkles size={17} />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400">
              Smart Categorization
            </p>

            <h3 className="mt-2 max-w-xs text-[20px] font-bold leading-7 tracking-tight text-white">
              Aura AI monitors 40+ categories daily.
            </h3>

            <p className="mt-3 max-w-sm text-[12px] leading-5 text-white/60">
              Your spending patterns are continuously organized to help you
              understand where your money goes.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Budget Intelligence
          </p>

          <h3 className="mt-1.5 text-[18px] font-bold tracking-tight text-black">
            Master your monthly flow
          </h3>

          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#565e74]">
            Aura identifies recurring expenses and spending patterns to help
            you set smarter limits and keep your monthly budget under control.
          </p>

          {/* Categories */}
          <div className="mt-5">
            <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Monitored Categories
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e6edf9] bg-[#fbfcff] px-3.5 py-2 text-[11px] font-bold text-[#565e74]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  {category}
                </span>
              ))}

              <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-[11px] font-bold text-emerald-700">
                +36 more
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}