import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="sticky top-0 z-50 border-b border-[#d3e4fe]/60 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <h1 className="text-xl font-bold text-black">Aura Finance</h1>

          <div className="hidden items-center gap-8 md:flex">
            <a className="text-sm font-medium text-[#45464d]">Portfolio</a>
            <a className="text-sm font-medium text-[#45464d]">Markets</a>
            <a className="text-sm font-medium text-[#45464d]">Insights</a>
            <a className="text-sm font-medium text-[#45464d]">Settings</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#45464d]">
              Support
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce9ff] text-black">
              U
            </div>
          </div>
        </nav>
      </header>

      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16 lg:px-12">
        <OnboardingForm />
      </section>
    </main>
  );
}