"use client";

import React, { useState } from "react";
import { Send, Mail, Inbox, Plus, User, Calendar, Tag, Paperclip, MessageSquare } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface SchoolNotice {
  id: string;
  title: string;
  sender: string;
  date: string;
  type: "notice" | "circular" | "announcement" | "sms";
  audience: string;
  content: string;
  attachments?: string[];
}

interface CommunicationPageTemplateProps {
  title: string;
  description?: string;
  notices: SchoolNotice[];
}

export function CommunicationPageTemplate({
  title,
  description,
  notices: initialNotices,
}: CommunicationPageTemplateProps) {
  const [notices, setNotices] = useState<SchoolNotice[]>(initialNotices);
  const [selectedNotice, setSelectedNotice] = useState<SchoolNotice | null>(
    initialNotices[0] || null
  );
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // Mock Compose State
  const [newTitle, setNewTitle] = useState("");
  const [newAudience, setNewAudience] = useState("All Branches");
  const [newType, setNewType] = useState<SchoolNotice["type"]>("notice");
  const [newContent, setNewContent] = useState("");

  const filteredNotices = notices.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      toast.error("Please provide a title and notice body content!");
      return;
    }

    const newNotice: SchoolNotice = {
      id: `ntc-${Math.random().toString(36).substr(2, 9)}`,
      title: newTitle,
      sender: "Super Admin",
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      type: newType,
      audience: newAudience,
      content: newContent,
    };

    const updated = [newNotice, ...notices];
    setNotices(updated);
    setSelectedNotice(newNotice);
    setIsComposeOpen(false);
    toast.success("School announcement published and sent successfully!");

    // Reset Compose Form
    setNewTitle("");
    setNewContent("");
  };

  const getBadgeColors = (type: SchoolNotice["type"]) => {
    const map = {
      notice: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
      circular: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
      announcement: "bg-green-500/10 text-green-600 border border-green-500/20",
      sms: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    };
    return map[type] || "bg-muted text-muted-foreground";
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button size="sm" onClick={() => setIsComposeOpen(true)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Compose Notice</span>
          </Button>
        }
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 h-[calc(100vh-200px)] overflow-hidden">
        {/* Left column Notice list */}
        <div className="lg:col-span-5 border border-border bg-card rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1">
              {[
                { label: "All", val: "all" },
                { label: "Notices", val: "notice" },
                { label: "Circulars", val: "circular" },
                { label: "Announce", val: "announcement" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => setFilterType(tab.val)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-colors",
                    filterType === tab.val
                      ? "bg-primary text-white border-primary"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/80"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredNotices.map((n) => {
              const isSelected = selectedNotice?.id === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedNotice(n)}
                  className={cn(
                    "w-full p-4 flex flex-col items-start gap-2 hover:bg-muted/40 transition-colors text-left border-l-2",
                    isSelected ? "border-primary bg-primary/5" : "border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-xs font-bold text-foreground truncate">{n.title}</span>
                    <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0", getBadgeColors(n.type))}>
                      {n.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 w-full leading-normal">
                    {n.content}
                  </p>
                  <div className="flex items-center justify-between w-full text-[9px] text-muted-foreground">
                    <span>By: {n.sender}</span>
                    <span>{n.date}</span>
                  </div>
                </button>
              );
            })}

            {filteredNotices.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Inbox className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                No notices published under this category.
              </div>
            )}
          </div>
        </div>

        {/* Right column selected Notice body rendering */}
        <div className="lg:col-span-7 border border-border bg-card rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          {selectedNotice ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden text-left">
              {/* Header tags info */}
              <div className="p-5 border-b border-border bg-muted/10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className={cn("text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase", getBadgeColors(selectedNotice.type))}>
                    {selectedNotice.type}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-0.5">
                      <User className="h-3.5 w-3.5" />
                      {selectedNotice.sender}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {selectedNotice.date}
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{selectedNotice.title}</h3>
                <span className="text-[10px] text-primary font-bold mt-1 block">Audience: {selectedNotice.audience}</span>
              </div>

              {/* Scrollable body content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>

                {/* Attachments */}
                {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                  <div className="border-t border-border pt-4 mt-6">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Paperclip className="h-3.5 w-3.5 text-primary" />
                      Notice Attachments
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedNotice.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border border-border/80 bg-muted/30 text-xs font-semibold text-foreground">
                          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-8">
              <MessageSquare className="h-10 w-10 text-muted-foreground/50 mb-2 animate-bounce" />
              Select an announcement from the notices sidebar to display its full content body.
            </div>
          )}
        </div>
      </div>

      {/* Compose Notice Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-sm font-bold text-foreground">Compose notice / Circular</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Publish notice board alerts to targeted cohorts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleComposeSubmit} className="space-y-4 pt-2">
            <div className="space-y-3">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-foreground uppercase">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Meet 2025 Details"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-8 rounded-lg border border-border bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-foreground uppercase">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Teachers Only">Teachers Only</option>
                    <option value="Students & Parents">Students &amp; Parents</option>
                    <option value="Delhi Main Branch">Delhi Main Branch</option>
                  </select>
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-foreground uppercase">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as SchoolNotice["type"])}
                    className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="notice">General Notice</option>
                    <option value="circular">Official Circular</option>
                    <option value="announcement">Public Announcement</option>
                    <option value="sms">SMS Text Broadcast</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-foreground uppercase">Notice Body Content</label>
                <textarea
                  required
                  placeholder="Write the complete announcement or circular detail text here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 flex flex-row items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsComposeOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-semibold">
                <Send className="h-3.5 w-3.5 text-white mr-1" />
                <span>Publish</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
export type { SchoolNotice };
