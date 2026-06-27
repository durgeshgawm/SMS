"use client";

import React, { use, useState } from "react";
import { Building2, Plus, Search, Filter, Trash2, MapPin, Compass, Clock, Map } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Route {
  id: string;
  code: string;
  name: string;
  startPoint: string;
  endPoint: string;
  timing: string;
  stops: string[];
  distance: string;
}

export default function TransportRoutesPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const allowedRoles = ["super-admin", "transport", "student", "parent", "teacher", "academic"];
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const isTransportAdmin = role === "transport" || role === "super-admin";

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: "rt-1",
      code: "ROUTE-01",
      name: "Dwarka Sector 10 to School",
      startPoint: "Dwarka Sector 10 Metro",
      endPoint: "Greenwood Campus Sector 15",
      timing: "06:45 AM - 07:45 AM",
      stops: ["Sector 10 Metro", "Sector 6 Market", "Sector 4 Chowk", "Palam Crossing", "Sector 15 Campus"],
      distance: "14.2 km",
    },
    {
      id: "rt-2",
      code: "ROUTE-02",
      name: "Janakpuri West to School",
      startPoint: "Janakpuri West Metro",
      endPoint: "Greenwood Campus Sector 15",
      timing: "07:00 AM - 07:50 AM",
      stops: ["Janakpuri West", "Uttam Nagar East", "Vikaspuri Chowk", "Peeragarhi", "Sector 15 Campus"],
      distance: "12.8 km",
    },
    {
      id: "rt-3",
      code: "ROUTE-03",
      name: "Gurugram Phase 3 to School",
      startPoint: "Cyber City Phase 3",
      endPoint: "Greenwood Campus Sector 15",
      timing: "06:30 AM - 07:45 AM",
      stops: ["Phase 3 Metro", "Ambience Mall", "Rajiv Chowk", "Hero Honda Chowk", "Sector 15 Campus"],
      distance: "22.5 km",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(routes[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newTiming, setNewTiming] = useState("07:00 AM - 08:00 AM");
  const [newStops, setNewStops] = useState("");
  const [newDistance, setNewDistance] = useState("10 km");

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || !newStart || !newEnd || !newStops) return;

    const stopsArray = newStops.split(",").map((s) => s.trim());
    const newRt: Route = {
      id: `rt-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      startPoint: newStart,
      endPoint: newEnd,
      timing: newTiming,
      stops: stopsArray,
      distance: newDistance,
    };

    setRoutes([...routes, newRt]);
    setSelectedRoute(newRt);
    setIsModalOpen(false);
    toast.success(`Route ${newCode} configured successfully!`);

    // Reset Form
    setNewCode("");
    setNewName("");
    setNewStart("");
    setNewEnd("");
    setNewStops("");
    setNewDistance("10 km");
  };

  const handleDeleteRoute = (id: string) => {
    if (confirm("Are you sure you want to delete this transport route?")) {
      const nextRoutes = routes.filter((r) => r.id !== id);
      setRoutes(nextRoutes);
      setSelectedRoute(nextRoutes[0] || null);
      toast.success("Route deleted successfully.");
    }
  };

  const filteredRoutes = routes.filter((r) => {
    return (
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <PageContainer>
      <PageHeader
        title="Transport Routes & Stoppages"
        description="Configure route timings, define passenger pickup/drop stoppages, and view visual map schedules."
        actions={
          isTransportAdmin && (
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
              <Plus className="h-4 w-4" />
              <span>Configure Route</span>
            </Button>
          )
        }
      />

      {/* Routes Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Active Bus Routes</span>
          <h3 className="text-2xl font-bold tracking-tight">{routes.length} Routes</h3>
          <div className="text-[10px] text-muted-foreground">Covering key NCR regions</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Bus Stops</span>
          <h3 className="text-2xl font-bold text-purple-500 tracking-tight">
            {routes.reduce((acc, curr) => acc + curr.stops.length, 0)} Stoppages
          </h3>
          <div className="text-[10px] text-muted-foreground">Mapped pickup milestones</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">System Load Factor</span>
          <h3 className="text-base font-bold text-green-500 tracking-tight flex items-center gap-1">
            <Compass className="h-4 w-4 text-green-500" /> Optimal Routing
          </h3>
          <div className="text-[10px] text-muted-foreground">Shortest distance timeline active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Routes List */}
        <div className="md:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search routes..."
              className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2.5">
            {filteredRoutes.map((rt) => (
              <div
                key={rt.id}
                onClick={() => setSelectedRoute(rt)}
                className={`p-4 border rounded-xl shadow-sm text-left cursor-pointer transition-all ${
                  selectedRoute?.id === rt.id
                    ? "border-primary bg-primary/[0.02]"
                    : "bg-card hover:bg-muted/40"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold text-xs text-primary">{rt.code}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">{rt.distance}</span>
                </div>
                <h4 className="font-bold text-foreground text-xs">{rt.name}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {rt.timing}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Route Stoppage details */}
        <div className="md:col-span-2">
          {selectedRoute ? (
            <div className="bg-card border rounded-xl p-6 shadow-sm text-left space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold font-mono">
                      {selectedRoute.code}
                    </span>
                    <h3 className="font-bold text-foreground text-sm">{selectedRoute.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Map className="h-3.5 w-3.5" />
                    <strong>Route Span:</strong> {selectedRoute.startPoint} ➔ {selectedRoute.endPoint}
                  </p>
                </div>

                {isTransportAdmin && (
                  <button
                    onClick={() => handleDeleteRoute(selectedRoute.id)}
                    className="p-1 border rounded text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Stops Timeline */}
              <div className="space-y-4">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                  Route Stops & Sequence Timeline
                </span>

                <div className="relative pl-6 space-y-6 border-l-2 border-primary/20 ml-2">
                  {selectedRoute.stops.map((stop, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === selectedRoute.stops.length - 1;
                    return (
                      <div key={idx} className="relative flex items-center justify-between">
                        {/* Dot circle */}
                        <div className={`absolute -left-[31px] h-4.5 w-4.5 rounded-full border bg-card flex items-center justify-center ${
                          isFirst ? "border-green-500 text-green-500" : isLast ? "border-red-500 text-red-500" : "border-primary text-primary"
                        }`}>
                          <MapPin className="h-2.5 w-2.5" />
                        </div>

                        <div>
                          <h4 className="font-bold text-foreground text-xs">{stop}</h4>
                          <p className="text-[10px] text-muted-foreground">
                            {isFirst ? "Origin Point" : isLast ? "Campus Terminus" : `Stop Stoppage #${idx}`}
                          </p>
                        </div>

                        <span className="text-[10px] font-mono text-muted-foreground">
                          {isFirst ? "+0 min" : `+${idx * 15} min`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
              No routes configured in library.
            </div>
          )}
        </div>
      </div>

      {/* Add Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Building2 className="h-4.5 w-4.5 text-primary" />
                Configure New Transport Route
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Route Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROUTE-04"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Distance (km)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15 km"
                    value={newDistance}
                    onChange={(e) => setNewDistance(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Route Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dwarka Sector 10 to School"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Start Station</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dwarka Sector 10"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">End Station</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Greenwood campus"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Stops Sequence (Comma separated)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Sector 10 Metro, Sector 6 Market, Palam Crossing, School Campus"
                  value={newStops}
                  onChange={(e) => setNewStops(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Route Timing Range</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 06:45 AM - 07:45 AM"
                  value={newTiming}
                  onChange={(e) => setNewTiming(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
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
                  Save Route
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
