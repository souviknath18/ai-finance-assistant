const categories = ["Utilities", "Health", "Education", "Entertainment"];

export default function QuickEditSection() {
  return (
    <section className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
      <div className="relative flex h-64 items-end overflow-hidden rounded-3xl bg-gradient-to-br from-[#dce9ff] to-[#0b1c30] p-6 shadow-xl">
        <div className="absolute inset-0 bg-black/20" />

        <p className="relative z-10 text-2xl font-bold leading-tight text-white">
          Aura AI monitors 40+ categories daily.
        </p>
      </div>

      <div className="rounded-3xl p-6">
        <h3 className="mb-4 text-2xl font-bold text-black">
          Master your monthly flow
        </h3>

        <p className="mb-6 text-sm leading-7 text-[#565e74]">
          Our intelligent categorization engine identifies recurring expenses
          and suggests limits based on your lifestyle goals. Adjust any category
          instantly.
        </p>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-[#e5eeff] px-5 py-3 text-xs font-bold text-black"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}