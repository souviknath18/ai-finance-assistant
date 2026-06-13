"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import PaymentCardIcons from "./PaymentCardIcons";
import PromoCodeSection from "./PromoCodeSection";

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Success! Your account has been upgraded to Aura Elite.");
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-black">Payment Details</h2>
        <PaymentCardIcons />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              value={cardNumber}
              onChange={(event) =>
                setCardNumber(formatCardNumber(event.target.value))
              }
              placeholder="0000 0000 0000 0000"
              className={`${inputClass} pr-10`}
            />

            <CreditCard
              size={17}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565e74]"
            />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-4">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Processing..." : "Complete Upgrade"}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#e5eeff] pt-4 sm:grid-cols-2">
        <SecureText label="SSL Secure Payment" />
        <SecureText label="PCI DSS Compliant" />
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3.5 py-3 text-[13px] text-black outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </span>

      {children}
    </label>
  );
}

function SecureText({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#565e74]">
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
      {label}
    </div>
  );
}