"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Brain,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { signupUser } from "@/lib/api/authApi";
import { saveAuthData } from "@/lib/auth/tokenStorage";

type FormErrors = {
  full_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  server?: string;
};

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = useMemo(
    () => ({
      minLength: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      lowercase: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[^A-Za-z0-9]/.test(form.password),
    }),
    [form.password]
  );

  const passwordScore = Object.values(passwordRules).filter(Boolean).length;

  const passwordStrength =
    form.password.length === 0
      ? {
          label: "",
          width: "w-0",
          color: "bg-transparent",
          textColor: "text-[#565e74]",
        }
      : passwordScore <= 2
      ? {
          label: "Weak",
          width: "w-1/3",
          color: "bg-red-500",
          textColor: "text-red-600",
        }
      : passwordScore <= 4
      ? {
          label: "Medium",
          width: "w-2/3",
          color: "bg-yellow-500",
          textColor: "text-yellow-600",
        }
      : {
          label: "Strong",
          width: "w-full",
          color: "bg-emerald-500",
          textColor: "text-emerald-600",
        };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required.";
    } else if (form.full_name.trim().length < 3) {
      newErrors.full_name = "Full name must be at least 3 characters.";
    } else if (!nameRegex.test(form.full_name.trim())) {
      newErrors.full_name = "Full name can contain only letters and spaces.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (passwordScore < 4) {
      newErrors.password =
        "Password is too weak. Use uppercase, lowercase, number, and special character.";
    }

    if (!form.confirm_password) {
      newErrors.confirm_password = "Confirm password is required.";
    } else if (form.password !== form.confirm_password) {
      newErrors.confirm_password = "Password and confirm password do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getBackendErrorMessage = (err: any) => {
    if (err?.email?.[0]) return err.email[0];
    if (err?.full_name?.[0]) return err.full_name[0];
    if (err?.password?.[0]) return err.password[0];
    if (err?.confirm_password?.[0]) return err.confirm_password[0];
    if (err?.detail) return err.detail;

    return "Signup failed. Please check your details and try again.";
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

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await signupUser({
        ...form,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
      });

      saveAuthData(data);
      router.push("/onboarding");
    } catch (err: any) {
      setErrors({
        server: getBackendErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-[#eff4ff] px-4 py-3.5 text-[15px] outline-none transition focus:ring-2 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-[#c6c6cd] focus:border-emerald-500 focus:ring-emerald-100"
    }`;

  return (
    <div className="w-full max-w-[500px] rounded-3xl border border-[#d3e4fe]/50 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-black">
          Join Aura Finance
        </h1>

        <p className="text-[15px] leading-7 text-[#565e74]">
          Step into the future of precision wealth management.
        </p>
      </div>

      <form onSubmit={handleSignup} noValidate className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#565e74]">
            Full Name
          </label>

          <div className="relative">
            <input
              name="full_name"
              type="text"
              placeholder="John Doe"
              value={form.full_name}
              onChange={handleChange}
              className={`${inputClass(Boolean(errors.full_name))} pr-12`}
            />

            {form.full_name.length > 2 && !errors.full_name && (
              <CheckCircle2
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500"
              />
            )}
          </div>

          {errors.full_name && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle size={14} />
              {errors.full_name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#565e74]">
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
          <label className="text-sm font-medium text-[#565e74]">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

          {form.password.length > 0 && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#dce9ff]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.color}`}
                />
              </div>

              <p
                className={`text-xs font-semibold ${passwordStrength.textColor}`}
              >
                Password strength: {passwordStrength.label}
              </p>

              <div className="grid grid-cols-1 gap-1 text-xs text-[#565e74]">
                <p className={passwordRules.minLength ? "text-emerald-600" : ""}>
                  {passwordRules.minLength ? "✓" : "•"} Minimum 8 characters
                </p>
                <p className={passwordRules.uppercase ? "text-emerald-600" : ""}>
                  {passwordRules.uppercase ? "✓" : "•"} One uppercase letter
                </p>
                <p className={passwordRules.lowercase ? "text-emerald-600" : ""}>
                  {passwordRules.lowercase ? "✓" : "•"} One lowercase letter
                </p>
                <p className={passwordRules.number ? "text-emerald-600" : ""}>
                  {passwordRules.number ? "✓" : "•"} One number
                </p>
                <p className={passwordRules.special ? "text-emerald-600" : ""}>
                  {passwordRules.special ? "✓" : "•"} One special character
                </p>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="flex items-start gap-1 text-xs font-medium text-red-500">
              <AlertCircle size={14} className="mt-[1px]" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#565e74]">
            Confirm Password
          </label>

          <div className="relative">
            <input
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={handleChange}
              className={`${inputClass(Boolean(errors.confirm_password))} pr-12`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#565e74] transition hover:text-black"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {form.confirm_password.length > 0 &&
            form.password === form.confirm_password &&
            !errors.confirm_password && (
              <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={14} />
                Passwords match.
              </p>
            )}

          {errors.confirm_password && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle size={14} />
              {errors.confirm_password}
            </p>
          )}
        </div>

        {errors.server && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={16} />
            {errors.server}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-emerald-300/50 bg-gradient-to-br from-white to-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Brain size={18} />
            </div>

            <div>
              <h3 className="mb-1 text-sm font-bold text-black">
                Smart AI Onboarding
              </h3>

              <p className="text-xs leading-6 text-[#565e74]">
                Your account will be optimized by our AI engine for instant
                financial insights after setup.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-black py-4 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#565e74]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#d3e4fe]/60 pt-6 text-xs text-[#565e74]">
        <Lock size={14} />
        Secure SSL Encryption
      </div>
    </div>
  );
}