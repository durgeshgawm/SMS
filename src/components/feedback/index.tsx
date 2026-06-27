"use client";

import React from "react";
import { AlertCircle, HelpCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// --- 1. StatusBadge ---
interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = status.toLowerCase().trim();

  let themeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";

  if (
    ["active", "approved", "paid", "success", "completed", "yes"].includes(normStatus)
  ) {
    themeClass = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
  } else if (
    ["pending", "partial", "ongoing", "warning", "in-progress", "submitted"].includes(
      normStatus
    )
  ) {
    themeClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
  } else if (
    ["rejected", "cancelled", "unpaid", "overdue", "danger", "no", "inactive"].includes(
      normStatus
    )
  ) {
    themeClass = "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
  } else if (["info", "suspended", "allocated"].includes(normStatus)) {
    themeClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 text-[11px] font-semibold rounded-full border tracking-wide select-none",
        themeClass,
        className
      )}
    >
      {status}
    </Badge>
  );
}

// --- 2. EmptyState ---
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = AlertCircle,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border bg-card/50 max-w-md mx-auto my-6 space-y-4 animate-in fade-in duration-200",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
          {description}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

// --- 3. ConfirmDialog ---
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-xl">
        <DialogHeader className="text-left space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <HelpCircle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-sm font-bold tracking-tight text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-row items-center gap-2 sm:justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-8 text-xs font-semibold"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
