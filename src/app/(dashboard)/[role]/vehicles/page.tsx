"use client";

import React, { use, useState } from "react";
import { Bus, Plus, Search, Filter, Trash2, AlertTriangle, CheckCircle, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Vehicle {
  id: string;
  code: string;
  plateNo: string;
  model: string;
  capacity: number;
  driverName: string;
  insuranceExpiry: string;
  status: "Active" | "Maintenance" | "Inactive";
}

export default function FleetVehiclesPage({
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

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "vh-1",
      code: "GW-BUS-01",
      plateNo: "DL 1PA 5289",
      model: "Tata Starbus 40-Seater",
      capacity: 40,
      driverName: "Hari Singh",
      insuranceExpiry: "2026-12-15",
      status: "Active",
    },
    {
      id: "vh-2",
      code: "GW-BUS-02",
      plateNo: "DL 1PB 7712",
      model: "Tata Starbus 32-Seater",
      capacity: 32,
      driverName: "Baldev Raj",
      insuranceExpiry: "2026-07-10",
      status: "Active",
    },
    {
      id: "vh-3",
      code: "GW-VAN-01",
      plateNo: "DL 3CA 4512",
      model: "Maruti Suzuki Eeco",
      capacity: 8,
      driverName: "Amit Kumar",
      insuranceExpiry: "2026-06-28", // expiring in 2 days
      status: "Active",
    },
    {
      id: "vh-4",
      code: "GW-BUS-03",
      plateNo: "DL 1PC 9901",
      model: "Mahindra Cruzio 36-Seater",
      capacity: 36,
      driverName: "Unassigned",
      insuranceExpiry: "2027-02-20",
      status: "Maintenance",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newPlate, setNewPlate] = useState("");
  const [newModel, setNewModel] = useState("Tata Starbus 40-Seater");
  const [newCapacity, setNewCapacity] = useState("40");
  const [newDriver, setNewDriver] = useState("Unassigned");
  const [newInsurance, setNewInsurance] = useState("");

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newInsurance) return;

    const nextCode = `GW-BUS-0${vehicles.length + 1}`;
    const newVh: Vehicle = {
      id: `vh-${Date.now()}`,
      code: nextCode,
      plateNo: newPlate,
      model: newModel,
      capacity: parseInt(newCapacity) || 30,
      driverName: newDriver,
      insuranceExpiry: newInsurance,
      status: "Active",
    };

    setVehicles([newVh, ...vehicles]);
    setIsModalOpen(false);
    toast.success(`Vehicle ${newPlate} added successfully!`);

    // Reset Form
    setNewPlate("");
    setNewInsurance("");
    setNewDriver("Unassigned");
  };

  const handleStatusChange = (id: string, nextStatus: "Active" | "Maintenance" | "Inactive") => {
    setVehicles(
      vehicles.map((v) => (v.id === id ? { ...v, status: nextStatus } : v))
    );
    toast.success(`Vehicle status updated to ${nextStatus}.`);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm("Are you sure you want to retire this fleet vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
      toast.success("Vehicle deleted from transport registry.");
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || v.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Fleet Vehicle Register"
        description="Register and manage institutional transportation vehicles, plate numbers, capacities, and active maintenance schedules."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Fleet Vehicles</span>
          <h3 className="text-2xl font-bold tracking-tight">{vehicles.length} Units</h3>
          <div className="text-[10px] text-muted-foreground">Buses, vans & shuttle fleet</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Vehicles on Route (Active)</span>
          <h3 className="text-2xl font-bold text-green-500 tracking-tight">
            {vehicles.filter((v) => v.status === "Active").length} Units
          </h3>
          <div className="text-[10px] text-muted-foreground">Running daily schedules</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">In Service Shop</span>
          <h3 className="text-2xl font-bold text-amber-500 tracking-tight">
            {vehicles.filter((v) => v.status === "Maintenance").length} Units
          </h3>
          <div className="text-[10px] text-muted-foreground">Undergoing mechanical auditing</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-red-500 border-red-500/20 bg-red-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-500">Expiring Insurances</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">1 Vehicle</h3>
          <div className="text-[10px] text-red-500">Renewal due within 3 days</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by code, plate, model, driver..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Status:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Vehicle Code</th>
              <th className="p-4 font-semibold">Plate Number</th>
              <th className="p-4 font-semibold">Brand / Model Specs</th>
              <th className="p-4 font-semibold text-center">Seat Capacity</th>
              <th className="p-4 font-semibold">Assigned Driver</th>
              <th className="p-4 font-semibold">Insurance Valid Until</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No fleet vehicles registered in Greenwood database.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((vh) => (
                <tr key={vh.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{vh.code}</td>
                  <td className="p-4 font-mono font-semibold text-foreground">{vh.plateNo}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">{vh.model}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold text-foreground">{vh.capacity} Seats</td>
                  <td className="p-4 font-medium text-foreground">{vh.driverName}</td>
                  <td className="p-4 text-muted-foreground font-mono">{vh.insuranceExpiry}</td>
                  <td className="p-4 text-center">
                    {vh.status === "Active" && (
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase text-[9px] border border-green-500/20">
                        Active
                      </span>
                    )}
                    {vh.status === "Maintenance" && (
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-500 rounded-full font-bold uppercase text-[9px] border border-amber-500/20">
                        Maintenance
                      </span>
                    )}
                    {vh.status === "Inactive" && (
                      <span className="px-2.5 py-0.5 bg-slate-500/10 text-slate-500 rounded-full font-bold uppercase text-[9px] border border-slate-500/20">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {vh.status !== "Maintenance" && (
                        <button
                          onClick={() => handleStatusChange(vh.id, "Maintenance")}
                          title="Send to Maintenance Shop"
                          className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {vh.status === "Maintenance" && (
                        <button
                          onClick={() => handleStatusChange(vh.id, "Active")}
                          title="Return to Active service"
                          className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-green-500 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVehicle(vh.id)}
                        title="Remove vehicle from registry"
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

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Bus className="h-4.5 w-4.5 text-primary" />
                Register Fleet Vehicle
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Plate Number (Registration)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL 1PA 5289"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Vehicle Specification / Model</label>
                <select
                  value={newModel}
                  onChange={(e) => {
                    setNewModel(e.target.value);
                    setNewCapacity(e.target.value.includes("40-Seater") ? "40" : e.target.value.includes("32-Seater") ? "32" : "8");
                  }}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                >
                  <option value="Tata Starbus 40-Seater">Tata Starbus (40 Seats)</option>
                  <option value="Tata Starbus 32-Seater">Tata Starbus (32 Seats)</option>
                  <option value="Maruti Suzuki Eeco">Maruti Suzuki Eeco (8 Seats)</option>
                  <option value="Mahindra Cruzio 36-Seater">Mahindra Cruzio (36 Seats)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Insurance Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newInsurance}
                    onChange={(e) => setNewInsurance(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Assign Driver Name</label>
                <input
                  type="text"
                  required
                  value={newDriver}
                  onChange={(e) => setNewDriver(e.target.value)}
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
                  Register Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
