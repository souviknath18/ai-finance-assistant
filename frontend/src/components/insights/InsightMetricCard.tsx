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
    <div className="flex flex-col rounded-3xl border border-transparent bg-white p-6 shadow-sm transition hover:border-[#c6c6cd] hover:shadow-md">
      <div className="mb-5 flex items-center gap-3">
        <IconCircle tone={tone}>{icon}</IconCircle>

        <h3 className="text-xs font-bold uppercase tracking-wide text-black">
          {title}
        </h3>
      </div>

      <div className="flex-1">
        <p className="mb-2 text-2xl font-bold text-black">{value}</p>

        <p className="mb-5 text-sm leading-6 text-[#565e74]">
          {description}
        </p>

        {children}
      </div>
    </div>
  );
}