"use client";

import React, { use, useState } from "react";
import { AlertCircle, Plus, Search, Filter, Trash2, CheckCircle, Clock, Hammer, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Complaint {
  id: string;
  complaintNo: string;
  category: "Electrical" | "Plumbing" | "Furniture" | "Wi-Fi / Internet" | "Other";
  roomNo: string;
  reporter: string;
  details: string;
  status: "Open" | "In Progress" | "Resolved";
  dateReported: string;
  resolutionDate: string;
}

export default function HostelComplaintsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const allowedRoles = ["super-admin", "hostel", "student"];
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const isWarden = role === "hostel" || role === "super-admin";

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "cp-1",
      complaintNo: "GW-COMP-101",
      category: "Electrical",
      roomNo: "101",
      reporter: "Rahul Verma",
      details: "Ceiling fan speed regulator is broken and sparking.",
      status: "Open",
      dateReported: "2026-06-25",
      resolutionDate: "-",
    },
    {
      id: "cp-2",
      category: "Plumbing",
      complaintNo: "GW-COMP-102",
      roomNo: "201",
      reporter: "Sneha Sharma",
      details: "Washroom tap leak is causing water waste and noise.",
      status: "In Progress",
      dateReported: "2026-06-24",
      resolutionDate: "-",
    },
    {
      id: "cp-3",
      category: "Furniture",
      complaintNo: "GW-COMP-103",
      roomNo: "102",
      reporter: "Devendra Patel",
      details: "Study table drawer handle is loose.",
      status: "Resolved",
      dateReported: "2026-06-20",
      resolutionDate: "2026-06-22",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newCat, setNewCat] = useState<"Electrical" | "Plumbing" | "Furniture" | "Wi-Fi / Internet" | "Other">("Electrical");
  const [newRoom, setNewRoom] = useState("");
  const [newReporter, setNewReporter] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom || !newReporter || !newDetails) return;

    const newCp: Complaint = {
      id: `cp-${Date.now()}`,
      complaintNo: `GW-COMP-${complaints.length + 101}`,
      category: newCat,
      roomNo: newRoom,
      reporter: newReporter,
      details: newDetails,
      status: "Open",
      dateReported: new Date().toISOString().split("T")[0],
      resolutionDate: "-",
    };

    setComplaints([newCp, ...complaints]);
    setIsModalOpen(false);
    toast.success("Complaint logged. Maintenance notified!");

    // Reset Form
    setNewRoom("");
    setNewReporter("");
    setNewDetails("");
  };

  const handleStatusChange = (id: string, next: "In Progress" | "Resolved") => {
    setComplaints(
      complaints.map((c) => {
        if (c.id === id) {
          const dateStr = next === "Resolved" ? new Date().toISOString().split("T")[0] : "-";
          toast.success(`Complaint status shifted to ${next}.`);
          return { ...c, status: next, resolutionDate: dateStr };
        }
        return c;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this complaint record?")) {
      setComplaints(complaints.filter((c) => c.id !== id));
      toast.success("Complaint deleted.");
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.reporter.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCat === "all" || c.category === selectedCat;
    const matchesStatus = selectedStatus === "all" || c.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Hostel Complaints Board"
        description="Monitor room maintenance requests, assign technician staff, and track resolution timelines."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>File Complaint</span>
          </Button>
        }
      />

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Tickets Mapped</span>
          <h3 className="text-2xl font-bold tracking-tight">{complaints.length} Tickets</h3>
          <div className="text-[10px] text-muted-foreground">Logged by hostel residents</div>
        </div>

        <div className="bg-card text-card-foreground border border-red-500/20 bg-red-500/[0.01] rounded-xl p-5 shadow-sm space-y-1.5 text-left text-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-500">Tickets Open</span>
            <AlertCircle className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            {complaints.filter((c) => c.status === "Open").length} Tickets
          </h3>
          <div className="text-[10px] text-muted-foreground">Unassigned / Pending reviews</div>
        </div>

        <div className="bg-card text-card-foreground border border-amber-500/20 bg-amber-500/[0.01] rounded-xl p-5 shadow-sm space-y-1.5 text-left text-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-500">In Progress (Tech)</span>
            <Clock className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            {complaints.filter((c) => c.status === "In Progress").length} Tickets
          </h3>
          <div className="text-[10px] text-muted-foreground">Technician currently working</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-600">Tickets Resolved</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-500 tracking-tight">
            {complaints.filter((c) => c.status === "Resolved").length} Tickets
          </h3>
          <div className="text-[10px] text-muted-foreground">Resolution checked by warden</div>
        </div>
      </div>

      {/* Filters header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search complaints logs..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Furniture">Furniture</option>
            <option value="Wi-Fi / Internet">Wi-Fi</option>
          </select>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Grid of Complaint Cards */}
      {filteredComplaints.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
          No complaints registered matching filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {filteredComplaints.map((cp) => (
            <div key={cp.id} className="bg-card border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/45 transition-all">
              {/* Header */}
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-primary">{cp.complaintNo}</span>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[9px] font-bold">
                      {cp.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground text-xs mt-1">Room {cp.roomNo}</h4>
                </div>

                {cp.status === "Open" && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-bold uppercase text-[9px]">
                    Open
                  </span>
                )}
                {cp.status === "In Progress" && (
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-bold uppercase text-[9px]">
                    In Progress
                  </span>
                )}
                {cp.status === "Resolved" && (
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-bold uppercase text-[9px]">
                    Resolved
                  </span>
                )}
              </div>

              {/* Details text */}
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-bold uppercase block">Reported details</span>
                <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-2.5 rounded-lg border">
                  "{cp.details}"
                </p>
              </div>

              {/* Footer and assign buttons */}
              <div className="border-t pt-3.5 flex flex-col gap-2.5 text-[10px] text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>Reported by: <strong>{cp.reporter}</strong></span>
                  <span>Date: {cp.dateReported}</span>
                </div>
                {cp.status === "Resolved" && (
                  <div className="flex justify-between items-center text-green-500 font-bold">
                    <span>Resolution Date:</span>
                    <span>{cp.resolutionDate}</span>
                  </div>
                )}

                {isWarden && cp.status !== "Resolved" && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                    {cp.status === "Open" && (
                      <button
                        onClick={() => handleStatusChange(cp.id, "In Progress")}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[9px] font-bold uppercase flex items-center gap-0.5"
                      >
                        <Hammer className="h-3 w-3" /> Assign Tech
                      </button>
                    )}
                    {cp.status === "In Progress" && (
                      <button
                        onClick={() => handleStatusChange(cp.id, "Resolved")}
                        className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[9px] font-bold uppercase flex items-center gap-0.5"
                      >
                        <CheckCircle className="h-3 w-3" /> Resolve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cp.id)}
                      className="p-1 border rounded text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <AlertCircle className="h-4.5 w-4.5 text-primary" />
                File Room Repair Complaint
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Issue Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                >
                  <option value="Electrical">Electrical (Lights, fan, power socket)</option>
                  <option value="Plumbing">Plumbing (Tap leak, flush tank, drainage)</option>
                  <option value="Furniture">Furniture (Bed frame, desk drawer, cupboard)</option>
                  <option value="Wi-Fi / Internet">Wi-Fi Connection issue</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Room No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Resident Reporter Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={newReporter}
                    onChange={(e) => setNewReporter(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Describe reported issue details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the mechanical, electrical, or plumbing defect here..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
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
                  File Complaint
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
