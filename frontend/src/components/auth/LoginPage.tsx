import AuthNavbar from "./AuthNavbar";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <AuthNavbar />

      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <section className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <LoginForm />
      </section>

      <footer className="relative z-10 border-t border-[#d3e4fe]/60 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-base font-bold text-black">Aura Finance</h2>
            <p className="mt-1.5 text-[13px] text-[#565e74]">
              © 2026 Aura Finance AI. Precision in financial autonomy.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-[13px] text-[#565e74]">
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