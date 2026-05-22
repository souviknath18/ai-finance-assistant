type MiniBarsProps = {
  items?: {
    amount: string;
  }[];
};

export default function MiniBars({ items = [] }: MiniBarsProps) {
  const values = items.map((item) => Number(item.amount));
  const max = Math.max(...values, 1);

  const bars = values.length
    ? values.slice(-6).map((value) => `${Math.max((value / max) * 100, 10)}%`)
    : [];

  return (
    <div className="flex h-16 items-end gap-1 rounded-2xl bg-[#eff4ff] px-3 pb-2">
      {bars.length === 0 ? (
        <p className="self-center text-xs font-semibold text-[#565e74]">
          No trend data yet
        </p>
      ) : (
        bars.map((height, index) => (
          <div
            key={height + index}
            className={`w-1/6 rounded-sm ${
              index === bars.length - 1 ? "bg-black" : "bg-[#c6c6cd]"
            }`}
            style={{ height }}
          />
        ))
      )}
    </div>
  );
}