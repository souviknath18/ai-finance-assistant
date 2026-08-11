import {
  BarChart3,
  Brain,
  Shield,
} from "lucide-react";

import AuthFooter from "./AuthFooter";
import AuthNavbar from "./AuthNavbar";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f8faff] text-[#0b1c30]">
      <AuthNavbar />

      {/* Soft background accents */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl sm:h-80 sm:w-80" />

      {/* Main Content */}
      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24 lg:px-8">
        <SignupForm />

        {/* Feature Highlights */}
        <div className="mt-5 grid w-full max-w-5xl grid-cols-1 gap-3 sm:mt-6 md:grid-cols-3">
          <FeatureCard
            icon={<Shield size={17} />}
            title="Bank-Grade Security"
            text="Multi-layer protection keeps your financial data private and secure."
          />

          <FeatureCard
            icon={<BarChart3 size={17} />}
            title="Real-Time Analytics"
            text="Understand your financial patterns and cash flow with clear insights."
          />

          <FeatureCard
            icon={<Brain size={17} />}
            title="AI Forecasting"
            text="Use intelligent analysis to anticipate spending, savings, and future trends."
          />
        </div>
      </section>

      <AuthFooter />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6edf9] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-emerald-100 hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <h3 className="text-[12px] font-bold text-black">
        {title}
      </h3>

      <p className="mt-1.5 text-[11px] leading-5 text-[#565e74] sm:text-[12px]">
        {text}
      </p>
    </div>
  );
}