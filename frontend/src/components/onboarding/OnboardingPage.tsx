import {
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80" />

      {/* Navbar */}
      <nav className="relative z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-[#d3e4fe]/60 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-black to-[#1f2937] text-white shadow-sm">
            <Sparkles size={15} />
          </div>

          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-[15px] font-bold tracking-tight text-black sm:text-lg">
              Aura Finance
            </h1>

            <p className="hidden text-[10px] font-semibold tracking-wide text-[#7c839b] xs:block sm:hidden">
              AI Finance Workspace
            </p>
          </div>
        </div>

        {/* Secure Setup */}
        <div className="flex items-center gap-1.5 text-[#565e74]">
          <LockKeyhole
            size={13}
            className="text-emerald-700"
          />

          <span className="hidden text-[11px] font-semibold sm:inline">
            Secure Setup
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="w-full">
          <OnboardingForm />
        </div>
      </section>
    </main>
  );
}