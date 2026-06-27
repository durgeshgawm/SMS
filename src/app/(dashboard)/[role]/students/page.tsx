"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { mockStudents } from "@/data/mock-db";
import { UserRole } from "@/types/common";

const studentCols: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Student Name" },
  { accessorKey: "admissionNo", header: "Admission No" },
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "section", header: "Section" },
  { accessorKey: "fatherName", header: "Father Name" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "feeStatus",
    header: "Fees Status",
    cell: ({ row }) => {
      const s = row.original.feeStatus;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "paid" ? "bg-green-500/10 text-green-500 border-green-500/20" :
          s === "unpaid" ? "bg-red-500/10 text-red-500 border-red-500/20" :
          s === "partial" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
          "bg-orange-500/10 text-orange-500 border-orange-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
];

export default function AllStudentsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [students, setStudents] = useState(mockStudents);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `std-${Math.floor(Math.random() * 9000) + 1000}`,
      ...values,
    };
    setStudents([newRec, ...students]);
  };

  const handleRecordDelete = (row: any) => {
    setStudents(students.filter((s) => s.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Student Full Name" required placeholder="e.g. Aarav Sharma" />
      <FormInput name="rollNo" label="Roll Number" required placeholder="e.g. 10" />
      <FormInput name="admissionNo" label="Admission Register No" required placeholder="e.g. GW-2026-401" />
      <FormInput name="class" label="Assigned Class Level" required placeholder="e.g. Class 10" />
      <FormInput name="section" label="Class Section Division" required placeholder="e.g. A" />
      <FormInput name="fatherName" label="Father / Guardian Full Name" required placeholder="e.g. Rajesh Sharma" />
      <FormInput name="phone" label="Emergency Contact No" required placeholder="e.g. 9876543210" />
      <FormSelect
        name="feeStatus"
        label="Fee Ledger Status"
        required
        options={[
          { value: "paid", label: "Paid" },
          { value: "unpaid", label: "Unpaid" },
          { value: "partial", label: "Partial" },
          { value: "overdue", label: "Overdue" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="All Students Directory"
      description="Administrative directory containing student records, academic details, and fee statuses."
      addLabel="Add Student Profile"
      data={students}
      columns={studentCols}
      searchKey="name"
      searchPlaceholder="Search students directory..."
      exportFileName="Greenwood_students_ledger"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
