"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useAuthStore } from "@/store/use-auth-store";
import { sidebarConfigs } from "@/config/sidebar";
import { SidebarItem } from "./sidebar-item";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { isCollapsed, toggleSidebar, isMobileOpen, setMobileSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Fallback to super-admin if no user logged in (helps during dev/layout testing)
  const role = user?.role || "super-admin";
  const config = sidebarConfigs[role];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!config) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#1a1f36] dark:bg-[#0b0f19] border-r border-[#1e293b]/50 dark:border-slate-800/80 text-[#94a3b8] transition-all duration-300 lg:static",
          isCollapsed ? "w-[80px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Branding Area */}
        <div className={cn("flex h-[70px] items-center justify-between px-4 border-b border-[#1e293b] dark:border-slate-800/60", isCollapsed && "justify-center px-0")}>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1] text-white shrink-0">
              <School className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left animate-in fade-in duration-300">
                <span className="font-bold text-sm tracking-wide text-white">SMS ERP</span>
                <span className="text-[9px] text-[#94a3b8]/75 uppercase font-semibold">School Management System</span>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden lg:flex hover:bg-[#6366f1]/10 text-[#94a3b8] hover:text-white shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className={cn("flex-1 py-4 px-3 space-y-1", isCollapsed ? "overflow-y-visible" : "overflow-y-auto")}>
          {config.items.map((item, idx) => (
            <SidebarItem key={`${item.label}-${idx}`} item={item} />
          ))}
        </div>
      </aside>
    </>
  );
}
