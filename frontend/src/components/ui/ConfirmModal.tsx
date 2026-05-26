import { AlertTriangle, X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  loading = false,
  onCloseAction,
  onConfirmAction,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <h2 className="text-xl font-bold text-black">{title}</h2>
          </div>

          <button
            onClick={onCloseAction}
            className="rounded-lg p-1 text-[#565e74] hover:bg-[#eff4ff] hover:text-black"
          >
            <X size={17} />
          </button>
        </div>

        <p className="mb-5 text-[13px] leading-5 text-[#565e74]">{message}</p>

        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCloseAction}
            disabled={loading}
            className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black hover:bg-[#eff4ff]"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmAction}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}