"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { mockBranches } from "@/data/mock-db";
import { UserRole } from "@/types/common";

const branchCols: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Branch Name" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "studentsCount", header: "Students Count" },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => `₹${row.original.revenue.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`text-xs font-semibold uppercase ${row.original.status === "active" ? "text-green-500" : "text-red-500"}`}>
        {row.original.status}
      </span>
    ),
  },
];

export default function BranchManagementPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [branches, setBranches] = useState(mockBranches);

  // Allow only Super Admin to manage branches
  if (role !== "super-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied. Only Super Admin accounts can manage campus branches.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `br-${Math.random().toString(36).substring(2, 9)}`,
      adminsCount: 0,
      studentsCount: 0,
      status: "active",
      ...values,
    };
    setBranches([newRec, ...branches]);
  };

  const handleRecordDelete = (row: any) => {
    setBranches(branches.filter((b) => b.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Branch Name" required placeholder="e.g. Mumbai Campus" />
      <FormInput name="code" label="Campus Code Designation" required placeholder="e.g. GW-MUM-02" />
      <FormInput name="city" label="City" required placeholder="e.g. Mumbai" />
      <FormInput name="revenue" label="Projected Yearly Revenue (₹)" type="number" required placeholder="e.g. 800000" />
      <FormSelect
        name="status"
        label="Branch Active Status"
        required
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Branch Management"
      description="Greenwood administration ledger for managing all campus branches."
      addLabel="Add New Branch"
      data={branches}
      columns={branchCols}
      searchKey="name"
      searchPlaceholder="Search branch list..."
      exportFileName="Greenwood_branches_ledger"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
