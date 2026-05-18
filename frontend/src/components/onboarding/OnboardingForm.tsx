"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { completeOnboarding } from "@/lib/api/onboardingApi";
import CustomSelect from "@/components/ui/CustomSelect";

import OnboardingHeader from "./OnboardingHeader";
import OnboardingInfoCard from "./OnboardingInfoCard";
import OnboardingError from "./OnboardingError";
import MoneyInput from "./MoneyInput";
import SmallBudgetInput from "./SmallBudgetInput";
import PrioritySelector from "./PrioritySelector";
import OnboardingActions from "./OnboardingActions";

const currencyOptions = [
  { label: "INR - Indian Rupee", value: "INR" },
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "GBP - British Pound", value: "GBP" },
];

export default function OnboardingForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    currency: "INR",
    monthly_income: "",
    monthly_savings_target: "",
    spending_limit: "",
    housing_budget: "",
    groceries_budget: "",
    entertainment_budget: "",
    priorities: ["wealth_building"],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currencySymbol =
    form.currency === "INR"
      ? "₹"
      : form.currency === "USD"
      ? "$"
      : form.currency === "EUR"
      ? "€"
      : "£";

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });

    setError("");
  };

  const togglePriority = (value: string) => {
    const exists = form.priorities.includes(value);

    setForm({
      ...form,
      priorities: exists
        ? form.priorities.filter((item) => item !== value)
        : [...form.priorities, value],
    });
  };

  const validateForm = () => {
    if (!form.monthly_income || Number(form.monthly_income) <= 0) {
      return "Monthly income is required.";
    }

    if (
      !form.monthly_savings_target ||
      Number(form.monthly_savings_target) < 0
    ) {
      return "Monthly savings target is required.";
    }

    if (!form.spending_limit || Number(form.spending_limit) <= 0) {
      return "General spending limit is required.";
    }

    if (form.priorities.length === 0) {
      return "Please select at least one financial priority.";
    }

    return "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await completeOnboarding(form);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.detail ||
          err?.monthly_income?.[0] ||
          err?.currency?.[0] ||
          "Failed to complete onboarding."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-[800px] flex-col items-center">
      <OnboardingHeader />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-8 rounded-3xl border border-[#d3e4fe]/50 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] md:p-10"
      >
        <OnboardingInfoCard />

        <OnboardingError error={error} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-sm text-[#565e74]">
              Preferred Currency
            </label>

            <CustomSelect
              name="currency"
              value={form.currency}
              options={currencyOptions}
              onChangeAction={handleSelectChange}
            />
          </div>

          <MoneyInput
            label="Monthly Income"
            name="monthly_income"
            value={form.monthly_income}
            symbol={currencySymbol}
            placeholder="50000"
            onChange={handleChange}
          />

          <MoneyInput
            label="Monthly Savings Target"
            name="monthly_savings_target"
            value={form.monthly_savings_target}
            symbol={currencySymbol}
            placeholder="10000"
            onChange={handleChange}
          />

          <MoneyInput
            label="General Spending Limit"
            name="spending_limit"
            value={form.spending_limit}
            symbol={currencySymbol}
            placeholder="30000"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-3">
          <label className="ml-1 text-sm text-[#565e74]">
            Category-Specific Goals Optional
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SmallBudgetInput
              label="Housing"
              name="housing_budget"
              value={form.housing_budget}
              onChange={handleChange}
              symbol={currencySymbol}
              placeholder="12000"
            />

            <SmallBudgetInput
              label="Groceries"
              name="groceries_budget"
              value={form.groceries_budget}
              onChange={handleChange}
              symbol={currencySymbol}
              placeholder="6000"
            />

            <SmallBudgetInput
              label="Entertainment"
              name="entertainment_budget"
              value={form.entertainment_budget}
              onChange={handleChange}
              symbol={currencySymbol}
              placeholder="3000"
            />
          </div>
        </div>

        <PrioritySelector
          selectedPriorities={form.priorities}
          onToggleAction={togglePriority}
        />

        <OnboardingActions
          loading={loading}
          onSkipAction={() => router.push("/dashboard")}
        />
      </form>
    </div>
  );
}