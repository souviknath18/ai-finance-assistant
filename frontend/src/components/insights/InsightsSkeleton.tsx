export default function InsightsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-2.5 w-20 rounded-full bg-[#edf2fb]" />

                <div className="mt-3 h-6 w-28 rounded-lg bg-[#e8eefb]" />
              </div>

              <div className="h-9 w-9 rounded-xl bg-emerald-50" />
            </div>

            <div className="mt-3 h-2.5 w-32 rounded-full bg-[#edf2fb]" />
          </div>
        ))}
      </div>

      {/* Executive summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="rounded-3xl border border-[#e6edf9] bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:col-span-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50" />

            <div>
              <div className="h-3 w-36 rounded-full bg-[#e8eefb]" />
              <div className="mt-2 h-2 w-48 rounded-full bg-[#edf2fb]" />
            </div>
          </div>

          <div className="mt-6 h-6 w-3/4 rounded-lg bg-[#e8eefb]" />

          <div className="mt-3 h-3 w-full rounded-full bg-[#edf2fb]" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-[#edf2fb]" />

          <div className="mt-6 h-20 rounded-2xl bg-[#fbfcff]" />
        </div>

        <div className="space-y-4 md:col-span-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="h-3 w-24 rounded-full bg-[#e8eefb]" />

              <div className="mt-4 h-3 w-3/4 rounded-full bg-[#edf2fb]" />

              <div className="mt-2 h-3 w-full rounded-full bg-[#edf2fb]" />
            </div>
          ))}
        </div>
      </div>

      {/* Main metrics */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)]"
          >
            <div className="flex justify-between">
              <div>
                <div className="h-2.5 w-28 rounded-full bg-[#edf2fb]" />

                <div className="mt-3 h-6 w-20 rounded-lg bg-[#e8eefb]" />
              </div>

              <div className="h-10 w-10 rounded-xl bg-emerald-50" />
            </div>

            <div className="mt-5 h-3 w-full rounded-full bg-[#edf2fb]" />
            <div className="mt-2 h-3 w-4/5 rounded-full bg-[#edf2fb]" />

            <div className="mt-5 h-24 rounded-xl bg-[#fbfcff]" />
          </div>
        ))}
      </div>

      {/* Category + health */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="h-[420px] rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] xl:col-span-4" />

        <div className="h-[420px] rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] xl:col-span-8" />
      </div>
    </div>
  );
}