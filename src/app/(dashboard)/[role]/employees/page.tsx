"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";
import { mockEmployees } from "@/data/mock-db";
import { useRouter } from "next/navigation";

const employeeColumns: ColumnDef<any>[] = [
  { accessorKey: "employeeNo", header: "Staff ID" },
  { accessorKey: "name", header: "Staff Name" },
  {
    accessorKey: "role",
    header: "Access Role",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.role}</span>
    )
  },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "designation", header: "Designation" },
  { accessorKey: "phone", header: "Contact Phone" },
  { accessorKey: "email", header: "Institutional Email" },
  {
    accessorKey: "salary",
    header: "Salary (₹)",
    cell: ({ row }) => `₹${row.original.salary.toLocaleString()}`,
  },
];

export default function EmployeesListPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const router = useRouter();

  const [employees, setEmployees] = useState(mockEmployees);

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `emp-${Math.floor(Math.random() * 900) + 100}`,
      status: "active",
      ...values,
      salary: parseFloat(values.salary),
    };
    setEmployees([newRec, ...employees]);
  };

  const handleRecordDelete = (row: any) => {
    setEmployees(employees.filter((e) => e.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="employeeNo" label="Staff ID Code" required placeholder="e.g. GW-EMP-102" />
      <FormInput name="name" label="Full Staff Name" required placeholder="e.g. Ms. Shalini Gupta" />
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
      <FormInput name="department" label="Department" required placeholder="e.g. Academics" />
      <FormInput name="designation" label="Designation Title" required placeholder="e.g. Senior Lecturer" />
      <FormInput name="phone" label="Contact No" required placeholder="e.g. 9876543210" />
      <FormInput name="email" label="Email Address" required placeholder="e.g. teacher@school.com" />
      <FormInput name="salary" label="Monthly Base Salary (₹)" type="number" required placeholder="e.g. 75000" />
    </>
  );

  return (
    <ListViewTemplate
      title="Employees Directory Register"
      description="Monitor active institutional staff files, map departments and designations, and manage payroll base values."
      addLabel="Enroll Employee Account"
      data={employees}
      columns={employeeColumns}
      searchKey="name"
      searchPlaceholder="Search staff directory..."
      exportFileName="Greenwood_employees_registry"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
