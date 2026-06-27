"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, Sun, Moon, Menu, Globe, Calendar, Check, CheckSquare,
  ChevronDown, User, Lock, Settings, Users, ShieldCheck, Sliders, Database, History, LogOut 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useBranchStore } from "@/store/use-branch-store";
import { useNotificationStore } from "@/store/use-notification-store";
import { useThemeStore } from "@/store/use-theme-store";
import { useAuthStore } from "@/store/use-auth-store";
import { BreadcrumbNav } from "./breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export function Header() {
  const router = useRouter();
  const { toggleMobileSidebar } = useSidebarStore();
  const { selectedBranchId, selectedBranchName, setSelectedBranch } = useBranchStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const displayUser = user || {
    name: "Super Admin",
    email: "superadmin@sms.com",
    role: "super-admin",
  };

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentDateString, setCurrentDateString] = useState("");

  useEffect(() => {
    // Dynamic date string
    setCurrentDateString(formatDate(new Date(), "EEEE, dd MMM yyyy"));
  }, []);

  const branches = [
    { id: "br-delhi", name: "Delhi Main Branch" },
    { id: "br-mumbai", name: "Mumbai Branch" },
    { id: "br-chennai", name: "Chennai Campus" },
  ];

  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm relative z-30">
      {/* Left Area: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:block">
          <BreadcrumbNav />
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-2 md:gap-4 text-sm">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 text-muted-foreground border-r border-border pr-4">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">{currentDateString}</span>
        </div>

        {/* Branch Selector Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsBranchOpen(!isBranchOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-1.5 h-8 font-medium text-xs border-border/80"
          >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[120px] truncate">{selectedBranchName}</span>
          </Button>

          {isBranchOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card p-1 shadow-lg z-50">
              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Switch Branch
              </div>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b.id, b.name);
                    setIsBranchOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-2 py-1.5 text-xs rounded-md text-left transition-colors",
                    selectedBranchId === b.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <span>{b.name}</span>
                  {selectedBranchId === b.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-400" />
          )}
        </Button>

        {/* Notifications Dropdown Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsBranchOpen(false);
            }}
            className="h-8 w-8 relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </Button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
                <span className="font-semibold text-xs text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[10px] font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <CheckSquare className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "p-3 text-left hover:bg-muted/40 cursor-pointer transition-colors",
                        !n.isRead && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full mt-1.5 shrink-0",
                            n.type === "success" && "bg-green-500",
                            n.type === "warning" && "bg-amber-500",
                            n.type === "error" && "bg-red-500",
                            n.type === "info" && "bg-blue-500"
                          )}
                        />
                        <div className="flex-1 space-y-0.5">
                          <p className="text-xs font-semibold text-foreground leading-none">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            {n.description}
                          </p>
                          <span className="text-[9px] text-muted-foreground block pt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {displayUser && (
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsBranchOpen(false);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border/60"
            >
              <div className="h-8 w-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
                {displayUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-foreground pr-1 select-none">
                {displayUser.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>

            {isProfileOpen && (
              <>
                {/* Backdrop overlay for closing on click outside */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsProfileOpen(false)} 
                />
                
                {/* Dropdown Menu Box */}
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150 text-left">
                  {/* Profile Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
                    <div className="h-10 w-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
                      {displayUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-foreground truncate">{displayUser.name}</span>
                      <span className="text-[11px] text-muted-foreground truncate">{displayUser.email}</span>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="py-1">
                    {/* Admin Panel Group */}
                    <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Admin Panel
                    </div>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">Profile</span>
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">Change Password</span>
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">Preferences</span>
                    </button>
                    <button className="flex items-center justify-between w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <span className="flex items-center gap-2.5">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Language</span>
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground mr-1">English &gt;</span>
                    </button>
                    <button 
                      onClick={() => {
                        toggleTheme();
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        {theme === "light" ? (
                          <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span>Theme</span>
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground capitalize mr-1">{theme} &gt;</span>
                    </button>

                    <div className="border-t border-border/60 my-1" />

                    {/* System Group */}
                    <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      System
                    </div>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">User Management</span>
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">Role &amp; Permissions</span>
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">System Settings</span>
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <Database className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">Backup &amp; Restore</span>
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-foreground hover:bg-muted/65 transition-colors text-left">
                      <History className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">Activity Logs</span>
                    </button>

                    <div className="border-t border-border/60 my-1" />

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        router.push("/login");
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
