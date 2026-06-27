"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput } from "@/components/forms";
import { UserRole } from "@/types/common";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { BellRing } from "lucide-react";

interface OverdueDue {
  id: string;
  name: string;
  className: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
  phone: string;
}

export default function DueManagementPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [dues, setDues] = useState<OverdueDue[]>([
    { id: "due-1", name: "Rohan Sen", className: "Class 9-C", amount: 12000, dueDate: "2026-06-25", overdueDays: 1, phone: "9812739485" },
    { id: "due-2", name: "Kabir Dev", className: "Class 9-A", amount: 8000, dueDate: "2026-06-22", overdueDays: 4, phone: "9123456789" },
    { id: "due-3", name: "Priya Patel", className: "Class 10-B", amount: 10000, dueDate: "2026-06-18", overdueDays: 8, phone: "9988776655" },
  ]);

  if (role !== "super-admin" && role !== "finance" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleSendReminder = (row: OverdueDue) => {
    toast.success(`Dues reminder SMS broadcast sent to guardian of ${row.name} (+91 ${row.phone})!`);
  };

  const dueCols: ColumnDef<OverdueDue>[] = [
    { accessorKey: "name", header: "Student Name" },
    { accessorKey: "className", header: "Class" },
    {
      accessorKey: "amount",
      header: "Outstanding Dues (₹)",
      cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
    },
    { accessorKey: "dueDate", header: "Due Date" },
    {
      accessorKey: "overdueDays",
      header: "Overdue Timeline",
      cell: ({ row }) => (
        <span className="text-red-500 font-semibold">{row.original.overdueDays} Days Overdue</span>
      ),
    },
    { accessorKey: "phone", header: "Guardian Contact" },
    {
      id: "remind",
      header: "Broadcast Alert",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSendReminder(row.original)}
          className="h-7 text-[10px] font-bold px-2 flex items-center gap-1 border-red-500/20 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <BellRing className="h-3 w-3 shrink-0" />
          <span>Remind SMS</span>
        </Button>
      ),
    },
  ];

  const handleRecordAdd = (values: any) => {
    const newRec: OverdueDue = {
      id: `due-${Math.floor(Math.random() * 900) + 100}`,
      name: values.name,
      className: values.className,
      amount: parseFloat(values.amount),
      dueDate: values.dueDate,
      overdueDays: parseInt(values.overdueDays || "0"),
      phone: values.phone,
    };
    setDues([newRec, ...dues]);
  };

  const handleRecordDelete = (row: OverdueDue) => {
    setDues(dues.filter((d) => d.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Student Full Name" required placeholder="e.g. Kabir Dev" />
      <FormInput name="className" label="Class Division" required placeholder="e.g. Class 10-A" />
      <FormInput name="amount" label="Outstanding Amount (₹)" type="number" required placeholder="e.g. 8000" />
      <FormInput name="dueDate" label="Due Date" type="date" required />
      <FormInput name="overdueDays" label="Overdue Days" type="number" placeholder="e.g. 5" />
      <FormInput name="phone" label="Guardian Phone No" required placeholder="e.g. 9876543210" />
    </>
  );

  return (
    <ListViewTemplate
      title="Overdue Dues Reminders"
      description="Monitor outstanding fee ledgers and dispatch automated SMS payment reminders to parents."
      addLabel="Add Dues Entry"
      data={dues}
      columns={dueCols}
      searchKey="name"
      searchPlaceholder="Search outstanding dues..."
      exportFileName="Greenwood_overdue_reminders"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
