import React from "react";
import { cn } from "@/lib/utils";

interface QuickActionsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function QuickActionsGrid({ children, className, ...props }: QuickActionsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
