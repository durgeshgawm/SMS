import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("flex-1 p-4 md:p-6 space-y-6 max-w-[1600px] w-full mx-auto animate-in fade-in-50 duration-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}
