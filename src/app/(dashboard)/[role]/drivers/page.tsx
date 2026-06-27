"use client";

import React, { use, useState } from "react";
import { Users, Plus, Search, Filter, Trash2, ShieldCheck, Mail, Phone, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  phone: string;
  assignedVehicle: string;
  licenseExpiry: string;
  shift: string;
  attendance: "Present" | "Absent";
}

export default function FleetDriversPage({
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

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "dr-1",
      name: "Hari Singh",
      licenseNo: "DL-14202008432",
      phone: "+91 98112 34567",
      assignedVehicle: "GW-BUS-01",
      licenseExpiry: "2029-08-14",
      shift: "Morning (06:00 AM - 02:00 PM)",
      attendance: "Present",
    },
    {
      id: "dr-2",
      name: "Baldev Raj",
      licenseNo: "DL-12201899431",
      phone: "+91 99554 43210",
      assignedVehicle: "GW-BUS-02",
      licenseExpiry: "2027-11-20",
      shift: "Morning (06:00 AM - 02:00 PM)",
      attendance: "Present",
    },

    {
      id: "dr-3",
      name: "Sukhdev Singh",
      licenseNo: "DL-11201584321",
      phone: "+91 99778 86655",
      assignedVehicle: "Unassigned",
      licenseExpiry: "2028-05-12",
      shift: "Afternoon (01:00 PM - 09:00 PM)",
      attendance: "Absent",
    },


  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShift, setSelectedShift] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newLicense, setNewLicense] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newVehicle, setNewVehicle] = useState("Unassigned");
  const [newExpiry, setNewExpiry] = useState("");
  const [newShift, setNewShift] = useState("Morning (06:00 AM - 02:00 PM)");

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLicense || !newPhone || !newExpiry) return;

    const newDr: Driver = {
      id: `dr-${Date.now()}`,
      name: newName,
      licenseNo: newLicense,
      phone: newPhone,
      assignedVehicle: newVehicle,
      licenseExpiry: newExpiry,
      shift: newShift,
      attendance: "Present",
    };

    setDrivers([newDr, ...drivers]);
    setIsModalOpen(false);
    toast.success(`Driver ${newName} added successfully!`);

    // Reset Form
    setNewName("");
    setNewLicense("");
    setNewPhone("");
    setNewExpiry("");
  };

  const handleAttendanceToggle = (id: string, name: string, current: "Present" | "Absent") => {
    const nextAttendance = current === "Present" ? "Absent" : "Present";
    setDrivers(
      drivers.map((d) => (d.id === id ? { ...d, attendance: nextAttendance } : d))
    );
    toast.success(`Driver ${name} marked ${nextAttendance} today.`);
  };

  const handleDeleteDriver = (id: string) => {
    if (confirm("Are you sure you want to remove this driver profile from registry?")) {
      setDrivers(drivers.filter((d) => d.id !== id));
      toast.success("Driver removed from transport registry.");
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesShift = selectedShift === "all" || d.shift.includes(selectedShift);

    return matchesSearch && matchesShift;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Drivers & Staff Directory"
        description="Verify driver licenses, map fleet assignments, and track daily driver attendance."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Add Driver</span>
          </Button>
        }
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Drivers</span>
          <h3 className="text-2xl font-bold tracking-tight">{drivers.length} Drivers</h3>
          <div className="text-[10px] text-muted-foreground">Active profiles on fleet roster</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-green-600">
          <span className="text-xs font-medium text-muted-foreground text-green-600">On Duty Today</span>
          <h3 className="text-2xl font-bold tracking-tight">
            {drivers.filter((d) => d.attendance === "Present").length} Drivers
          </h3>
          <div className="text-[10px] text-muted-foreground">Present and active on routes</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-red-500">
          <span className="text-xs font-medium text-muted-foreground text-red-500">Absent / Leave</span>
          <h3 className="text-2xl font-bold tracking-tight">
            {drivers.filter((d) => d.attendance === "Absent").length} Drivers
          </h3>
          <div className="text-[10px] text-muted-foreground">Requires route substitute assignment</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search drivers registry..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Shift:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="all">All Shifts</option>
            <option value="Morning">Morning shift</option>
            <option value="Afternoon">Afternoon shift</option>
          </select>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Driver Name</th>
              <th className="p-4 font-semibold">License Number</th>
              <th className="p-4 font-semibold">Contact Phone</th>
              <th className="p-4 font-semibold">Assigned Fleet</th>
              <th className="p-4 font-semibold">License Expiration</th>
              <th className="p-4 font-semibold">Duty Shift</th>
              <th className="p-4 font-semibold text-center">Duty Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No drivers registered on selected shift.
                </td>
              </tr>
            ) : (
              filteredDrivers.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                        {d.name.split(" ").slice(-1)[0][0] || "D"}
                      </div>
                      <span className="font-semibold text-foreground">{d.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-muted-foreground font-semibold">{d.licenseNo}</td>
                  <td className="p-4 text-foreground font-semibold flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" /> {d.phone}
                  </td>
                  <td className="p-4">
                    {d.assignedVehicle !== "Unassigned" ? (
                      <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded font-bold font-mono">
                        {d.assignedVehicle}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{d.licenseExpiry}</td>
                  <td className="p-4 text-muted-foreground font-medium">{d.shift}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleAttendanceToggle(d.id, d.name, d.attendance)}
                      title="Toggle Daily Attendance"
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] border transition-all ${d.attendance === "Present"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                    >
                      {d.attendance}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteDriver(d.id)}
                      title="Remove Driver Profile"
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

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-primary" />
                Register New Driver
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Driver Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hari Singh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">License Number Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-14202008432"
                  value={newLicense}
                  onChange={(e) => setNewLicense(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Phone Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98112 34567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Assigned Vehicle</label>
                  <input
                    type="text"
                    required
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Shift Timing</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Morning (06:00 AM - 02:00 PM)">Morning (6AM - 2PM)</option>
                    <option value="Afternoon (01:00 PM - 09:00 PM)">Afternoon (1PM - 9PM)</option>
                  </select>
                </div>
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
                  Save Driver Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
