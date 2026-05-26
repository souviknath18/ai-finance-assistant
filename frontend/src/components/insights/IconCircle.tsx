type IconCircleProps = {
  children: React.ReactNode;
  tone?: "default" | "red" | "green" | "purple";
};

export default function IconCircle({
  children,
  tone = "default",
}: IconCircleProps) {
  const cls =
    tone === "red"
      ? "bg-red-50 text-red-700"
      : tone === "green"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "purple"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-[#dce9ff] text-black";

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full ${cls}`}
    >
      {children}
    </div>
  );
}