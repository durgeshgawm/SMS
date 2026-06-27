"use client";

import React, { use } from "react";
import { ApprovalPageTemplate, ApprovalRequest } from "@/components/templates/approval-page";
import { UserRole } from "@/types/common";

const mockLeaveRequests: ApprovalRequest[] = [
  {
    id: "req-701",
    title: "Sick Leave Request",
    requester: "Aarav Sharma (Class 10)",
    date: "26 Jun 2026",
    type: "Medical Leave",
    status: "pending",
    details: {
      "Student ID": "GW-2026-401",
      "Leave Type": "Medical / Sick Leave",
      "From Date": "28 Jun 2026",
      "To Date": "30 Jun 2026",
      "Total Days": "3 Days",
      "Reason for Leave": "Diagnosed with viral fever. Rest and medication prescribed by school medical head.",
    },
    timeline: [
      { title: "Request Submitted", desc: "Leave request logged via parent portal application.", time: "Today, 08:30 AM", user: "Parent Account" },
    ],
  },
  {
    id: "req-702",
    title: "Family Marriage Occasion",
    requester: "Rahul Verma (Class 10)",
    date: "25 Jun 2026",
    type: "Casual Leave",
    status: "pending",
    details: {
      "Student ID": "GW-2026-508",
      "Leave Type": "Casual Leave",
      "From Date": "02 Jul 2026",
      "To Date": "05 Jul 2026",
      "Total Days": "4 Days",
      "Reason for Leave": "Attending elder brother's wedding ceremony in Jaipur.",
    },
    timeline: [
      { title: "Request Submitted", desc: "Leave request registered with wedding invitation card pdf attachment.", time: "Yesterday, 04:15 PM", user: "Parent Account" },
    ],
  },
  {
    id: "req-703",
    title: "Athletics Event Training",
    requester: "Simran Kaur (Class 8)",
    date: "24 Jun 2026",
    type: "Duty Leave",
    status: "approved",
    details: {
      "Student ID": "GW-2026-214",
      "Leave Type": "Duty Leave / Sports",
      "From Date": "25 Jun 2026",
      "To Date": "26 Jun 2026",
      "Total Days": "2 Days",
      "Reason for Leave": "Representing the school academy in state-level athletics training camp.",
    },
    timeline: [
      { title: "Request Approved", desc: "Duty leave sanctioned by Sports Coordinator.", time: "24 Jun 2026, 02:00 PM", user: "Super Admin" },
      { title: "Request Submitted", desc: "Duty leave request registered.", time: "24 Jun 2026, 10:00 AM", user: "Student Portal" },
    ],
  },
];

export default function StudentLeaveRequestsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "branch-admin" && role !== "academic") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  return (
    <ApprovalPageTemplate
      title="Student Leave Requests"
      description="Manage and process leave requests, medical absences, and duty leave sanctions."
      requests={mockLeaveRequests}
    />
  );
}
