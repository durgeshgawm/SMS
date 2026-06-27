"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

interface BranchAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchName: string;
  status: "active" | "inactive";
}

const adminCols: ColumnDef<BranchAdmin>[] = [
  { accessorKey: "name", header: "Admin Name" },
  { accessorKey: "email", header: "Email Address" },
  { accessorKey: "phone", header: "Phone Number" },
  { accessorKey: "branchName", header: "Assigned Campus" },
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

const mockBranchAdmins: BranchAdmin[] = [
  { id: "adm-101", name: "Vikram Malhotra", email: "v.malhotra@school.com", phone: "9874561230", branchName: "Delhi Main Branch", status: "active" },
  { id: "adm-102", name: "Siddharth Roy", email: "s.roy@school.com", phone: "9911223344", branchName: "Mumbai Campus", status: "active" },
  { id: "adm-103", name: "Kiran Krishnan", email: "k.krishnan@school.com", phone: "9215487612", branchName: "Chennai Campus", status: "inactive" },
];

export default function BranchAdminsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [admins, setAdmins] = useState(mockBranchAdmins);

  if (role !== "super-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const branchesMap: Record<string, string> = {
      "br-delhi": "Delhi Main Branch",
      "br-mumbai": "Mumbai Campus",
      "br-chennai": "Chennai Campus",
    };

    const newRec: BranchAdmin = {
      id: `adm-${Math.random().toString(36).substring(2, 9)}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      branchName: branchesMap[values.branchId] || "Delhi Main Branch",
      status: values.status,
    };
    setAdmins([newRec, ...admins]);
  };

  const handleRecordDelete = (row: BranchAdmin) => {
    setAdmins(admins.filter((a) => a.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Admin Full Name" required placeholder="e.g. Vikram Malhotra" />
      <FormInput name="email" label="Institutional Email" required placeholder="e.g. vikram@school.com" />
      <FormInput name="phone" label="Contact Phone" required placeholder="e.g. 9874561230" />
      <FormSelect
        name="branchId"
        label="Assigned School Campus"
        required
        options={[
          { value: "br-delhi", label: "Delhi Main Branch" },
          { value: "br-mumbai", label: "Mumbai Campus" },
          { value: "br-chennai", label: "Chennai Campus" },
        ]}
      />
      <FormSelect
        name="status"
        label="Access Status"
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
      title="Branch Administrators"
      description="Register and audit administrative heads assigned to run individual school branches."
      addLabel="Assign Branch Admin"
      data={admins}
      columns={adminCols}
      searchKey="name"
      searchPlaceholder="Search admin list..."
      exportFileName="Greenwood_branch_admins"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
