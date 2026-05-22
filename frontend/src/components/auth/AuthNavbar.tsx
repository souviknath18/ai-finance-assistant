"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthNavbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-16 sm:h-20 w-full items-center justify-between border-b border-[#d3e4fe]/60 bg-white/80 px-4 sm:px-6 backdrop-blur-xl lg:px-12">
      
      {/* LOGO */}
      <div className="flex items-center gap-2 sm:gap-3">

        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-black text-white">
          <Sparkles
            size={16}
            className="sm:h-[18px] sm:w-[18px]"
          />
        </div>

        <h1 className="text-[17px] sm:text-xl font-bold tracking-tight">
          Aura Finance
        </h1>

      </div>

      {/* CENTER NAV */}
      <div className="hidden items-center gap-10 md:flex">

        <Link
          href="#"
          className="text-sm font-medium text-[#45464d] transition hover:text-black"
        >
          Features
        </Link>

        <Link
          href="#"
          className="text-sm font-medium text-[#45464d] transition hover:text-black"
        >
          How it Works
        </Link>

        <Link
          href="#"
          className="text-sm font-medium text-[#45464d] transition hover:text-black"
        >
          Pricing
        </Link>

      </div>

      {/* AUTH BUTTONS */}
      <div className="flex items-center gap-2 sm:gap-4">

        <Link
          href="/auth/login"
          className="text-[13px] sm:text-sm font-medium text-[#45464d] transition hover:text-black"
        >
          Login
        </Link>

        <Link
          href="/auth/signup"
          className="rounded-lg sm:rounded-xl bg-black px-3 sm:px-5 py-2 sm:py-2.5 text-[13px] sm:text-sm font-semibold text-white transition hover:scale-[0.98]"
        >
          Sign Up
        </Link>

      </div>
    </nav>
  );
}