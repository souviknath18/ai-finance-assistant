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
} from "lucide-react";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/auth/login");
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 h-14 border-b border-[#d3e4fe]/60 bg-white/85 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed
          ? "md:left-[76px] md:w-[calc(100%-76px)]"
          : "md:left-[248px] md:w-[calc(100%-248px)]"
      } left-0 w-full`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          {/* MOBILE SIDEBAR BUTTON */}
          <button
            onClick={() => setSidebarOpenAction(true)}
            className="rounded-lg border border-[#c6c6cd] p-2 text-[#45464d] transition hover:bg-[#eff4ff] hover:text-black md:hidden"
          >
            <Menu size={17} />
          </button>

          {/* DESKTOP COLLAPSE BUTTON */}
          <button
            onClick={() =>
              setSidebarCollapsedAction(!sidebarCollapsed)
            }
            className="hidden rounded-lg border border-[#c6c6cd] p-2 text-[#45464d] transition hover:bg-[#eff4ff] hover:text-black md:flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </button>

          {/* WELCOME */}
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7c839b]">
              Welcome back
            </p>

            <h2 className="mt-0.5 text-[15px] font-bold text-black">
              Souvik
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          
          {/* AI CHAT */}
          <button
            onClick={() => router.push("/chat")}
            className="hidden items-center gap-2 rounded-full bg-black px-3 py-2 text-[11px] font-bold text-white transition hover:opacity-90 sm:flex"
          >
            <MessageCircle size={14} />
            AI Chat
          </button>

          {/* NOTIFICATIONS */}
          <button
            onClick={() => router.push("/notifications")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c6c6cd] text-[#45464d] transition hover:bg-[#eff4ff] hover:text-black"
          >
            <Bell size={17} />
          </button>

          {/* PROFILE */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileMenuOpen(!profileMenuOpen)
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c6c6cd] bg-[#dce9ff] text-black transition hover:ring-2 hover:ring-emerald-100"
            >
              <User size={16} />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-60 overflow-hidden rounded-2xl border border-[#d3e4fe] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                
                {/* PROFILE HEADER */}
                <div className="border-b border-[#e5eeff] p-4">
                  <p className="text-sm font-bold text-black">
                    Souvik Nath
                  </p>

                  <p className="mt-1 truncate text-[11px] text-[#565e74]">
                    souviknath18@gmail.com
                  </p>
                </div>

                {/* MENU ITEMS */}
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

                {/* LOGOUT */}
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
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#45464d] transition hover:bg-[#eff4ff] hover:text-black"
    >
      {icon}
      {label}
    </button>
  );
}