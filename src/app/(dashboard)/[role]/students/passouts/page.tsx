"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput } from "@/components/forms";
import { UserRole } from "@/types/common";

interface PassoutAlumni {
  id: string;
  name: string;
  graduationYear: number;
  percentage: string;
  placement: string;
  contact: string;
}

const alumniCols: ColumnDef<PassoutAlumni>[] = [
  { accessorKey: "name", header: "Alumni Name" },
  { accessorKey: "graduationYear", header: "Passout Year" },
  { accessorKey: "percentage", header: "Final Score" },
  { accessorKey: "placement", header: "Higher Education / Placement" },
  { accessorKey: "contact", header: "Contact No" },
];

const mockAlumni: PassoutAlumni[] = [
  { id: "alm-301", name: "Rishabh Malhotra", graduationYear: 2025, percentage: "94.8%", placement: "IIT Delhi (B.Tech)", contact: "9874561230" },
  { id: "alm-302", name: "Sanya Gupta", graduationYear: 2024, percentage: "92.2%", placement: "St. Stephens College (BA)", contact: "9911223344" },
  { id: "alm-303", name: "Abhay Sharma", graduationYear: 2024, percentage: "89.5%", placement: "BITS Pilani (CS)", contact: "9215487612" },
];

export default function StudentPassoutsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [alumni, setAlumni] = useState(mockAlumni);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec: PassoutAlumni = {
      id: `alm-${Math.random().toString(36).substring(2, 9)}`,
      name: values.name,
      graduationYear: parseInt(values.graduationYear),
      percentage: values.percentage,
      placement: values.placement,
      contact: values.contact,
    };
    setAlumni([newRec, ...alumni]);
  };

  const handleRecordDelete = (row: PassoutAlumni) => {
    setAlumni(alumni.filter((a) => a.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Alumni Name" required placeholder="e.g. Rishabh Malhotra" />
      <FormInput name="graduationYear" label="Passout Graduation Year" type="number" required placeholder="e.g. 2025" />
      <FormInput name="percentage" label="Final Grade / Score (%)" required placeholder="e.g. 94.8%" />
      <FormInput name="placement" label="Higher Education / Organization Placement" required placeholder="e.g. Delhi University (B.Com)" />
      <FormInput name="contact" label="Contact Number" required placeholder="e.g. 9874561230" />
    </>
  );

  return (
    <ListViewTemplate
      title="Student Passouts & Alumni"
      description="Track graduation years, academic performance, placements, and contacts of institutional alumni."
      addLabel="Add Alumni Record"
      data={alumni}
      columns={alumniCols}
      searchKey="name"
      searchPlaceholder="Search alumni directory..."
      exportFileName="Greenwood_alumni_ledger"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
