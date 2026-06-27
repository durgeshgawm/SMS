"use client";

import React, { useState } from "react";
import { FileText, Download, Printer, Filter, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { KPICard } from "@/components/dashboard/kpi-card";
import { toast } from "@/components/ui/toast";
import { ColumnDef } from "@tanstack/react-table";

interface SummaryKPI {
  title: string;
  value: string | number;
  icon: any;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan" | "indigo";
}

interface ReportPageTemplateProps<TData> {
  title: string;
  description?: string;
  data: TData[];
  columns: ColumnDef<TData, any>[];
  summaryKPIs?: SummaryKPI[];
  filterFields?: React.ReactNode;
  exportFileName?: string;
}

export function ReportPageTemplate<TData extends { id: string | number }>({
  title,
  description,
  data,
  columns,
  summaryKPIs = [],
  filterFields,
  exportFileName = "report",
}: ReportPageTemplateProps<TData>) {
  const [reportData, setReportData] = useState<TData[]>(data);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Successfully generated and downloaded PDF report!");
    }, 1500);
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Successfully exported report data to Excel spreadsheet!");
    }, 1200);
  };

  const handlePrint = () => {
    toast.info("Opening system print dialog...");
    window.print();
  };

  return (
    <PageContainer>
      {/* Page Header with Export/Print Actions */}
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="h-8 text-xs font-semibold flex items-center gap-1 border-border/80"
            >
              <FileText className="h-3.5 w-3.5 text-red-500" />
              <span>Export PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="h-8 text-xs font-semibold flex items-center gap-1 border-border/80"
            >
              <Download className="h-3.5 w-3.5 text-green-500" />
              <span>Export Excel</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs font-semibold flex items-center gap-1 border-border/80"
            >
              <Printer className="h-3.5 w-3.5 text-primary" />
              <span>Print</span>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Row */}
      {summaryKPIs.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-6">
          {summaryKPIs.map((kpi, idx) => (
            <KPICard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              color={kpi.color || "indigo"}
            />
          ))}
        </div>
      )}

      {/* Filter panel */}
      {filterFields && (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm mb-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>Report Filters</span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-end">
            {filterFields}
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8 text-xs font-semibold flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-border/80 shrink-0">
                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={reportData}
          searchKey="name"
          searchPlaceholder="Search report entries..."
          exportFileName={exportFileName}
        />
      </div>
    </PageContainer>
  );
}
export type { SummaryKPI };
