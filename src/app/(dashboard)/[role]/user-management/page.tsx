"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const userColumns: ColumnDef<any>[] = [
  { accessorKey: "name", header: "User Name" },
  { accessorKey: "email", header: "Institutional Email" },
  {
    accessorKey: "role",
    header: "System Role",
    cell: ({ row }) => {
      const r = row.original.role;
      return <span className="text-xs font-semibold capitalize">{r.replace("-", " ")}</span>;
    }
  },
  { accessorKey: "branch", header: "Assigned Campus" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
  { accessorKey: "lastLogin", header: "Last Portal Activity" },
];

export default function AllUsersDirectoryPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [users, setUsers] = useState([
    { id: "usr-1", name: "Ms. Shalini Gupta", email: "teacher@school.com", role: "teacher", branch: "Delhi Main Branch", status: "active", lastLogin: "Today, 10:15 AM" },
    { id: "usr-2", name: "Mr. Vikram Malhotra", email: "finance@school.com", role: "finance", branch: "Mumbai Branch", status: "active", lastLogin: "Today, 11:20 AM" },
    { id: "usr-3", name: "Mr. Amit Rao", email: "dean@school.com", role: "academic", branch: "Delhi Main Branch", status: "active", lastLogin: "Yesterday, 04:30 PM" },
    { id: "usr-4", name: "Mr. Rajesh Kumar", email: "warden@school.com", role: "hostel", branch: "Chennai Campus", status: "active", lastLogin: "24 Jun, 09:00 AM" },
    { id: "usr-5", name: "Ms. Sunita Deshmukh", email: "hr@school.com", role: "hr", branch: "Delhi Main Branch", status: "inactive", lastLogin: "18 Jun, 02:00 PM" },
  ]);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `usr-${Math.floor(Math.random() * 900) + 100}`,
      lastLogin: "Never logged in",
      ...values,
    };
    setUsers([newRec, ...users]);
  };

  const handleRecordDelete = (row: any) => {
    setUsers(users.filter((u) => u.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Staff Full Name" required placeholder="e.g. Ms. Shalini Gupta" />
      <FormInput name="email" label="Institutional Email Address" required placeholder="e.g. shalini@school.com" />
      <FormSelect
        name="role"
        label="System Access Role"
        required
        options={[
          { value: "teacher", label: "Educator (Teacher)" },
          { value: "academic", label: "Academic Head" },
          { value: "finance", label: "Finance Manager" },
          { value: "hr", label: "HR Manager" },
          { value: "hostel", label: "Hostel Warden" },
          { value: "library", label: "Librarian" },
        ]}
      />
      <FormInput name="branch" label="Assigned Branch Campus" required placeholder="e.g. Delhi Main Branch" />
      <FormSelect
        name="status"
        label="Account Active Status"
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
      title="Branch Users Directory"
      description="Create, allocate, and audit branch employee access accounts and primary system roles."
      addLabel="Register Staff Account"
      data={users}
      columns={userColumns}
      searchKey="name"
      searchPlaceholder="Search users directory..."
      exportFileName="Greenwood_staff_access_accounts"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
