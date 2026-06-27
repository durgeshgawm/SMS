"use client";

import React, { use, useState } from "react";
import { UserCheck, CheckCircle2, XCircle, AlertCircle, Save, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { mockStudents } from "@/data/mock-db";
import { UserRole } from "@/types/common";

interface AttendanceRecord {
  id: string;
  name: string;
  admissionNo: string;
  rollNo: string;
  status: "present" | "absent" | "late";
}

export default function DailyAttendancePage({
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

  // Attendance Records state mapped from mockStudents
  const [records, setRecords] = useState<AttendanceRecord[]>(
    mockStudents.map((s) => ({
      id: s.id,
      name: s.name,
      admissionNo: s.admissionNo,
      rollNo: s.rollNo,
      status: "present", // default to present
    }))
  );

  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (id: string, status: AttendanceRecord["status"]) => {
    setRecords(records.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleSaveAttendance = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Attendance roster for ${selectedClass}-${selectedSection} logged successfully!`);
    }, 1200);
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Daily Attendance Register"
        description="Record and submit daily class attendance rolls."
        actions={
          <Button onClick={handleSaveAttendance} disabled={isSubmitting} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span>Submit Attendance</span>
          </Button>
        }
      />

      {/* Filter Header Card */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm mb-6 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider mb-3">
          <Filter className="h-3.5 w-3.5 text-primary" />
          <span>Class Filter</span>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 max-w-xl">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Class Level</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-8 border bg-card text-xs rounded-lg px-2"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full h-8 border bg-card text-xs rounded-lg px-2"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Logging Table */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-left">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Student Attendance Roster</span>
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            Total Students: {records.length} | Present: {records.filter((r) => r.status === "present").length} | Absent: {records.filter((r) => r.status === "absent").length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 font-semibold text-muted-foreground">Roll No</th>
                <th className="pb-3 font-semibold text-muted-foreground">Admission No</th>
                <th className="pb-3 font-semibold text-muted-foreground">Student Name</th>
                <th className="pb-3 font-semibold text-muted-foreground text-center">Attendance Toggles</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="py-3 font-mono text-muted-foreground">{row.rollNo}</td>
                  <td className="py-3 font-mono text-muted-foreground">{row.admissionNo}</td>
                  <td className="py-3 font-semibold text-foreground">{row.name}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Present */}
                      <button
                        onClick={() => handleStatusChange(row.id, "present")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                          row.status === "present"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "hover:bg-muted text-muted-foreground border-border/60"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Present</span>
                      </button>

                      {/* Late */}
                      <button
                        onClick={() => handleStatusChange(row.id, "late")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                          row.status === "late"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "hover:bg-muted text-muted-foreground border-border/60"
                        }`}
                      >
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Late</span>
                      </button>

                      {/* Absent */}
                      <button
                        onClick={() => handleStatusChange(row.id, "absent")}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                          row.status === "absent"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "hover:bg-muted text-muted-foreground border-border/60"
                        }`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
