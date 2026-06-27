"use client";

import React, { use, useState } from "react";
import { Plus, Search, Filter, Trash2, UserPlus, Compass, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Allocation {
  id: string;
  name: string;
  type: "Student" | "Staff";
  classDept: string;
  routeCode: string;
  vehicleCode: string;
  pickupStop: string;
  allocatedDate: string;
}

export default function TransportAllocationPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  if (role !== "super-admin" && role !== "transport") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [allocations, setAllocations] = useState<Allocation[]>([
    {
      id: "al-1",
      name: "Rahul Verma",
      type: "Student",
      classDept: "Class 10 - Section A",
      routeCode: "ROUTE-01",
      vehicleCode: "GW-BUS-01",
      pickupStop: "Sector 10 Metro",
      allocatedDate: "2024-06-21",
    },
    {
      id: "al-2",
      name: "Ms. Shalini Gupta",
      type: "Staff",
      classDept: "Academics",
      routeCode: "ROUTE-02",
      vehicleCode: "GW-BUS-02",
      pickupStop: "Uttam Nagar East",
      allocatedDate: "2024-06-16",
    },
    {
      id: "al-3",
      name: "Sneha Sharma",
      type: "Student",
      classDept: "Class 9 - Section B",
      routeCode: "ROUTE-01",
      vehicleCode: "GW-BUS-01",
      pickupStop: "Sector 6 Market",
      allocatedDate: "2024-08-02",
    },
    {
      id: "al-4",
      name: "Amit Kumar",
      type: "Staff",
      classDept: "Administration",
      routeCode: "ROUTE-03",
      vehicleCode: "GW-VAN-01",
      pickupStop: "Ambience Mall",
      allocatedDate: "2025-01-18",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"Student" | "Staff">("Student");
  const [newClassDept, setNewClassDept] = useState("");
  const [newRoute, setNewRoute] = useState("ROUTE-01");
  const [newVehicle, setNewVehicle] = useState("GW-BUS-01");
  const [newStop, setNewStop] = useState("");

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newClassDept || !newStop) return;

    const newAl: Allocation = {
      id: `al-${Date.now()}`,
      name: newName,
      type: newType,
      classDept: newClassDept,
      routeCode: newRoute,
      vehicleCode: newVehicle,
      pickupStop: newStop,
      allocatedDate: new Date().toISOString().split("T")[0],
    };

    setAllocations([newAl, ...allocations]);
    setIsModalOpen(false);
    toast.success(`Seat allocated successfully for ${newName}!`);

    // Reset Form
    setNewName("");
    setNewClassDept("");
    setNewStop("");
  };

  const handleDeallocate = (id: string, name: string) => {
    if (confirm(`Are you sure you want to cancel transport allocation for ${name}?`)) {
      setAllocations(allocations.filter((al) => al.id !== id));
      toast.success("Allocation mapping cancelled.");
    }
  };

  const filteredAllocations = allocations.filter((al) => {
    const matchesSearch =
      al.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.classDept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.pickupStop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.vehicleCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || al.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <PageContainer>
      <PageHeader
        title="GPS & Seat Allocation"
        description="Map student and employee profiles to operational vehicle routes, shifts, and pickup stops."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Map Allocation</span>
          </Button>
        }
      />

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Allocations Mapped</span>
          <h3 className="text-2xl font-bold tracking-tight">{allocations.length} Passengers</h3>
          <div className="text-[10px] text-muted-foreground">Students & staff seatings</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Allocated Pupils</span>
          <h3 className="text-2xl font-bold text-blue-500 tracking-tight">
            {allocations.filter((a) => a.type === "Student").length} Students
          </h3>
          <div className="text-[10px] text-muted-foreground">Bus pass generated</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Allocated Employees</span>
          <h3 className="text-2xl font-bold text-purple-500 tracking-tight">
            {allocations.filter((a) => a.type === "Staff").length} Staff
          </h3>
          <div className="text-[10px] text-muted-foreground">Staff van allocations</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Fares Linked Status</span>
          <h3 className="text-base font-bold text-green-500 tracking-tight flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Sync Intact
          </h3>
          <div className="text-[10px] text-muted-foreground">Billed through Finance collections</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search allocations..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Role:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Student">Students</option>
            <option value="Staff">Employees / Staff</option>
          </select>
        </div>
      </div>

      {/* Allocations table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Passenger Name</th>
              <th className="p-4 font-semibold">Passenger Type</th>
              <th className="p-4 font-semibold">Class / Mapped Dept</th>
              <th className="p-4 font-semibold">Route Code</th>
              <th className="p-4 font-semibold">Vehicle Code</th>
              <th className="p-4 font-semibold">Pickup / Drop Stop</th>
              <th className="p-4 font-semibold">Date of Mapping</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No allocation logs found matching search.
                </td>
              </tr>
            ) : (
              filteredAllocations.map((al) => (
                <tr key={al.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{al.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      al.type === "Student" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {al.type}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-foreground">{al.classDept}</td>
                  <td className="p-4 font-mono font-bold text-primary">{al.routeCode}</td>
                  <td className="p-4 font-mono font-semibold text-foreground">{al.vehicleCode}</td>
                  <td className="p-4 text-foreground font-semibold flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                    {al.pickupStop}
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{al.allocatedDate}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeallocate(al.id, al.name)}
                      title="Deallocate passenger seat"
                      className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Allocation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <UserPlus className="h-4.5 w-4.5 text-primary" />
                Allocate Transport Seat
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAllocation} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Passenger Name</label>
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
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Passenger Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Staff">Employee / Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Class / Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10 - Section A"
                    value={newClassDept}
                    onChange={(e) => setNewClassDept(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Mapped Route</label>
                  <select
                    value={newRoute}
                    onChange={(e) => setNewRoute(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="ROUTE-01">ROUTE-01 (Dwarka)</option>
                    <option value="ROUTE-02">ROUTE-02 (Janakpuri)</option>
                    <option value="ROUTE-03">ROUTE-03 (Gurugram)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Vehicle</label>
                  <select
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  >
                    <option value="GW-BUS-01">GW-BUS-01</option>
                    <option value="GW-BUS-02">GW-BUS-02</option>
                    <option value="GW-VAN-01">GW-VAN-01</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Stoppage Stop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 10 Metro"
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
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
                  Confirm Allocation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
