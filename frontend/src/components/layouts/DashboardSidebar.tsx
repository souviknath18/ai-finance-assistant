"use client";

import { useEffect } from "react";
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

const tooltipClassName =
  "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[100] -translate-y-1/2 translate-x-0 whitespace-nowrap rounded-lg border border-[#dfe9fb] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0b1c30] opacity-0 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100";

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpenAction,
  sidebarCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const showLabels = sidebarOpen || !sidebarCollapsed;
  const showCollapsedTooltip = sidebarCollapsed && !sidebarOpen;

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

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
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col overflow-visible border-r border-[#dfe9fb] bg-[#eff4ff] py-4 pl-3 pr-2 transition-all duration-300 md:z-40 ${
          sidebarCollapsed ? "md:w-[76px]" : "md:w-[248px]"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-5 flex shrink-0 items-center justify-between px-2">
          <Link
            href="/dashboard"
            onClick={handleSidebarLinkClick}
            aria-label="Aura Finance dashboard"
            className={`group relative flex items-center ${
              showCollapsedTooltip ? "w-full justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">
              <Sparkles size={16} />
            </div>

            {showCollapsedTooltip && (
              <div className={tooltipClassName}>Aura Finance</div>
            )}

            {showLabels && (
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
            type="button"
            onClick={() => setSidebarOpenAction(false)}
            className="rounded-lg p-2 text-[#565e74] transition hover:bg-[#dce9ff] hover:text-black md:hidden"
            aria-label="Close sidebar"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="sidebar-scroll flex-1 space-y-[2px] overflow-y-auto overflow-x-visible pr-[2px]">
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
                aria-label={item.label}
                className={`group relative flex items-center rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  showCollapsedTooltip
                    ? "justify-center px-2"
                    : "gap-3 px-3"
                } ${
                  active
                    ? "bg-emerald-100/80 text-emerald-800 shadow-[inset_3px_0_0_#047857]"
                    : "text-[#45464d] hover:bg-[#dce9ff] hover:text-black"
                }`}
              >
                <Icon size={17} className="shrink-0" />

                {showCollapsedTooltip && (
                  <div className={tooltipClassName}>{item.label}</div>
                )}

                {showLabels && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 shrink-0 border-t border-[#dfe9fb] pt-3">
          {showLabels && (
            <Link
              href="/billing/upgrade"
              onClick={handleSidebarLinkClick}
              className="mb-3 flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-[12px] font-bold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              Upgrade Plan
            </Link>
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
                  aria-label={item.label}
                  className={`group relative flex items-center rounded-xl py-2 text-[13px] font-semibold transition-all duration-200 ${
                    showCollapsedTooltip
                      ? "justify-center px-2"
                      : "gap-3 px-3"
                  } ${
                    active
                      ? "bg-emerald-100/80 text-emerald-800 shadow-[inset_3px_0_0_#047857]"
                      : "text-[#45464d] hover:bg-[#dce9ff] hover:text-black"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />

                  {showCollapsedTooltip && (
                    <div className={tooltipClassName}>{item.label}</div>
                  )}

                  {showLabels && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className={`group relative flex w-full items-center rounded-xl py-2 text-[13px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 ${
                showCollapsedTooltip
                  ? "justify-center px-2"
                  : "gap-3 px-3"
              }`}
            >
              <LogOut size={16} className="shrink-0" />

              {showCollapsedTooltip && (
                <div className={tooltipClassName}>Logout</div>
              )}

              {showLabels && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}