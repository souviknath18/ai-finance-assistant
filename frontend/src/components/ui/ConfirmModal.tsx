"use client";

import { useEffect } from "react";

import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

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
  // Prevent the page behind the modal from scrolling.
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    onCloseAction();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close confirmation dialog"
        disabled={loading}
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600">
              <AlertTriangle size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-red-500">
                Confirmation Required
              </p>

              <h2
                id="confirm-modal-title"
                className="mt-1 text-[17px] font-bold tracking-tight text-black"
              >
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close modal"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#76777d] transition hover:bg-[#eff4ff] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-[12px] leading-6 text-[#565e74]">
            {message}
          </p>

          <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-3">
            <p className="text-[10px] font-medium leading-5 text-red-700">
              Please confirm before continuing. This action may not be
              reversible.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2.5 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition hover:border-[#c9d9f3] hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirmAction}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-[12px] font-bold text-white transition-[background-color,opacity,box-shadow] duration-200 hover:bg-red-700 hover:shadow-[0_6px_16px_rgba(220,38,38,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={14}
                className="animate-spin"
              />
            )}

            {loading
              ? "Processing..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}