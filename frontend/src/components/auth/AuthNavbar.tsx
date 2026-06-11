"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthNavbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#d3e4fe]/60 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Link href="/" className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-black to-[#1f2937] text-white shadow-sm">
          <Sparkles size={15} />
        </div>

        <div className="min-w-0 leading-tight">
          <h1 className="truncate text-[15px] font-bold tracking-tight text-black sm:text-lg">
            Aura Finance
          </h1>

          <p className="hidden text-[10px] font-semibold tracking-wide text-[#7c839b] xs:block sm:hidden">
            AI Finance Workspace
          </p>
        </div>
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        <Link
          href="#"
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          Features
        </Link>

        <Link
          href="#"
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          How it Works
        </Link>

        <Link
          href="#"
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          Pricing
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <Link
          href="/auth/login"
          className="text-[12px] font-semibold text-[#45464d] transition hover:text-black sm:text-[13px]"
        >
          Login
        </Link>

        <Link
          href="/auth/signup"
          className="rounded-xl bg-black px-3 py-2 text-[12px] font-semibold text-white transition hover:scale-[0.98] sm:px-4 sm:text-[13px]"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}