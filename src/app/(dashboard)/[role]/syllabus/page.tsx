"use client";

import React, { use, useState } from "react";
import { BookOpen, BookOpenCheck, CheckCircle2, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface SyllabusChapter {
  id: string;
  name: string;
  progress: number; // 0 to 100
  status: "Completed" | "In Progress" | "Pending";
  topics: string[];
}

export default function SyllabusMonitorPage({
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
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const [chapters, setChapters] = useState<SyllabusChapter[]>([
    { id: "ch-1", name: "Chapter 1: Real Numbers & Sets", progress: 100, status: "Completed", topics: ["Euclid division", "Rational numbers representation", "Venn diagrams"] },
    { id: "ch-2", name: "Chapter 2: Trigonometric Identites", progress: 100, status: "Completed", topics: ["Trigonometry ratios", "Complementary angles", "Standard heights"] },
    { id: "ch-3", name: "Chapter 3: Quadratic Equations", progress: 65, status: "In Progress", topics: ["Discriminant values", "Roots derivation methods", "Real-world problems"] },
    { id: "ch-4", name: "Chapter 4: Triangles & Coordinate Geometry", progress: 15, status: "In Progress", topics: ["Similar triangles theorems", "Section division ratio", "Area coordinates"] },
    { id: "ch-5", name: "Chapter 5: Probability & Stats Analysis", progress: 0, status: "Pending", topics: ["Mean variance calculation", "Complementary probabilities", "Sample coin tosses"] },
  ]);

  const handleUpdateProgress = (id: string, newProgress: number) => {
    let newStatus: SyllabusChapter["status"] = "Pending";
    if (newProgress === 100) newStatus = "Completed";
    else if (newProgress > 0) newStatus = "In Progress";

    setChapters(
      chapters.map((ch) =>
        ch.id === id ? { ...ch, progress: newProgress, status: newStatus } : ch
      )
    );
    toast.success(`Updated chapter progress to ${newProgress}%!`);
  };

  const getStatusBadge = (status: SyllabusChapter["status"]) => {
    switch (status) {
      case "Completed":
        return <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-bold">Completed</span>;
      case "In Progress":
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold">In Progress</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border text-[9px] font-bold">Pending</span>;
    }
  };

  // Calculate overall progress average
  const totalProgress = Math.round(chapters.reduce((sum, ch) => sum + ch.progress, 0) / chapters.length);

  return (
    <PageContainer>
      <PageHeader
        title="Syllabus Completion Monitor"
        description="Monitor, update, and audit real-time syllabus coverage metrics across class levels and subjects."
        actions={
          <Button onClick={() => toast.success("Syllabus report synced to supervisor board.")} size="sm" className="flex items-center gap-1">
            <BookOpenCheck className="h-4 w-4" />
            <span>Approve Progress Report</span>
          </Button>
        }
      />

      {/* Select Filters row */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm text-left flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Class Level</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-8 border bg-card text-xs rounded-lg px-2 min-w-[120px]"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground block mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-8 border bg-card text-xs rounded-lg px-2 min-w-[150px]"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="General Science">General Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="English Lit">English Lit</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-muted/30 p-2.5 rounded-lg border border-border/50">
          <div className="text-right">
            <span className="text-[10px] font-bold text-muted-foreground block leading-none">Course Coverage</span>
            <span className="text-lg font-extrabold text-foreground">{totalProgress}% Done</span>
          </div>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${totalProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Syllabus Chapters List */}
      <div className="space-y-4 text-left">
        {chapters.map((ch, idx) => (
          <div key={ch.id} className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4 hover:border-border-hover transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{ch.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(ch.status)}
                    <span className="text-[10px] text-muted-foreground font-medium">Progress: {ch.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Changer Slider/Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground">Adjust:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={ch.progress}
                  onChange={(e) => handleUpdateProgress(ch.id, parseInt(e.target.value))}
                  className="w-32 h-1 bg-muted accent-primary rounded-lg cursor-pointer"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateProgress(ch.id, 100)}
                    className="h-7 text-[9px] font-bold px-2"
                  >
                    Set Completed
                  </Button>
                </div>
              </div>
            </div>

            {/* List of subtopics in the chapter */}
            <div className="border-t border-border/40 pt-3">
              <span className="text-[10px] font-bold text-muted-foreground block mb-2 uppercase tracking-wider">Chapter Subtopics Covered</span>
              <div className="flex flex-wrap gap-2">
                {ch.topics.map((t, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-muted/40 border border-border/50 rounded-lg text-[10px] font-medium text-foreground flex items-center gap-1"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
