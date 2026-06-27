"use client";

import React, { use, useState } from "react";
import { History, Search, Filter, Calendar, BookOpen, User, CheckCircle, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/types/common";

interface AuditLog {
  id: string;
  timestamp: string;
  action: "Issue" | "Return" | "Renew" | "Fine Charged" | "Fine Collected";
  cardId: string;
  memberName: string;
  bookTitle: string;
  details: string;
  operator: string;
}

export default function LibraryTransactionsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "library") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: "log-1",
      timestamp: "2026-06-26 04:30 PM",
      action: "Issue",
      cardId: "GW-LIB-0001",
      memberName: "Rahul Verma",
      bookTitle: "Introduction to Classical Physics",
      details: "Issued standard 14 days loan. Deadline: 2026-07-10",
      operator: "Mrs. Veena Sen (Librarian)",
    },
    {
      id: "log-2",
      timestamp: "2026-06-26 02:15 PM",
      action: "Return",
      cardId: "GW-LIB-0003",
      memberName: "Sneha Sharma",
      bookTitle: "The C Programming Language",
      details: "Returned book in perfect condition. Overdue fines paid.",
      operator: "Mrs. Veena Sen (Librarian)",
    },
    {
      id: "log-3",
      timestamp: "2026-06-25 11:20 AM",
      action: "Renew",
      cardId: "GW-LIB-0002",
      memberName: "Ms. Shalini Gupta",
      bookTitle: "Higher Engineering Mathematics",
      details: "Extended lending limit by 14 days. New Deadline: 2026-07-15",
      operator: "Mrs. Veena Sen (Librarian)",
    },
    {
      id: "log-4",
      timestamp: "2026-06-25 09:45 AM",
      action: "Fine Charged",
      cardId: "GW-LIB-0004",
      memberName: "Mr. Rajesh Kumar",
      bookTitle: "History of Ancient India",
      details: "Charged ₹90 INR penalty (18 days overdue)",
      operator: "System Audit (Cron)",
    },
    {
      id: "log-5",
      timestamp: "2026-06-24 03:10 PM",
      action: "Fine Collected",
      cardId: "GW-LIB-0003",
      memberName: "Sneha Sharma",
      bookTitle: "The C Programming Language",
      details: "Collected ₹20 INR cash late fee penalty",
      operator: "Mrs. Veena Sen (Librarian)",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === "all" || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "Issue":
        return (
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded font-bold text-[9px] uppercase border border-blue-500/20">
            Issue
          </span>
        );
      case "Return":
        return (
          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-bold text-[9px] uppercase border border-green-500/20">
            Return
          </span>
        );
      case "Renew":
        return (
          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded font-bold text-[9px] uppercase border border-purple-500/20">
            Renew
          </span>
        );
      case "Fine Charged":
        return (
          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded font-bold text-[9px] uppercase border border-red-500/20">
            Charged
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded font-bold text-[9px] uppercase border border-amber-500/20">
            Collected
          </span>
        );
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Library Transactions history"
        description="View chronological library book logs, checkout audit records, and late penalty ledger details."
      />

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Logs Recorded</span>
          <h3 className="text-2xl font-bold tracking-tight">{logs.length} Actions</h3>
          <div className="text-[10px] text-muted-foreground">All transaction categories</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Books Issued Logs</span>
          <h3 className="text-2xl font-bold text-blue-500 tracking-tight">
            {logs.filter((l) => l.action === "Issue").length} Actions
          </h3>
          <div className="text-[10px] text-muted-foreground">Lending checkout entries</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Books Returned Logs</span>
          <h3 className="text-2xl font-bold text-green-500 tracking-tight">
            {logs.filter((l) => l.action === "Return").length} Actions
          </h3>
          <div className="text-[10px] text-muted-foreground">Catalog return entries</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Fines Generated Logs</span>
          <h3 className="text-2xl font-bold text-red-500 tracking-tight">
            {logs.filter((l) => l.action === "Fine Charged").length} Actions
          </h3>
          <div className="text-[10px] text-muted-foreground">Late return policy charges</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transaction logs..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Action Type:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="Issue">Issue Book</option>
            <option value="Return">Return Book</option>
            <option value="Renew">Renew Loan</option>
            <option value="Fine Charged">Charge Fine</option>
            <option value="Fine Collected">Collect Fine</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Card ID</th>
              <th className="p-4 font-semibold">Member Name</th>
              <th className="p-4 font-semibold">Book Mapped</th>
              <th className="p-4 font-semibold">Details Summary</th>
              <th className="p-4 font-semibold">Operator / Auditor</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No transaction audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">{getActionBadge(log.action)}</td>
                  <td className="p-4 font-mono font-bold text-foreground">{log.cardId}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {log.memberName}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                      {log.bookTitle}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground font-medium">{log.details}</td>
                  <td className="p-4 text-muted-foreground font-semibold italic">{log.operator}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
