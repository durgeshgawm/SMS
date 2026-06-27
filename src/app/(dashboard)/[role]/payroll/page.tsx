"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const payrollColumns: ColumnDef<any>[] = [
  { accessorKey: "employeeNo", header: "Staff ID" },
  { accessorKey: "name", header: "Staff Name" },
  { accessorKey: "designation", header: "Designation" },
  {
    accessorKey: "base",
    header: "Base Salary (₹)",
    cell: ({ row }) => `₹${row.original.base.toLocaleString()}`,
  },
  {
    accessorKey: "pf",
    header: "Provident Fund (₹)",
    cell: ({ row }) => `₹${row.original.pf.toLocaleString()}`,
  },
  {
    accessorKey: "tax",
    header: "Professional Tax (₹)",
    cell: ({ row }) => `₹${row.original.tax.toLocaleString()}`,
  },
  {
    accessorKey: "insurance",
    header: "Health Insurance (₹)",
    cell: ({ row }) => `₹${row.original.insurance.toLocaleString()}`,
  },
  {
    accessorKey: "netPay",
    header: "Projected Net Pay (₹)",
    cell: ({ row }) => `₹${row.original.netPay.toLocaleString()}`,
  },
];

export default function HRPayrollPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [payrollEntries, setPayrollEntries] = useState([
    { id: "pay-rec-1", employeeNo: "GW-EMP-001", name: "Ms. Shalini Gupta", designation: "Senior Maths Lecturer", base: 50000, pf: 4500, tax: 2500, insurance: 3000, netPay: 40000 },
    { id: "pay-rec-2", employeeNo: "GW-EMP-002", name: "Mr. Vikram Malhotra", designation: "Chief Finance Manager", base: 60000, pf: 5400, tax: 3000, insurance: 3500, netPay: 48100 },
    { id: "pay-rec-3", employeeNo: "GW-EMP-003", name: "Mr. Amit Rao", designation: "Dean of Studies", base: 65000, pf: 5850, tax: 3250, insurance: 4000, netPay: 51900 },
    { id: "pay-rec-4", employeeNo: "GW-EMP-004", name: "Mr. Rajesh Kumar", designation: "Chief Hostel Warden", base: 35000, pf: 3150, tax: 1750, insurance: 2000, netPay: 28100 },
    { id: "pay-rec-5", employeeNo: "GW-EMP-005", name: "Ms. Sunita Deshmukh", designation: "Senior HR Lead", base: 55000, pf: 4950, tax: 2750, insurance: 3000, netPay: 44300 },
  ]);

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const base = parseFloat(values.base);
    const pf = Math.round(base * 0.09); // mock PF rate
    const tax = Math.round(base * 0.05); // mock Tax rate
    const insurance = 3000;
    const netPay = base - pf - tax - insurance;

    const newRec = {
      id: `pay-rec-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
      base,
      pf,
      tax,
      insurance,
      netPay,
    };
    setPayrollEntries([newRec, ...payrollEntries]);
  };

  const handleRecordDelete = (row: any) => {
    setPayrollEntries(payrollEntries.filter((p) => p.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="employeeNo" label="Staff ID Code" required placeholder="e.g. GW-EMP-102" />
      <FormInput name="name" label="Staff Full Name" required placeholder="e.g. Ms. Shalini Gupta" />
      <FormInput name="designation" label="Designation Title" required placeholder="e.g. Senior Lecturer" />
      <FormInput name="base" label="Monthly Base Salary (₹)" type="number" required placeholder="e.g. 50000" />
    </>
  );

  return (
    <ListViewTemplate
      title="Staff Payroll Allocation Matrix"
      description="Configure base salary payouts, set PF percentages, specify income tax deductions, and compute projected net earnings."
      addLabel="Configure Payroll Profile"
      data={payrollEntries}
      columns={payrollColumns}
      searchKey="name"
      searchPlaceholder="Search payroll files..."
      exportFileName="Greenwood_staff_payroll_configurations"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
