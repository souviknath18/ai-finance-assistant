import type {
  ReactNode,
} from "react";

type FileBadgeProps = {
  icon: ReactNode;
  label: string;
  tone:
    | "red"
    | "green"
    | "blue";
};

export default function FileBadge({
  icon,
  label,
  tone,
}: FileBadgeProps) {
  const toneStyles = {
    red: {
      container:
        "border-red-100 bg-red-50/60",
      icon: "text-red-600",
    },

    green: {
      container:
        "border-emerald-100 bg-emerald-50/60",
      icon: "text-emerald-700",
    },

    blue: {
      container:
        "border-blue-100 bg-blue-50/60",
      icon: "text-blue-600",
    },
  };

  const styles =
    toneStyles[tone];

  return (
    <div
      className={`inline-flex h-8 items-center gap-2 rounded-xl border px-3 ${styles.container}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center ${styles.icon}`}
      >
        {icon}
      </span>

      <span className="text-[10px] font-bold text-[#565e74]">
        {label}
      </span>
    </div>
  );
}