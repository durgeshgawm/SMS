import React from "react";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan" | "indigo";
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  description = "vs last month",
  color = "indigo",
}: KPICardProps) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3">
      <div className="space-y-1.5 flex-1 min-w-0">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{title}</span>
        <span className="text-xl xl:text-2xl font-bold tracking-tight text-foreground block truncate">{value}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {trend && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                trend.isPositive
                  ? "bg-green-500/10 text-green-600 dark:text-green-500"
                  : "bg-red-500/10 text-red-600 dark:text-red-500"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3 shrink-0" />
              ) : (
                <ArrowDownRight className="h-3 w-3 shrink-0" />
              )}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-[11px] text-muted-foreground font-medium leading-none">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", colorMap[color])}>
        <Icon className="h-5.5 w-5.5" />
      </div>
    </div>
  );
}
