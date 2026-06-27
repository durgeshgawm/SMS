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
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#1a1f36] border-r border-[#1e293b]/50 text-[#94a3b8] transition-all duration-300 lg:static",
          isCollapsed ? "w-[80px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Branding Area */}
        <div className="flex h-[70px] items-center justify-between px-4 border-b border-[#1e293b]">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366f1] text-white">
              <School className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm tracking-wide text-white">SMS ERP</span>
                <span className="text-[10px] text-[#94a3b8]/75 uppercase">{config.roleLabel}</span>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex hover:bg-[#6366f1]/10 text-[#94a3b8] hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
          {config.items.map((item, idx) => (
            <SidebarItem key={`${item.label}-${idx}`} item={item} />
          ))}
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-[#1e293b] flex flex-col gap-2">
          {!isCollapsed && user && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1e293b]/40">
              <div className="h-9 w-9 rounded-full bg-[#6366f1] text-white font-bold flex items-center justify-center text-sm shadow">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-xs font-semibold text-white truncate">{user.name}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
