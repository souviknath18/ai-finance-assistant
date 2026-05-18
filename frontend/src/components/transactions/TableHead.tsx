type TableHeadProps = {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
};

export default function TableHead({
  children,
  align = "left",
}: TableHeadProps) {
  return (
    <th
      className={`p-5 text-xs font-bold uppercase tracking-wide text-[#565e74] ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}