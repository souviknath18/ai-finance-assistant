"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  Bell,
  CreditCard,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import {
  getNotificationUnreadCount,
} from "@/lib/api/notificationsApi";

type DashboardTopbarProps = {
  setSidebarOpenAction: (
    value: boolean
  ) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsedAction: (
    value: boolean
  ) => void;
};

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/uploads": "Uploads",
  "/transactions": "Transactions",
  "/categories": "Categories",
  "/chat": "AI Chat",
  "/insights": "Insights",
  "/budgets": "Budgets",
  "/goals": "Goals",
  "/subscriptions": "Subscriptions",
  "/reports": "Reports",
  "/history": "File History",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/billing": "Billing",
  "/profile": "Profile",
};

function getPageName(
  pathname: string
) {
  const matchedRoute =
    Object.keys(pageNames)
      .sort(
        (a, b) =>
          b.length - a.length
      )
      .find(
        (route) =>
          pathname === route ||
          pathname.startsWith(
            `${route}/`
          )
      );

  return matchedRoute
    ? pageNames[matchedRoute]
    : "Aura Finance";
}

export default function DashboardTopbar({
  setSidebarOpenAction,
  sidebarCollapsed,
  setSidebarCollapsedAction,
}: DashboardTopbarProps) {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const menuRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [
    mobileScrolled,
    setMobileScrolled,
  ] = useState(false);

  const currentPageName =
    getPageName(pathname);

  /* Close profile menu outside */
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* Notification count */
  useEffect(() => {
    const loadCount =
      async () => {
        try {
          const count =
            await getNotificationUnreadCount();

          setNotificationCount(
            count
          );
        } catch (error) {
          console.error(error);
        }
      };

    void loadCount();

    const interval =
      window.setInterval(
        loadCount,
        30000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  /* Mobile scroll title */
  useEffect(() => {
    const handleScroll = () => {
      setMobileScrolled(
        window.scrollY > 48
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* Recalculate after route change */
  useEffect(() => {
    setMobileScrolled(
      window.scrollY > 48
    );
  }, [pathname]);

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

  return (
    <header
      className={`fixed right-0 top-0 z-30 h-16 border-b border-[#d3e4fe]/70 bg-white/90 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed
          ? "md:left-[76px] md:w-[calc(100%-76px)]"
          : "md:left-[248px] md:w-[calc(100%-248px)]"
      } left-0 w-full`}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 md:flex-none">
          {/* Mobile sidebar */}
          <button
            type="button"
            onClick={() =>
              setSidebarOpenAction(
                true
              )
            }
            aria-label="Open sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dbe5f5] bg-white text-[#45464d] shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-[background-color,border-color,color,box-shadow] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] md:hidden"
          >
            <Menu size={17} />
          </button>

          {/* Desktop sidebar collapse */}
          <button
            type="button"
            onClick={() =>
              setSidebarCollapsedAction(
                !sidebarCollapsed
              )
            }
            aria-label={
              sidebarCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dbe5f5] bg-white text-[#45464d] shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-[background-color,border-color,color,box-shadow] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] md:flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen
                size={17}
              />
            ) : (
              <PanelLeftClose
                size={17}
              />
            )}
          </button>

          {/* MOBILE TITLE */}
          <div className="relative h-[38px] min-w-0 flex-1 overflow-hidden md:hidden">
            {/* Aura Finance */}
            <div
              className={`absolute inset-0 flex min-w-0 flex-col justify-center
                transition-[opacity,transform]
                duration-700
                ease-[cubic-bezier(0.4,0,0.2,1)]
                ${
                  mobileScrolled
                    ? "-translate-y-1 opacity-0"
                    : "translate-y-0 opacity-100"
                }
              `}
            >
              <h1 className="truncate text-[14px] font-bold tracking-tight text-black">
                Aura Finance
              </h1>

              <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7c839b]">
                Intelligent Wealth
              </p>
            </div>

            {/* Current Page */}
            <div
              className={`absolute inset-0 flex min-w-0 items-center
                transition-[opacity,transform]
                duration-700
                ease-[cubic-bezier(0.4,0,0.2,1)]
                ${
                  mobileScrolled
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0"
                }
              `}
            >
              <h2 className="truncate text-[15px] font-bold tracking-tight text-black">
                {currentPageName}
              </h2>
            </div>
          </div>

          {/* Desktop Greeting */}
          <div className="hidden shrink-0 leading-tight md:mr-4 md:block lg:mr-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
              Welcome back
            </p>

            <h2 className="mt-0.5 truncate text-[14px] font-bold text-black">
              Souvik
            </h2>
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden min-w-0 max-w-[420px] flex-1 items-center gap-2.5 rounded-xl border border-[#dbe5f5] bg-[#f8f9ff] px-3 py-2 transition-[background-color,border-color,box-shadow] focus-within:border-emerald-200 focus-within:bg-white focus-within:shadow-[0_4px_14px_rgba(15,23,42,0.04)] md:flex">
          <Search
            size={15}
            className="shrink-0 text-[#7c839b]"
          />

          <input
            placeholder="Search transactions, merchants, insights..."
            className="w-full bg-transparent text-[12px] font-medium text-black outline-none placeholder:text-[#8a92a5]"
          />
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2">
          {/* AI status */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 lg:flex">
            <span className="h-1.5 w-1.5 animate-breathe-glow rounded-full bg-emerald-500" />

            <span className="text-[10px] font-bold text-emerald-700">
              AI Active
            </span>
          </div>

          {/* AI Chat */}
          <button
            type="button"
            onClick={() =>
              router.push(
                "/chat"
              )
            }
            className="hidden h-9 items-center gap-2 rounded-xl bg-black px-3 text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(15,23,42,0.10)] transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.14)] sm:flex"
          >
            <MessageCircle
              size={14}
            />

            AI Chat
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() =>
              router.push(
                "/notifications"
              )
            }
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe5f5] bg-white text-[#45464d] shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-[background-color,border-color,color,box-shadow] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Bell size={16} />

            {notificationCount >
              0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[8px] font-bold text-white">
                {notificationCount >
                99
                  ? "99+"
                  : notificationCount}
              </span>
            )}
          </button>

          {/* PROFILE */}
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileMenuOpen(
                  (prev) =>
                    !prev
                )
              }
              aria-label="Open profile menu"
              className={`flex h-9 w-9 items-center justify-center rounded-full border bg-emerald-50 text-emerald-700 transition-[border-color,box-shadow,background-color] ${
                profileMenuOpen
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-emerald-100 hover:border-emerald-200 hover:ring-2 hover:ring-emerald-100"
              }`}
            >
              <User size={15} />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-[270px] overflow-hidden rounded-2xl border border-[#e6edf9] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                {/* Profile Header */}
                <div className="border-b border-[#edf2fb] bg-[#fbfcff] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
                      <User
                        size={17}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-black">
                        Souvik Nath
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#7c839b]">
                        souviknath18@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
                    <Sparkles
                      size={11}
                      className="text-emerald-700"
                    />

                    <span className="text-[9px] font-bold text-emerald-700">
                      Aura Finance
                    </span>
                  </div>
                </div>

                {/* Profile Menu */}
                <div className="p-2">
                  <ProfileMenuButton
                    icon={
                      <User
                        size={15}
                      />
                    }
                    label="Profile"
                    onClick={() => {
                      setProfileMenuOpen(
                        false
                      );

                      router.push(
                        "/profile"
                      );
                    }}
                  />

                  <ProfileMenuButton
                    icon={
                      <Settings
                        size={15}
                      />
                    }
                    label="Settings"
                    onClick={() => {
                      setProfileMenuOpen(
                        false
                      );

                      router.push(
                        "/settings"
                      );
                    }}
                  />

                  <ProfileMenuButton
                    icon={
                      <CreditCard
                        size={15}
                      />
                    }
                    label="Billing"
                    onClick={() => {
                      setProfileMenuOpen(
                        false
                      );

                      router.push(
                        "/billing"
                      );
                    }}
                  />
                </div>

                {/* Logout */}
                <div className="border-t border-[#edf2fb] p-2">
                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut
                      size={15}
                    />

                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileMenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-semibold text-[#45464d] transition-colors hover:bg-[#f8faff] hover:text-black"
    >
      <span className="text-[#7c839b] transition-colors group-hover:text-emerald-700">
        {icon}
      </span>

      {label}
    </button>
  );
}