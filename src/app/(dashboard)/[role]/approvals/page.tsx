"use client";

import React, { use } from "react";
import { ApprovalPageTemplate, ApprovalRequest } from "@/components/templates/approval-page";
import { UserRole } from "@/types/common";

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: "app-1",
    title: "Student Medical Leave Request",
    requester: "Kabir Dev (Class 9-A)",
    date: "2026-06-25",
    type: "Leave Request",
    status: "pending",
    details: {
      "Reason for Leave": "High fever and viral infection recovery.",
      "Duration Requested": "3 Days (28th June - 30th June)",
      "Parent Consent Verified": "Yes (via SMS gateway)",
      "Medical Certificate Attached": "Yes (physician letter uploaded)"
    },
    timeline: [
      { title: "Parent Consent Submitted", desc: "Guardian verified leave notice", time: "09:30 AM", user: "Rajesh Dev (Parent)" },
      { title: "Request Filed", desc: "Submitted to class teacher", time: "08:15 AM", user: "Kabir Dev (Student)" }
    ]
  },
  {
    id: "app-2",
    title: "Fee Merit Discount Request",
    requester: "Rohan Sen (Class 9-C)",
    date: "2026-06-24",
    type: "Fee Discount",
    status: "pending",
    details: {
      "Discount Category": "Merit Scholarship Waiver",
      "Requested Discount": "15% Term 2 Tuition Waiver",
      "Previous Semester Score": "92.4% aggregate",
      "Outstanding Dues Status": "None (fully clear)"
    },
    timeline: [
      { title: "Marks Verified", desc: "Aggregate score check complete", time: "04:30 PM", user: "Ms. Shalini Gupta (Class Teacher)" },
      { title: "Discount Request Filed", desc: "Sent to finance review board", time: "11:20 AM", user: "Rohan Sen (Student)" }
    ]
  },
  {
    id: "app-3",
    title: "Hostel Room Allocation Request",
    requester: "Priya Patel (Class 10-B)",
    date: "2026-06-22",
    type: "Hostel Room Allotment",
    status: "approved",
    details: {
      "Preferred Block": "Girls B-Block Room 202",
      "Room Category": "Triple Sharing Suite",
      "Medical Assistance": "None needed",
      "Allotment Status": "Active (Term 1)"
    },
    timeline: [
      { title: "Room Assigned", desc: "Triple sharing bed logged", time: "10:15 AM", user: "Aarti Deshpande (Warden)" },
      { title: "Request Submitted", desc: "Filed via portal hostel module", time: "09:00 AM", user: "Priya Patel (Student)" }
    ]
  }
];

export default function BranchApprovalsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  return (
    <ApprovalPageTemplate
      title="Branch Approvals Feed"
      description="Review and process student leave notices, scholarship discount waivers, and hostel room allotting registrations."
      requests={mockApprovalRequests}
    />
  );
}
