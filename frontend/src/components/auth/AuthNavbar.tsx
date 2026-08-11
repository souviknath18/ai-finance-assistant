"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const navLinks = [
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "How it Works",
    href: "/#how-it-works",
  },
  {
    label: "Security",
    href: "/#security",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

export default function AuthNavbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-14 w-full items-center border-b border-[#e6edf9] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          aria-label="Aura Finance home"
          className="group flex min-w-0 items-center gap-2.5"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.10)]">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-emerald-900/50" />

            <Sparkles
              size={14}
              className="relative z-10"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-[14px] font-bold tracking-tight text-black sm:text-[15px]">
              Aura Finance
            </h1>

            <p className="hidden text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7c839b] xs:block sm:hidden">
              AI Finance Workspace
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-[12px] font-semibold text-[#565e74] transition-[background-color,color] duration-200 hover:bg-[#f8faff] hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/auth/login"
            className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-[11px] font-bold text-[#45464d] transition-[background-color,color] duration-200 hover:bg-[#f8faff] hover:text-black sm:px-4 sm:text-[12px]"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-black px-3.5 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(15,23,42,0.10)] transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.14)] sm:px-4 sm:text-[12px]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}