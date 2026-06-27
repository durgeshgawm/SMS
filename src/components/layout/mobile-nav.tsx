"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useNotificationStore } from "@/store/use-notification-store";

export function MobileNav() {
  const pathname = usePathname();
  const { toggleMobileSidebar } = useSidebarStore();
  const { unreadCount } = useNotificationStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-16 border-t border-border bg-card flex items-center justify-around px-2 lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] font-medium",
          pathname === "/" ? "text-[#6366f1]" : "text-muted-foreground"
        )}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>

      <button
        onClick={toggleMobileSidebar}
        className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] font-medium text-muted-foreground"
      >
        <Grid className="h-5 w-5" />
        <span>Menu</span>
      </button>

      <div className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] font-medium text-muted-foreground">
        <Bell className="h-5 w-5" />
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-6 h-2.5 w-2.5 rounded-full bg-red-500" />
        )}
      </div>
    </div>
  );
}
