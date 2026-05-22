"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? "md:ml-20" : "md:ml-64";

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
          setSidebarCollapsedAction={setSidebarCollapsed}
        />

        <main
          className="mx-auto w-full max-w-7xl px-6 pb-16 pt-24 lg:px-12"
          style={
            {
              "--sidebar-offset": sidebarCollapsed ? "5rem" : "16rem",
            } as React.CSSProperties
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}