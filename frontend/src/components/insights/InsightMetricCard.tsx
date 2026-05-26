import IconCircle from "./IconCircle";

type InsightMetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  children?: React.ReactNode;
  tone?: "default" | "red" | "green" | "purple";
};

export default function InsightMetricCard({
  icon,
  title,
  value,
  description,
  children,
  tone = "default",
}: InsightMetricCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-transparent bg-white p-5 shadow-sm transition hover:border-[#c6c6cd] hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <IconCircle tone={tone}>{icon}</IconCircle>

        <h3 className="text-[11px] font-bold uppercase tracking-wide text-black">
          {title}
        </h3>
      </div>

      <div className="flex-1">
        <p className="mb-1.5 text-xl font-bold text-black">{value}</p>

        <p className="mb-4 text-[13px] leading-5 text-[#565e74]">
          {description}
        </p>

        {children}
      </div>
    </div>
  );
}