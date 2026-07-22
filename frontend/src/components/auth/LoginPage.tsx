import AuthFooter from "./AuthFooter";
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

      <AuthFooter />
    </main>
  );
}