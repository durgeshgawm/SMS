"use client";

import React, { use, useState } from "react";
import { Plus, Search, Filter, Trash2, CalendarCheck, Clock, CheckCircle, Navigation } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Trip {
  id: string;
  timeSlot: string;
  routeCode: string;
  vehicleCode: string;
  driverName: string;
  category: "Morning Pickup" | "Afternoon Drop" | "Special Trip";
  pupilsCount: number;
  status: "Scheduled" | "In Transit" | "Completed";
}

export default function FleetTripsSchedulerPage({
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

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "tr-1",
      timeSlot: "06:45 AM - 07:45 AM",
      routeCode: "ROUTE-01",
      vehicleCode: "GW-BUS-01",
      driverName: "Hari Singh",
      category: "Morning Pickup",
      pupilsCount: 38,
      status: "Completed",
    },
    {
      id: "tr-2",
      timeSlot: "07:00 AM - 07:50 AM",
      routeCode: "ROUTE-02",
      vehicleCode: "GW-BUS-02",
      driverName: "Baldev Raj",
      category: "Morning Pickup",
      pupilsCount: 30,
      status: "Completed",
    },
    {
      id: "tr-3",
      timeSlot: "01:30 PM - 02:30 PM",
      routeCode: "ROUTE-01",
      vehicleCode: "GW-BUS-01",
      driverName: "Hari Singh",
      category: "Afternoon Drop",
      pupilsCount: 38,
      status: "In Transit",
    },
    {
      id: "tr-4",
      timeSlot: "02:00 PM - 03:00 PM",
      routeCode: "ROUTE-03",
      vehicleCode: "GW-VAN-01",
      driverName: "Amit Kumar",
      category: "Afternoon Drop",
      pupilsCount: 8,
      status: "Scheduled",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const handleStatusChange = (id: string, nextStatus: "Scheduled" | "In Transit" | "Completed") => {
    setTrips(
      trips.map((tr) => (tr.id === id ? { ...tr, status: nextStatus } : tr))
    );
    toast.success(`Trip status updated to ${nextStatus}.`);
  };

  const handleCreateTrip = () => {
    // quick simulation to create next schedule
    const route = prompt("Enter Route Code (e.g. ROUTE-01):");
    const driver = prompt("Enter Driver Name:");
    const vehicle = prompt("Enter Vehicle Code (e.g. GW-BUS-03):");
    const category = prompt("Enter Category (Morning Pickup / Afternoon Drop):");

    if (route && driver && vehicle) {
      const newTr: Trip = {
        id: `tr-${Date.now()}`,
        timeSlot: "03:15 PM - 04:15 PM",
        routeCode: route.toUpperCase(),
        vehicleCode: vehicle.toUpperCase(),
        driverName: driver,
        category: category === "Morning Pickup" ? "Morning Pickup" : "Afternoon Drop",
        pupilsCount: 25,
        status: "Scheduled",
      };
      setTrips([...trips, newTr]);
      toast.success("Schedule run registered.");
    }
  };

  const handleDeleteTrip = (id: string) => {
    if (confirm("Are you sure you want to cancel this trip schedule?")) {
      setTrips(trips.filter((t) => t.id !== id));
      toast.success("Trip schedule deleted.");
    }
  };

  const filteredTrips = trips.filter((tr) => {
    const matchesSearch =
      tr.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tr.vehicleCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCat === "all" || tr.category === selectedCat;

    return matchesSearch && matchesCat;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Trips & Dispatch Scheduler"
        description="Monitor daily school bus dispatch timetables, pickup/drop progress, and vehicle transit states."
        actions={
          <Button onClick={handleCreateTrip} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Plan Trip Run</span>
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Planned Runs</span>
          <h3 className="text-2xl font-bold tracking-tight">{trips.length} Trips</h3>
          <div className="text-[10px] text-muted-foreground">Scheduled for today</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-green-500">
          <span className="text-xs font-medium text-muted-foreground text-green-500">Completed Runs</span>
          <h3 className="text-2xl font-bold tracking-tight">
            {trips.filter((t) => t.status === "Completed").length} Runs
          </h3>
          <div className="text-[10px] text-muted-foreground">Successfully checked off</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-blue-500">
          <span className="text-xs font-medium text-muted-foreground text-blue-500">Active Transit (Live)</span>
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-1.5">
            <Navigation className="h-5 w-5 animate-pulse text-blue-500" />
            {trips.filter((t) => t.status === "In Transit").length} Runs
          </h3>
          <div className="text-[10px] text-muted-foreground">En-route on active GPS</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Remaining Schedules</span>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {trips.filter((t) => t.status === "Scheduled").length} Runs
          </h3>
          <div className="text-[10px] text-muted-foreground">Pending transit release</div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by route, driver, bus..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">All Trip Types</option>
            <option value="Morning Pickup">Morning Pickup</option>
            <option value="Afternoon Drop">Afternoon Drop</option>
            <option value="Special Trip">Special Trip</option>
          </select>
        </div>
      </div>

      {/* Trips list table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Scheduled Timing</th>
              <th className="p-4 font-semibold">Route Code</th>
              <th className="p-4 font-semibold">Vehicle Code</th>
              <th className="p-4 font-semibold">Driver Name</th>
              <th className="p-4 font-semibold">Trip Category</th>
              <th className="p-4 font-semibold text-center">Mapped Passengers</th>
              <th className="p-4 font-semibold text-center">Transit Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No trips scheduled for today.
                </td>
              </tr>
            ) : (
              filteredTrips.map((tr) => (
                <tr key={tr.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {tr.timeSlot}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-primary">{tr.routeCode}</td>
                  <td className="p-4 font-mono font-semibold text-foreground">{tr.vehicleCode}</td>
                  <td className="p-4 font-semibold text-foreground">{tr.driverName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tr.category === "Morning Pickup" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    }`}>
                      {tr.category}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-foreground">{tr.pupilsCount} Pupils</td>
                  <td className="p-4 text-center">
                    {tr.status === "Completed" && (
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase text-[9px] border border-green-500/20">
                        Completed
                      </span>
                    )}
                    {tr.status === "In Transit" && (
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-bold uppercase text-[9px] border border-blue-500/20 animate-pulse">
                        In Transit
                      </span>
                    )}
                    {tr.status === "Scheduled" && (
                      <span className="px-2.5 py-0.5 bg-slate-500/10 text-slate-500 rounded-full font-bold uppercase text-[9px] border border-slate-500/20">
                        Scheduled
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {tr.status === "Scheduled" && (
                        <button
                          onClick={() => handleStatusChange(tr.id, "In Transit")}
                          className="px-2.5 py-1 text-[9px] bg-blue-500 text-white rounded font-bold uppercase hover:bg-blue-600"
                        >
                          Dispatch
                        </button>
                      )}
                      {tr.status === "In Transit" && (
                        <button
                          onClick={() => handleStatusChange(tr.id, "Completed")}
                          className="px-2.5 py-1 text-[9px] bg-green-500 text-white rounded font-bold uppercase hover:bg-green-600"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTrip(tr.id)}
                        title="Delete trip schedule"
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
    </PageContainer>
  );
}
