"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const classColumns: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Class Level" },
  { accessorKey: "sections", header: "Active Sections" },
  { accessorKey: "capacity", header: "Max capacity" },
  { accessorKey: "enrolled", header: "Enrolled Students" },
  { accessorKey: "classTeacher", header: "Class Teacher" },
  { accessorKey: "roomNo", header: "Classroom No" },
];

export default function ClassAndSectionsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [classes, setClasses] = useState([
    { id: "cls-1", name: "Class 10", sections: "A, B, C", capacity: 120, enrolled: 110, classTeacher: "Ms. Shalini Gupta", roomNo: "Room 401" },
    { id: "cls-2", name: "Class 9", sections: "A, B, C", capacity: 120, enrolled: 98, classTeacher: "Mr. Amit Rao", roomNo: "Room 402" },
    { id: "cls-3", name: "Class 8", sections: "A, B", capacity: 80, enrolled: 76, classTeacher: "Ms. Sunita Deshmukh", roomNo: "Room 301" },
    { id: "cls-4", name: "Class 7", sections: "A, B", capacity: 80, enrolled: 68, classTeacher: "Mr. Rajesh Kumar", roomNo: "Room 302" },
    { id: "cls-5", name: "Class 6", sections: "A", capacity: 40, enrolled: 35, classTeacher: "Mr. Vikram Malhotra", roomNo: "Room 201" },
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
      id: `cls-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
    };
    setClasses([newRec, ...classes]);
  };

  const handleRecordDelete = (row: any) => {
    setClasses(classes.filter((c) => c.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Class Level Name" required placeholder="e.g. Class 11 Science" />
      <FormInput name="sections" label="Active Sections (comma separated)" required placeholder="e.g. A, B, C" />
      <FormInput name="capacity" label="Total Intake Capacity" type="number" required placeholder="e.g. 120" />
      <FormInput name="enrolled" label="Enrolled Count" type="number" required placeholder="e.g. 80" />
      <FormInput name="classTeacher" label="Assigned Class Teacher" required placeholder="e.g. Ms. Shalini Gupta" />
      <FormInput name="roomNo" label="Assigned Classroom" required placeholder="e.g. Room 403" />
    </>
  );

  return (
    <ListViewTemplate
      title="Class & Sections Directory"
      description="Register, allocate, and monitor class directories and primary class teacher mappings."
      addLabel="Create Class"
      data={classes}
      columns={classColumns}
      searchKey="name"
      searchPlaceholder="Search classes..."
      exportFileName="Greenwood_class_allocations"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
