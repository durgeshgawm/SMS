import React from "react";
import { cn } from "@/lib/utils";

interface KPICardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function KPICardRow({ children, className, ...props }: KPICardRowProps) {
  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
