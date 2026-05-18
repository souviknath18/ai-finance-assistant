type NotificationCardProps = {
  icon: React.ReactNode;
  tone: "red" | "green" | "dark" | "purple" | "muted";
  title: string;
  time: string;
  description: string;
  actions: string[];
  dangerAction?: string;
  progress?: number;
};

export default function NotificationCard({
  icon,
  tone,
  title,
  time,
  description,
  actions,
  dangerAction,
  progress,
}: NotificationCardProps) {
  const toneMap = {
    red: {
      border: "border-l-red-600",
      iconBg: "bg-red-50",
      iconText: "text-red-600",
    },
    green: {
      border: "border-l-emerald-700",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-700",
    },
    dark: {
      border: "border-l-black",
      iconBg: "bg-[#e5eeff]",
      iconText: "text-black",
    },
    purple: {
      border: "border-l-indigo-600",
      iconBg: "bg-indigo-100",
      iconText: "text-indigo-700",
    },
    muted: {
      border: "border-l-[#76777d]",
      iconBg: "bg-[#e5eeff]",
      iconText: "text-[#565e74]",
    },
  };

  const current = toneMap[tone];

  return (
    <div
      className={`flex gap-5 rounded-3xl border-l-4 ${current.border} bg-white p-6 shadow-sm transition hover:shadow-md`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${current.iconBg} ${current.iconText}`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-black">{title}</h3>

          <span className="whitespace-nowrap text-xs font-bold text-[#565e74]">
            {time}
          </span>
        </div>

        <p className="mb-4 text-sm leading-6 text-[#565e74]">
          {description}
        </p>

        {progress !== undefined && (
          <div className="mb-4 h-1.5 w-full rounded-full bg-[#e5eeff]">
            <div
              className="h-1.5 rounded-full bg-black"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {actions.map((action) => (
            <button
              key={action}
              className={`border-b pb-px text-xs font-bold uppercase tracking-wide transition hover:opacity-70 ${
                action === dangerAction
                  ? "border-red-600 text-red-600"
                  : action === "Dismiss"
                  ? "border-transparent text-[#565e74] hover:text-black"
                  : "border-black text-black"
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}