"use client";

import React, { use, useState } from "react";
import { Plus, MoveRight, Phone, Mail, Award, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface CandidateCard {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  stage: "Applied" | "Shortlisted" | "Interviewing" | "Offered" | "Rejected";
}

const initialCandidates: CandidateCard[] = [
  { id: "cand-1", name: "Dr. Anirudh Sen", phone: "9876543210", email: "anirudh.sen@gmail.com", position: "Mathematics Professor", stage: "Interviewing" },
  { id: "cand-2", name: "Ms. Rita Roy", phone: "9988771144", email: "rita.roy@gmail.com", position: "English Lecturer", stage: "Applied" },
  { id: "cand-3", name: "Mr. Gaurav Das", phone: "9564871239", email: "gaurav.das@gmail.com", position: "Physics Teacher", stage: "Shortlisted" },
  { id: "cand-4", name: "Mrs. Preeti Singh", phone: "9215487611", email: "preeti.s@gmail.com", position: "Chemistry Lab Assistant", stage: "Offered" },
  { id: "cand-5", name: "Mr. Aditya Sen", phone: "9812457800", email: "aditya.sen@gmail.com", position: "Physical Education Coach", stage: "Rejected" },
];

export default function HRRecruitmentPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [candidates, setCandidates] = useState<CandidateCard[]>(initialCandidates);
  const stages: CandidateCard["stage"][] = ["Applied", "Shortlisted", "Interviewing", "Offered", "Rejected"];

  const handleMoveStage = (id: string, currentStage: CandidateCard["stage"]) => {
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = (currentIndex + 1) % stages.length;
    const nextStage = stages[nextIndex];

    setCandidates(
      candidates.map((c) => {
        if (c.id === id) {
          return { ...c, stage: nextStage };
        }
        return c;
      })
    );
    toast.success(`Candidate stage updated to ${nextStage}!`);
  };

  const getStageHeaderColor = (stage: CandidateCard["stage"]) => {
    const map = {
      Applied: "border-t-blue-500 bg-blue-50/50 dark:bg-blue-950/10",
      Shortlisted: "border-t-orange-500 bg-orange-50/50 dark:bg-orange-950/10",
      Interviewing: "border-t-purple-500 bg-purple-50/50 dark:bg-purple-950/10",
      Offered: "border-t-green-500 bg-green-50/50 dark:bg-green-950/10",
      Rejected: "border-t-red-500 bg-red-50/50 dark:bg-red-950/10",
    };
    return map[stage] || "";
  };

  return (
    <PageContainer>
      <PageHeader
        title="HR Recruitment Pipeline"
        description="Monitor recruitment stages, move candidates across applicant tracking columns, and manage job offers."
        actions={
          <Button
            size="sm"
            onClick={() => {
              const newName = prompt("Enter Candidate Name:");
              if (!newName) return;
              const newPos = prompt("Enter Position Applied:");
              if (!newPos) return;

              const newCand: CandidateCard = {
                id: `cand-${Math.floor(Math.random() * 900) + 100}`,
                name: newName,
                phone: "9876543210",
                email: `${newName.toLowerCase().replace(" ", ".")}@gmail.com`,
                position: newPos,
                stage: "Applied",
              };
              setCandidates([...candidates, newCand]);
              toast.success(`Registered candidate ${newName} to pipeline!`);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Candidate</span>
          </Button>
        }
      />

      {/* Kanban Stages Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-[calc(100vh-210px)] overflow-hidden text-left">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);
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
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-muted/10">
                {stageCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-3 rounded-lg border border-border bg-card shadow-sm space-y-2 hover:shadow transition-shadow group text-left relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-foreground leading-tight">
                        {cand.name}
                      </span>
                      <button
                        onClick={() => handleMoveStage(cand.id, cand.stage)}
                        title="Move to Next Stage"
                        className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-primary flex items-center justify-center shrink-0 border border-border/60"
                      >
                        <MoveRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-primary font-bold">{cand.position}</p>

                    <div className="space-y-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{cand.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{cand.email}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-muted-foreground border border-dashed border-border/60 rounded-lg bg-card/50">
                    <AlertCircle className="h-4 w-4 mx-auto mb-1 opacity-50" />
                    No candidates in stage
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
