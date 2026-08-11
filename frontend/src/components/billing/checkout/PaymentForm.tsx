"use client";

import { useState } from "react";
import {
  CreditCard,
  Loader2,
} from "lucide-react";

import PaymentCardIcons from "./PaymentCardIcons";
import PromoCodeSection from "./PromoCodeSection";

export default function PaymentForm() {
  const [loading, setLoading] =
    useState(false);

  const [
    cardNumber,
    setCardNumber,
  ] = useState("");

  const formatCardNumber = (
    value: string
  ) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      alert(
        "Success! Your account has been upgraded to Aura Elite."
      );
    }, 1500);
  };

  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-black">
            Payment Details
          </h2>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            Enter your payment information to complete the upgrade.
          </p>
        </div>

        <PaymentCardIcons />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Field label="Cardholder Name">
          <input
            required
            type="text"
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>

        <Field label="Card Number">
          <div className="relative">
            <input
              required
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(event) =>
                setCardNumber(
                  formatCardNumber(
                    event.target.value
                  )
                )
              }
              placeholder="0000 0000 0000 0000"
              className={`${inputClass} pr-10`}
            />

            <CreditCard
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565e74]"
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Expiry Date">
            <input
              required
              type="text"
              placeholder="MM / YY"
              className={inputClass}
            />
          </Field>

          <Field label="CVV">
            <input
              required
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="•••"
              className={inputClass}
            />
          </Field>
        </div>

        <PromoCodeSection />

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <Loader2
              size={15}
              className="animate-spin"
            />
          )}

          {loading
            ? "Processing..."
            : "Complete Upgrade"}
        </button>
      </form>

      <div className="mt-5 grid grid-cols-1 gap-2 border-t border-[#edf2fb] pt-4 sm:grid-cols-2">
        <SecureText label="SSL Secure Payment" />
        <SecureText label="PCI DSS Compliant" />
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3.5 text-[12px] text-[#0b1c30] outline-none transition placeholder:text-[#8a92a5] hover:border-[#c9d9f3] focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[#565e74]">
        {label}
      </span>

      {children}
    </label>
  );
}

function SecureText({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-medium text-[#7c839b]">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {label}
    </div>
  );
}