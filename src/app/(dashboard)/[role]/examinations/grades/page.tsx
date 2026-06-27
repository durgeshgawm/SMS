"use client";

import React, { use } from "react";
import { GraduationCap, Award, BookOpen, CheckCircle } from "lucide-react";
import { ReportPageTemplate } from "@/components/templates/report-page";
import { ColumnDef } from "@tanstack/react-table";
import { UserRole } from "@/types/common";

interface SubjectGrade {
  id: string;
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: string;
  grade: string;
}

const gradeCols: ColumnDef<SubjectGrade>[] = [
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "maxMarks", header: "Maximum Marks" },
  { accessorKey: "obtainedMarks", header: "Obtained Marks" },
  { accessorKey: "percentage", header: "Percentage" },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <span className="font-bold text-primary">{row.original.grade}</span>
    ),
  },
];

const mockGrades: SubjectGrade[] = [
  { id: "gr-1", subject: "Mathematics Paper", maxMarks: 100, obtainedMarks: 96, percentage: "96.0%", grade: "A+" },
  { id: "gr-2", subject: "General Science Paper", maxMarks: 100, obtainedMarks: 88, percentage: "88.0%", grade: "A" },
  { id: "gr-3", subject: "Social Studies Paper", maxMarks: 100, obtainedMarks: 84, percentage: "84.0%", grade: "B+" },
  { id: "gr-4", subject: "English Literature", maxMarks: 100, obtainedMarks: 76, percentage: "76.0%", grade: "B" },
  { id: "gr-5", subject: "Computer Applications", maxMarks: 100, obtainedMarks: 98, percentage: "98.0%", grade: "A+" },
];

export default function ExaminationsGradesPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "academic") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const summaryKPIs = [
    { title: "Highest Class Mark", value: "98/100", icon: Award, color: "green" as const },
    { title: "Class Average Score", value: "88.4%", icon: GraduationCap, color: "blue" as const },
    { title: "Students Examined", value: "48 Students", icon: BookOpen, color: "purple" as const },
    { title: "Class Passing Rate", value: "100%", icon: CheckCircle, color: "indigo" as const },
  ];

  const filters = (
    <>
      <div>
        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Target Class</label>
        <select className="w-full h-8 border bg-card text-xs rounded-lg px-2">
          <option>Class 10 - Section A</option>
          <option>Class 10 - Section B</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Select Student</label>
        <select className="w-full h-8 border bg-card text-xs rounded-lg px-2">
          <option>Aarav Sharma (Roll 10)</option>
          <option>Rahul Verma (Roll 12)</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-bold text-muted-foreground block mb-1">Exam Term</label>
        <select className="w-full h-8 border bg-card text-xs rounded-lg px-2">
          <option>Semester Final Exams 2026</option>
          <option>Unit Assessment Test II</option>
        </select>
      </div>
    </>
  );

  return (
    <ReportPageTemplate
      title="Exams Grade Ledger & Report Cards"
      description="Compile, audit, and print individual student grade cards and exam averages."
      data={mockGrades}
      columns={gradeCols}
      summaryKPIs={summaryKPIs}
      filterFields={filters}
      exportFileName="Greenwood_Student_GradeCard"
    />
  );
}
