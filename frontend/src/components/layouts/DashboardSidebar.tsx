"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  ReceiptText,
  Tags,
  Lightbulb,
  WalletCards,
  CreditCard,
  Target,
  CalendarDays,
  BarChart3,
  FolderOpen,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

type DashboardSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpenAction: (value: boolean) => void;
  sidebarCollapsed: boolean;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Uploads", href: "/uploads", icon: Upload },
  { label: "Transactions", href: "/transactions", icon: ReceiptText },
  { label: "Categories", href: "/categories", icon: Tags },
  { label: "AI Chat", href: "/chat", icon: MessageCircle },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Budgets", href: "/budgets", icon: WalletCards },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Subscriptions", href: "/subscriptions", icon: CalendarDays },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "File History", href: "/history", icon: FolderOpen },
];

const bottomItems = [
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpenAction,
  sidebarCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSidebarLinkClick = () => {
    if (sidebarOpen) {
      setSidebarOpenAction(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/auth/login");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpenAction(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#c6c6cd]/50 bg-[#eff4ff] py-4 pl-3 pr-2 transition-all duration-300 md:z-40 ${
          sidebarCollapsed ? "md:w-[76px]" : "md:w-[248px]"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } w-64`}
      >
        <div className="mb-5 flex shrink-0 items-center justify-between px-2">
          <Link
            href="/dashboard"
            onClick={handleSidebarLinkClick}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              <Sparkles size={16} />
            </div>

            {!sidebarCollapsed && (
              <div>
                <h1 className="text-[15px] font-bold tracking-tight text-black">
                  Aura Finance
                </h1>

                <p className="text-[11px] font-semibold text-[#565e74]">
                  Intelligent Wealth
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarOpenAction(false)}
            className="rounded-lg p-2 text-[#565e74] transition hover:bg-[#dce9ff] hover:text-black md:hidden"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="sidebar-scroll flex-1 space-y-[2px] overflow-y-auto pr-[2px]">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleSidebarLinkClick}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  active
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-[#45464d] hover:bg-[#dce9ff] hover:text-black"
                }`}
              >
                <Icon size={17} className="shrink-0" />

                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 shrink-0 border-t border-[#c6c6cd]/50 pt-3">
          {!sidebarCollapsed && (
            <button className="mb-3 w-full rounded-lg bg-black px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90 active:scale-[0.99]">
              Upgrade Plan
            </button>
          )}

          <div className="space-y-[2px]">
            {bottomItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleSidebarLinkClick}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200 ${
                    active
                      ? "bg-emerald-100 text-emerald-800"
                      : "text-[#45464d] hover:bg-[#dce9ff] hover:text-black"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />

                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
            >
              <LogOut size={16} className="shrink-0" />

              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}