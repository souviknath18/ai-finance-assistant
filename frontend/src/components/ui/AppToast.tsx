import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type AppToastProps = {
  show: boolean;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  onCloseAction: () => void;
};

export default function AppToast({
  show,
  type = "success",
  title,
  message,
  onCloseAction,
}: AppToastProps) {
  if (!show) return null;

  const styles = {
    success: {
      icon: <CheckCircle2 size={18} />,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    error: {
      icon: <AlertCircle size={18} />,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    info: {
      icon: <Info size={18} />,
      color: "text-[#565e74]",
      bg: "bg-[#eff4ff]",
      border: "border-[#d3e4fe]",
    },
  };

  const current = styles[type];

  return (
    <div className="fixed right-6 top-20 z-[9999] w-[calc(100%-3rem)] max-w-sm animate-[toastSlide_0.35s_ease]">
      <div
        className={`flex gap-3 rounded-2xl border ${current.border} ${current.bg} p-3.5 shadow-[0_16px_45px_rgba(15,23,42,0.14)]`}
      >
        <div className={current.color}>{current.icon}</div>

        <div className="flex-1">
          <p className="text-[13px] font-bold text-black">{title}</p>

          {message && (
            <p className="mt-1 text-[13px] leading-5 text-[#565e74]">
              {message}
            </p>
          )}
        </div>

        <button
          onClick={onCloseAction}
          className="text-[#565e74] hover:text-black"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}