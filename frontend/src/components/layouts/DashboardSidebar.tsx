"use client";

import { useEffect } from "react";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  FolderOpen,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MessageCircle,
  ReceiptText,
  Settings,
  Sparkles,
  Tags,
  Target,
  Upload,
  WalletCards,
  X,
} from "lucide-react";

type DashboardSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpenAction: (
    value: boolean
  ) => void;
  sidebarCollapsed: boolean;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Accounts",
    href: "/accounts",
    icon: Landmark,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ReceiptText,
  },
  {
    label: "Insights",
    href: "/insights",
    icon: Lightbulb,
  },
  {
    label: "AI Chat",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: WalletCards,
  },
  {
    label: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    label: "Subscriptions",
    href: "/subscriptions",
    icon: CalendarDays,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    label: "Uploads",
    href: "/uploads",
    icon: Upload,
  },
  {
    label: "File History",
    href: "/history",
    icon: FolderOpen,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

const bottomItems = [
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];

const mobileItems = [
  ...navItems,
  ...bottomItems,
];

const tooltipClassName =
  "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[100] -translate-y-1/2 translate-x-0 whitespace-nowrap rounded-xl border border-[#e6edf9] bg-white px-3 py-2 text-[11px] font-semibold text-[#0b1c30] opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100";

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpenAction,
  sidebarCollapsed,
}: DashboardSidebarProps) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const showLabels =
    sidebarOpen ||
    !sidebarCollapsed;

  const showCollapsedTooltip =
    sidebarCollapsed &&
    !sidebarOpen;

  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [sidebarOpen]);

  const handleSidebarLinkClick =
    () => {
      /*
       * Only close the mobile sidebar.
       *
       * This does NOT change
       * sidebarCollapsed.
       */
      if (sidebarOpen) {
        setSidebarOpenAction(
          false
        );
      }
    };

  const handleLogout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
    );

    router.push(
      "/auth/login"
    );
  };

  const isActive = (
    href: string
  ) =>
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    );

  return (
    <>
      {/* ================================
          MOBILE OVERLAY
      ================================= */}
      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpenAction(
              false
            )
          }
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* ================================
          SIDEBAR
      ================================= */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col overflow-visible bg-gradient-to-b from-[#f3f7ff] via-[#eef4ff] to-[#eaf2ff] py-3 pl-3 pr-2 transition-all duration-300 md:z-40 md:border-r md:border-[#dfe9fb] md:shadow-[8px_0_28px_rgba(15,23,42,0.04)] ${
          sidebarCollapsed
            ? "md:w-[76px]"
            : "md:w-[248px]"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* ================================
            HEADER
        ================================= */}
        <div className="mb-4 flex shrink-0 items-center justify-between px-2">
          <Link
            href="/dashboard"
            onClick={
              handleSidebarLinkClick
            }
            aria-label="Aura Finance dashboard"
            className={`group relative flex items-center ${
              showCollapsedTooltip
                ? "w-full justify-center"
                : "gap-2.5"
            }`}
          >
            {/* Logo */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black text-white shadow-[0_6px_16px_rgba(15,23,42,0.16)]">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-emerald-900/50" />

              <Sparkles
                size={15}
                className="relative z-10"
              />
            </div>

            {/* Collapsed Tooltip */}
            {showCollapsedTooltip && (
              <div
                className={
                  tooltipClassName
                }
              >
                Aura Finance
              </div>
            )}

            {/* Brand Text */}
            {showLabels && (
              <div className="min-w-0">
                <h1 className="truncate text-[14px] font-bold tracking-tight text-black">
                  Aura Finance
                </h1>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <p className="truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7c839b]">
                    Intelligent Wealth
                  </p>
                </div>
              </div>
            )}
          </Link>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() =>
              setSidebarOpenAction(
                false
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe9fb] bg-white text-[#565e74] shadow-[0_3px_10px_rgba(15,23,42,0.04)] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>

        {/* ================================
            MOBILE NAVIGATION
        ================================= */}
        <nav className="sidebar-scroll flex-1 space-y-[2px] overflow-y-auto overflow-x-visible pr-[2px] md:hidden">
          {mobileItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                isActive(
                  item.href
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    handleSidebarLinkClick
                  }
                  aria-label={
                    item.label
                  }
                  className={`group relative flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                    active
                      ? "bg-white text-emerald-800 shadow-[0_4px_12px_rgba(15,23,42,0.05)] ring-1 ring-emerald-100"
                      : "text-[#45464d] hover:bg-white/70 hover:text-black"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-[#565e74] group-hover:bg-[#f8faff] group-hover:text-black"
                    }`}
                  >
                    <Icon
                      size={15}
                    />
                  </div>

                  <span className="truncate">
                    {item.label}
                  </span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  )}
                </Link>
              );
            }
          )}

          {/* Mobile Logout */}
          <button
            type="button"
            onClick={
              handleLogout
            }
            aria-label="Logout"
            className="group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition group-hover:bg-white">
              <LogOut
                size={15}
              />
            </div>

            <span>
              Logout
            </span>
          </button>
        </nav>

        {/* ================================
            DESKTOP NAVIGATION
        ================================= */}
        <nav className="sidebar-scroll hidden flex-1 space-y-[2px] overflow-y-auto overflow-x-visible pr-[2px] md:block">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                isActive(
                  item.href
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    handleSidebarLinkClick
                  }
                  aria-label={
                    item.label
                  }
                  className={`group relative flex items-center rounded-xl py-1.25 text-[12px] font-semibold transition-all duration-200 ${
                    showCollapsedTooltip
                      ? "justify-center px-2"
                      : "gap-2.5 px-2.5"
                  } ${
                    active
                      ? "bg-white text-emerald-800 shadow-[0_4px_12px_rgba(15,23,42,0.05)] ring-1 ring-emerald-100"
                      : "text-[#45464d] hover:bg-white/70 hover:text-black"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-[#565e74] group-hover:bg-white group-hover:text-black"
                    }`}
                  >
                    <Icon
                      size={15}
                    />
                  </div>

                  {/* Tooltip */}
                  {showCollapsedTooltip && (
                    <div
                      className={
                        tooltipClassName
                      }
                    >
                      {
                        item.label
                      }
                    </div>
                  )}

                  {/* Label */}
                  {showLabels && (
                    <>
                      <span className="min-w-0 flex-1 truncate">
                        {
                          item.label
                        }
                      </span>

                      {active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      )}
                    </>
                  )}
                </Link>
              );
            }
          )}
        </nav>

        {/* ================================
            DESKTOP BOTTOM
        ================================= */}
        <div className="mt-1.5 hidden shrink-0 border-t border-[#dfe9fb] pt-1.5 md:block">
          {/* Upgrade Plan */}
          {showLabels && (
            <Link
              href="/billing/upgrade"
              onClick={
                handleSidebarLinkClick
              }
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 text-[11px] font-bold text-white shadow-[0_6px_16px_rgba(15,23,42,0.13)] transition-opacity duration-200 hover:opacity-90"
            >
              <Sparkles
                size={12}
              />

              Upgrade Plan
            </Link>
          )}

          {/* Bottom Items */}
          <div className="space-y-[2px]">
            {bottomItems.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  isActive(
                    item.href
                  );

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    onClick={
                      handleSidebarLinkClick
                    }
                    aria-label={
                      item.label
                    }
                    className={`group relative flex items-center rounded-xl py-1.25 text-[12px] font-semibold transition-all duration-200 ${
                      showCollapsedTooltip
                        ? "justify-center px-2"
                        : "gap-2.5 px-2.5"
                    } ${
                      active
                        ? "bg-white text-emerald-800 shadow-[0_4px_12px_rgba(15,23,42,0.05)] ring-1 ring-emerald-100"
                        : "text-[#45464d] hover:bg-white/70 hover:text-black"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-[#565e74] group-hover:bg-white group-hover:text-black"
                      }`}
                    >
                      <Icon
                        size={14}
                      />
                    </div>

                    {/* Tooltip */}
                    {showCollapsedTooltip && (
                      <div
                        className={
                          tooltipClassName
                        }
                      >
                        {
                          item.label
                        }
                      </div>
                    )}

                    {/* Label */}
                    {showLabels && (
                      <>
                        <span className="min-w-0 flex-1 truncate">
                          {
                            item.label
                          }
                        </span>

                        {active && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        )}
                      </>
                    )}
                  </Link>
                );
              }
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={
                handleLogout
              }
              aria-label="Logout"
              className={`group relative flex w-full items-center rounded-xl py-1.25 text-[12px] font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 ${
                showCollapsedTooltip
                  ? "justify-center px-2"
                  : "gap-2.5 px-2.5"
              }`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition group-hover:bg-white">
                <LogOut
                  size={14}
                />
              </div>

              {/* Tooltip */}
              {showCollapsedTooltip && (
                <div
                  className={
                    tooltipClassName
                  }
                >
                  Logout
                </div>
              )}

              {/* Label */}
              {showLabels && (
                <span>
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}