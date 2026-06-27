"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem as SidebarItemType } from "@/types/sidebar";
import { useSidebarStore } from "@/store/use-sidebar-store";

interface SidebarItemProps {
  item: SidebarItemType;
  depth?: number;
}

export function SidebarItem({ item, depth = 0 }: SidebarItemProps) {
  const pathname = usePathname();
  const { isCollapsed, setMobileSidebar } = useSidebarStore();
  const hasChildren = !!item.children && item.children.length > 0;

  // Check if any child is active
  const isChildActive =
    hasChildren && item.children?.some((child) => pathname === child.href);
  const isDirectActive = !hasChildren && pathname === item.href;
  const isActive = isDirectActive || isChildActive;

  const [isOpen, setIsOpen] = useState(isChildActive);

  // Sync open state with active route changes
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [pathname, isChildActive]);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else {
      setMobileSidebar(false); // Close drawer on mobile click
    }
  };

  const Icon = item.icon;

  return (
    <div className="w-full">
      {item.href ? (
        <Link
          href={item.href}
          onClick={handleToggle}
          className={cn(
            "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group relative",
            isActive
              ? "bg-[#6366f1] text-white"
              : "text-[#94a3b8] hover:bg-[#6366f1]/10 hover:text-white",
            isCollapsed && "justify-center"
          )}
        >
          <Icon className={cn("h-5 w-5 shrink-0", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
          {!isCollapsed && item.badge && (
            <span
              className={cn(
                "ml-auto px-2 py-0.5 text-xs rounded-full",
                isActive ? "bg-white/20 text-white" : "bg-[#6366f1]/20 text-[#6366f1]"
              )}
            >
              {item.badge}
            </span>
          )}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#1e293b] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity遂 z-50 pointer-events-none shadow-md">
              {item.label}
            </span>
          )}
        </Link>
      ) : (
        <button
          onClick={handleToggle}
          className={cn(
            "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group relative",
            isActive ? "text-white" : "text-[#94a3b8] hover:bg-[#6366f1]/10 hover:text-white",
            isCollapsed && "justify-center"
          )}
        >
          <Icon className={cn("h-5 w-5 shrink-0", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
          {!isCollapsed && hasChildren && (
            <span className="ml-auto">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-[#94a3b8]/60" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[#94a3b8]/60" />
              )}
            </span>
          )}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#1e293b] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-md">
              {item.label}
            </span>
          )}
        </button>
      )}

      {hasChildren && isOpen && !isCollapsed && (
        <div className="mt-1 pl-8 space-y-1">
          {item.children?.map((child) => {
            const isSubActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setMobileSidebar(false)}
                className={cn(
                  "block px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors",
                  isSubActive ? "text-[#6366f1] font-semibold bg-[#6366f1]/5" : "text-[#94a3b8]/80 hover:text-white"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
