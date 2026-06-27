"use client";

import React, { use, useState } from "react";
import { ClipboardList, PlusCircle, ArrowLeftRight, Clock, AlertTriangle, CheckCircle, RefreshCcw, Search, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Loan {
  id: string;
  bookTitle: string;
  isbn: string;
  borrowerName: string;
  borrowerId: string;
  borrowerType: "Student" | "Teacher";
  issueDate: string;
  dueDate: string;
  status: "Issued" | "Overdue";
}

export default function LibraryIssueReturnPage({
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

  const [activeLoans, setActiveLoans] = useState<Loan[]>([
    {
      id: "loan-1",
      bookTitle: "Introduction to Classical Physics",
      isbn: "978-81-7026-300-5",
      borrowerName: "Rahul Verma",
      borrowerId: "GW-STD-1002",
      borrowerType: "Student",
      issueDate: "2026-06-12",
      dueDate: "2026-06-26",
      status: "Overdue",
    },
    {
      id: "loan-2",
      bookTitle: "The C Programming Language (2nd Ed)",
      isbn: "978-0-13-110362-7",
      borrowerName: "Ms. Shalini Gupta",
      borrowerId: "GW-EMP-001",
      borrowerType: "Teacher",
      issueDate: "2026-06-15",
      dueDate: "2026-07-15",
      status: "Issued",
    },
    {
      id: "loan-3",
      bookTitle: "Higher Engineering Mathematics",
      isbn: "978-93-5134-174-1",
      borrowerName: "Sneha Sharma",
      borrowerId: "GW-STD-1088",
      borrowerType: "Student",
      issueDate: "2026-06-20",
      dueDate: "2026-07-04",
      status: "Issued",
    },
  ]);

  // Issue Book Form State
  const [isbn, setIsbn] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberType, setMemberType] = useState<"Student" | "Teacher">("Student");
  const [days, setDays] = useState("14");

  const [searchTerm, setSearchTerm] = useState("");

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isbn || !memberId || !memberName) return;

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + parseInt(days));

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      bookTitle: "Scanned Library Book Volume",
      isbn,
      borrowerName: memberName,
      borrowerId: memberId,
      borrowerType: memberType,
      issueDate: issueDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      status: "Issued",
    };

    setActiveLoans([newLoan, ...activeLoans]);
    toast.success(`Book issued successfully to ${memberName}!`);

    // Reset Form
    setIsbn("");
    setMemberId("");
    setMemberName("");
  };

  const handleReturnBook = (id: string, title: string) => {
    setActiveLoans(activeLoans.filter((l) => l.id !== id));
    toast.success(`Book "${title}" returned to shelves catalog.`);
  };

  const handleRenewBook = (id: string) => {
    setActiveLoans(
      activeLoans.map((l) => {
        if (l.id === id) {
          const currentDueDate = new Date(l.dueDate);
          currentDueDate.setDate(currentDueDate.getDate() + 14); // extend 14 days
          toast.success(`Extended checkout deadline by 14 days.`);
          return {
            ...l,
            dueDate: currentDueDate.toISOString().split("T")[0],
            status: "Issued",
          };
        }
        return l;
      })
    );
  };

  const filteredLoans = activeLoans.filter((l) => {
    return (
      l.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.borrowerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <PageContainer>
      <PageHeader
        title="Issue & Return Desk"
        description="Handle book lending logs, renew borrowing deadlines, check active loans, and record book returns."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm text-left space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Active Loan Sheets</span>
          <h3 className="text-2xl font-bold tracking-tight">{activeLoans.length} Loans</h3>
          <p className="text-[10px] text-muted-foreground">Books checked out right now</p>
        </div>

        <div className="bg-card border border-red-500/20 bg-red-500/[0.01] rounded-xl p-5 shadow-sm text-left space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-500">Overdue Returns</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-red-500 tracking-tight">
            {activeLoans.filter((l) => l.status === "Overdue").length} Books
          </h3>
          <p className="text-[10px] text-muted-foreground">Late submission fines applied</p>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm text-left space-y-1">
          <span className="text-xs font-medium text-muted-foreground">System Audit Status</span>
          <h3 className="text-base font-bold text-green-500 tracking-tight flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Clear Logs
          </h3>
          <p className="text-[10px] text-muted-foreground">Real-time book movements synced</p>
        </div>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="bg-card border h-10 p-0.5 rounded-lg flex justify-start max-w-sm mb-6">
          <TabsTrigger value="loans" className="text-xs">Active Loans Ledger</TabsTrigger>
          <TabsTrigger value="issue" className="text-xs">Issue New Book</TabsTrigger>
        </TabsList>

        {/* Active Checked out loans */}
        <TabsContent value="loans">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-4 shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search active loans..."
                className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-xs text-muted-foreground font-semibold">
              Showing {filteredLoans.length} entries
            </span>
          </div>

          <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <th className="p-4 font-semibold">Book Title Details</th>
                  <th className="p-4 font-semibold">Borrower Name</th>
                  <th className="p-4 font-semibold">Member Code</th>
                  <th className="p-4 font-semibold">Date Mapped</th>
                  <th className="p-4 font-semibold">Deadline Date</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No active book checkouts found.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan) => (
                    <tr key={loan.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{loan.bookTitle}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">ISBN: {loan.isbn}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{loan.borrowerName}</div>
                        <div className="text-[10px] text-muted-foreground">{loan.borrowerType}</div>
                      </td>
                      <td className="p-4 font-mono text-foreground font-semibold">{loan.borrowerId}</td>
                      <td className="p-4 text-muted-foreground">{loan.issueDate}</td>
                      <td className="p-4 text-muted-foreground font-semibold">{loan.dueDate}</td>
                      <td className="p-4 text-center">
                        {loan.status === "Overdue" ? (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-bold uppercase text-[9px]">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-bold uppercase text-[9px]">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRenewBook(loan.id)}
                            title="Renew / Extend loan"
                            className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                          >
                            <RefreshCcw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleReturnBook(loan.id, loan.bookTitle)}
                            className="px-2 py-1 text-[10px] bg-green-500 text-white rounded hover:bg-green-600 font-semibold uppercase"
                          >
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Issue Book Form */}
        <TabsContent value="issue">
          <div className="max-w-md bg-card border rounded-xl p-6 shadow-sm mx-auto text-left">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5 border-b pb-3 mb-4">
              <PlusCircle className="h-4.5 w-4.5 text-primary" />
              Lend Book to Library Member
            </h3>

            <form onSubmit={handleIssueBook} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Book ISBN</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 978-81-7026-300-5"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Member ID Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GW-STD-1002"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Member Type</label>
                  <select
                    value={memberType}
                    onChange={(e) => setMemberType(e.target.value as any)}
                    className="w-full border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher / Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Borrower Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Lending Duration</label>
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none"
                >
                  <option value="7">7 Days (Short Loan)</option>
                  <option value="14">14 Days (Standard Loan)</option>
                  <option value="30">30 Days (Extended Term)</option>
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full text-xs font-bold py-2 bg-primary text-primary-foreground hover:bg-primary/95">
                  Confirm Book Issue
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
