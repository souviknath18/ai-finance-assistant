type FileBadgeProps = {
  icon: React.ReactNode;
  label: string;
  tone: "red" | "green" | "blue";
};

export default function FileBadge({ icon, label, tone }: FileBadgeProps) {
  const toneClass =
    tone === "red"
      ? "text-red-600"
      : tone === "green"
      ? "text-emerald-700"
      : "text-indigo-600";

  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#e5eeff] px-4 py-2 text-xs font-bold text-black">
      <span className={toneClass}>{icon}</span>
      {label}
    </div>
  );
}