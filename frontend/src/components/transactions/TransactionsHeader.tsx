import {
  Download,
  Plus,
} from "lucide-react";

export default function TransactionsHeader() {
  return (
    <section className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black">
            Transactions
          </h1>

          <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
            Monitor and manage your financial records with AI-enhanced
            precision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)]"
          >
            <Plus
              size={15}
              className="shrink-0"
            />

            Add Record
          </button>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          >
            <Download
              size={15}
              className="shrink-0"
            />

            Export
          </button>
        </div>
      </div>
    </section>
  );
}