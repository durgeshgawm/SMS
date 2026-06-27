"use client";

import React, { useEffect } from "react";
import { useThemeStore } from "@/store/use-theme-store";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 px-4 py-12 dark:from-slate-950 dark:via-zinc-950 dark:to-slate-950">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-350">
        {children}
      </div>
    </div>
  );
}
