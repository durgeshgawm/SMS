"use client";

import React, { use, useState } from "react";
import { Award, TrendingUp, CheckCircle, Clock, User, Search, Plus, Star, Filter, Sparkles, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

interface Appraisal {
  id: string;
  employeeNo: string;
  name: string;
  department: string;
  designation: string;
  rating: number;
  reviewPeriod: string;
  kpis: {
    workQuality: number;
    attendance: number;
    communication: number;
    studentFeedback: number;
  };
  feedback: string;
  reviewer: string;
  date: string;
}

export default function PerformanceAppraisalPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [appraisals, setAppraisals] = useState<Appraisal[]>([
    {
      id: "apr-1",
      employeeNo: "GW-EMP-001",
      name: "Ms. Shalini Gupta",
      department: "Academics",
      designation: "Senior Mathematics Lecturer",
      rating: 4.8,
      reviewPeriod: "Annual 2025-26",
      kpis: { workQuality: 4.9, attendance: 4.8, communication: 4.7, studentFeedback: 4.8 },
      feedback: "Exceptional dedication to math pedagogy. Initiated advanced calculus modules and improved average student scores by 12%. Regular attendance and superb collaborative rapport.",
      reviewer: "Dr. A. K. Sridhar (Academic Head)",
      date: "2026-05-15",
    },
    {
      id: "apr-2",
      employeeNo: "GW-EMP-004",
      name: "Mr. Rajesh Kumar",
      department: "Administration",
      designation: "Head Clerk",
      rating: 4.2,
      reviewPeriod: "Annual 2025-26",
      kpis: { workQuality: 4.0, attendance: 4.5, communication: 4.3, studentFeedback: 4.0 },
      feedback: "Highly organized registry work. Handled high-volume enrollments efficiently. Needs minor enhancement in digital system response turnaround times.",
      reviewer: "Ms. Sunita Sharma (HR Director)",
      date: "2026-05-20",
    },
    {
      id: "apr-3",
      employeeNo: "GW-EMP-007",
      name: "Mrs. Priya Patel",
      department: "Academics",
      designation: "Primary Class Teacher (Grade 3)",
      rating: 4.5,
      reviewPeriod: "Annual 2025-26",
      kpis: { workQuality: 4.6, attendance: 4.2, communication: 4.8, studentFeedback: 4.4 },
      feedback: "Superb parent-teacher engagement scores. Organized creative project exhibitions. Active involvement in the inter-school cultural coordinator committees.",
      reviewer: "Dr. A. K. Sridhar (Academic Head)",
      date: "2026-05-22",
    },
    {
      id: "apr-4",
      employeeNo: "GW-EMP-012",
      name: "Mr. Amit Verma",
      department: "Sports",
      designation: "Physical Education Trainer",
      rating: 3.9,
      reviewPeriod: "Annual 2025-26",
      kpis: { workQuality: 4.0, attendance: 3.8, communication: 4.0, studentFeedback: 3.8 },
      feedback: "Excellent sports program training schedule compliance. Needs to ensure punctual logging of daily student activity attendance records in the database portal.",
      reviewer: "Ms. Sunita Sharma (HR Director)",
      date: "2026-05-25",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newEmpNo, setNewEmpNo] = useState("GW-EMP-");
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("Academics");
  const [newDesig, setNewDesig] = useState("");
  const [newPeriod, setNewPeriod] = useState("Annual 2025-26");
  const [newRating, setNewRating] = useState("4.0");
  const [newWorkQuality, setNewWorkQuality] = useState("4.0");
  const [newAttendance, setNewAttendance] = useState("4.0");
  const [newComm, setNewComm] = useState("4.0");
  const [newFeedback, setNewFeedback] = useState("");

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleAddAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesig || !newFeedback) return;

    const newApr: Appraisal = {
      id: `apr-${Date.now()}`,
      employeeNo: newEmpNo,
      name: newName,
      department: newDept,
      designation: newDesig,
      rating: parseFloat(newRating),
      reviewPeriod: newPeriod,
      kpis: {
        workQuality: parseFloat(newWorkQuality),
        attendance: parseFloat(newAttendance),
        communication: parseFloat(newComm),
        studentFeedback: parseFloat(newRating), // default to same as rating
      },
      feedback: newFeedback,
      reviewer: "Self Registered / HR Panel",
      date: new Date().toISOString().split("T")[0],
    };

    setAppraisals([newApr, ...appraisals]);
    setIsModalOpen(false);
    // Reset form
    setNewName("");
    setNewDesig("");
    setNewFeedback("");
  };

  const filteredAppraisals = appraisals.filter((apr) => {
    const matchesSearch =
      apr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apr.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apr.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "all" || apr.department === selectedDept;

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4+" && apr.rating >= 4.0) ||
      (selectedRating === "3-4" && apr.rating >= 3.0 && apr.rating < 4.0) ||
      (selectedRating === "3-" && apr.rating < 3.0);

    return matchesSearch && matchesDept && matchesRating;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Performance Appraisals & KPIs"
        description="Monitor staff appraisal logs, performance scores, department metrics, and qualitative KPI reviews."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Create New Appraisal</span>
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Average Appraisal Score</span>
            <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">4.35</h3>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-0.5">
              +1.2% this year
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Target baseline: 4.0/5.0 index</p>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Top-Performing Branch</span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-bold tracking-tight">Greenwood Central</h3>
          </div>
          <p className="text-[10px] text-muted-foreground">Academics leads with 4.5 rating</p>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Reviews Logged</span>
            <div className="p-1.5 bg-green-500/10 rounded-lg text-green-500">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{appraisals.length} Profiles</h3>
          </div>
          <p className="text-[10px] text-muted-foreground">100% review cycle compliance</p>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Appraisal Audit Status</span>
            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-bold text-green-500">Verified Cycle</h3>
          </div>
          <p className="text-[10px] text-muted-foreground">ISO-compliant competency check</p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employee / designation..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Academics">Academics</option>
            <option value="Administration">Administration</option>
            <option value="Sports">Sports</option>
          </select>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="4+">Excellent (4.0+)</option>
            <option value="3-4">Proficient (3.0 - 4.0)</option>
            <option value="3-">Needs Work (&lt; 3.0)</option>
          </select>
        </div>
      </div>

      {/* Feedback Appraisal Cards Grid */}
      {filteredAppraisals.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card border rounded-xl text-center shadow-sm">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
          <h4 className="text-sm font-bold">No Appraisal Matches Found</h4>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Adjust your filters or query terms to search from Greenwood active personnel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {filteredAppraisals.map((apr) => (
            <div key={apr.id} className="bg-card border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/35 transition-all">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border text-primary font-bold flex items-center justify-center text-xs">
                    {apr.name.split(" ").slice(-1)[0][0] || "E"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {apr.name}
                      <span className="text-[10px] text-muted-foreground font-normal">({apr.employeeNo})</span>
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {apr.designation} • <span className="font-semibold text-primary/80">{apr.department}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-600 text-yellow-600" />
                  <span className="text-xs font-black">{apr.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* KPI indicators breakdown */}
              <div className="grid grid-cols-3 gap-2 bg-muted/40 p-3 rounded-lg border">
                <div>
                  <span className="text-[9px] text-muted-foreground block uppercase">Work Quality</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(apr.kpis.workQuality / 5) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">{apr.kpis.workQuality}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-muted-foreground block uppercase">Attendance</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(apr.kpis.attendance / 5) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">{apr.kpis.attendance}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-muted-foreground block uppercase">Collaboration</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(apr.kpis.communication / 5) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">{apr.kpis.communication}</span>
                  </div>
                </div>
              </div>

              {/* Appraisal Feedback Text */}
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Evaluator Comments</span>
                <p className="text-xs text-muted-foreground leading-relaxed italic bg-card border-l-2 border-primary/50 pl-3.5 py-1">
                  "{apr.feedback}"
                </p>
              </div>

              {/* Footer Author details */}
              <div className="flex items-center justify-between border-t pt-3.5 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>Reviewer: <strong>{apr.reviewer}</strong></span>
                </div>
                <span>Cycle: {apr.reviewPeriod}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Appraisal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                Add Employee Appraisal Rating
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAppraisal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Employee No</label>
                  <input
                    type="text"
                    required
                    value={newEmpNo}
                    onChange={(e) => setNewEmpNo(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Gupta"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Administration">Administration</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Lecturer"
                    value={newDesig}
                    onChange={(e) => setNewDesig(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Work Quality</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={newWorkQuality}
                    onChange={(e) => setNewWorkQuality(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Attendance</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={newAttendance}
                    onChange={(e) => setNewAttendance(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Reviewer Comments</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize the performance appraisal notes here..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs h-8 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Appraisal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
