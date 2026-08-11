"use client";

import { useState } from "react";

import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type AppLayoutProps = {
  children: React.ReactNode;
  initialSidebarCollapsed?: boolean;
};

export default function AppLayout({
  children,
  initialSidebarCollapsed = false,
}: AppLayoutProps) {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(
    initialSidebarCollapsed
  );

  const handleSidebarCollapsedChange = (
    value: boolean
  ) => {
    setSidebarCollapsed(value);

    /*
     * Save in cookie so the server knows
     * the sidebar state on refresh.
     */
    document.cookie = `sidebarCollapsed=${String(
      value
    )}; path=/; max-age=31536000; SameSite=Lax`;

    /*
     * Keep localStorage too if anything
     * else in the app currently uses it.
     */
    localStorage.setItem(
      "sidebarCollapsed",
      String(value)
    );
  };

  const sidebarWidth =
    sidebarCollapsed
      ? "md:ml-[76px]"
      : "md:ml-[248px]";

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <DashboardSidebar
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpenAction={
          setSidebarOpen
        }
        sidebarCollapsed={
          sidebarCollapsed
        }
      />

      <div
        className={`min-h-screen transition-[margin] duration-300 ease-in-out ${sidebarWidth}`}
      >
        <DashboardTopbar
          setSidebarOpenAction={
            setSidebarOpen
          }
          sidebarCollapsed={
            sidebarCollapsed
          }
          setSidebarCollapsedAction={
            handleSidebarCollapsedChange
          }
        />

        <main
          className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[88px] sm:px-6 lg:px-8"
          style={
            {
              "--sidebar-offset":
                sidebarCollapsed
                  ? "76px"
                  : "248px",
            } as React.CSSProperties
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}