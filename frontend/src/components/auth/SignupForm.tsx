"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import {
  signupUser,
} from "@/lib/api/authApi";

import {
  saveAuthData,
} from "@/lib/auth/tokenStorage";

type FormErrors = {
  full_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  server?: string;
};

export default function SignupForm() {
  const router =
    useRouter();

  const [
    form,
    setForm,
  ] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const passwordRules =
    useMemo(
      () => ({
        minLength:
          form.password.length >= 8,

        uppercase:
          /[A-Z]/.test(
            form.password
          ),

        lowercase:
          /[a-z]/.test(
            form.password
          ),

        number:
          /[0-9]/.test(
            form.password
          ),

        special:
          /[^A-Za-z0-9]/.test(
            form.password
          ),
      }),
      [form.password]
    );

  const passwordScore =
    Object.values(
      passwordRules
    ).filter(Boolean).length;

  const passwordStrength =
    form.password.length === 0
      ? {
          label: "",
          width: "w-0",
          color:
            "bg-transparent",
          textColor:
            "text-[#565e74]",
        }
      : passwordScore <= 2
        ? {
            label: "Weak",
            width: "w-1/3",
            color:
              "bg-red-500",
            textColor:
              "text-red-600",
          }
        : passwordScore <= 4
          ? {
              label: "Medium",
              width: "w-2/3",
              color:
                "bg-amber-400",
              textColor:
                "text-amber-600",
            }
          : {
              label: "Strong",
              width: "w-full",
              color:
                "bg-emerald-500",
              textColor:
                "text-emerald-600",
            };

  const validateForm = () => {
    const newErrors: FormErrors =
      {};

    const nameRegex =
      /^[A-Za-z\s]+$/;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.full_name.trim()) {
      newErrors.full_name =
        "Full name is required.";
    } else if (
      form.full_name.trim()
        .length < 3
    ) {
      newErrors.full_name =
        "Full name must be at least 3 characters.";
    } else if (
      !nameRegex.test(
        form.full_name.trim()
      )
    ) {
      newErrors.full_name =
        "Full name can contain only letters and spaces.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !emailRegex.test(
        form.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      form.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters.";
    } else if (
      passwordScore < 4
    ) {
      newErrors.password =
        "Password is too weak. Use uppercase, lowercase, number, and special character.";
    }

    if (
      !form.confirm_password
    ) {
      newErrors.confirm_password =
        "Confirm password is required.";
    } else if (
      form.password !==
      form.confirm_password
    ) {
      newErrors.confirm_password =
        "Password and confirm password do not match.";
    }

    setErrors(
      newErrors
    );

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  const getBackendErrorMessage = (
    err: any
  ) => {
    if (err?.email?.[0]) {
      return err.email[0];
    }

    if (
      err?.full_name?.[0]
    ) {
      return err.full_name[0];
    }

    if (
      err?.password?.[0]
    ) {
      return err.password[0];
    }

    if (
      err?.confirm_password?.[0]
    ) {
      return err
        .confirm_password[0];
    }

    if (err?.detail) {
      return err.detail;
    }

    return "Signup failed. Please check your details and try again.";
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      server: "",
    }));
  };

  const handleSignup = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data =
        await signupUser({
          ...form,

          full_name:
            form.full_name.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),
        });

      saveAuthData(data);

      router.push(
        "/onboarding"
      );
    } catch (err: any) {
      setErrors({
        server:
          getBackendErrorMessage(
            err
          ),
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (
    hasError?: boolean
  ) =>
    `h-11 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#0b1c30] outline-none transition-[border-color,box-shadow] placeholder:text-[#8a92a5] ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
    }`;

  return (
    <div className="w-full max-w-[440px] rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-bold tracking-tight text-black sm:text-[28px]">
          Join Aura Finance
        </h1>

        <p className="mt-2 text-[12px] leading-5 text-[#565e74]">
          Create your account and
          start building a smarter
          financial workspace.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={
          handleSignup
        }
        noValidate
        className="space-y-4"
      >
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
            Full Name
          </label>

          <div className="relative">
            <input
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={
                form.full_name
              }
              onChange={
                handleChange
              }
              className={`${inputClass(
                Boolean(
                  errors.full_name
                )
              )} pr-10`}
            />

            {form.full_name
              .length > 2 &&
              !errors.full_name && (
                <CheckCircle2
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                />
              )}
          </div>

          {errors.full_name && (
            <p className="flex items-center gap-1 text-[10px] font-medium text-red-500">
              <AlertCircle
                size={12}
              />

              {
                errors.full_name
              }
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
            Email Address
          </label>

          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            className={inputClass(
              Boolean(
                errors.email
              )
            )}
          />

          {errors.email && (
            <p className="flex items-center gap-1 text-[10px] font-medium text-red-500">
              <AlertCircle
                size={12}
              />

              {
                errors.email
              }
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="••••••••"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              className={`${inputClass(
                Boolean(
                  errors.password
                )
              )} pr-10`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) =>
                    !prev
                )
              }
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#7c839b] transition hover:bg-[#f8f9ff] hover:text-black"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff
                  size={15}
                />
              ) : (
                <Eye
                  size={15}
                />
              )}
            </button>
          </div>

          {/* Password strength */}
          {form.password
            .length > 0 && (
            <div className="space-y-1.5 pt-0.5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.color}`}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-[#7c839b]">
                  Password
                  strength
                </p>

                <p
                  className={`text-[10px] font-bold ${passwordStrength.textColor}`}
                >
                  {
                    passwordStrength.label
                  }
                </p>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="flex items-start gap-1 text-[10px] font-medium leading-4 text-red-500">
              <AlertCircle
                size={12}
                className="mt-0.5 shrink-0"
              />

              {
                errors.password
              }
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
            Confirm Password
          </label>

          <div className="relative">
            <input
              name="confirm_password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="••••••••"
              value={
                form.confirm_password
              }
              onChange={
                handleChange
              }
              className={`${inputClass(
                Boolean(
                  errors.confirm_password
                )
              )} pr-10`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) =>
                    !prev
                )
              }
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#7c839b] transition hover:bg-[#f8f9ff] hover:text-black"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={15}
                />
              ) : (
                <Eye
                  size={15}
                />
              )}
            </button>
          </div>

          {form.confirm_password
            .length > 0 &&
            form.password ===
              form.confirm_password &&
            !errors.confirm_password && (
              <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                <CheckCircle2
                  size={12}
                />

                Passwords match.
              </p>
            )}

          {errors.confirm_password && (
            <p className="flex items-center gap-1 text-[10px] font-medium text-red-500">
              <AlertCircle
                size={12}
              />

              {
                errors.confirm_password
              }
            </p>
          )}
        </div>

        {/* Server Error */}
        {errors.server && (
          <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-[12px] leading-5 text-red-700">
            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0"
            />

            <span>
              {
                errors.server
              }
            </span>
          </div>
        )}

        {/* AI Onboarding */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
              <Brain
                size={14}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
                Smart AI
                Onboarding
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                Aura will
                personalize your
                workspace during
                setup to generate
                more relevant
                financial
                insights.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            loading
          }
          className="flex h-11 w-full items-center justify-center rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      {/* Login */}
      <div className="mt-5 text-center">
        <p className="text-[12px] text-[#565e74]">
          Already have an
          account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-emerald-700 transition hover:text-emerald-800 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Security */}
      <div className="mt-5 border-t border-[#edf2fb] pt-4">
        <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
          <Lock
            size={11}
            className="text-emerald-700"
          />

          Secure SSL Encryption
        </div>
      </div>
    </div>
  );
}