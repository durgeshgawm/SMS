"use client";

import React, { use, useState } from "react";
import { Award, GraduationCap, Percent, BookOpenCheck } from "lucide-react";
import { ReportPageTemplate } from "@/components/templates/report-page";
import { ColumnDef } from "@tanstack/react-table";
import { UserRole } from "@/types/common";

interface StudentResult {
  id: string;
  rank: number;
  rollNo: string;
  name: string;
  maths: number;
  science: number;
  english: number;
  percentage: number;
  grade: string;
}

const resultColumns: ColumnDef<StudentResult>[] = [
  { accessorKey: "rank", header: "Class Rank" },
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "name", header: "Student Name" },
  { accessorKey: "maths", header: "Mathematics (%)" },
  { accessorKey: "science", header: "General Science (%)" },
  { accessorKey: "english", header: "English Lit (%)" },
  {
    accessorKey: "percentage",
    header: "Aggregate (%)",
    cell: ({ row }) => `${row.original.percentage}%`,
  },
  {
    accessorKey: "grade",
    header: "Assigned Grade",
    cell: ({ row }) => {
      const g = row.original.grade;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          g.includes("A") ? "bg-green-500/10 text-green-500 border-green-500/20" :
          g.includes("B") ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
          "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {g}
        </span>
      );
    }
  },
];

export default function ResultsLedgerPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "academic" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [selectedClass, setSelectedClass] = useState("Class 10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedExam, setSelectedExam] = useState("Semester Final Exams 2026");

  const resultsData: StudentResult[] = [
    { id: "res-1", rank: 1, rollNo: "10", name: "Aarav Sharma", maths: 96, science: 98, english: 94, percentage: 96, grade: "A+" },
    { id: "res-2", rank: 2, rollNo: "12", name: "Aanya Verma", maths: 92, science: 94, english: 90, percentage: 92, grade: "A+" },
    { id: "res-3", rank: 3, rollNo: "24", name: "Priya Patel", maths: 88, science: 90, english: 86, percentage: 88, grade: "A" },
    { id: "res-4", rank: 4, rollNo: "05", name: "Kabir Dev", maths: 82, science: 80, english: 78, percentage: 80, grade: "B+" },
    { id: "res-5", rank: 5, rollNo: "18", name: "Rohan Sen", maths: 76, science: 74, english: 72, percentage: 74, grade: "B" },
  ];

  const summaryKPIs = [
    { title: "Average Score", value: "86.0%", icon: Percent, color: "blue" as const },
    { title: "Pass Percentage", value: "100.0%", icon: Award, color: "green" as const },
    { title: "Top Scorer", value: "Aarav (96%)", icon: GraduationCap, color: "purple" as const },
    { title: "Total Evaluated", value: "5 Students", icon: BookOpenCheck, color: "orange" as const },
  ];

  const filters = (
    <>
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
      <div>
        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Examination Term</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full h-8 border bg-card text-xs rounded-lg px-2"
        >
          <option value="Semester Final Exams 2026">Semester Final Exams 2026</option>
          <option value="Mid Term Assessment">Mid Term Assessment</option>
        </select>
      </div>
    </>
  );

  return (
    <ReportPageTemplate
      title="Results & Grading Ledger"
      description="Track aggregate scores, pass statistics, individual rank sheets, and class grade card lists."
      data={resultsData}
      columns={resultColumns}
      summaryKPIs={summaryKPIs}
      filterFields={filters}
      exportFileName="Greenwood_academic_results_ledger"
    />
  );
}
