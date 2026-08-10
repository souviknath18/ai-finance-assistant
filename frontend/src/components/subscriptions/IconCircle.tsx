type IconCircleProps = {
  children: React.ReactNode;
  tone?: "default" | "green" | "red" | "amber";
  size?: "sm" | "md";
};

export default function IconCircle({
  children,
  tone = "default",
  size = "md",
}: IconCircleProps) {
  const toneStyles = {
    default:
      "border-[#e6edf9] bg-[#f3f6fc] text-black",
    green:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    red:
      "border-red-100 bg-red-50 text-red-600",
    amber:
      "border-amber-100 bg-amber-50 text-amber-700",
  };

  const sizeStyles = {
    sm: "h-9 w-9 rounded-xl",
    md: "h-11 w-11 rounded-2xl",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center border ${sizeStyles[size]} ${toneStyles[tone]}`}
    >
      {children}
    </div>
  );
}