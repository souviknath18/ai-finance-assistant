"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#d3e4fe]/60 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
          <Sparkles size={16} />
        </div>

        <h1 className="text-lg font-bold tracking-tight text-black">
          Aura Finance
        </h1>
      </Link>

      <div className="hidden items-center gap-7 md:flex">
        <a
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          Features
        </a>

        <a
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          How it Works
        </a>

        <a
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          Pricing
        </a>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <Link
          href="/auth/login"
          className="text-[13px] font-medium text-[#45464d] transition hover:text-black"
        >
          Login
        </Link>

        <Link
          href="/auth/signup"
          className="rounded-xl bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:scale-[0.98]"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}