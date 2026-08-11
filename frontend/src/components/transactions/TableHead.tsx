type TableHeadProps = {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export default function TableHead({
  children,
  align = "left",
  className = "",
}: TableHeadProps) {
  const alignment =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <th
      scope="col"
      className={`whitespace-nowrap px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#565e74] ${alignment} ${className}`}
    >
      {children}
    </th>
  );
}