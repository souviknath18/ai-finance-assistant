const categories = ["Utilities", "Health", "Education", "Entertainment"];

export default function QuickEditSection() {
  return (
    <section className="mt-10 grid grid-cols-1 items-center gap-4 md:grid-cols-2">
      <div className="relative flex h-52 items-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#dce9ff] to-[#0b1c30] p-5 shadow-xl">
        <div className="absolute inset-0 bg-black/20" />

        <p className="relative z-10 text-xl font-bold leading-tight text-white">
          Aura AI monitors 40+ categories daily.
        </p>
      </div>

      <div className="rounded-2xl p-5">
        <h3 className="mb-3 text-lg font-bold text-black">
          Master your monthly flow
        </h3>

        <p className="mb-5 text-[13px] leading-6 text-[#565e74]">
          Our intelligent categorization engine identifies recurring expenses
          and suggests limits based on your lifestyle goals. Adjust any category
          instantly.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-[#e5eeff] px-4 py-2 text-[11px] font-bold text-black"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}