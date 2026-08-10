type MiniBarItem = {
  month: string;
  amount: string | number;
  amount_display: string;
};

type MiniBarsProps = {
  items?: MiniBarItem[];
};

export default function MiniBars({
  items = [],
}: MiniBarsProps) {
  const recentItems = items.slice(-6);

  if (recentItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-4 py-5 text-center">
        <p className="text-[11px] font-medium text-[#7c839b]">
          No monthly spending data available.
        </p>
      </div>
    );
  }

  const values = recentItems.map((item) =>
    Number(item.amount) || 0
  );

  const maxValue = Math.max(...values, 1);

  return (
    <div>
      {/* Chart */}
      <div className="relative h-28 rounded-xl bg-[#fbfcff] px-3 pb-1 pt-3">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-x-3 bottom-1 top-3 flex flex-col justify-between">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="border-t border-dashed border-[#edf2fb]"
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative z-10 flex h-full items-end gap-2">
          {recentItems.map((item, index) => {
            const value =
              Number(item.amount) || 0;

            const height =
              value > 0
                ? Math.max(
                    (value / maxValue) * 100,
                    10
                  )
                : 4;

            const isLatest =
              index ===
              recentItems.length - 1;

            return (
              <div
                key={`${item.month}-${index}`}
                className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
              >
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-[9px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                  {item.amount_display}
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[34px] rounded-t-lg transition-[height,background-color] duration-500 ${
                    isLatest
                      ? "bg-gradient-to-t from-emerald-700 to-emerald-400"
                      : "bg-[#dbe5f5] group-hover:bg-[#c7d5ea]"
                  }`}
                  style={{
                    height: `${height}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Month labels */}
      <div className="mt-2 flex gap-2 px-3">
        {recentItems.map((item, index) => {
          const isLatest =
            index ===
            recentItems.length - 1;

          return (
            <div
              key={`${item.month}-label-${index}`}
              className="min-w-0 flex-1 text-center"
            >
              <span
                className={`text-[9px] font-bold ${
                  isLatest
                    ? "text-emerald-700"
                    : "text-[#7c839b]"
                }`}
              >
                {formatMonth(item.month)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[#edf2fb] pt-3">
        <p className="text-[9px] font-medium text-[#7c839b]">
          Last {recentItems.length} months
        </p>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[9px] font-bold text-emerald-700">
            Latest month
          </span>
        </div>
      </div>
    </div>
  );
}

function formatMonth(
  month: string
) {
  if (!month) {
    return "--";
  }

  const parsed = new Date(month);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    );
  }

  return month.substring(0, 3);
}