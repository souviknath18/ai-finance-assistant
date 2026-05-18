export default function MiniBars() {
  const bars = ["35%", "50%", "65%", "100%", "50%", "40%"];

  return (
    <div className="flex h-16 items-end gap-1 rounded-2xl bg-[#eff4ff] px-3 pb-2">
      {bars.map((height, index) => (
        <div
          key={height + index}
          className={`w-1/6 rounded-sm ${
            index === 3 ? "bg-black" : "bg-[#c6c6cd]"
          }`}
          style={{ height }}
        />
      ))}
    </div>
  );
}