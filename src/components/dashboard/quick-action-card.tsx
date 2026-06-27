import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  label: string;
  icon: LucideIcon;
  href: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan" | "indigo";
}

export function QuickActionCard({ label, icon: Icon, href, color = "indigo" }: QuickActionCardProps) {
  const colorMap = {
    blue: "text-blue-500 bg-blue-500/5 group-hover:bg-blue-500 group-hover:text-white border-blue-500/10",
    green: "text-green-500 bg-green-500/5 group-hover:bg-green-500 group-hover:text-white border-green-500/10",
    purple: "text-purple-500 bg-purple-500/5 group-hover:bg-purple-500 group-hover:text-white border-purple-500/10",
    orange: "text-orange-500 bg-orange-500/5 group-hover:bg-orange-500 group-hover:text-white border-orange-500/10",
    red: "text-red-500 bg-red-500/5 group-hover:bg-red-500 group-hover:text-white border-red-500/10",
    cyan: "text-cyan-500 bg-cyan-500/5 group-hover:bg-cyan-500 group-hover:text-white border-cyan-500/10",
    indigo: "text-indigo-500 bg-indigo-500/5 group-hover:bg-indigo-500 group-hover:text-white border-indigo-500/10",
  };

  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:border-[#6366f1]/35 hover:shadow-md transition-all duration-200"
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl border mb-3 transition-colors duration-250",
          colorMap[color]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-[13px] font-semibold text-foreground text-center group-hover:text-[#6366f1] transition-colors leading-tight">
        {label}
      </span>
    </Link>
  );
}
