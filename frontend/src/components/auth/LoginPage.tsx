import AuthNavbar from "./AuthNavbar";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <AuthNavbar />

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80" />

      <section className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-16 lg:px-8">
        <LoginForm />
      </section>

      <footer className="relative z-10 border-t border-[#d3e4fe]/60 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <h2 className="text-base font-bold text-black">Aura Finance</h2>
            <p className="mt-1.5 text-[12px] text-[#565e74] sm:text-[13px]">
              © 2026 Aura Finance AI. Precision in financial autonomy.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[12px] text-[#565e74] sm:gap-5 sm:text-[13px]">
            <a href="#" className="hover:text-black hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:text-black hover:underline">
              Security
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}