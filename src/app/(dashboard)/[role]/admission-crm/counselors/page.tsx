"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

interface Counselor {
  id: string;
  name: string;
  email: string;
  activeLeads: number;
  conversionRate: string;
  status: "active" | "inactive";
}

const counselorCols: ColumnDef<Counselor>[] = [
  { accessorKey: "name", header: "Counselor Name" },
  { accessorKey: "email", header: "Email Address" },
  { accessorKey: "activeLeads", header: "Active Leads Load" },
  { accessorKey: "conversionRate", header: "Conversion Rate" },
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

const mockCounselors: Counselor[] = [
  { id: "cns-201", name: "Ms. Shalini Gupta", email: "shalini.g@school.com", activeLeads: 42, conversionRate: "41.5%", status: "active" },
  { id: "cns-202", name: "Mr. Dean Rao", email: "dean.rao@school.com", activeLeads: 38, conversionRate: "35.2%", status: "active" },
  { id: "cns-203", name: "Mrs. Anjali Varma", email: "anjali.v@school.com", activeLeads: 15, conversionRate: "28.0%", status: "inactive" },
];

export default function CounselorAllocationPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [counselors, setCounselors] = useState(mockCounselors);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec: Counselor = {
      id: `cns-${Math.random().toString(36).substring(2, 9)}`,
      name: values.name,
      email: values.email,
      activeLeads: 0,
      conversionRate: "0.0%",
      status: values.status,
    };
    setCounselors([newRec, ...counselors]);
  };

  const handleRecordDelete = (row: Counselor) => {
    setCounselors(counselors.filter((c) => c.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Counselor Full Name" required placeholder="e.g. Shalini Gupta" />
      <FormInput name="email" label="Institutional Email" required placeholder="e.g. shalini.g@school.com" />
      <FormSelect
        name="status"
        label="Availability Status"
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
      title="Admission Counselors"
      description="Manage admission desk counselors, lead distribution load, and individual conversion performance metrics."
      addLabel="Add Counselor"
      data={counselors}
      columns={counselorCols}
      searchKey="name"
      searchPlaceholder="Search counselors..."
      exportFileName="Greenwood_counselors"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
