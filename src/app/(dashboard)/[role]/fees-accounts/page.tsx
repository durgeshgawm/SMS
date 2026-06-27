"use client";

import React, { use } from "react";
import { CreditCard, Wallet, AlertTriangle, TrendingUp, HelpCircle } from "lucide-react";
import { AnalyticsPageTemplate } from "@/components/templates/analytics-page";
import { BarChart, DonutChart } from "@/components/charts";
import { UserRole } from "@/types/common";

export default function FeesAccountsDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const metrics = [
    { title: "Fee Collection (May)", value: "₹2,45,68,900", icon: Wallet, trend: { value: 12.6, isPositive: true }, color: "purple" as const },
    { title: "Operational Outflows", value: "₹1,32,45,600", icon: TrendingUp, trend: { value: 3.1, isPositive: false }, color: "red" as const },
    { title: "Outstanding Fees Due", value: "₹98,45,200", icon: AlertTriangle, trend: { value: 2.8, isPositive: false }, color: "orange" as const },
    { title: "Active Ledger Surplus", value: "₹1,13,23,300", icon: CreditCard, color: "green" as const },
  ];

  const charts = [
    {
      title: "Fee Collections & Expense Flow",
      subtitle: "Monthly billing and payouts comparison in Lacs (₹)",
      colSpan: "col-span-6" as const,
      component: (
        <BarChart
          data={[
            { month: "Jan", Collection: 220, Expenses: 110 },
            { month: "Feb", Collection: 240, Expenses: 130 },
            { month: "Mar", Collection: 260, Expenses: 120 },
            { month: "Apr", Collection: 290, Expenses: 140 },
            { month: "May", Collection: 350, Expenses: 150 },
            { month: "Jun", Collection: 320, Expenses: 160 },
          ]}
          xAxisKey="month"
          series={[
            { key: "Collection", name: "Fee Income", color: "#6366f1" },
            { key: "Expenses", name: "Operating Expenses", color: "#c7d2fe" },
          ]}
        />
      ),
    },
    {
      title: "Fee Payment Method Breakdown",
      subtitle: "Payment gateway channel usage distribution",
      colSpan: "col-span-6" as const,
      component: (
        <DonutChart
          data={[
            { name: "UPI Apps (GPay/PhonePe)", value: 12500000, color: "#10b981" },
            { name: "Net Banking Transfers", value: 8500000, color: "#3b82f6" },
            { name: "Credit/Debit Cards", value: 2568900, color: "#8b5cf6" },
            { name: "Cash Counter Payments", value: 1000000, color: "#f59e0b" },
          ]}
        />
      ),
    },
  ];

  const comparisonTable = {
    title: "Recent Fee Receipt Transactions",
    headers: ["Receipt No", "Student Name", "Class Cohort", "Paid Amount", "Payment Gateway Mode", "Status"],
    rows: [
      ["GW-F-2026-1049", "Aarav Sharma", "Class 10 - A", "₹15,000", "Online UPI", "Settled"],
      ["GW-F-2026-1050", "Rahul Verma", "Class 10 - B", "₹12,500", "Net Banking", "Settled"],
      ["GW-F-2026-1051", "Aditya Sen", "Class 10 - A", "₹15,000", "Credit Card", "Settled"],
      ["GW-F-2026-1052", "Aanya Verma", "Class 10 - B", "₹12,500", "Cash Counter", "Settled"],
    ],
  };

  return (
    <AnalyticsPageTemplate
      title="Fees & Accounts Ledger"
      description="ERP financial overview tracking collections, outstanding dues, transactions and expenses."
      metrics={metrics}
      charts={charts}
      comparisonTable={comparisonTable}
    />
  );
}
