"use client";

import React, { use, useState } from "react";
import { Users, Plus, Search, Filter, Trash2, ShieldCheck, ShieldAlert, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Member {
  id: string;
  cardId: string;
  name: string;
  type: "Student" | "Teacher" | "Staff";
  classDept: string;
  joinedDate: string;
  borrowedCount: number;
  maxLimit: number;
  status: "Active" | "Suspended";
}

export default function LibraryMembersPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "library") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [members, setMembers] = useState<Member[]>([
    {
      id: "mbr-1",
      cardId: "GW-LIB-0001",
      name: "Rahul Verma",
      type: "Student",
      classDept: "Class 10 - Section A",
      joinedDate: "2024-06-20",
      borrowedCount: 1,
      maxLimit: 3,
      status: "Active",
    },
    {
      id: "mbr-2",
      cardId: "GW-LIB-0002",
      name: "Ms. Shalini Gupta",
      type: "Teacher",
      classDept: "Academics",
      joinedDate: "2024-06-16",
      borrowedCount: 2,
      maxLimit: 5,
      status: "Active",
    },
    {
      id: "mbr-3",
      cardId: "GW-LIB-0003",
      name: "Sneha Sharma",
      type: "Student",
      classDept: "Class 9 - Section B",
      joinedDate: "2024-08-01",
      borrowedCount: 3,
      maxLimit: 3,
      status: "Active",
    },
    {
      id: "mbr-4",
      cardId: "GW-LIB-0004",
      name: "Mr. Rajesh Kumar",
      type: "Staff",
      classDept: "Administration",
      joinedDate: "2025-01-15",
      borrowedCount: 0,
      maxLimit: 3,
      status: "Suspended",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New member states
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"Student" | "Teacher" | "Staff">("Student");
  const [newClassDept, setNewClassDept] = useState("");
  const [newMaxLimit, setNewMaxLimit] = useState("3");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newClassDept) return;

    const newMbr: Member = {
      id: `mbr-${Date.now()}`,
      cardId: `GW-LIB-00${members.length + 1}`,
      name: newName,
      type: newType,
      classDept: newClassDept,
      joinedDate: new Date().toISOString().split("T")[0],
      borrowedCount: 0,
      maxLimit: parseInt(newMaxLimit) || 3,
      status: "Active",
    };

    setMembers([newMbr, ...members]);
    setIsModalOpen(false);
    toast.success(`Library membership profile created for ${newName}!`);

    // Reset Form
    setNewName("");
    setNewClassDept("");
    setNewMaxLimit("3");
  };

  const handleStatusToggle = (id: string, name: string, currentStatus: "Active" | "Suspended") => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setMembers(
      members.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
    toast.success(`Library card for ${name} is now ${nextStatus}.`);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Are you sure you want to revoke this library card membership?")) {
      setMembers(members.filter((m) => m.id !== id));
      toast.success("Library membership revoked successfully.");
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.classDept.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || m.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Library Membership Registry"
        description="Add, suspend, and configure library memberships, card ids, and book borrow caps for pupils and faculty."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Register Member</span>
          </Button>
        }
      />

      {/* Member Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Card Holders</span>
          <h3 className="text-2xl font-bold tracking-tight">{members.length} Members</h3>
          <div className="text-[10px] text-muted-foreground">Active in Greenwood system</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Student Members</span>
          <h3 className="text-2xl font-bold text-blue-500 tracking-tight">
            {members.filter((m) => m.type === "Student").length} Cards
          </h3>
          <div className="text-[10px] text-muted-foreground">Classroom pupil accounts</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Faculty & Staff Cards</span>
          <h3 className="text-2xl font-bold text-purple-500 tracking-tight">
            {members.filter((m) => m.type === "Teacher" || m.type === "Staff").length} Cards
          </h3>
          <div className="text-[10px] text-muted-foreground">Staff & teaching roster logs</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Suspended accounts</span>
          <h3 className="text-2xl font-bold text-red-500 tracking-tight">
            {members.filter((m) => m.status === "Suspended").length} Cards
          </h3>
          <div className="text-[10px] text-muted-foreground">Blocked due to lost items or fines</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, card ID, class..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Type:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      {/* Members table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Library Card ID</th>
              <th className="p-4 font-semibold">Member Name</th>
              <th className="p-4 font-semibold">Member Type</th>
              <th className="p-4 font-semibold">Class / Department</th>
              <th className="p-4 font-semibold">Date of Joining</th>
              <th className="p-4 font-semibold text-center">Books Borrowed</th>
              <th className="p-4 font-semibold text-center">Max Book Limit</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">
                  No library members registered under selected filters.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{m.cardId}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                        {m.name.split(" ").slice(-1)[0][0] || "U"}
                      </div>
                      <span className="font-semibold text-foreground">{m.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.type === "Student" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="p-4 text-foreground font-medium">{m.classDept}</td>
                  <td className="p-4 text-muted-foreground font-mono">{m.joinedDate}</td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${m.borrowedCount >= m.maxLimit ? "text-red-500" : "text-foreground"}`}>
                      {m.borrowedCount}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-muted-foreground">{m.maxLimit}</td>
                  <td className="p-4 text-center">
                    {m.status === "Active" ? (
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase text-[9px] border border-green-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-red-500/10 text-red-500 rounded-full font-bold uppercase text-[9px] border border-red-500/20">
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(m.id, m.name, m.status)}
                        title={m.status === "Active" ? "Suspend Account" : "Activate Account"}
                        className={`p-1 border rounded hover:bg-muted transition-colors ${
                          m.status === "Active" ? "text-amber-500 hover:text-amber-600" : "text-green-500 hover:text-green-600"
                        }`}
                      >
                        {m.status === "Active" ? <ShieldAlert className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        title="Delete Member Account"
                        className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-primary" />
                Register New Library Card Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Borrower Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Member Role</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher / Instructor</option>
                    <option value="Staff">Office Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Max Borrow Limit</label>
                  <select
                    value={newMaxLimit}
                    onChange={(e) => setNewMaxLimit(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="3">3 Books (Standard Student)</option>
                    <option value="5">5 Books (Premium Faculty)</option>
                    <option value="10">10 Books (Admin/Research)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Classroom Mapped / Staff Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 - Section A"
                  value={newClassDept}
                  onChange={(e) => setNewClassDept(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
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
                  Create Member Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
