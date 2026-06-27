"use client";

import React from "react";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ChartContainer } from "@/components/charts";

interface MetricCard {
  title: string;
  value: string | number;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  description?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan" | "indigo";
}

interface AnalyticsPageTemplateProps {
  title: string;
  description?: string;
  metrics?: MetricCard[];
  charts: {
    title: string;
    subtitle?: string;
    colSpan?: "col-span-1" | "col-span-2" | "col-span-3" | "col-span-4" | "col-span-6" | "col-span-12";
    component: React.ReactNode;
  }[];
  comparisonTable?: {
    title: string;
    headers: string[];
    rows: any[][];
  };
}

export function AnalyticsPageTemplate({
  title,
  description,
  metrics = [],
  charts = [],
  comparisonTable,
}: AnalyticsPageTemplateProps) {
  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader title={title} description={description} />

      {/* Metric Cards Grid */}
      {metrics.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-6">
          {metrics.map((metric, idx) => (
            <KPICard
              key={idx}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              description={metric.description}
              color={metric.color}
            />
          ))}
        </div>
      )}

      {/* Grid of charts */}
      {charts.length > 0 && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 mb-6">
          {charts.map((chart, idx) => {
            const span = chart.colSpan || "lg:col-span-6";
            // Map col-span-X values correctly to Tailwind grid spans
            const tailwindSpan = 
              span === "col-span-1" ? "lg:col-span-3" :
              span === "col-span-2" ? "lg:col-span-4" :
              span === "col-span-3" ? "lg:col-span-4" :
              span === "col-span-4" ? "lg:col-span-4" :
              span === "col-span-6" ? "lg:col-span-6" :
              span === "col-span-12" ? "lg:col-span-12" : "lg:col-span-6";

            return (
              <div key={idx} className={tailwindSpan}>
                <ChartContainer title={chart.title} subtitle={chart.subtitle || ""}>
                  {chart.component}
                </ChartContainer>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison table */}
      {comparisonTable && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4">{comparisonTable.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border">
                  {comparisonTable.headers.map((header, idx) => (
                    <th key={idx} className="pb-3 font-bold text-muted-foreground uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonTable.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="py-3.5 font-medium text-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
export type { MetricCard };
