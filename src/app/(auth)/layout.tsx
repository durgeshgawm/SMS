"use client";

import React, { useEffect } from "react";
import { useThemeStore } from "@/store/use-theme-store";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 overflow-hidden transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100">
      {/* Background gradients for soft accent lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.07),transparent_35%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.09),transparent_35%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.06),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_40%)] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" 
        style={{
          maskImage: "radial-gradient(circle at center, white 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, white 60%, transparent 100%)"
        }}
      />

      {/* Floating Animated Neon Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 0.95, 1.05, 1],
          x: [0, 30, -20, 15, 0],
          y: [0, -40, 20, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[90px] sm:blur-[110px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1.05, 0.9, 1],
          x: [0, -40, 30, -15, 0],
          y: [0, 35, -30, 25, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] sm:blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1.2, 1.05, 1],
          x: [0, 15, -15, 20, 0],
          y: [0, 25, 15, -20, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-fuchsia-500/5 dark:bg-fuchsia-600/5 blur-[110px] sm:blur-[150px] pointer-events-none"
      />

      <div className="w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}
