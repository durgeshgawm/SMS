"use client";

import React, { use, useState } from "react";
import { Plus, Search, Filter, Trash2, CreditCard, Droplets, Gauge } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface FuelLog {
  id: string;
  date: string;
  vehicleCode: string;
  liters: number;
  ratePerLiter: number;
  totalCost: number;
  odometer: number;
  cardId: string;
}

export default function FleetFuelLogsPage({
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

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([
    {
      id: "fl-1",
      date: "2026-06-25",
      vehicleCode: "GW-BUS-01",
      liters: 60,
      ratePerLiter: 95.5,
      totalCost: 5730,
      odometer: 12450,
      cardId: "GW-HPCL-9843",
    },
    {
      id: "fl-2",
      date: "2026-06-24",
      vehicleCode: "GW-BUS-02",
      liters: 50,
      ratePerLiter: 95.5,
      totalCost: 4775,
      odometer: 8940,
      cardId: "GW-HPCL-1290",
    },
    {
      id: "fl-3",
      date: "2026-06-22",
      vehicleCode: "GW-VAN-01",
      liters: 30,
      ratePerLiter: 95.5,
      totalCost: 2865,
      odometer: 4520,
      cardId: "GW-HPCL-4412",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newVehicle, setNewVehicle] = useState("GW-BUS-01");
  const [newLiters, setNewLiters] = useState("50");
  const [newOdometer, setNewOdometer] = useState("10000");
  const [newCard, setNewCard] = useState("GW-HPCL-");

  const handleAddFuelLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiters || !newOdometer) return;

    const lit = parseFloat(newLiters) || 10;
    const rate = 95.5; // Delhi NCR average diesel/petrol index
    const cost = lit * rate;

    const newLog: FuelLog = {
      id: `fl-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      vehicleCode: newVehicle,
      liters: lit,
      ratePerLiter: rate,
      totalCost: cost,
      odometer: parseInt(newOdometer) || 10000,
      cardId: newCard || "Cash Payout",
    };

    setFuelLogs([newLog, ...fuelLogs]);
    setIsModalOpen(false);
    toast.success(`Fuel log added. Total Cost: ₹${cost.toLocaleString()}`);

    // Reset Form
    setNewLiters("50");
    setNewOdometer("10000");
    setNewCard("GW-HPCL-");
  };

  const handleDeleteLog = (id: string) => {
    if (confirm("Are you sure you want to delete this fuel record?")) {
      setFuelLogs(fuelLogs.filter((fl) => fl.id !== id));
      toast.success("Refuel transaction deleted.");
    }
  };

  const filteredLogs = fuelLogs.filter((fl) => {
    const matchesSearch =
      fl.vehicleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fl.cardId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicle = selectedVehicle === "all" || fl.vehicleCode === selectedVehicle;

    return matchesSearch && matchesVehicle;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Fleet Fuel Expenses Log"
        description="Monitor vehicle refuel transactions, verify corporate fuel card disbursements, and audit fleet mileage values."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Record Refuel</span>
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Monthly Fuel Spent</span>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            ₹{fuelLogs.reduce((acc, curr) => acc + curr.totalCost, 0).toLocaleString()}
          </h3>
          <div className="text-[10px] text-muted-foreground">Corporate card totals</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Liters Consumed</span>
            <Droplets className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            {fuelLogs.reduce((acc, curr) => acc + curr.liters, 0)} Liters
          </h3>
          <div className="text-[10px] text-muted-foreground">Refuel tallies recorded</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Avg Fleet Mileage</span>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground">5.2 km/l Index</h3>
          <div className="text-[10px] text-muted-foreground">Complies with fleet average</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by vehicle, card ID..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Vehicle:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="all">All Vehicles</option>
            <option value="GW-BUS-01">GW-BUS-01</option>
            <option value="GW-BUS-02">GW-BUS-02</option>
            <option value="GW-VAN-01">GW-VAN-01</option>
          </select>
        </div>
      </div>

      {/* Fuel Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Refuel Date</th>
              <th className="p-4 font-semibold">Vehicle Code</th>
              <th className="p-4 font-semibold text-center">Liters Filled</th>
              <th className="p-4 font-semibold text-center">Rate (₹/L)</th>
              <th className="p-4 font-semibold text-center">Total Cost (₹)</th>
              <th className="p-4 font-semibold text-center">Odometer Mapped</th>
              <th className="p-4 font-semibold">Fuel Card ID</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No refuel transactions recorded matching search filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono text-muted-foreground">{log.date}</td>
                  <td className="p-4 font-mono font-bold text-foreground">{log.vehicleCode}</td>
                  <td className="p-4 text-center font-bold text-foreground">{log.liters} Liters</td>
                  <td className="p-4 text-center text-muted-foreground">₹{log.ratePerLiter}</td>
                  <td className="p-4 text-center font-bold text-green-500">₹{log.totalCost.toLocaleString()}</td>
                  <td className="p-4 text-center font-mono font-semibold text-foreground">{log.odometer} km</td>
                  <td className="p-4 font-mono text-muted-foreground font-semibold">{log.cardId}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      title="Delete refuel entry"
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

      {/* Add Fuel Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Droplets className="h-4.5 w-4.5 text-primary animate-pulse" />
                Record Fuel Refill Transaction
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFuelLog} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Select Fleet Vehicle</label>
                <select
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                >
                  <option value="GW-BUS-01">GW-BUS-01 (Tata Starbus)</option>
                  <option value="GW-BUS-02">GW-BUS-02 (Tata Starbus)</option>
                  <option value="GW-VAN-01">GW-VAN-01 (Maruti Eeco)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Liters Filled</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLiters}
                    onChange={(e) => setNewLiters(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Odometer Reading (km)</label>
                  <input
                    type="number"
                    required
                    value={newOdometer}
                    onChange={(e) => setNewOdometer(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">HPCL Fuel Card ID</label>
                <input
                  type="text"
                  required
                  value={newCard}
                  onChange={(e) => setNewCard(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-muted rounded-lg text-[10px] text-muted-foreground">
                Pricing Rate index is matched dynamically at <strong>₹95.5 / Liter</strong> baseline for diesel fuel categories.
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
                  Save Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
