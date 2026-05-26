import { ArrowRight, PlayCircle, FileText, Table, Image } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-[#89f5e7]/40 bg-[#89f5e7]/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006a61]">
            AI-Powered Autonomy
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Your Finances, Mastered by AI.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#565e74] sm:text-lg">
            Upload bank statements, CSVs, invoices, or salary slips. Let Aura
            categorize your spending, find insights, and help you reach your
            goals.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
              Get Started for Free
              <ArrowRight size={17} />
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#76777d] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff]">
              <PlayCircle size={17} />
              Watch Demo
            </button>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-dashed border-[#c6c6cd] bg-white p-8 text-center shadow-[0_0_40px_rgba(0,106,97,0.10)] transition hover:border-[#006a61]">
          <div className="mb-8 flex justify-center -space-x-4">
            <FileMockup
              icon={<FileText size={30} />}
              badge="PDF"
              tone="red"
              rotate="-rotate-12"
            />

            <FileMockup
              icon={<Table size={30} />}
              badge="CSV"
              tone="green"
              rotate="z-10"
            />

            <FileMockup
              icon={<Image size={30} />}
              badge="JPG"
              tone="blue"
              rotate="rotate-12"
            />
          </div>

          <h3 className="text-2xl font-bold text-black">
            Drop your files here
          </h3>

          <p className="mt-2 text-sm text-[#565e74]">
            Support for PDF, CSV, and Images up to 20MB
          </p>

          <button className="mt-7 text-sm font-bold text-[#006a61] hover:underline">
            Or browse files from your computer
          </button>
        </div>
      </div>
    </section>
  );
}

function FileMockup({
  icon,
  badge,
  tone,
  rotate,
}: {
  icon: React.ReactNode;
  badge: string;
  tone: "red" | "green" | "blue";
  rotate: string;
}) {
  const badgeClass =
    tone === "red"
      ? "bg-red-600"
      : tone === "green"
      ? "bg-[#006a61]"
      : "bg-indigo-700";

  const iconClass =
    tone === "red"
      ? "text-black"
      : tone === "green"
      ? "text-[#006a61]"
      : "text-indigo-700";

  return (
    <div
      className={`relative flex h-24 w-20 items-center justify-center rounded-xl border border-[#dce9ff] bg-white shadow-md ${rotate}`}
    >
      <span className={iconClass}>{icon}</span>

      <span
        className={`absolute -bottom-2 -right-2 rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${badgeClass}`}
      >
        {badge}
      </span>
    </div>
  );
}