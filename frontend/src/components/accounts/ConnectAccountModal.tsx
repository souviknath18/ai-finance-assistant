"use client";

import {
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import BankOptionCard from "./BankOptionCard";

import {
  connectAccount,
} from "@/lib/api/accountApi";

import {
  BankInstitution,
} from "@/types/account";

type ConnectAccountModalProps = {
  open: boolean;

  institutions: BankInstitution[];

  onCloseAction: () => void;

  onSuccessAction:
    () => Promise<void> | void;
};

export default function ConnectAccountModal({
  open,
  institutions,
  onCloseAction,
  onSuccessAction,
}: ConnectAccountModalProps) {
  const [
    selectedCode,
    setSelectedCode,
  ] = useState<string | null>(
    null
  );

  const [
    connecting,
    setConnecting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const bodyOverflow =
      document.body.style.overflow;

    const htmlOverflow =
      document.documentElement.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        bodyOverflow;

      document.documentElement.style.overflow =
        htmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedCode(null);
      setError(null);
      setConnecting(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (connecting) {
      return;
    }

    setSelectedCode(null);
    setError(null);

    onCloseAction();
  };

  const handleConnect = async () => {
    if (!selectedCode) {
      setError(
        "Select a bank to continue."
      );

      return;
    }

    try {
      setConnecting(true);
      setError(null);

      await connectAccount({
        institution_code:
          selectedCode,
      });

      setSelectedCode(null);
      setError(null);

      // Close modal immediately after
      // successful account creation.
      onCloseAction();

      // Refresh connected accounts.
      await onSuccessAction();
    } catch (err: unknown) {
      console.error(
        "Failed to connect account:",
        err
      );

      let message =
        "We couldn't connect this account.";

      if (
        typeof err === "object" &&
        err !== null
      ) {
        const apiError =
          err as {
            detail?: string;
            non_field_errors?:
              string[];
          };

        if (apiError.detail) {
          message =
            apiError.detail;
        } else if (
          apiError
            .non_field_errors?.[0]
        ) {
          message =
            apiError
              .non_field_errors[0];
        }
      }

      setError(message);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/25 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Sparkles
                  size={17}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">
                  Connect an Account
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Choose a demo
                  institution to
                  simulate automatic
                  financial data sync.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={
                connecting
              }
              onClick={
                handleClose
              }
              aria-label="Close connect account modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="mb-5 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-blue-700"
              />

              <div>
                <p className="text-[11px] font-bold text-blue-900">
                  Demo connection
                </p>

                <p className="mt-1 text-[11px] leading-5 text-blue-700">
                  Aura is not
                  connecting to a real
                  bank in this version.
                  Sample financial data
                  will be generated by
                  the backend for
                  development and
                  portfolio
                  demonstration.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5">
                <p className="text-[12px] font-semibold text-red-600">
                  {error}
                </p>
              </div>
            )}

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a93a6]">
              Select Institution
            </p>

            <div className="space-y-3">
              {institutions.map(
                (
                  institution
                ) => (
                  <BankOptionCard
                    key={
                      institution.code
                    }
                    institution={
                      institution
                    }
                    selected={
                      selectedCode ===
                      institution.code
                    }
                    disabled={
                      connecting
                    }
                    onSelectAction={(
                      selected
                    ) => {
                      setSelectedCode(
                        selected.code
                      );

                      setError(
                        null
                      );
                    }}
                  />
                )
              )}
            </div>

            {institutions.length ===
              0 && (
              <div className="rounded-2xl border border-dashed border-[#dfe9fb] bg-[#f8faff] px-5 py-8 text-center">
                <p className="text-[12px] font-semibold text-[#565e74]">
                  No demo banks are
                  available yet.
                </p>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <button
              type="button"
              disabled={
                connecting
              }
              onClick={
                handleClose
              }
              className="h-10 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[11px] font-bold text-[#565e74] transition hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                connecting ||
                !selectedCode
              }
              onClick={
                handleConnect
              }
              className="inline-flex h-10 min-w-[145px] items-center justify-center gap-2 rounded-xl bg-black px-5 text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {connecting ? (
                <>
                  <LoaderCircle
                    size={14}
                    className="animate-spin"
                  />

                  Connecting...
                </>
              ) : (
                <>
                  <Sparkles
                    size={14}
                  />

                  Connect Demo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}