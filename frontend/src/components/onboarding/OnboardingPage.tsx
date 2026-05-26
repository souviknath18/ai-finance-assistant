import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="sticky top-0 z-50 border-b border-[#d3e4fe]/60 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-bold text-black">Aura Finance</h1>

          <div className="hidden items-center gap-6 md:flex">
            <a className="text-[13px] font-medium text-[#45464d]">Portfolio</a>
            <a className="text-[13px] font-medium text-[#45464d]">Markets</a>
            <a className="text-[13px] font-medium text-[#45464d]">Insights</a>
            <a className="text-[13px] font-medium text-[#45464d]">Settings</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-[13px] font-medium text-[#45464d]">
              Support
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce9ff] text-[13px] font-bold text-black">
              U
            </div>
          </div>
        </nav>
      </header>

      <section className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <OnboardingForm />
      </section>
    </main>
  );
}