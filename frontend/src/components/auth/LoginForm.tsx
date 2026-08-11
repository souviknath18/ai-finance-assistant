"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import {
  loginUser,
} from "@/lib/api/authApi";

import {
  saveAuthData,
} from "@/lib/auth/tokenStorage";

type LoginErrors = {
  email?: string;
  password?: string;
  server?: string;
};

export default function LoginForm() {
  const router =
    useRouter();

  const [
    form,
    setForm,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    errors,
    setErrors,
  ] = useState<LoginErrors>({});

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const validateForm = () => {
    const newErrors: LoginErrors = {};

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
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

  const handleLogin = async (
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
        await loginUser({
          email:
            form.email
              .trim()
              .toLowerCase(),
          password:
            form.password,
        });

      saveAuthData(data);

      if (
        data.user.is_onboarded
      ) {
        router.push(
          "/dashboard"
        );
      } else {
        router.push(
          "/onboarding"
        );
      }
    } catch (err: any) {
      setErrors({
        server:
          err?.detail ||
          err?.email?.[0] ||
          err?.password?.[0] ||
          "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (
    hasError?: boolean
  ) =>
    `h-11 w-full rounded-xl border bg-white px-3.5 text-[13px] text-[#0b1c30] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#8a92a5] ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
    }`;

  return (
    <div className="w-full max-w-[400px] rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-bold tracking-tight text-black sm:text-[28px]">
          Welcome Back
        </h1>

        <p className="mt-2 text-[12px] leading-5 text-[#565e74]">
          Sign in to continue to your
          Aura Finance workspace.
        </p>
      </div>

      {/* Server Error */}
      {errors.server && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-[12px] leading-5 text-red-700">
          <AlertCircle
            size={15}
            className="mt-0.5 shrink-0"
          />

          <span>
            {errors.server}
          </span>
        </div>
      )}

      <form
        onSubmit={handleLogin}
        noValidate
        className="space-y-4"
      >
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
            value={form.email}
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

              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
              Password
            </label>

            <Link
              href="#"
              className="text-[10px] font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Enter your password"
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

          {errors.password && (
            <p className="flex items-center gap-1 text-[10px] font-medium text-red-500">
              <AlertCircle
                size={12}
              />

              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      {/* Signup */}
      <div className="mt-5 text-center">
        <p className="text-[12px] text-[#565e74]">
          Don&apos;t have an
          account?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-emerald-700 transition hover:text-emerald-800 hover:underline"
          >
            Sign Up
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