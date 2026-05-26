import { BarChart3, Download, History } from "lucide-react";

export default function AIPrivacySection() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <BarChart3 size={18} className="text-black" />
        <h2 className="text-lg font-bold text-black">Data & AI Privacy</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-sm">
        <div className="border-b border-[#e5eeff] p-5">
          <h3 className="mb-1.5 text-base font-bold text-black">
            AI Memory Retention
          </h3>

          <p className="mb-5 text-[13px] leading-6 text-[#565e74]">
            Control how much the AI remembers about your financial habits across
            sessions.
          </p>

          <div className="space-y-4">
            <MemoryOption
              title="Full Contextual Memory"
              description="Allows Aura to remember long-term goals and specific transaction details to provide tailored advice."
              checked
            />

            <MemoryOption
              title="Session-Only Memory"
              description="Resets AI context after 24 hours. Good for general advice without personal profiling."
            />
          </div>
        </div>

        <div className="bg-[#eff4ff] p-5">
          <h3 className="mb-1.5 text-base font-bold text-black">
            Export Your Data
          </h3>

          <p className="mb-4 text-[13px] leading-6 text-[#565e74]">
            Download a complete archive of your financial data and AI
            interaction history in JSON or CSV format.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white">
              <Download size={15} />
              Request Data Export
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-[#76777d] px-4 py-2.5 text-[13px] font-bold text-black">
              <History size={15} />
              Export History
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MemoryOption({
  title,
  description,
  checked = false,
}: {
  title: string;
  description: string;
  checked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        defaultChecked={checked}
        name="ai_memory"
        type="radio"
        className="mt-1 accent-emerald-700"
      />

      <div>
        <p className="text-[13px] font-bold text-black">{title}</p>
        <p className="mt-1 text-[13px] leading-5 text-[#565e74]">
          {description}
        </p>
      </div>
    </label>
  );
}