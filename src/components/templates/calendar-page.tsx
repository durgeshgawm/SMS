"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Tag, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CalendarEvent {
  id: string;
  title: string;
  category: "exam" | "holiday" | "event" | "academic" | "timetable";
  date: string;
  time: string;
  location?: string;
  description?: string;
}

interface CalendarPageTemplateProps {
  title: string;
  description?: string;
  events: CalendarEvent[];
}

export function CalendarPageTemplate({
  title,
  description,
  events: initialEvents,
}: CalendarPageTemplateProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState("May 2025");

  // Mock Form Fields state
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newCategory, setNewCategory] = useState<CalendarEvent["category"]>("event");

  const filteredEvents = events.filter((e) => {
    if (filterCategory === "all") return true;
    return e.category === filterCategory;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newTime) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const newEvent: CalendarEvent = {
      id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      title: newTitle,
      date: newDate,
      time: newTime,
      category: newCategory,
      description: "Added via calendar coordinator.",
    };

    setEvents([newEvent, ...events]);
    setIsAddOpen(false);
    toast.success("Event added successfully to the school calendar!");

    // Reset Form
    setNewTitle("");
    setNewDate("");
    setNewTime("");
  };

  const getCategoryStyles = (cat: CalendarEvent["category"]) => {
    const map = {
      exam: "bg-red-500/10 text-red-600 border border-red-500/20",
      holiday: "bg-green-500/10 text-green-600 border border-green-500/20",
      event: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
      academic: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
      timetable: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    };
    return map[cat] || "bg-muted text-muted-foreground";
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </Button>
        }
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Mock Monthly Grid (highly aesthetic calendar visual) */}
        <div className="lg:col-span-8 bg-card rounded-xl border border-border p-5 shadow-sm text-left">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>{currentMonth}</span>
            </h3>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 border-border/80">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 border-border/80">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Simple grid of calendar cells (visual mockup representation of month calendar) */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground uppercase mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 aspect-[7/5]">
            {/* Blank leading offsets */}
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={`offset-${idx}`} className="rounded-lg bg-muted/10 border border-transparent" />
            ))}
            
            {/* Days with dynamic mockup events */}
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const hasEvent = day === 5 || day === 12 || day === 15 || day === 21;
              const isToday = day === 26;

              return (
                <div
                  key={`day-${day}`}
                  className={`rounded-lg border border-border/60 p-1 flex flex-col justify-between text-left hover:border-primary transition-colors cursor-pointer ${
                    isToday ? "bg-primary/5 border-primary" : "bg-card"
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {day}
                  </span>
                  {hasEvent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mx-auto mb-1 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Filters and Agenda Lists */}
        <div className="lg:col-span-4 bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col text-left">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-primary" />
              <span>Agenda Filters</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "All", val: "all" },
                { label: "Exams", val: "exam" },
                { label: "Holidays", val: "holiday" },
                { label: "Events", val: "event" },
                { label: "Academic", val: "academic" },
              ].map((filter) => (
                <button
                  key={filter.val}
                  onClick={() => setFilterCategory(filter.val)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-colors ${
                    filterCategory === filter.val
                      ? "bg-primary text-white border-primary"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/80"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Upcoming Events
            </h4>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
              {filteredEvents.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="w-full p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors text-left flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block truncate">
                      {evt.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {evt.time}
                      </span>
                      <span>•</span>
                      <span>{evt.date}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0 ${getCategoryStyles(evt.category)}`}>
                    {evt.category}
                  </span>
                </button>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No upcoming items found for this filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Event Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-sm rounded-xl">
          {selectedEvent && (
            <>
              <DialogHeader className="text-left">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase self-start mb-2 ${getCategoryStyles(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
                <DialogTitle className="text-sm font-bold text-foreground leading-tight">
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Schedule details and location tags.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-xs text-left py-2 border-y border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">{selectedEvent.time}</span>
                  <span className="text-muted-foreground">on {selectedEvent.date}</span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-semibold text-foreground">{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent.description && (
                  <p className="text-muted-foreground leading-normal pt-1">{selectedEvent.description}</p>
                )}
              </div>

              <DialogFooter className="pt-2 flex flex-row items-center justify-end">
                <Button size="sm" onClick={() => setSelectedEvent(null)} className="h-8 text-xs">
                  Dismiss
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-sm font-bold text-foreground">Add New Event</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the calendar entry details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEvent} className="space-y-4 pt-2">
            <div className="space-y-3">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-foreground uppercase">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-foreground uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-foreground uppercase">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full h-8 rounded-lg border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-foreground uppercase">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CalendarEvent["category"])}
                  className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="event">General Event</option>
                  <option value="holiday">Official Holiday</option>
                  <option value="exam">Examination</option>
                  <option value="academic">Academic Activity</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-4 flex flex-row items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-semibold">
                Add Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
export type { CalendarEvent };
