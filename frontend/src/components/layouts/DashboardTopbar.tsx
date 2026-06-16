"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
  CreditCard,
  Search,
  Sparkles,
} from "lucide-react";
import { getNotificationUnreadCount } from "@/lib/api/notificationsApi";

type DashboardTopbarProps = {
  setSidebarOpenAction: (value: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsedAction: (value: boolean) => void;
};

export default function DashboardTopbar({
  setSidebarOpenAction,
  sidebarCollapsed,
  setSidebarCollapsedAction,
}: DashboardTopbarProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const count = await getNotificationUnreadCount();
        setNotificationCount(count);
      } catch (error) {
        console.error(error);
      }
    };

    loadCount();

    const interval = window.setInterval(loadCount, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/auth/login");
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 h-16 border-b border-[#d3e4fe]/70 bg-white/90 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed
          ? "md:left-[76px] md:w-[calc(100%-76px)]"
          : "md:left-[248px] md:w-[calc(100%-248px)]"
      } left-0 w-full`}
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setSidebarOpenAction(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe5f5] text-[#45464d] transition hover:bg-[#f8f9ff] hover:text-black md:hidden"
          >
            <Menu size={17} />
          </button>

          <button
            onClick={() => setSidebarCollapsedAction(!sidebarCollapsed)}
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#dbe5f5] text-[#45464d] transition hover:bg-[#f8f9ff] hover:text-black md:flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </button>

          <div className="flex min-w-0 items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-black to-[#1f2937] text-white shadow-sm">
              <Sparkles size={14} />
            </div>

            <div className="min-w-0 leading-tight">
              <h1 className="truncate text-[14px] font-bold tracking-tight text-black">
                Aura Finance
              </h1>

              <p className="truncate text-[10px] font-semibold tracking-wide text-[#7c839b]">
                AI Finance Workspace
              </p>
            </div>
          </div>

          <div className="hidden leading-tight md:block">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
              Welcome back
            </p>

            <h2 className="mt-0.5 truncate text-[15px] font-bold text-black">
              Souvik
            </h2>
          </div>
        </div>

        <div className="hidden w-full max-w-[420px] items-center gap-2 rounded-xl border border-[#dbe5f5] bg-[#f8f9ff] px-3 py-2 md:flex">
          <Search size={15} className="shrink-0 text-[#7c839b]" />

          <input
            placeholder="Search transactions, merchants, insights..."
            className="w-full bg-transparent text-[13px] font-medium text-black outline-none placeholder:text-[#7c839b]"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 lg:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700">
              AI Active
            </span>
          </div>

          <button
            onClick={() => router.push("/chat")}
            className="hidden h-9 items-center gap-2 rounded-xl bg-black px-3 text-[11px] font-bold text-white transition hover:opacity-90 sm:flex"
          >
            <MessageCircle size={14} />
            AI Chat
          </button>

          <button
            onClick={() => router.push("/notifications")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#dbe5f5] text-[#45464d] transition hover:bg-[#f8f9ff] hover:text-black"
          >
            <Bell size={17} />

            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe5f5] bg-emerald-50 text-emerald-700 transition hover:ring-2 hover:ring-emerald-100"
            >
              <User size={16} />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-64 overflow-hidden rounded-2xl border border-[#dbe5f5] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                <div className="border-b border-[#e5eeff] p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                    <User size={18} />
                  </div>

                  <p className="text-sm font-bold text-black">Souvik Nath</p>

                  <p className="mt-1 truncate text-[11px] text-[#565e74]">
                    souviknath18@gmail.com
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
                    <Sparkles size={12} className="text-emerald-700" />
                    <span className="text-[10px] font-bold text-emerald-700">
                      Aura Finance
                    </span>
                  </div>
                </div>

                <div className="p-2">
                  <ProfileMenuButton
                    icon={<User size={16} />}
                    label="Profile"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/profile");
                    }}
                  />

                  <ProfileMenuButton
                    icon={<Settings size={16} />}
                    label="Settings"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/settings");
                    }}
                  />

                  <ProfileMenuButton
                    icon={<CreditCard size={16} />}
                    label="Billing"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/billing");
                    }}
                  />
                </div>

                <div className="border-t border-[#e5eeff] p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
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
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#45464d] transition hover:bg-[#f8f9ff] hover:text-black"
    >
      {icon}
      {label}
    </button>
  );
}