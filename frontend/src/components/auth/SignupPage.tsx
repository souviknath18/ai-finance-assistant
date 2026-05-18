import { Shield, Brain, BarChart3 } from "lucide-react";
import AuthNavbar from "./AuthNavbar";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <AuthNavbar />

      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-40 lg:px-12">
        <SignupForm />

        <div className="mt-16 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#d3e4fe]/40 bg-white p-6">
            <Shield className="mb-4 text-emerald-600" />
            <h3 className="mb-2 text-sm font-bold text-black">
              Bank-Grade Security
            </h3>
            <p className="text-sm leading-7 text-[#565e74]">
              Multi-layer encryption keeping your financial data private and secure.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d3e4fe]/40 bg-white p-6">
            <BarChart3 className="mb-4 text-emerald-600" />
            <h3 className="mb-2 text-sm font-bold text-black">
              Real-time Analytics
            </h3>
            <p className="text-sm leading-7 text-[#565e74]">
              Gain instant visibility into your financial patterns and cash flow.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d3e4fe]/40 bg-white p-6">
            <Brain className="mb-4 text-emerald-600" />
            <h3 className="mb-2 text-sm font-bold text-black">
              AI Forecasting
            </h3>
            <p className="text-sm leading-7 text-[#565e74]">
              Predict future expenses and savings using intelligent AI models.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}