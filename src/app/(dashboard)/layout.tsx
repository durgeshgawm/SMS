"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function GeneralDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      <DashboardLayout>{children}</DashboardLayout>
      <MobileNav />
    </div>
  );
}
