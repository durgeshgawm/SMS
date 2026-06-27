"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function BreadcrumbNav() {
  const pathname = usePathname();
  if (!pathname || pathname === "/login" || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const formatSegment = (str: string) => {
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="flex items-center space-x-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors duration-150"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        const label =
          /^[a-z0-9-]{8,}$/i.test(segment) || /^\d+$/.test(segment)
            ? `#${segment.slice(0, 8)}`
            : formatSegment(segment);

        return (
          <div key={href} className="flex items-center space-x-1">
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-medium text-foreground max-w-[150px] truncate" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors duration-150 max-w-[120px] truncate"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
