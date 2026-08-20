"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Landmark,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import type {
  BankInstitution,
} from "@/types/account";

type DemoAccountSetupProps = {
  institution: BankInstitution;

  consentAccepted: boolean;

  onConsentChangeAction: (
    value: boolean
  ) => void;

  onBackAction: () => void;
};

export default function DemoAccountSetup({
  institution,
  consentAccepted,
  onConsentChangeAction,
  onBackAction,
}: DemoAccountSetupProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBackAction}
        className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold text-[#667085] transition hover:text-black"
      >
        <ArrowLeft size={13} />

        Choose another bank
      </button>

      <div className="rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
            <Landmark size={18} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
              Demo Account
            </p>

            <h3 className="mt-1 text-[16px] font-bold text-black">
              {institution.name}
            </h3>

            <p className="mt-1 text-[11px] text-[#7c839b]">
              Review the simulated account
              before connecting.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AccountDetail
            label="Account"
            value={
              institution.demo_account_name
            }
          />

          <AccountDetail
            label="Account Type"
            value={
              institution.demo_account_type
            }
          />

          <AccountDetail
            label="Account Number"
            value={`•••• ${institution.demo_masked_account_number}`}
          />

          <AccountDetail
            label="Currency"
            value={
              institution.demo_currency
            }
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
        <ShieldCheck
          size={17}
          className="mt-0.5 shrink-0 text-blue-700"
        />

        <div>
          <p className="text-[11px] font-bold text-blue-900">
            No real banking credentials
          </p>

          <p className="mt-1 text-[11px] leading-5 text-blue-700">
            This connection uses simulated
            financial data. Aura will not ask
            for your net-banking password,
            OTP, UPI PIN, card PIN, or CVV.
          </p>
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e6edf9] bg-white p-4 transition hover:border-emerald-200">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(event) =>
            onConsentChangeAction(
              event.target.checked
            )
          }
          className="mt-0.5 h-4 w-4 accent-emerald-600"
        />

        <div>
          <p className="text-[11px] font-bold text-[#0b1c30]">
            I understand this is a demo
            connection
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#7c839b]">
            Aura will create a simulated
            account and use sample
            transaction data for this demo.
          </p>
        </div>
      </label>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f8faff] px-3 py-2.5">
        <LockKeyhole
          size={13}
          className="mt-0.5 shrink-0 text-[#667085]"
        />

        <p className="text-[10px] leading-5 text-[#667085]">
          Real banking integrations should use
          a secure consent-based financial-data
          provider rather than collecting bank
          credentials directly inside Aura.
        </p>
      </div>
    </div>
  );
}

function AccountDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-white p-3.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <CheckCircle2
          size={12}
          className="shrink-0 text-emerald-600"
        />

        <p className="text-[12px] font-semibold text-[#334155]">
          {value}
        </p>
      </div>
    </div>
  );
}