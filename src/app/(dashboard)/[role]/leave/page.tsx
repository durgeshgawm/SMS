"use client";

import React, { use } from "react";
import { ApprovalPageTemplate, ApprovalRequest } from "@/components/templates/approval-page";
import { UserRole } from "@/types/common";

const mockHRLeaveRequests: ApprovalRequest[] = [
  {
    id: "hr-leave-1",
    title: "Employee Sick Leave Notice",
    requester: "Ms. Shalini Gupta (Maths Dept)",
    date: "2026-06-25",
    type: "Sick Leave",
    status: "pending",
    details: {
      "Employee ID": "GW-EMP-001",
      "Leave Category": "Sick / Medical Leave",
      "Duration Requested": "2 Days (28th June - 29th June)",
      "Reason for Leave": "Severe throat infection and vocal rest recommended by physician.",
      "Workload Handover": "Classes allocated to substitute Mr. Satish Kumar."
    },
    timeline: [
      { title: "Substitute Assigned", desc: "Timetable updated with substitute classes.", time: "Yesterday, 03:30 PM", user: "Mr. Amit Rao (Academic Head)" },
      { title: "Request Filed", desc: "Submitted sick leave application.", time: "Yesterday, 10:15 AM", user: "Ms. Shalini Gupta (Employee)" }
    ]
  },
  {
    id: "hr-leave-2",
    title: "Employee Casual Leave Request",
    requester: "Mr. Rajesh Kumar (Hostel Warden)",
    date: "2026-06-24",
    type: "Casual Leave",
    status: "pending",
    details: {
      "Employee ID": "GW-EMP-004",
      "Leave Category": "Casual Leave Request",
      "Duration Requested": "3 Days (01st July - 03rd July)",
      "Reason for Leave": "Attending personal family property registration in hometown.",
      "Workload Handover": "Assistant warden assigned to monitor boys block."
    },
    timeline: [
      { title: "Warden Handover Confirmed", desc: "Assistant warden signed monitoring sheets.", time: "24 Jun, 02:00 PM", user: "Warden Desk" },
      { title: "Request Filed", desc: "Casual leave request registered.", time: "24 Jun, 09:30 AM", user: "Mr. Rajesh Kumar (Employee)" }
    ]
  }
];

export default function HRLeaveApprovalsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  return (
    <ApprovalPageTemplate
      title="Staff Leave Approvals Feed"
      description="Process and monitor medical leave notices and casual leave applications for institutional employees."
      requests={mockHRLeaveRequests}
    />
  );
}
