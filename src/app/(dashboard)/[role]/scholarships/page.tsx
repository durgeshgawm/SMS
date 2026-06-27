"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const scholarshipColumns: ColumnDef<any>[] = [
  { accessorKey: "studentName", header: "Student Name" },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "category", header: "Scholarship Category" },
  { accessorKey: "waiver", header: "Waiver Percentage" },
  {
    accessorKey: "grantAmount",
    header: "Approx. Term Waiver Value",
    cell: ({ row }) => `₹${row.original.grantAmount.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "approved" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
];

export default function ScholarshipGrantsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [grants, setGrants] = useState([
    { id: "grt-1", studentName: "Aarav Sharma", class: "Class 10-A", category: "Academic Merit Waiver", waiver: "100%", grantAmount: 15000, status: "approved" },
    { id: "grt-2", studentName: "Priya Patel", class: "Class 10-B", category: "Sports Excellence Waiver", waiver: "50%", grantAmount: 7500, status: "approved" },
    { id: "grt-3", studentName: "Kabir Dev", class: "Class 9-A", category: "Economically Weaker Section (EWS)", waiver: "75%", grantAmount: 11250, status: "approved" },
    { id: "grt-4", studentName: "Rohan Sen", class: "Class 9-C", category: "Sibling Discount Allowance", waiver: "10%", grantAmount: 1500, status: "pending" },
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
      id: `grt-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
      grantAmount: parseFloat(values.grantAmount),
    };
    setGrants([newRec, ...grants]);
  };

  const handleRecordDelete = (row: any) => {
    setGrants(grants.filter((g) => g.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="studentName" label="Student Full Name" required placeholder="e.g. Rohan Sen" />
      <FormInput name="class" label="Class Cohort Division" required placeholder="e.g. Class 10-A" />
      <FormSelect
        name="category"
        label="Scholarship Category"
        required
        options={[
          { value: "Academic Merit Waiver", label: "Academic Merit Waiver" },
          { value: "Sports Excellence Waiver", label: "Sports Excellence Waiver" },
          { value: "Economically Weaker Section (EWS)", label: "Economically Weaker Section (EWS)" },
          { value: "Sibling Discount Allowance", label: "Sibling Discount Allowance" },
        ]}
      />
      <FormInput name="waiver" label="Waiver Percentage (e.g. 50%)" required placeholder="e.g. 50%" />
      <FormInput name="grantAmount" label="Approx. Payout Value (₹)" type="number" required placeholder="e.g. 7500" />
      <FormSelect
        name="status"
        label="Grant Status"
        required
        options={[
          { value: "approved", label: "Approved" },
          { value: "pending", label: "Pending" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Scholarships & Discount Grants"
      description="Process and monitor student scholarship applications, tuition waivers, and sibling discount permissions."
      addLabel="Grant Scholarship"
      data={grants}
      columns={scholarshipColumns}
      searchKey="studentName"
      searchPlaceholder="Search scholarships..."
      exportFileName="Greenwood_scholarship_grants"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
