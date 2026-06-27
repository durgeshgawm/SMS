"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const subjectColumns: ColumnDef<any>[] = [
  { accessorKey: "code", header: "Subject Code" },
  { accessorKey: "name", header: "Subject Name" },
  { accessorKey: "class", header: "Class Level" },
  { accessorKey: "credits", header: "Credit Weights" },
  { accessorKey: "type", header: "Subject Type" },
  { accessorKey: "teacher", header: "Assigned Teachers" },
];

export default function SubjectsCatalogPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [subjects, setSubjects] = useState([
    { id: "sub-1", code: "MTH-101", name: "Mathematics Paper I", class: "Class 10", credits: "4 Credits", type: "Core Theory", teacher: "Ms. Shalini Gupta" },
    { id: "sub-2", code: "SCI-102", name: "General Science Practical", class: "Class 10", credits: "3 Credits", type: "Laboratory Practical", teacher: "Mr. Dean Rao" },
    { id: "sub-3", code: "ENG-103", name: "English Language Studies", class: "Class 9", credits: "3 Credits", type: "Core Theory", teacher: "Ms. Sunita Deshmukh" },
    { id: "sub-4", code: "SST-104", name: "Social Studies History", class: "Class 9", credits: "4 Credits", type: "Core Theory", teacher: "Mr. Amit Rao" },
    { id: "sub-5", code: "CS-105", name: "Computer Applications Practical", class: "Class 10", credits: "2 Credits", type: "Laboratory Practical", teacher: "Mr. Satish Kumar" },
  ]);

  if (role !== "super-admin" && role !== "academic" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `sub-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
    };
    setSubjects([newRec, ...subjects]);
  };

  const handleRecordDelete = (row: any) => {
    setSubjects(subjects.filter((s) => s.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="code" label="Subject Code" required placeholder="e.g. MTH-101" />
      <FormInput name="name" label="Subject Name Description" required placeholder="e.g. Advanced Mathematics" />
      <FormInput name="class" label="Class Level Tag" required placeholder="e.g. Class 10" />
      <FormInput name="credits" label="Credit Weightage" required placeholder="e.g. 4 Credits" />
      <FormSelect
        name="type"
        label="Subject Type Category"
        required
        options={[
          { value: "Core Theory", label: "Core Theory" },
          { value: "Laboratory Practical", label: "Laboratory Practical" },
          { value: "Elective Subject", label: "Elective Subject" },
        ]}
      />
      <FormInput name="teacher" label="Assigned Lecturer Teacher" required placeholder="e.g. Ms. Shalini Gupta" />
    </>
  );

  return (
    <ListViewTemplate
      title="Subjects Catalog Directory"
      description="Registry compiling syllabus topics, institutional codes, course weightage credits, and lecturer pairings."
      addLabel="Register Subject"
      data={subjects}
      columns={subjectColumns}
      searchKey="name"
      searchPlaceholder="Search subjects..."
      exportFileName="Greenwood_subjects_registry"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
