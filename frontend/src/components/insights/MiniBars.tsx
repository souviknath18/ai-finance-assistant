type MiniBarItem = {
  month?: string;
  amount: string | number;
  amount_display?: string;
};

type MiniBarsProps = {
  items?: MiniBarItem[];
};

export default function MiniBars({
  items = [],
}: MiniBarsProps) {
  const recentItems = items.slice(-6);

  const values = recentItems.map((item) => {
    const value = Number(item.amount);
    return Number.isFinite(value) ? value : 0;
  });

  const maxValue = Math.max(...values, 1);

  if (recentItems.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl bg-[#f8faff]">
        <p className="text-[12px] font-medium text-[#565e74]">
          No spending trend data yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Chart */}
      <div className="flex h-28 items-end gap-2">
        {recentItems.map((item, index) => {
          const value = values[index];

          const height = Math.max(
            (value / maxValue) * 100,
            value > 0 ? 12 : 4
          );

          const isLatest = index === recentItems.length - 1;

          return (
            <div
              key={`${item.month ?? "month"}-${index}`}
              className="group flex h-full flex-1 flex-col justify-end"
            >
              <div className="relative flex h-full items-end">
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm group-hover:block">
                  {item.amount_display ??
                    formatCurrency(value)}
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isLatest
                      ? "bg-black"
                      : "bg-[#cbd7ea] group-hover:bg-[#aebbd0]"
                  }`}
                  style={{
                    height: `${height}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="mt-2 flex gap-2">
        {recentItems.map((item, index) => (
          <div
            key={`${item.month ?? "label"}-${index}`}
            className={`flex-1 text-center text-[10px] font-semibold ${
              index === recentItems.length - 1
                ? "text-black"
                : "text-[#8a92a5]"
            }`}
          >
            {formatMonth(item.month, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatMonth(
  month: string | undefined,
  index: number
) {
  if (!month) {
    return `${index + 1}`;
  }

  const parsedDate = new Date(month);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
    });
  }

  return month.slice(0, 3);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}