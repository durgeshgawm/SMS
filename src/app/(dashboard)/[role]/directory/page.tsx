"use client";

import React, { use, useState } from "react";
import { User, Briefcase, FileText, Printer, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/common";

export default function EmployeeDirectoryPage({
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

  const [selectedStaff, setSelectedStaff] = useState({
    id: "emp-1",
    employeeNo: "GW-EMP-001",
    name: "Ms. Shalini Gupta",
    role: "teacher",
    department: "Academics",
    designation: "Senior Mathematics Lecturer",
    phone: "+91 94561 23789",
    email: "shalini.g@school.com",
    status: "active",
    salary: 75000,
    joiningDate: "2024-06-15",
    panNo: "ABCDE1234F",
    bankAccount: "98421058312",
  });

  return (
    <PageContainer>
      <PageHeader
        title="Employee File Dossier"
        description="Individual institutional employee dossier, employment history, and payroll details."
        actions={
          <Button onClick={() => window.print()} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>Print Employee dossier</span>
          </Button>
        }
      />

      <div className="space-y-6 text-left">
        {/* Profile Card Header */}
        <div className="flex flex-col items-center sm:flex-row gap-6 p-6 border rounded-xl bg-card shadow-sm">
          <div className="h-24 w-24 rounded-full border bg-primary/10 text-primary flex items-center justify-center text-3xl font-extrabold shrink-0">
            SG
          </div>
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-foreground">{selectedStaff.name}</h2>
              <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase border border-green-500/20">
                Active Employee
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              ID: {selectedStaff.employeeNo} | {selectedStaff.designation} ({selectedStaff.department})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div><strong>Email:</strong> {selectedStaff.email}</div>
              <div><strong>Contact Phone:</strong> {selectedStaff.phone}</div>
              <div><strong>Joining Date:</strong> {selectedStaff.joiningDate}</div>
            </div>
          </div>
        </div>

        {/* Tabs System */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card border h-10 p-0.5 rounded-lg flex justify-start max-w-md">
            <TabsTrigger value="profile" className="text-xs">Profile Overview</TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs">Salary & Wages</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">Tax Documents</TabsTrigger>
          </TabsList>

          {/* Profile Overview Content */}
          <TabsContent value="profile" className="pt-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 bg-card rounded-xl border p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Recent HR Activity Logs</h3>
                <div className="space-y-3.5">
                  {[
                    { title: "Monthly Payroll Generated", desc: "Payslip logged for June 2026", date: "Today, 09:45 AM" },
                    { title: "Leave Sanctioned", desc: "2 days Casual Leave approved by HR manager", date: "15 Jun 2026" },
                    { title: "Annual Review Completed", desc: "Excellence rating received from Academic Head", date: "10 May 2026" },
                  ].map((act, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-xs border-b pb-3.5 last:border-0 last:pb-0">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-foreground">{act.title}</h4>
                        <p className="text-muted-foreground text-[11px]">{act.desc}</p>
                        <span className="text-[10px] text-muted-foreground block pt-1">{act.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Active Class Allocations</h3>
                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p><strong>Primary Class Teacher:</strong> Class 10 - Section A</p>
                  <p><strong>Mapped Subjects:</strong> Mathematics Paper I, Mathematics Paper II</p>
                  <p><strong>Weekly Workload:</strong> 18 Teaching Hours/Week</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Salary History Content */}
          <TabsContent value="payroll" className="pt-4">
            <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground">Salary Disbursement Structure</h3>
              <div className="grid gap-4 sm:grid-cols-3 text-xs border-b pb-4 mb-4">
                <div>
                  <span className="text-muted-foreground block">Monthly Base Salary</span>
                  <strong className="text-sm text-foreground">₹{selectedStaff.salary.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Salary Bank Account</span>
                  <strong className="text-sm text-foreground">SBI A/C {selectedStaff.bankAccount}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Bank IFSC Code</span>
                  <strong className="text-sm text-foreground">SBIN0001428</strong>
                </div>
              </div>

              <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider mb-2">Disbursement Payout History</span>
              <table className="w-full text-xs text-left border-collapse border border-border">
                <thead>
                  <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                    <th className="p-3 border-r">Payslip ID</th>
                    <th className="p-3 border-r">Month</th>
                    <th className="p-3 border-r">Base Paid</th>
                    <th className="p-3 border-r">Deductions</th>
                    <th className="p-3">Net Payout</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 border-r font-mono">GW-PAY-06-2026</td>
                    <td className="p-3 border-r font-semibold">June 2026</td>
                    <td className="p-3 border-r">₹50,000</td>
                    <td className="p-3 border-r text-red-500">-₹4,500</td>
                    <td className="p-3 font-semibold text-green-500">₹45,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Documents Content */}
          <TabsContent value="documents" className="pt-4">
            <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground">Tax Identification & Credentials</h3>
              <div className="space-y-3.5 text-xs text-muted-foreground leading-normal max-w-md">
                <p><strong>Permanent Account Number (PAN):</strong> {selectedStaff.panNo}</p>
                <div className="flex items-center gap-2 p-3 bg-green-500/5 rounded-lg border border-green-500/20 text-green-600">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span className="font-semibold text-[11px]">PAN card verification verified by Tax Department node</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
