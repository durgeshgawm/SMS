"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const incomeColumns: ColumnDef<any>[] = [
  { accessorKey: "receiptNo", header: "Receipt No" },
  { accessorKey: "studentName", header: "Student Name" },
  { accessorKey: "category", header: "Income Category" },
  {
    accessorKey: "amount",
    header: "Amount Received (₹)",
    cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
  },
  { accessorKey: "date", header: "Receipt Date" },
  { accessorKey: "mode", header: "Payment Mode" },
];

export default function IncomeLedgerPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [incomes, setIncomes] = useState([
    { id: "inc-rec-1", receiptNo: "GW-INC-901", studentName: "Aarav Sharma", category: "Tuition Fees", amount: 15000, date: "2026-06-25", mode: "Online UPI" },
    { id: "inc-rec-2", receiptNo: "GW-INC-902", studentName: "Priya Patel", category: "Tuition Fees", amount: 10000, date: "2026-06-24", mode: "Net Banking" },
    { id: "inc-rec-3", receiptNo: "GW-INC-903", studentName: "Aanya Verma", category: "Tuition Fees", amount: 15000, date: "2026-06-22", mode: "Credit Card" },
    { id: "inc-rec-4", receiptNo: "GW-INC-904", studentName: "Kabir Dev", category: "Admission Fees", amount: 25000, date: "2026-06-20", mode: "Cash Payment" },
    { id: "inc-rec-5", receiptNo: "GW-INC-905", studentName: "Rohan Sen", category: "Transport Fees", amount: 2500, date: "2026-06-18", mode: "Online UPI" },
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
      id: `inc-rec-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
      amount: parseFloat(values.amount),
    };
    setIncomes([newRec, ...incomes]);
  };

  const handleRecordDelete = (row: any) => {
    setIncomes(incomes.filter((i) => i.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="receiptNo" label="Receipt Reference No" required placeholder="e.g. GW-INC-906" />
      <FormInput name="studentName" label="Student Full Name" required placeholder="e.g. Aarav Sharma" />
      <FormSelect
        name="category"
        label="Income Stream Category"
        required
        options={[
          { value: "Tuition Fees", label: "Tuition Fees" },
          { value: "Admission Fees", label: "Admission Fees" },
          { value: "Transport Fees", label: "Transport Fees" },
          { value: "Sports & Labs", label: "Sports & Labs" },
        ]}
      />
      <FormInput name="amount" label="Amount Received (₹)" type="number" required placeholder="e.g. 15000" />
      <FormInput name="date" label="Receipt Date" type="date" required />
      <FormSelect
        name="mode"
        label="Payment Mode"
        required
        options={[
          { value: "Online UPI", label: "Online UPI" },
          { value: "Net Banking", label: "Net Banking" },
          { value: "Credit Card", label: "Credit Card" },
          { value: "Cash Payment", label: "Cash Payment" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Branch Revenue Income Ledger"
      description="Register tuition fees collection invoices, catalog admission intakes, and monitor total branch cash inflows."
      addLabel="Record Inflow Income"
      data={incomes}
      columns={incomeColumns}
      searchKey="studentName"
      searchPlaceholder="Search income invoices..."
      exportFileName="Greenwood_operating_inflows"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
