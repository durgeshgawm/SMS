"use client";

import React, { use, useState } from "react";
import { CreditCard, Users, Briefcase, FileCheck, CheckCircle2 } from "lucide-react";
import { ReportPageTemplate } from "@/components/templates/report-page";
import { ColumnDef } from "@tanstack/react-table";
import { UserRole } from "@/types/common";

interface EmployeeSalary {
  id: string;
  employeeNo: string;
  name: string;
  department: string;
  baseSalary: number;
  hra: number;
  deductions: number;
  netPayout: number;
  status: "Paid" | "Processing" | "Pending";
}

const salaryColumns: ColumnDef<EmployeeSalary>[] = [
  { accessorKey: "employeeNo", header: "Staff ID" },
  { accessorKey: "name", header: "Staff Name" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "baseSalary",
    header: "Base Salary (₹)",
    cell: ({ row }) => `₹${row.original.baseSalary.toLocaleString()}`,
  },
  {
    accessorKey: "hra",
    header: "HRA (₹)",
    cell: ({ row }) => `₹${row.original.hra.toLocaleString()}`,
  },
  {
    accessorKey: "deductions",
    header: "Deductions (₹)",
    cell: ({ row }) => `₹${row.original.deductions.toLocaleString()}`,
  },
  {
    accessorKey: "netPayout",
    header: "Net Payout (₹)",
    cell: ({ row }) => `₹${row.original.netPayout.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Payout Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "Paid" ? "bg-green-500/10 text-green-500 border-green-500/20" :
          s === "Processing" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
          "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
];

export default function SalaryPayrollPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "finance" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedMonth, setSelectedMonth] = useState("June 2026");

  const payrollData: EmployeeSalary[] = [
    { id: "sal-1", employeeNo: "GW-EMP-001", name: "Ms. Shalini Gupta", department: "Academics", baseSalary: 50000, hra: 15000, deductions: 10000, netPayout: 55000, status: "Paid" },
    { id: "sal-2", employeeNo: "GW-EMP-002", name: "Mr. Vikram Malhotra", department: "Finance", baseSalary: 60000, hra: 18000, deductions: 12000, netPayout: 66000, status: "Paid" },
    { id: "sal-3", employeeNo: "GW-EMP-003", name: "Mr. Amit Rao", department: "Academics", baseSalary: 65000, hra: 20000, deductions: 15000, netPayout: 70000, status: "Paid" },
    { id: "sal-4", employeeNo: "GW-EMP-004", name: "Mr. Rajesh Kumar", department: "Hostel", baseSalary: 35000, hra: 10000, deductions: 5000, netPayout: 40000, status: "Processing" },
    { id: "sal-5", employeeNo: "GW-EMP-005", name: "Ms. Sunita Deshmukh", department: "HR Operations", baseSalary: 55000, hra: 16000, deductions: 11000, netPayout: 60000, status: "Pending" },
  ];

  const summaryKPIs = [
    { title: "Net Payroll Payout", value: "₹2,91,000", icon: CreditCard, color: "green" as const },
    { title: "Staff Members Paid", value: "3 Employees", icon: Users, color: "blue" as const },
    { title: "Base Deductions", value: "₹53,000", icon: Briefcase, color: "purple" as const },
    { title: "Pending Disbursements", value: "2 Claims", icon: FileCheck, color: "orange" as const },
  ];

  const filters = (
    <>
      <div>
        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Department</label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full h-8 border bg-card text-xs rounded-lg px-2"
        >
          <option value="All Departments">All Departments</option>
          <option value="Academics">Academics</option>
          <option value="Finance">Finance</option>
          <option value="Hostel">Hostel</option>
          <option value="HR Operations">HR Operations</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Payout Month</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full h-8 border bg-card text-xs rounded-lg px-2"
        >
          <option value="June 2026">June 2026</option>
          <option value="May 2026">May 2026</option>
          <option value="April 2026">April 2026</option>
        </select>
      </div>
    </>
  );

  return (
    <ReportPageTemplate
      title="Staff Salary & Payroll Registry"
      description="Process employee base pays, calculate house rent allowances, track tax deductions, and audit net disbursements."
      data={payrollData}
      columns={salaryColumns}
      summaryKPIs={summaryKPIs}
      filterFields={filters}
      exportFileName="Greenwood_staff_salary_payroll_ledger"
    />
  );
}
