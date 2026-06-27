"use client";

import React, { use, useState } from "react";
import { Plus, MoveRight, Phone, Mail, Award, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface LeadCard {
  id: string;
  name: string;
  phone: string;
  course: string;
  counselor: string;
  stage: "New" | "Contacted" | "In Progress" | "Registered" | "Dropped";
}

const initialLeads: LeadCard[] = [
  { id: "L-901", name: "Ananya Roy", phone: "9876543122", course: "Class 11 Science", counselor: "Ms. Shalini Gupta", stage: "In Progress" },
  { id: "L-902", name: "Rohan Das", phone: "9988771144", course: "Class 6 Primary", counselor: "Mr. Dean Rao", stage: "New" },
  { id: "L-903", name: "Preeti Singh", phone: "9564871239", course: "Class 9 General", counselor: "Ms. Shalini Gupta", stage: "Contacted" },
  { id: "L-904", name: "Aman Varma", phone: "9215487611", course: "Class 10 General", counselor: "Mr. Dean Rao", stage: "Registered" },
  { id: "L-905", name: "Neha Roy", phone: "9812457800", course: "Class 11 Humanities", counselor: "Ms. Shalini Gupta", stage: "Dropped" },
  { id: "L-906", name: "Rahul Verma", phone: "9876543210", course: "Class 10 A", counselor: "Ms. Shalini Gupta", stage: "Contacted" },
  { id: "L-907", name: "Simran Kaur", phone: "9123456789", course: "Class 8 Primary", counselor: "Mr. Dean Rao", stage: "In Progress" },
];

export default function LeadsPipelinePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const router = useRouter();
  const [leads, setLeads] = useState<LeadCard[]>(initialLeads);

  if (role !== "super-admin" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const stages: LeadCard["stage"][] = ["New", "Contacted", "In Progress", "Registered", "Dropped"];

  const handleMoveStage = (id: string, currentStage: LeadCard["stage"]) => {
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = (currentIndex + 1) % stages.length;
    const nextStage = stages[nextIndex];

    setLeads(
      leads.map((l) => {
        if (l.id === id) {
          return { ...l, stage: nextStage };
        }
        return l;
      })
    );
    toast.success(`Lead stage updated to ${nextStage}!`);
  };

  const getStageHeaderColor = (stage: LeadCard["stage"]) => {
    const map = {
      New: "border-t-blue-500 bg-blue-50/50 dark:bg-blue-950/10",
      Contacted: "border-t-orange-500 bg-orange-50/50 dark:bg-orange-950/10",
      "In Progress": "border-t-purple-500 bg-purple-50/50 dark:bg-purple-950/10",
      Registered: "border-t-green-500 bg-green-50/50 dark:bg-green-950/10",
      Dropped: "border-t-red-500 bg-red-50/50 dark:bg-red-950/10",
    };
    return map[stage] || "";
  };

  return (
    <PageContainer>
      <PageHeader
        title="CRM Leads Pipeline"
        description="Monitor lead advancement and conversion stages for new school student registrations."
        actions={
          <Button size="sm" onClick={() => router.push(`/${role}/admission-crm/inquiries`)} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Inquiry Lead</span>
          </Button>
        }
      />

      {/* Kanban Stages Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-[calc(100vh-210px)] overflow-hidden">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          return (
            <div
              key={stage}
              className={`border border-border rounded-xl flex flex-col h-full overflow-hidden border-t-4 ${getStageHeaderColor(
                stage
              )}`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-border/80 flex items-center justify-between font-bold text-xs">
                <span className="text-foreground">{stage}</span>
                <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] text-muted-foreground">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-muted/10">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded-lg border border-border bg-card shadow-sm space-y-2 hover:shadow transition-shadow group text-left relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-foreground leading-tight">
                        {lead.name}
                      </span>
                      <button
                        onClick={() => handleMoveStage(lead.id, lead.stage)}
                        title="Move to Next Stage"
                        className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-primary flex items-center justify-center shrink-0 border border-border/60"
                      >
                        <MoveRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-primary font-bold">{lead.course}</p>

                    <div className="space-y-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-foreground/80">
                        <Award className="h-3 w-3 text-muted-foreground" />
                        <span>{lead.counselor}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-muted-foreground border border-dashed border-border/60 rounded-lg">
                    <AlertCircle className="h-4 w-4 mx-auto mb-1 opacity-50" />
                    No leads in stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}

// Dummy Router import logic inside client page
import { useRouter } from "next/navigation";
