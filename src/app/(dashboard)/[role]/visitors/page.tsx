"use client";

import React, { use, useState } from "react";
import { Users, Plus, Search, Filter, Trash2, Clock, CheckCircle, Camera } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface VisitorLog {
  id: string;
  passNo: string;
  name: string;
  phone: string;
  purpose: string;
  mappedStudent: string;
  roomNo: string;
  checkIn: string;
  checkOut: string;
  status: "In Campus" | "Checked Out";
}

export default function HostelVisitorsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "hostel") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [visitors, setVisitors] = useState<VisitorLog[]>([
    {
      id: "vs-1",
      passNo: "GW-VPASS-01",
      name: "Mr. Ramesh Patel",
      phone: "+91 98765 43210",
      purpose: "Parent Visit / Meet Child",
      mappedStudent: "Priya Patel",
      roomNo: "201",
      checkIn: "2026-06-26 04:30 PM",
      checkOut: "-",
      status: "In Campus",
    },
    {
      id: "vs-2",
      passNo: "GW-VPASS-02",
      name: "Vendor (Amul Milk)",
      phone: "+91 99887 76655",
      purpose: "Kitchen Supplies Delivery",
      mappedStudent: "Mess Kitchen",
      roomNo: "-",
      checkIn: "2026-06-26 05:15 PM",
      checkOut: "-",
      status: "In Campus",
    },
    {
      id: "vs-3",
      passNo: "GW-VPASS-03",
      name: "Mr. A. K. Verma",
      phone: "+91 98112 23344",
      purpose: "Local Guardian visit",
      mappedStudent: "Amit Verma",
      roomNo: "101",
      checkIn: "2026-06-26 02:00 PM",
      checkOut: "2026-06-26 03:30 PM",
      status: "Checked Out",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPurpose, setNewPurpose] = useState("Parent Visit / Meet Child");
  const [newStudent, setNewStudent] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newStudent) return;

    const newPassCode = `GW-VPASS-0${visitors.length + 1}`;
    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newVs: VisitorLog = {
      id: `vs-${Date.now()}`,
      passNo: newPassCode,
      name: newName,
      phone: newPhone,
      purpose: newPurpose,
      mappedStudent: newStudent,
      roomNo: newRoom || "-",
      checkIn: dateStr,
      checkOut: "-",
      status: "In Campus",
    };

    setVisitors([newVs, ...visitors]);
    setIsModalOpen(false);
    toast.success(`Check-In pass ${newPassCode} released!`);

    // Reset Form
    setNewName("");
    setNewPhone("");
    setNewStudent("");
    setNewRoom("");
  };

  const handleCheckOut = (id: string, name: string) => {
    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 19);
    setVisitors(
      visitors.map((v) =>
        v.id === id ? { ...v, status: "Checked Out", checkOut: dateStr } : v
      )
    );
    toast.success(`Visitor ${name} checked out successfully.`);
  };

  const filteredVisitors = visitors.filter((vs) => {
    const matchesSearch =
      vs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vs.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vs.mappedStudent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vs.passNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || vs.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Warden Visitor logs"
        description="Release visitor guest passes, capture photo verification details, and monitor check-out status timelines."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Visitor Entry</span>
          </Button>
        }
      />

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Visitors Today</span>
          <h3 className="text-2xl font-bold tracking-tight">{visitors.length} Visitors</h3>
          <div className="text-[10px] text-muted-foreground">Gate entry log entries</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-blue-600">
          <span className="text-xs font-medium text-muted-foreground">Currently in Campus</span>
          <h3 className="text-2xl font-bold tracking-tight">
            {visitors.filter((v) => v.status === "In Campus").length} Passes
          </h3>
          <div className="text-[10px] text-muted-foreground">Active in hostel residential blocks</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Checked Out</span>
          <h3 className="text-2xl font-bold text-green-500 tracking-tight">
            {visitors.filter((v) => v.status === "Checked Out").length} Passes
          </h3>
          <div className="text-[10px] text-muted-foreground">Safe exit logged</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search visitors..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All States</option>
            <option value="In Campus">In Campus</option>
            <option value="Checked Out">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Visitors table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Pass Number</th>
              <th className="p-4 font-semibold">Visitor Name</th>
              <th className="p-4 font-semibold">Phone Contact</th>
              <th className="p-4 font-semibold">Purpose of Visit</th>
              <th className="p-4 font-semibold">Host resident Mapped</th>
              <th className="p-4 font-semibold">Room No</th>
              <th className="p-4 font-semibold">Check-In Time</th>
              <th className="p-4 font-semibold">Check-Out Time</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground">
                  No visitors logged.
                </td>
              </tr>
            ) : (
              filteredVisitors.map((vs) => (
                <tr key={vs.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{vs.passNo}</td>
                  <td className="p-4 font-semibold text-foreground">{vs.name}</td>
                  <td className="p-4 text-muted-foreground font-mono">{vs.phone}</td>
                  <td className="p-4 text-foreground font-medium">{vs.purpose}</td>
                  <td className="p-4 font-semibold text-foreground">{vs.mappedStudent}</td>
                  <td className="p-4 font-mono font-bold text-foreground">{vs.roomNo}</td>
                  <td className="p-4 text-muted-foreground font-mono">{vs.checkIn}</td>
                  <td className="p-4 text-muted-foreground font-mono">{vs.checkOut}</td>
                  <td className="p-4 text-center">
                    {vs.status === "In Campus" ? (
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-bold uppercase text-[9px] border border-blue-500/20">
                        In Campus
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase text-[9px] border border-green-500/20">
                        Checked Out
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {vs.status === "In Campus" ? (
                      <button
                        onClick={() => handleCheckOut(vs.id, vs.name)}
                        className="px-2 py-1 text-[9px] bg-green-500 hover:bg-green-600 text-white rounded font-bold uppercase"
                      >
                        Check Out
                      </button>
                    ) : (
                      <span className="text-green-500 text-[10px] font-semibold flex items-center justify-end gap-0.5">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Visitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-primary" />
                Register Visitor Check-In Pass
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVisitor} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Phone Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Purpose of Visit</label>
                  <select
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Parent Visit / Meet Child">Meet Resident Child</option>
                    <option value="Kitchen Supplies Delivery">Supplies Delivery</option>
                    <option value="Maintenance Worker">Repair Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Host Pupil Mapped</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Patel"
                    value={newStudent}
                    onChange={(e) => setNewStudent(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Room No</label>
                  <input
                    type="text"
                    placeholder="e.g. 201"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Webcam simulator block */}
              <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center bg-muted/30">
                <Camera className="h-6 w-6 text-muted-foreground mb-1.5" />
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Simulate Photo Capture</span>
                <span className="text-[9px] text-primary mt-0.5 cursor-pointer hover:underline">Verify Gate Webcam Feed</span>
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
                  Issue Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
