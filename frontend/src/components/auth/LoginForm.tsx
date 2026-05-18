"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, Eye, EyeOff } from "lucide-react";

import { loginUser } from "@/lib/api/authApi";
import { saveAuthData } from "@/lib/auth/tokenStorage";

type LoginErrors = {
  email?: string;
  password?: string;
  server?: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
      server: "",
    });
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      saveAuthData(data);
      if (data.user.is_onboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
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

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-4 text-[15px] outline-none transition focus:ring-2 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-[#c6c6cd] focus:border-emerald-500 focus:ring-emerald-100"
    }`;

  return (
    <div className="w-full max-w-[440px] rounded-3xl border border-[#d3e4fe]/50 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-black">
          Welcome Back
        </h1>

        <p className="text-[15px] leading-7 text-[#565e74]">
          Precision in financial autonomy starts here.
        </p>
      </div>

      {errors.server && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          <span>{errors.server}</span>
        </div>
      )}

      <form onSubmit={handleLogin} noValidate className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#565e74]">
            Email Address
          </label>

          <input
            name="email"
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            className={inputClass(Boolean(errors.email))}
          />

          {errors.email && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#565e74]">
              Password
            </label>

            <Link
              href="#"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={`${inputClass(Boolean(errors.password))} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#565e74] transition hover:text-black"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle size={14} />
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black py-4 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#565e74]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#565e74]/70">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-emerald-700" />
          Secure SSL Encryption
        </div>
        <div className="h-px w-12 bg-[#c6c6cd]" />
      </div>
    </div>
  );
}