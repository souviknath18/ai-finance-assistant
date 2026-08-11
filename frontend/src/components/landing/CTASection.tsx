import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-black px-5 py-12 text-center text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)] sm:px-10 sm:py-14">
        <div className="relative z-10">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <Sparkles size={16} />
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
            Start with Aura
          </p>

          <h2 className="mx-auto mt-2 max-w-2xl text-[28px] font-bold tracking-tight sm:text-[36px]">
            Build a clearer picture of your financial life.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[#b7c0d4]">
            Import your financial activity and let Aura organize, analyze,
            and surface the information that matters.
          </p>

          <Link
            href="/auth/signup"
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-[12px] font-bold text-black transition hover:bg-emerald-50 sm:w-auto"
          >
            Get Started for Free
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
      </div>
    </section>
  );
}