"use client";

import React, { use } from "react";
import { Users, UserCheck, Flame, PieChart } from "lucide-react";
import { AnalyticsPageTemplate } from "@/components/templates/analytics-page";
import { BarChart, DonutChart } from "@/components/charts";
import { UserRole } from "@/types/common";

export default function CRMDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const metrics = [
    { title: "Total Registered Leads", value: "842 Leads", icon: Users, trend: { value: 14.5, isPositive: true }, color: "blue" as const },
    { title: "Active Hot Follow-ups", value: "124 Leads", icon: Flame, trend: { value: 5.2, isPositive: false }, color: "red" as const },
    { title: "Admissions Confirmed", value: "312 Students", icon: UserCheck, trend: { value: 22.1, isPositive: true }, color: "green" as const },
    { title: "Admission Conversion Rate", value: "37.05%", icon: PieChart, color: "purple" as const },
  ];

  const charts = [
    {
      title: "Lead Capture Channels",
      subtitle: "Distribution of lead capture sources",
      colSpan: "col-span-6" as const,
      component: (
        <BarChart
          data={[
            { source: "Google Ads", count: 280 },
            { source: "Social Media", count: 180 },
            { source: "Referrals", count: 210 },
            { source: "Walk-ins", count: 120 },
            { source: "Flyers/Print", count: 52 },
          ]}
          xAxisKey="source"
          series={[{ key: "count", name: "Leads Count", color: "#8b5cf6" }]}
        />
      ),
    },
    {
      title: "Inquiries Pipeline Split",
      subtitle: "Current pipeline distribution share",
      colSpan: "col-span-6" as const,
      component: (
        <DonutChart
          data={[
            { name: "New Leads", value: 310, color: "#6366f1" },
            { name: "Contacted", value: 240, color: "#3b82f6" },
            { name: "In Progress", value: 168, color: "#22c55e" },
            { name: "Converted", value: 312, color: "#10b981" },
            { name: "Lost/Dropped", value: 92, color: "#ef4444" },
          ]}
        />
      ),
    },
  ];

  const comparisonTable = {
    title: "Recent Inquiry Leads Logs",
    headers: ["Lead Name", "Contact No", "Course Inquiry", "Lead Status", "Assigned Counselor"],
    rows: [
      ["Ananya Roy", "+91 98765 43122", "Class 11 Science", "Hot Followup", "Ms. Shalini Gupta"],
      ["Rohan Das", "+91 99887 71144", "Class 6 Primary", "New Lead", "Mr. Dean Rao"],
      ["Preeti Singh", "+91 95648 71239", "Class 9 General", "Contacted", "Ms. Shalini Gupta"],
      ["Aman Varma", "+91 92154 87611", "Class 10 General", "Registered", "Mr. Dean Rao"],
      ["Neha Roy", "+91 98124 57800", "Class 11 Humanities", "Closed Lost", "Ms. Shalini Gupta"],
    ],
  };

  return (
    <AnalyticsPageTemplate
      title="Admission CRM Dashboard"
      description="Track inquiries, pipeline conversions, marketing channels, and counselor performance."
      metrics={metrics}
      charts={charts}
      comparisonTable={comparisonTable}
    />
  );
}
