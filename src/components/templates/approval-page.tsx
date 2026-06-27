"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Clock, ShieldAlert, History, MessageSquare, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ApprovalRequest {
  id: string;
  title: string;
  requester: string;
  date: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  details: Record<string, string>;
  timeline: { title: string; desc: string; time: string; user: string }[];
}

interface ApprovalPageTemplateProps {
  title: string;
  description?: string;
  requests: ApprovalRequest[];
  onApprove?: (id: string, comment?: string) => void;
  onReject?: (id: string, comment?: string) => void;
}

export function ApprovalPageTemplate({
  title,
  description,
  requests: initialRequests,
  onApprove,
  onReject,
}: ApprovalPageTemplateProps) {
  const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests);
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(
    initialRequests[0] || null
  );
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = (status: "approved" | "rejected") => {
    if (!selectedReq) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Perform callback or local mock updates
      if (status === "approved" && onApprove) {
        onApprove(selectedReq.id, comment);
      } else if (status === "rejected" && onReject) {
        onReject(selectedReq.id, comment);
      } else {
        // Local mockup state update
        const updated = requests.map((r) => {
          if (r.id === selectedReq.id) {
            return {
              ...r,
              status,
              timeline: [
                {
                  title: status === "approved" ? "Request Approved" : "Request Rejected",
                  desc: comment || (status === "approved" ? "No comment added." : "Rejected by system administrator."),
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  user: "Super Admin",
                },
                ...r.timeline,
              ],
            };
          }
          return r;
        });

        setRequests(updated);
        setSelectedReq(updated.find((r) => r.id === selectedReq.id) || null);
        toast.success(`Request ${status === "approved" ? "approved" : "rejected"} successfully!`);
      }
      setComment("");
    }, 1000);
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader title={title} description={description} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 h-[calc(100vh-200px)] overflow-hidden">
        {/* Left Side: Requests List */}
        <div className="lg:col-span-5 border border-border bg-card rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Pending Approvals ({requests.filter((r) => r.status === "pending").length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {requests.map((req) => {
              const isSelected = selectedReq?.id === req.id;
              return (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelectedReq(req);
                    setComment("");
                  }}
                  className={cn(
                    "w-full p-4 flex flex-col items-start gap-2 hover:bg-muted/40 transition-colors text-left border-l-2",
                    isSelected ? "border-primary bg-primary/5" : "border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="text-xs font-bold text-foreground truncate">{req.title}</span>
                    <span
                      className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0",
                        req.status === "pending" && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                        req.status === "approved" && "bg-green-500/10 text-green-500 border border-green-500/20",
                        req.status === "rejected" && "bg-red-500/10 text-red-500 border border-red-500/20"
                      )}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground">
                    <span>By: {req.requester}</span>
                    <span>{req.date}</span>
                  </div>
                </button>
              );
            })}

            {requests.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2 opacity-60" />
                No approval requests found.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Request Details & Action Panel */}
        <div className="lg:col-span-7 border border-border bg-card rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
          {selectedReq ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-border flex items-center justify-between gap-4">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-foreground leading-tight">{selectedReq.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Requested by {selectedReq.requester} on {selectedReq.date}
                  </p>
                </div>

                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border shrink-0",
                    selectedReq.status === "pending" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    selectedReq.status === "approved" && "bg-green-500/10 text-green-500 border-green-500/20",
                    selectedReq.status === "rejected" && "bg-red-500/10 text-red-500 border-red-500/20"
                  )}
                >
                  {selectedReq.status === "pending" && <Clock className="h-3.5 w-3.5" />}
                  {selectedReq.status === "approved" && <CheckCircle className="h-3.5 w-3.5" />}
                  {selectedReq.status === "rejected" && <XCircle className="h-3.5 w-3.5" />}
                  <span className="capitalize">{selectedReq.status}</span>
                </span>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 p-5 overflow-y-auto space-y-6 text-left">
                {/* Details list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/60 pb-1.5">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Request Details
                  </h4>
                  <div className="grid gap-4 grid-cols-2">
                    {Object.entries(selectedReq.details).map(([label, val]) => (
                      <div key={label} className="space-y-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
                        <p className="text-xs font-semibold text-foreground">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/60 pb-1.5">
                    <History className="h-4 w-4 text-primary" />
                    Approval History
                  </h4>
                  <div className="relative pl-6 border-l border-border space-y-4 ml-2.5">
                    {selectedReq.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-card border-2 border-primary" />
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-foreground">{event.title}</span>
                            <span className="text-muted-foreground">{event.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{event.desc}</p>
                          <span className="text-[9px] font-medium text-muted-foreground block pt-0.5">
                            By: {event.user}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action input panel at bottom */}
              {selectedReq.status === "pending" && (
                <div className="p-4 border-t border-border bg-muted/20 space-y-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-2" />
                    <textarea
                      placeholder="Add custom decision comment / approval notes..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction("rejected")}
                      disabled={isSubmitting}
                      className="h-8 text-xs font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    >
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                      <span>Reject</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction("approved")}
                      disabled={isSubmitting}
                      className="h-8 text-xs font-semibold bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                      <span>Approve</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-8">
              <ShieldAlert className="h-10 w-10 text-muted-foreground/50 mb-2" />
              Select a request from the sidebar list to view details and action options.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
export type { ApprovalRequest };
