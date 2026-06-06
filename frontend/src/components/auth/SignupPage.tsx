import { Shield, Brain, BarChart3 } from "lucide-react";
import AuthNavbar from "./AuthNavbar";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <AuthNavbar />

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-16 lg:px-8">
        <SignupForm />

        <div className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-3 sm:mt-8 md:grid-cols-3 md:gap-4">
          <FeatureCard
            icon={<Shield size={20} className="text-emerald-600" />}
            title="Bank-Grade Security"
            text="Multi-layer encryption keeping your financial data private and secure."
          />

          <FeatureCard
            icon={<BarChart3 size={20} className="text-emerald-600" />}
            title="Real-time Analytics"
            text="Gain instant visibility into your financial patterns and cash flow."
          />

          <FeatureCard
            icon={<Brain size={20} className="text-emerald-600" />}
            title="AI Forecasting"
            text="Predict future expenses and savings using intelligent AI models."
          />
        </div>
      </div>
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
    <div className="rounded-2xl border border-[#d3e4fe]/40 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3">{icon}</div>

      <h3 className="mb-1.5 text-[13px] font-bold text-black">
        {title}
      </h3>

      <p className="text-[12px] leading-5 text-[#565e74] sm:text-[13px]">
        {text}
      </p>
    </div>
  );
}