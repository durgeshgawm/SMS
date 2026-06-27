"use client";

import React, { use } from "react";
import { TrendingUp, Building2, CreditCard, Users, Star } from "lucide-react";
import { AnalyticsPageTemplate } from "@/components/templates/analytics-page";
import { BarChart, LineChart, DonutChart } from "@/components/charts";
import { UserRole } from "@/types/common";

export default function BranchPerformancePage({
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
    { title: "Total ERP Revenue", value: "₹4,25,68,900", icon: CreditCard, trend: { value: 12.4, isPositive: true }, color: "green" as const },
    { title: "Active Branch Count", value: "12 Campus", icon: Building2, color: "blue" as const },
    { title: "Total Student Cohort", value: "12,568", icon: Users, trend: { value: 8.5, isPositive: true }, color: "purple" as const },
    { title: "Top Performing Unit", value: "Delhi Main", icon: Star, color: "orange" as const },
  ];

  const charts = [
    {
      title: "Fee Collections vs Operating Expenses",
      subtitle: "Monthly branch cashflows in Lacs (₹)",
      colSpan: "col-span-6" as const,
      component: (
        <BarChart
          data={[
            { month: "Jan", Revenue: 85, Expense: 42 },
            { month: "Feb", Revenue: 95, Expense: 45 },
            { month: "Mar", Revenue: 110, Expense: 52 },
            { month: "Apr", Revenue: 105, Expense: 48 },
            { month: "May", Revenue: 125, Expense: 58 },
            { month: "Jun", Revenue: 135, Expense: 60 },
          ]}
          xAxisKey="month"
          series={[
            { key: "Revenue", name: "Campus Fee Collection", color: "#6366f1" },
            { key: "Expense", name: "Operational Expense Outflow", color: "#c7d2fe" },
          ]}
        />
      ),
    },
    {
      title: "Student Enrollment Trends",
      subtitle: "New registrations per academic trimester",
      colSpan: "col-span-6" as const,
      component: (
        <LineChart
          data={[
            { date: "Trimester 1", Count: 1420 },
            { date: "Trimester 2", Count: 1650 },
            { date: "Trimester 3", Count: 1890 },
          ]}
          xAxisKey="date"
          series={[{ key: "Count", name: "New Admissions", color: "#22c55e" }]}
        />
      ),
    },
  ];

  const comparisonTable = {
    title: "Campus Branch Comparative Ledger",
    headers: ["Rank", "Campus Branch Name", "Student Count", "Fee Revenue Collected", "Dues Outstanding", "Active Status"],
    rows: [
      ["#1", "Delhi Main Branch", "2,568 Students", "₹45,68,900", "₹5,20,000", "Active"],
      ["#2", "Branch - North (Rohini)", "2,245 Students", "₹38,45,200", "₹4,12,000", "Active"],
      ["#3", "Branch - South (Saket)", "1,987 Students", "₹36,78,600", "₹6,80,000", "Active"],
      ["#4", "Branch - East (Mayur Vihar)", "1,854 Students", "₹28,45,600", "₹3,90,000", "Active"],
      ["#5", "Branch - West (Dwarka)", "1,654 Students", "₹25,45,800", "₹4,20,000", "Active"],
    ],
  };

  return (
    <AnalyticsPageTemplate
      title="Branch Performance Analytics"
      description="Comparative analysis of academic records, admissions, revenue, and expenses metrics across branches."
      metrics={metrics}
      charts={charts}
      comparisonTable={comparisonTable}
    />
  );
}
