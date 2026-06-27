"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

export default function Home() {
  const router = useRouter();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();

    // 2-second premium splash screen animation delay
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user_session");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.role) {
              router.push(`/${parsed.role}/dashboard`);
              return;
            }
          } catch (e) {}
        }
      }
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, initialize]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30">
          <School className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-wider mt-4">GREENWOOD ACADEMY</h1>
        <p className="text-xs text-indigo-200">School ERP Administration Portal</p>
        <div className="flex items-center gap-2 text-indigo-300 text-xs pt-8">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
          Loading workspace session...
        </div>
      </div>
    </main>
  );
}
