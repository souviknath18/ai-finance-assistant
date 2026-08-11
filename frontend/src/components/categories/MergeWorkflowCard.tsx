import {
  ArrowRight,
  GitMerge,
} from "lucide-react";

export default function MergeWorkflowCard() {
  return (
    <section className="mt-8">
      <div className="relative overflow-hidden rounded-3xl bg-black p-5 shadow-[0_10px_32px_rgba(15,23,42,0.12)] sm:p-6">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-emerald-300">
              <GitMerge size={17} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                Category Management
              </p>

              <h2 className="mt-1 text-[16px] font-bold tracking-tight text-white">
                Merge Workflow
              </h2>

              <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-[#bec6e0]">
                Consolidate similar custom categories while keeping your
                transaction history and categorization rules organized.
              </p>
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-[12px] font-bold text-black transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_18px_rgba(255,255,255,0.12)]"
          >
            Start Merge Process

            <ArrowRight
              size={14}
              className="shrink-0"
            />
          </button>
        </div>
      </div>
    </section>
  );
}