"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  completeOnboarding,
} from "@/lib/api/onboardingApi";

import CustomSelect from "@/components/ui/CustomSelect";

import OnboardingHeader from "./OnboardingHeader";
import OnboardingError from "./OnboardingError";
import MoneyInput from "./MoneyInput";
import SmallBudgetInput from "./SmallBudgetInput";
import PrioritySelector from "./PrioritySelector";
import OnboardingActions from "./OnboardingActions";

const currencyOptions = [
  {
    label: "INR - Indian Rupee",
    value: "INR",
  },
  {
    label: "USD - US Dollar",
    value: "USD",
  },
  {
    label: "EUR - Euro",
    value: "EUR",
  },
  {
    label: "GBP - British Pound",
    value: "GBP",
  },
];

export default function OnboardingForm() {
  const router =
    useRouter();

  const [
    form,
    setForm,
  ] = useState({
    currency: "INR",
    monthly_income: "",
    monthly_savings_target: "",
    spending_limit: "",
    housing_budget: "",
    groceries_budget: "",
    entertainment_budget: "",
    priorities: [
      "wealth_building",
    ],
  });

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const currencySymbol =
    form.currency === "INR"
      ? "₹"
      : form.currency === "USD"
        ? "$"
        : form.currency === "EUR"
          ? "€"
          : "£";

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]:
        event.target.value,
    }));

    setError("");
  };

  const handleSelectChange = (
    name: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const togglePriority = (
    value: string
  ) => {
    setForm((prev) => {
      const exists =
        prev.priorities.includes(
          value
        );

      return {
        ...prev,
        priorities: exists
          ? prev.priorities.filter(
              (item) =>
                item !== value
            )
          : [
              ...prev.priorities,
              value,
            ],
      };
    });

    setError("");
  };

  const validateForm = () => {
    if (
      !form.monthly_income ||
      Number(
        form.monthly_income
      ) <= 0
    ) {
      return "Monthly income is required.";
    }

    if (
      !form.monthly_savings_target ||
      Number(
        form.monthly_savings_target
      ) < 0
    ) {
      return "Monthly savings target is required.";
    }

    if (
      !form.spending_limit ||
      Number(
        form.spending_limit
      ) <= 0
    ) {
      return "General spending limit is required.";
    }

    if (
      form.priorities.length === 0
    ) {
      return "Please select at least one financial priority.";
    }

    return "";
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      await completeOnboarding(
        form
      );

      router.push(
        "/dashboard"
      );
    } catch (err: any) {
      setError(
        err?.detail ||
          err
            ?.monthly_income?.[0] ||
          err?.currency?.[0] ||
          "Failed to complete onboarding."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <OnboardingHeader />

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-6 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-6 lg:p-7"
      >
        <OnboardingError
          error={error}
        />

        {/* Financial Profile */}
        <section
          className={
            error
              ? "mt-5"
              : ""
          }
        >
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
              Financial Profile
            </p>

            <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
              Monthly Overview
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              These values help Aura understand your cash flow and recommend
              realistic targets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Currency */}
            <div className="space-y-1.5">
              <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
                Preferred Currency
              </label>

              <CustomSelect
                name="currency"
                value={
                  form.currency
                }
                options={
                  currencyOptions
                }
                onChangeAction={
                  handleSelectChange
                }
              />
            </div>

            <MoneyInput
              label="Monthly Income"
              name="monthly_income"
              value={
                form.monthly_income
              }
              symbol={
                currencySymbol
              }
              placeholder="50000"
              onChange={
                handleChange
              }
            />

            <MoneyInput
              label="Monthly Savings Target"
              name="monthly_savings_target"
              value={
                form.monthly_savings_target
              }
              symbol={
                currencySymbol
              }
              placeholder="10000"
              onChange={
                handleChange
              }
            />

            <MoneyInput
              label="General Spending Limit"
              name="spending_limit"
              value={
                form.spending_limit
              }
              symbol={
                currencySymbol
              }
              placeholder="30000"
              onChange={
                handleChange
              }
            />
          </div>
        </section>

        {/* Divider */}
        <div className="my-6 h-px bg-[#edf2fb]" />

        {/* Category Budgets */}
        <section>
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                Category Budgets
              </p>

              <span className="rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2 py-0.5 text-[9px] font-bold text-[#7c839b]">
                Optional
              </span>
            </div>

            <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
              Set Category Targets
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Add rough monthly limits now. You can change these later from
              Budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SmallBudgetInput
              label="Housing"
              name="housing_budget"
              value={
                form.housing_budget
              }
              onChange={
                handleChange
              }
              symbol={
                currencySymbol
              }
              placeholder="12000"
            />

            <SmallBudgetInput
              label="Groceries"
              name="groceries_budget"
              value={
                form.groceries_budget
              }
              onChange={
                handleChange
              }
              symbol={
                currencySymbol
              }
              placeholder="6000"
            />

            <SmallBudgetInput
              label="Entertainment"
              name="entertainment_budget"
              value={
                form.entertainment_budget
              }
              onChange={
                handleChange
              }
              symbol={
                currencySymbol
              }
              placeholder="3000"
            />
          </div>
        </section>

        {/* Divider */}
        <div className="my-6 h-px bg-[#edf2fb]" />

        {/* Financial Priorities */}
        <PrioritySelector
          selectedPriorities={
            form.priorities
          }
          onToggleAction={
            togglePriority
          }
        />

        {/* Actions */}
        <OnboardingActions
          loading={
            loading
          }
          onSkipAction={() =>
            router.push(
              "/dashboard"
            )
          }
        />
      </form>
    </div>
  );
}