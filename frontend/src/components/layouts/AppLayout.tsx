"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "sidebarCollapsed"
      );

    if (saved !== null) {
      setSidebarCollapsed(
        saved === "true"
      );
    }

    setMounted(true);
  }, []);

  const effectiveSidebarCollapsed =
    mounted
      ? sidebarCollapsed
      : false;

  const handleSidebarCollapsedChange = (
    value: boolean
  ) => {
    setSidebarCollapsed(value);

    localStorage.setItem(
      "sidebarCollapsed",
      String(value)
    );
  };

  const sidebarWidth =
    effectiveSidebarCollapsed
      ? "md:ml-[76px]"
      : "md:ml-[248px]";

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpenAction={
          setSidebarOpen
        }
        sidebarCollapsed={
          effectiveSidebarCollapsed
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
            effectiveSidebarCollapsed
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
                effectiveSidebarCollapsed
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