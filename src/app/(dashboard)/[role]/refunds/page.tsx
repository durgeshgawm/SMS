"use client";

import React, { use } from "react";
import { ApprovalPageTemplate, ApprovalRequest } from "@/components/templates/approval-page";
import { UserRole } from "@/types/common";

const mockRefundRequests: ApprovalRequest[] = [
  {
    id: "ref-1",
    title: "Admission Withdrawal caution Refund",
    requester: "Simran Kaur (Class 8)",
    date: "2026-06-25",
    type: "Withdrawal Refund",
    status: "pending",
    details: {
      "Student ID": "GW-2026-214",
      "Refund Category": "Caution / Security Deposit Refund",
      "Refund Amount": "₹10,000 (Standard caution waiver)",
      "Reason for Withdrawal": "Family relocation to Chennai branch.",
      "Beneficiary Bank Account": "HDFC Bank A/C 984210583 (IFSC: HDFC0001428)"
    },
    timeline: [
      { title: "Withdrawal Approved", desc: "Student withdrawal verified by Branch Admin.", time: "Yesterday, 04:30 PM", user: "Vikram Malhotra (Branch Admin)" },
      { title: "Refund Filed", desc: "Security deposit return filed.", time: "Yesterday, 11:20 AM", user: "Parent Account" }
    ]
  },
  {
    id: "ref-2",
    title: "Double Online Fee Payment Refund",
    requester: "Aarav Sharma (Class 10)",
    date: "2026-06-24",
    type: "Duplicate Transaction Error",
    status: "pending",
    details: {
      "Student ID": "GW-2026-401",
      "Refund Category": "Duplicate Online Transaction Refund",
      "Refund Amount": "₹12,500 (Term 1 tuition excess)",
      "Reason for Claim": "Razorpay double debit transaction error.",
      "Beneficiary Bank Account": "ICICI Bank A/C 458921004 (IFSC: ICIC0000104)"
    },
    timeline: [
      { title: "Gateway Logs Verified", desc: "Razorpay logs confirm duplicate Txn ID #UPI586249150.", time: "24 Jun, 03:15 PM", user: "Accounts Bureau Clerk" },
      { title: "Claim Registered", desc: "Filed double payment claim.", time: "24 Jun, 10:00 AM", user: "Parent Account" }
    ]
  }
];

export default function RefundsApprovalsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "finance" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  return (
    <ApprovalPageTemplate
      title="Dues & Refund Approvals Feed"
      description="Review and process student security deposit refunds and online gateway duplicate transaction returns."
      requests={mockRefundRequests}
    />
  );
}
