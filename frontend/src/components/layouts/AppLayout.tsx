"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const handleSidebarCollapsedChange = (value: boolean) => {
    setSidebarCollapsed(value);
    localStorage.setItem("sidebarCollapsed", String(value));
  };

  const sidebarWidth = sidebarCollapsed ? "md:ml-[76px]" : "md:ml-[248px]";

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpenAction={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className={`min-h-screen transition-all duration-300 ${sidebarWidth}`}>
        <DashboardTopbar
          setSidebarOpenAction={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsedAction={handleSidebarCollapsedChange}
        />

        <main
          className="mx-auto w-full max-w-7xl px-4 pb-14 pt-[88px] sm:px-6 lg:px-8"
          style={
            {
              "--sidebar-offset": sidebarCollapsed ? "76px" : "248px",
            } as React.CSSProperties
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}