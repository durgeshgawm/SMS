"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const expenseColumns: ColumnDef<any>[] = [
  { accessorKey: "voucherNo", header: "Voucher No" },
  { accessorKey: "title", header: "Expense Description" },
  { accessorKey: "category", header: "Expense Category" },
  {
    accessorKey: "amount",
    header: "Amount (INR)",
    cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
  },
  { accessorKey: "date", header: "Transaction Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
];

export default function ExpensesLedgerPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [expenses, setExpenses] = useState([
    { id: "exp-rec-1", voucherNo: "GW-EXP-104", title: "Monthly Campus Electricity Bill", category: "Utility Bills", amount: 45000, date: "2026-06-25", status: "paid" },
    { id: "exp-rec-2", voucherNo: "GW-EXP-105", title: "Desktop Computer Maintenance Services", category: "Maintenance", amount: 15000, date: "2026-06-22", status: "paid" },
    { id: "exp-rec-3", voucherNo: "GW-EXP-106", title: "Classroom Whiteboards & Markers Purchase", category: "Office Supplies", amount: 5000, date: "2026-06-20", status: "paid" },
    { id: "exp-rec-4", voucherNo: "GW-EXP-107", title: "Monthly High-Speed Internet Subscription", category: "Utility Bills", amount: 8000, date: "2026-06-18", status: "paid" },
    { id: "exp-rec-5", voucherNo: "GW-EXP-108", title: "Science Lab Chemical Reagents Replenishment", category: "Maintenance", amount: 12000, date: "2026-06-15", status: "pending" },
  ]);

  if (role !== "super-admin" && role !== "finance" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `exp-rec-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
      amount: parseFloat(values.amount),
    };
    setExpenses([newRec, ...expenses]);
  };

  const handleRecordDelete = (row: any) => {
    setExpenses(expenses.filter((e) => e.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="voucherNo" label="Voucher Reference No" required placeholder="e.g. GW-EXP-109" />
      <FormInput name="title" label="Expense Description Detail" required placeholder="e.g. Printer Cartridges Purchase" />
      <FormSelect
        name="category"
        label="Outflow Category"
        required
        options={[
          { value: "Utility Bills", label: "Utility Bills" },
          { value: "Maintenance", label: "Maintenance" },
          { value: "Office Supplies", label: "Office Supplies" },
          { value: "Salary & Wage", label: "Salary & Wage" },
        ]}
      />
      <FormInput name="amount" label="Payout Amount Value (₹)" type="number" required placeholder="e.g. 5000" />
      <FormInput name="date" label="Transaction Date" type="date" required />
      <FormSelect
        name="status"
        label="Transaction Status"
        required
        options={[
          { value: "paid", label: "Paid" },
          { value: "pending", label: "Pending" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Branch Expenses Register"
      description="Register operating payouts, track voucher reference numbers, and balance local branch cash flow ledgers."
      addLabel="Record Outflow Expense"
      data={expenses}
      columns={expenseColumns}
      searchKey="title"
      searchPlaceholder="Search expense items..."
      exportFileName="Greenwood_operating_expenses"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
