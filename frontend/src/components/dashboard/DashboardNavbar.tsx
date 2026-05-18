"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#d3e4fe]/60 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-black">
          Aura Finance
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <Link href="/dashboard" className="border-b-2 border-emerald-700 pb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Portfolio
          </Link>

          <Link href="/transactions" className="text-xs font-semibold uppercase tracking-wide text-[#45464d] transition hover:text-emerald-700">
            Transactions
          </Link>

          <Link href="/insights" className="text-xs font-semibold uppercase tracking-wide text-[#45464d] transition hover:text-emerald-700">
            Insights
          </Link>

          <Link href="/settings" className="text-xs font-semibold uppercase tracking-wide text-[#45464d] transition hover:text-emerald-700">
            Settings
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden text-xs font-semibold uppercase tracking-wide text-[#45464d] transition hover:text-emerald-700 sm:block">
            Support
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c6c6cd] bg-[#dce9ff] text-black">
            <User size={18} />
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-[#c6c6cd] p-2 text-[#45464d] transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </nav>
    </header>
  );
}