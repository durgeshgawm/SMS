"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const teacherColumns: ColumnDef<any>[] = [
  { accessorKey: "employeeNo", header: "Teacher ID" },
  { accessorKey: "name", header: "Teacher Name" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "workload", header: "Weekly Workload" },
  { accessorKey: "subjects", header: "Mapped Subjects" },
  {
    accessorKey: "classTeacher",
    header: "Class Teacher",
    cell: ({ row }) => {
      const ct = row.original.classTeacher;
      return ct ? (
        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold">
          Yes ({ct})
        </span>
      ) : (
        <span className="text-muted-foreground text-xs font-semibold">No</span>
      );
    }
  },
];

export default function TeachersDirectoryPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [teachers, setTeachers] = useState([
    { id: "teach-1", employeeNo: "GW-EMP-001", name: "Ms. Shalini Gupta", department: "Mathematics", workload: "18 Hours/Wk", subjects: "Maths Paper I, II", classTeacher: "10-A" },
    { id: "teach-2", employeeNo: "GW-EMP-002", name: "Mr. Dean Rao", department: "Science", workload: "20 Hours/Wk", subjects: "Chemistry, Physics Lab", classTeacher: "10-B" },
    { id: "teach-3", employeeNo: "GW-EMP-003", name: "Ms. Sunita Deshmukh", department: "Languages", workload: "16 Hours/Wk", subjects: "English Grammar, Lit", classTeacher: "" },
    { id: "teach-4", employeeNo: "GW-EMP-004", name: "Mr. Amit Rao", department: "Social Studies", workload: "14 Hours/Wk", subjects: "Indian History, Civics", classTeacher: "" },
    { id: "teach-5", employeeNo: "GW-EMP-005", name: "Mr. Satish Kumar", department: "Computers", workload: "12 Hours/Wk", subjects: "Coding Labs", classTeacher: "" },
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
      id: `teach-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
    };
    setTeachers([newRec, ...teachers]);
  };

  const handleRecordDelete = (row: any) => {
    setTeachers(teachers.filter((t) => t.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="employeeNo" label="Teacher Employee ID" required placeholder="e.g. GW-EMP-012" />
      <FormInput name="name" label="Teacher Full Name" required placeholder="e.g. Ms. Shalini Gupta" />
      <FormInput name="department" label="Department" required placeholder="e.g. Mathematics" />
      <FormInput name="workload" label="Weekly Workload (e.g. 18 Hours/Wk)" required placeholder="e.g. 18 Hours/Wk" />
      <FormInput name="subjects" label="Subjects Taught (comma separated)" required placeholder="e.g. Mathematics, Statistics" />
      <FormInput name="classTeacher" label="Class Teacher (Leave empty if none)" placeholder="e.g. 10-A" />
    </>
  );

  return (
    <ListViewTemplate
      title="Teachers Workload Directory"
      description="Administrative ledger of academic educators, teaching workloads, and primary subject mapping matrices."
      addLabel="Add Teacher"
      data={teachers}
      columns={teacherColumns}
      searchKey="name"
      searchPlaceholder="Search educators..."
      exportFileName="Greenwood_educators_workload"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
