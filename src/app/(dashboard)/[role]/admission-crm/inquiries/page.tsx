"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

interface InquiryLead {
  id: string;
  name: string;
  contact: string;
  courseInquiry: string;
  status: string;
  assignCounselor: string;
}

const inquiryCols: ColumnDef<InquiryLead>[] = [
  { accessorKey: "id", header: "Lead ID" },
  { accessorKey: "name", header: "Lead Name" },
  { accessorKey: "contact", header: "Contact No" },
  { accessorKey: "courseInquiry", header: "Inquiry For" },
  {
    accessorKey: "status",
    header: "Lead Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s.includes("New") ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
          s.includes("Hot") ? "bg-red-500/10 text-red-500 border-red-500/20" :
          s.includes("Registered") ? "bg-green-500/10 text-green-500 border-green-500/20" :
          "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
  { accessorKey: "assignCounselor", header: "Counselor" },
];

const mockInquiries: InquiryLead[] = [
  { id: "GW-L-501", name: "Ananya Roy", contact: "9876543122", courseInquiry: "Class 11 Science", status: "Hot Followup", assignCounselor: "Ms. Shalini Gupta" },
  { id: "GW-L-502", name: "Rohan Das", contact: "9988771144", courseInquiry: "Class 6 Primary", status: "New Lead", assignCounselor: "Mr. Dean Rao" },
  { id: "GW-L-503", name: "Preeti Singh", contact: "9564871239", courseInquiry: "Class 9 General", status: "Contacted", assignCounselor: "Ms. Shalini Gupta" },
  { id: "GW-L-504", name: "Aman Varma", contact: "9215487611", courseInquiry: "Class 10 General", status: "Registered", assignCounselor: "Mr. Dean Rao" },
  { id: "GW-L-505", name: "Neha Roy", contact: "9812457800", courseInquiry: "Class 11 Humanities", status: "Closed Lost", assignCounselor: "Ms. Shalini Gupta" },
];

export default function InquiriesListPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const [inquiries, setInquiries] = useState(mockInquiries);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec: InquiryLead = {
      id: `GW-L-${Math.floor(Math.random() * 900) + 100}`,
      name: values.name,
      contact: values.contact,
      courseInquiry: values.courseInquiry,
      status: values.status,
      assignCounselor: values.assignCounselor || "Ms. Shalini Gupta",
    };
    setInquiries([newRec, ...inquiries]);
  };

  const handleRecordDelete = (row: InquiryLead) => {
    setInquiries(inquiries.filter((i) => i.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="name" label="Lead Name" required placeholder="e.g. Aman Verma" />
      <FormInput name="contact" label="Contact No" required placeholder="e.g. 9876543210" />
      <FormInput name="courseInquiry" label="Inquiry For Course" required placeholder="e.g. Class 10" />
      <FormSelect
        name="status"
        label="Lead Status"
        required
        options={[
          { value: "New Lead", label: "New Lead" },
          { value: "Contacted", label: "Contacted" },
          { value: "Hot Followup", label: "Hot Followup" },
          { value: "Registered", label: "Registered" },
        ]}
      />
      <FormSelect
        name="assignCounselor"
        label="Assigned Counselor"
        required
        options={[
          { value: "Ms. Shalini Gupta", label: "Ms. Shalini Gupta" },
          { value: "Mr. Dean Rao", label: "Mr. Dean Rao" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Admission Inquiries"
      description="Register and follow up on school inquiry leads generated from various marketing campaigns."
      addLabel="Record Inquiry"
      data={inquiries}
      columns={inquiryCols}
      searchKey="name"
      searchPlaceholder="Search leads list..."
      exportFileName="Greenwood_inquiries_ledger"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
