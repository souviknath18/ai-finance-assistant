import {
  Download,
  History,
} from "lucide-react";

export default function AIPrivacySection() {
  return (
    <section>
      <h2 className="mb-3 text-[15px] font-bold text-black">
        Data & AI Privacy
      </h2>

      <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#edf2fb] p-5">
          <h3 className="text-[13px] font-bold text-black">
            AI Memory Retention
          </h3>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            Control how much the AI remembers about your financial habits
            across sessions.
          </p>

          <div className="mt-4 space-y-3">
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

        <div className="bg-[#fbfcff] p-5">
          <h3 className="text-[13px] font-bold text-black">
            Export Your Data
          </h3>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            Download a complete archive of your financial data and AI
            interaction history in JSON or CSV format.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition hover:opacity-90">
              <Download size={15} />
              Request Data Export
            </button>

            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition hover:bg-[#eff4ff]">
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
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
      <input
        type="radio"
        name="memory"
        defaultChecked={checked}
        className="mt-1 accent-emerald-700"
      />

      <div>
        <p className="text-[12px] font-bold text-black">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
          {description}
        </p>
      </div>
    </label>
  );
}