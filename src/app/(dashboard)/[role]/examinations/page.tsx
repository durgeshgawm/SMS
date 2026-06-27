"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

interface ExamSetup {
  id: string;
  code: string;
  name: string;
  className: string;
  startDate: string;
  endDate: string;
  status: "scheduled" | "ongoing" | "completed";
}

const examCols: ColumnDef<ExamSetup>[] = [
  { accessorKey: "code", header: "Exam Code" },
  { accessorKey: "name", header: "Exam Name" },
  { accessorKey: "className", header: "Target Class" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "scheduled" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
          s === "ongoing" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
          "bg-green-500/10 text-green-500 border-green-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
];

const mockExams: ExamSetup[] = [
  { id: "ex-801", code: "EX-T1-10", name: "Term 1 Semester Examination", className: "Class 10", startDate: "2026-07-02", endDate: "2026-07-12", status: "scheduled" },
  { id: "ex-802", code: "EX-UT-9", name: "Unit Test Assessment II", className: "Class 9", startDate: "2026-06-25", endDate: "2026-06-28", status: "ongoing" },
  { id: "ex-803", code: "EX-FIN-12", name: "Board Pre-Board Practicals", className: "Class 12", startDate: "2026-05-10", endDate: "2026-05-20", status: "completed" },
];

export default function ExaminationsSetupPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [exams, setExams] = useState(mockExams);

  if (role !== "super-admin" && role !== "academic") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec: ExamSetup = {
      id: `ex-${Math.random().toString(36).substring(2, 9)}`,
      code: values.code,
      name: values.name,
      className: values.className,
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
    };
    setExams([newRec, ...exams]);
  };

  const handleRecordDelete = (row: ExamSetup) => {
    setExams(exams.filter((e) => e.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="code" label="Exam Setup Code" required placeholder="e.g. EX-T1-10" />
      <FormInput name="name" label="Exam Name / Title" required placeholder="e.g. Term 1 Mid-Terms" />
      <FormInput name="className" label="Target Class Level" required placeholder="e.g. Class 10" />
      <FormInput name="startDate" label="Start Date" type="date" required />
      <FormInput name="endDate" label="End Date" type="date" required />
      <FormSelect
        name="status"
        label="Exam Status"
        required
        options={[
          { value: "scheduled", label: "Scheduled" },
          { value: "ongoing", label: "Ongoing" },
          { value: "completed", label: "Completed" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Examinations Setup"
      description="Configure academic examination schedules, target classrooms, and marks registers."
      addLabel="Configure Exam"
      data={exams}
      columns={examCols}
      searchKey="name"
      searchPlaceholder="Search exams..."
      exportFileName="Greenwood_exams_catalog"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
