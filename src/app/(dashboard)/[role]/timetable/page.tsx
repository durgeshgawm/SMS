"use client";

import React, { use, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Shuffle,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Printer
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Session {
  id: string;
  subject: string;
  teacher: string;
  classTag: string;
  color: string;
}

interface TimetableCell {
  day: string;
  period: number;
  session: Session | null;
}

const unallocatedSessionsList: Session[] = [
  { id: "sess-1", subject: "Mathematics", teacher: "Ms. Shalini Gupta", classTag: "Class 10-A", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { id: "sess-2", subject: "General Science", teacher: "Mr. Dean Rao", classTag: "Class 10-A", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { id: "sess-3", subject: "English Lit", teacher: "Ms. Sunita Deshmukh", classTag: "Class 9-B", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: "sess-4", subject: "Social Studies", teacher: "Mr. Amit Rao", classTag: "Class 10-B", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "sess-5", subject: "Computer Labs", teacher: "Mr. Satish Kumar", classTag: "Class 10-A", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { id: "sess-6", subject: "Physics Theory", teacher: "Mr. Dean Rao", classTag: "Class 9-A", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
];

export default function InteractiveTimetablePage({
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

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { num: 1, time: "09:00 AM - 10:00 AM" },
    { num: 2, time: "10:00 AM - 11:00 AM" },
    { num: 3, time: "11:00 AM - 12:00 PM" },
    { num: 4, time: "01:00 PM - 02:00 PM" },
    { num: 5, time: "02:00 PM - 03:00 PM" },
  ];

  // Initialize slots
  const [grid, setGrid] = useState<TimetableCell[]>(() => {
    const initialGrid: TimetableCell[] = [];
    days.forEach((day) => {
      periods.forEach((p) => {
        // Pre-populate a few slots to look realistic
        let initialSession: Session | null = null;
        if (day === "Monday" && p.num === 1) initialSession = unallocatedSessionsList[0];
        if (day === "Monday" && p.num === 2) initialSession = unallocatedSessionsList[1];
        if (day === "Wednesday" && p.num === 3) initialSession = unallocatedSessionsList[4];
        if (day === "Friday" && p.num === 5) initialSession = unallocatedSessionsList[2];

        initialGrid.push({
          day,
          period: p.num,
          session: initialSession,
        });
      });
    });
    return initialGrid;
  });

  const [unallocated, setUnallocated] = useState<Session[]>(unallocatedSessionsList);
  const [draggedSession, setDraggedSession] = useState<Session | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<{ day: string; period: number } | null>(null);
  const [substituteTeacher, setSubstituteTeacher] = useState({ absent: "", substitute: "", periodSelected: "" });

  // Handle HTML5 Drag Start
  const handleDragStart = (session: Session) => {
    setDraggedSession(session);
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent, day: string, period: number) => {
    e.preventDefault();
    setActiveDropZone({ day, period });
  };

  // Handle Drop on grid
  const handleDrop = (day: string, period: number) => {
    if (!draggedSession) return;

    setGrid((prev) =>
      prev.map((cell) =>
        cell.day === day && cell.period === period ? { ...cell, session: draggedSession } : cell
      )
    );
    toast.success(`Allocated ${draggedSession.subject} to ${day} Period ${period}!`);
    setDraggedSession(null);
    setActiveDropZone(null);
  };

  const handleCellClear = (day: string, period: number) => {
    setGrid((prev) =>
      prev.map((cell) =>
        cell.day === day && cell.period === period ? { ...cell, session: null } : cell
      )
    );
    toast.info("Schedule slot cleared.");
  };

  const handleAutoSchedule = () => {
    toast.success("AI Auto-scheduler initialized. Optimization complete!");
  };

  const handleSubstituteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!substituteTeacher.absent || !substituteTeacher.substitute) {
      toast.error("Please fill in both fields.");
      return;
    }
    toast.success(`Mapped substitute ${substituteTeacher.substitute} to cover absent teacher ${substituteTeacher.absent}!`);
    setSubstituteTeacher({ absent: "", substitute: "", periodSelected: "" });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Interactive Timetable Master"
        description="Drag subject cards into the weekly period grid to build timetables or allocate substitute lectures."
        actions={
          <div className="flex gap-2">
            <Button onClick={handleAutoSchedule} variant="outline" size="sm" className="flex items-center gap-1">
              <Shuffle className="h-4 w-4" />
              <span>AI Auto Schedule</span>
            </Button>
            <Button onClick={() => window.print()} size="sm" className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              <span>Print Schedule</span>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 text-left">
        {/* Left Sidebar: Unallocated sessions & Substitute tracker */}
        <div className="lg:col-span-3 space-y-6">
          {/* Draggable Sessions Stack */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Draggable Sessions</span>
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              Drag these cards directly into an empty slot in the weekly grid layout.
            </p>
            <div className="space-y-2.5">
              {unallocated.map((sess) => (
                <div
                  key={sess.id}
                  draggable
                  onDragStart={() => handleDragStart(sess)}
                  className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform ${sess.color}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold">{sess.subject}</span>
                    <span className="text-[9px] font-bold opacity-80 uppercase">{sess.classTag}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] opacity-75">
                    <User className="h-3 w-3 shrink-0" />
                    <span>{sess.teacher}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Substitute Teacher Allocation Form */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>Substitute Mapping</span>
            </h3>
            <form onSubmit={handleSubstituteSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">Absent Teacher</label>
                <input
                  type="text"
                  value={substituteTeacher.absent}
                  onChange={(e) => setSubstituteTeacher({ ...substituteTeacher, absent: e.target.value })}
                  placeholder="e.g. Ms. Shalini Gupta"
                  className="w-full h-8 bg-card border rounded-lg px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground block mb-1">Substitute Assignee</label>
                <input
                  type="text"
                  value={substituteTeacher.substitute}
                  onChange={(e) => setSubstituteTeacher({ ...substituteTeacher, substitute: e.target.value })}
                  placeholder="e.g. Mr. Satish Kumar"
                  className="w-full h-8 bg-card border rounded-lg px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button type="submit" size="sm" className="w-full h-8 text-[11px] font-bold">
                Deploy Substitute
              </Button>
            </form>
          </div>
        </div>

        {/* Right Area: Interactive Weekly Timetable Grid */}
        <div className="lg:col-span-9 bg-card rounded-xl border border-border p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Weekly Master Timetable (Class 10-A)</span>
            </h3>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Core Schedule: 09:00 AM - 03:00 PM
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-center border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-2 text-left w-24">Day</th>
                  {periods.map((p) => (
                    <th key={p.num} className="py-3 px-2 min-w-[120px]">
                      <div>Period {p.num}</div>
                      <div className="text-[9px] font-medium text-muted-foreground lowercase mt-0.5">{p.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className="border-b border-border/60 last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-2 text-left font-bold text-foreground">{day}</td>
                    {periods.map((p) => {
                      const cell = grid.find((c) => c.day === day && c.period === p.num);
                      const isOver = activeDropZone?.day === day && activeDropZone?.period === p.num;

                      return (
                        <td
                          key={p.num}
                          onDragOver={(e) => handleDragOver(e, day, p.num)}
                          onDrop={() => handleDrop(day, p.num)}
                          className={`p-2 transition-all border-l border-border/40 ${
                            isOver ? "bg-primary/10 border-primary/40 border-2" : ""
                          }`}
                        >
                          {cell?.session ? (
                            <div className={`p-2.5 rounded-lg border text-left relative group ${cell.session.color}`}>
                              <button
                                onClick={() => handleCellClear(day, p.num)}
                                className="absolute top-1 right-1 h-4.5 w-4.5 bg-background border rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </button>
                              <div className="font-bold text-[11px] leading-tight mb-0.5">{cell.session.subject}</div>
                              <div className="text-[9px] opacity-80 leading-none truncate">{cell.session.teacher}</div>
                            </div>
                          ) : (
                            <div className="h-14 border border-dashed border-border/70 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer select-none">
                              Drop Here
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
