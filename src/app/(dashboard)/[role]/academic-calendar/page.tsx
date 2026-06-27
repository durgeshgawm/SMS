"use client";

import React, { use } from "react";
import { CalendarPageTemplate, CalendarEvent } from "@/components/templates/calendar-page";
import { UserRole } from "@/types/common";

const mockCalendarEvents: CalendarEvent[] = [
  { id: "evt-1", title: "Semester Final Exams 2026", category: "exam", date: "2026-07-02", time: "09:00 AM - 12:00 PM", location: "Main Examination Hall No 2", description: "First semester written examinations across classes 6 to 12." },
  { id: "evt-2", title: "Monsoon Term PTM Meeting", category: "academic", date: "2026-07-10", time: "08:30 AM - 01:00 PM", location: "Classroom Blocks", description: "Reviewing student grade-sheet distributions and performance targets with parents." },
  { id: "evt-3", title: "Independence Day Celebration Holiday", category: "holiday", date: "2026-08-15", time: "All Day", location: "Campus Flag Grounds", description: "National celebration and official campus closure." },
  { id: "evt-4", title: "Annual Science Exhibition Fair", category: "event", date: "2026-08-22", time: "10:00 AM - 04:00 PM", location: "Indoor Multi-Sports Complex", description: "Student engineering and scientific project showcase." },
];

export default function AcademicCalendarPage({
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

  return (
    <CalendarPageTemplate
      title="Academic Calendar"
      description="Monitor term structures, scheduled exam calendars, official holidays, and community PTM schedules."
      events={mockCalendarEvents}
    />
  );
}
