"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

interface Guardian {
  id: string;
  name: string;
  studentName: string;
  phone: string;
  occupation: string;
  smsAlerts: "enabled" | "disabled";
}

const guardianCols: ColumnDef<Guardian>[] = [
  { accessorKey: "name", header: "Guardian Name" },
  { accessorKey: "studentName", header: "Linked Student" },
  { accessorKey: "phone", header: "Contact Phone" },
  { accessorKey: "occupation", header: "Occupation" },
  {
    accessorKey: "smsAlerts",
    header: "SMS Alerts",
    cell: ({ row }) => (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
        row.original.smsAlerts === "enabled" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
      }`}>
        {row.original.smsAlerts}
      </span>
    ),
  },
];

const mockGuardians: Guardian[] = [
  { id: "grd-401", name: "Rajesh Sharma", studentName: "Aarav Sharma", phone: "9876543210", occupation: "Chartered Accountant", smsAlerts: "enabled" },
  { id: "grd-402", name: "Sunil Verma", studentName: "Rahul Verma", phone: "9123456780", occupation: "Civil Engineer", smsAlerts: "enabled" },
  { id: "grd-403", name: "Mukesh Sen", studentName: "Aditya Sen", phone: "9874563211", occupation: "Business Consultant", smsAlerts: "disabled" },
];

export default function StudentGuardiansPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [guardians, setGuardians] = useState(mockGuardians);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec: Guardian = {
      id: `grd-${Math.random().toString(36).substring(2, 9)}`,
      name: values.name,
      studentName: values.studentName,
      phone: values.phone,
      occupation: values.occupation,
      smsAlerts: values.smsAlerts,
    };
    setGuardians([newRec, ...guardians]);
  };

  const handleRecordDelete = (row: Guardian) => {
    setGuardians(guardians.filter((g) => g.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Guardian Full Name" required placeholder="e.g. Rajesh Sharma" />
      <FormInput name="studentName" label="Linked Student Name" required placeholder="e.g. Aarav Sharma" />
      <FormInput name="phone" label="Contact Phone Number" required placeholder="e.g. 9876543210" />
      <FormInput name="occupation" label="Guardian Occupation" required placeholder="e.g. Software Architect" />
      <FormSelect
        name="smsAlerts"
        label="SMS Broadcast Alerts"
        required
        options={[
          { value: "enabled", label: "Enabled" },
          { value: "disabled", label: "Disabled" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Parent & Guardian Directory"
      description="Administrative contact details directory mapping student guardians and automated notification permissions."
      addLabel="Record Guardian"
      data={guardians}
      columns={guardianCols}
      searchKey="name"
      searchPlaceholder="Search guardian directory..."
      exportFileName="Greenwood_guardians_ledger"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
