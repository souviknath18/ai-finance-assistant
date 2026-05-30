import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#131b2e] p-10 text-center shadow-sm md:p-16">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-[#dae2fd] sm:text-5xl">
            Ready to master your money?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#7c839b]">
            Join users who have automated their financial clarity with Aura
            Finance AI.
          </p>

          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#006a61] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#005049]"
          >
            Get Started for Free
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[#89f5e7]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    </section>
  );
}