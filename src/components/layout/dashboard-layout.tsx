"use client";

import React, { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { initialize } = useAuthStore();

  // Initialize session state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background pb-16 lg:pb-0">
      {/* Sidebar component */}
      <Sidebar />

      {/* Workspace panel */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#f5f7fa] dark:bg-[#0f1117]">
        {/* Top Header toolbar */}
        <Header />

        {/* Scrollable container for the specific page view */}
        <main className="flex-1 overflow-y-auto focus:outline-none bg-[#f5f7fa] dark:bg-[#0f1117]">
          {children}
        </main>
      </div>
    </div>
  );
}
