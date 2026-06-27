"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const structureColumns: ColumnDef<any>[] = [
  { accessorKey: "code", header: "Category Code" },
  { accessorKey: "name", header: "Fee Category" },
  { accessorKey: "frequency", header: "Billing Frequency" },
  {
    accessorKey: "amount",
    header: "Amount (INR)",
    cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
  },
  { accessorKey: "description", header: "Description" },
];

export default function FeeManagementPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [fees, setFees] = useState([
    { id: "fee-cat-1", code: "TUIT-10", name: "Academic Tuition Fees", frequency: "Quarterly", amount: 15000, description: "Core academic classroom lectures & tuition expenses." },
    { id: "fee-cat-2", code: "ADM-NEW", name: "One-time Admission Fee", frequency: "One-Time", amount: 25000, description: "New student enrollment and registration fee." },
    { id: "fee-cat-3", code: "LAB-COMP", name: "Computer Lab Charges", frequency: "Yearly", amount: 2000, description: "Access to computer labs and technology hubs." },
    { id: "fee-cat-4", code: "LIB-MAIN", name: "Library Annual Fees", frequency: "Yearly", amount: 1500, description: "Library books catalog issuance and maintenance." },
    { id: "fee-cat-5", code: "TRAN-M5", name: "Transport Facility (Monthly)", frequency: "Monthly", amount: 2500, description: "School bus transport routes coverage charges." },
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
      id: `fee-cat-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
      amount: parseFloat(values.amount),
    };
    setFees([newRec, ...fees]);
  };

  const handleRecordDelete = (row: any) => {
    setFees(fees.filter((f) => f.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="code" label="Category Code" required placeholder="e.g. TUIT-10" />
      <FormInput name="name" label="Fee Category Name" required placeholder="e.g. Tuition Fees" />
      <FormSelect
        name="frequency"
        label="Billing Frequency"
        required
        options={[
          { value: "One-Time", label: "One-Time" },
          { value: "Monthly", label: "Monthly" },
          { value: "Quarterly", label: "Quarterly" },
          { value: "Yearly", label: "Yearly" },
        ]}
      />
      <FormInput name="amount" label="Billing Amount Value (₹)" type="number" required placeholder="e.g. 15000" />
      <FormInput name="description" label="Fee Description Details" placeholder="e.g. Access to physics lab" />
    </>
  );

  return (
    <ListViewTemplate
      title="Fee Structure Management"
      description="Configure, schedule, and register institutional fee structures and billing categories."
      addLabel="Add Fee Category"
      data={fees}
      columns={structureColumns}
      searchKey="name"
      searchPlaceholder="Search fee structures..."
      exportFileName="Greenwood_fee_structures"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
