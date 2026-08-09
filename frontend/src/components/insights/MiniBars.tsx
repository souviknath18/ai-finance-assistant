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
      <div className="flex h-32 items-center justify-center rounded-xl border border-[#e5eeff] bg-[#f8faff]">
        <p className="text-[12px] text-[#8a92a5]">
          No monthly spending data available.
        </p>
      </div>
    );
  }

  const values = recentItems.map((item) =>
    Number(item.amount)
  );

  const maxValue = Math.max(...values, 1);

  return (
    <div>
      {/* Bars */}
      <div className="flex h-28 items-end gap-2">
        {recentItems.map((item, index) => {
          const value = Number(item.amount);

          const height = Math.max(
            (value / maxValue) * 100,
            value > 0 ? 10 : 4
          );

          const isLatest =
            index === recentItems.length - 1;

          return (
            <div
              key={`${item.month}-${index}`}
              className="group flex flex-1 flex-col justify-end"
            >
              {/* Tooltip */}
              <div className="pointer-events-none mb-2 hidden rounded-lg bg-black px-2 py-1 text-center text-[10px] font-semibold text-white group-hover:block">
                {item.amount_display}
              </div>

              {/* Bar */}
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${
                  isLatest
                    ? "bg-black"
                    : "bg-[#c8d8ef] hover:bg-[#9fb7d7]"
                }`}
                style={{
                  height: `${height}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="mt-3 flex gap-2">
        {recentItems.map((item, index) => (
          <div
            key={`${item.month}-label-${index}`}
            className={`flex-1 text-center text-[10px] font-semibold ${
              index === recentItems.length - 1
                ? "text-black"
                : "text-[#8a92a5]"
            }`}
          >
            {formatMonth(item.month)}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatMonth(month: string) {
  if (!month) {
    return "--";
  }

  const parsed = new Date(month);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", {
      month: "short",
    });
  }

  return month.substring(0, 3);
}