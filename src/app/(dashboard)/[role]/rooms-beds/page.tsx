"use client";

import React, { use, useState } from "react";
import { Home, Plus, Search, Filter, Bed, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Room {
  id: string;
  roomNo: string;
  block: "Block A (Boys)" | "Block B (Girls)";
  floor: number;
  type: "Single" | "Double" | "Triple";
  beds: {
    id: string;
    bedNo: string;
    status: "Occupied" | "Vacant" | "Maintenance";
    resident?: string;
  }[];
}

export default function HostelRoomsBedsPage({
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

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "rm-1",
      roomNo: "101",
      block: "Block A (Boys)",
      floor: 1,
      type: "Double",
      beds: [
        { id: "bd-1a", bedNo: "101-A", status: "Occupied", resident: "Rahul Verma" },
        { id: "bd-1b", bedNo: "101-B", status: "Vacant" },
      ],
    },
    {
      id: "rm-2",
      roomNo: "102",
      block: "Block A (Boys)",
      floor: 1,
      type: "Single",
      beds: [
        { id: "bd-2a", bedNo: "102-A", status: "Occupied", resident: "Devendra Patel" },
      ],
    },
    {
      id: "rm-3",
      roomNo: "201",
      block: "Block B (Girls)",
      floor: 2,
      type: "Double",
      beds: [
        { id: "bd-3a", bedNo: "201-A", status: "Occupied", resident: "Sneha Sharma" },
        { id: "bd-3b", bedNo: "201-B", status: "Occupied", resident: "Pooja Gupta" },
      ],
    },
    {
      id: "rm-4",
      roomNo: "202",
      block: "Block B (Girls)",
      floor: 2,
      type: "Triple",
      beds: [
        { id: "bd-4a", bedNo: "202-A", status: "Vacant" },
        { id: "bd-4b", bedNo: "202-B", status: "Maintenance" },
        { id: "bd-4c", bedNo: "202-C", status: "Vacant" },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newRoomNo, setNewRoomNo] = useState("");
  const [newBlock, setNewBlock] = useState<"Block A (Boys)" | "Block B (Girls)">("Block A (Boys)");
  const [newFloor, setNewFloor] = useState("1");
  const [newType, setNewType] = useState<"Single" | "Double" | "Triple">("Double");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNo) return;

    const count = newType === "Single" ? 1 : newType === "Double" ? 2 : 3;
    const initialBeds = Array.from({ length: count }).map((_, idx) => {
      const char = String.fromCharCode(65 + idx); // A, B, C
      return {
        id: `bd-${newRoomNo}-${char}`,
        bedNo: `${newRoomNo}-${char}`,
        status: "Vacant" as const,
      };
    });

    const newRm: Room = {
      id: `rm-${Date.now()}`,
      roomNo: newRoomNo,
      block: newBlock,
      floor: parseInt(newFloor) || 1,
      type: newType,
      beds: initialBeds,
    };

    setRooms([...rooms, newRm]);
    setIsModalOpen(false);
    toast.success(`Room ${newRoomNo} registered successfully!`);

    // Reset Form
    setNewRoomNo("");
  };

  const handleBedStatusChange = (roomId: string, bedId: string, nextStatus: "Occupied" | "Vacant" | "Maintenance") => {
    setRooms(
      rooms.map((rm) => {
        if (rm.id === roomId) {
          const nextBeds = rm.beds.map((bd) => {
            if (bd.id === bedId) {
              const resident = nextStatus === "Occupied" ? prompt("Enter resident name:") || "Unassigned" : undefined;
              return { ...bd, status: nextStatus, resident };
            }
            return bd;
          });
          return { ...rm, beds: nextBeds };
        }
        return rm;
      })
    );
    toast.success("Bed allocation state updated.");
  };

  const filteredRooms = rooms.filter((rm) => {
    const matchesSearch =
      rm.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.beds.some((b) => b.resident?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBlock = selectedBlock === "all" || rm.block === selectedBlock;

    return matchesSearch && matchesBlock;
  });

  // Calculate totals
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, curr) => acc + curr.beds.length, 0);
  const occupiedBeds = rooms.reduce((acc, curr) => acc + curr.beds.filter((b) => b.status === "Occupied").length, 0);
  const maintenanceBeds = rooms.reduce((acc, curr) => acc + curr.beds.filter((b) => b.status === "Maintenance").length, 0);
  const vacantBeds = totalBeds - occupiedBeds - maintenanceBeds;

  return (
    <PageContainer>
      <PageHeader
        title="Rooms & Beds Occupancy"
        description="Verify hostel bed allocations, monitor vacancies across building blocks, and manage warden room assignments."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Create Room Entry</span>
          </Button>
        }
      />

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Rooms Mapped</span>
          <h3 className="text-2xl font-bold tracking-tight">{totalRooms} Rooms</h3>
          <div className="text-[10px] text-muted-foreground">Across Boys & Girls Blocks</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Beds Occupied</span>
          <h3 className="text-2xl font-bold text-blue-500 tracking-tight">{occupiedBeds} / {totalBeds} Beds</h3>
          <div className="text-[10px] text-muted-foreground">
            {Math.round((occupiedBeds / totalBeds) * 100)}% occupancy index
          </div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Beds Vacant (Stock)</span>
          <h3 className="text-2xl font-bold text-green-500 tracking-tight">{vacantBeds} Beds</h3>
          <div className="text-[10px] text-muted-foreground">Ready for quick allotment</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Under Maintenance</span>
          <h3 className="text-2xl font-bold text-amber-500 tracking-tight">{maintenanceBeds} Beds</h3>
          <div className="text-[10px] text-muted-foreground">Blocked for room cleaning/repairs</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by room no, resident name..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Block:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
          >
            <option value="all">All Blocks</option>
            <option value="Block A (Boys)">Block A (Boys)</option>
            <option value="Block B (Girls)">Block B (Girls)</option>
          </select>
        </div>
      </div>

      {/* Rooms visual cards grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredRooms.map((rm) => (
          <div key={rm.id} className="bg-card border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <Home className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-xs">Room {rm.roomNo}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    Floor {rm.floor} • <span className="font-semibold text-primary/80">{rm.block}</span>
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[9px] font-bold uppercase tracking-wide">
                {rm.type} sharing
              </span>
            </div>

            {/* Beds Layout details */}
            <div className="space-y-3.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Beds Setup Map</span>
              <div className="space-y-2.5">
                {rm.beds.map((bd) => (
                  <div key={bd.id} className="flex items-center justify-between p-2.5 bg-muted/30 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bed className={`h-4.5 w-4.5 ${
                        bd.status === "Occupied" ? "text-blue-500" : bd.status === "Vacant" ? "text-green-500" : "text-amber-500"
                      }`} />
                      <div className="text-left">
                        <span className="font-bold text-xs text-foreground block leading-tight">{bd.bedNo}</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[140px] block">
                          {bd.status === "Occupied" ? `Resident: ${bd.resident}` : bd.status === "Vacant" ? "Available / Empty" : "Out of Service"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {bd.status === "Vacant" && (
                        <button
                          onClick={() => handleBedStatusChange(rm.id, bd.id, "Occupied")}
                          className="px-2 py-0.5 bg-primary text-primary-foreground rounded text-[9px] font-bold uppercase"
                        >
                          Allot
                        </button>
                      )}
                      {bd.status === "Occupied" && (
                        <button
                          onClick={() => handleBedStatusChange(rm.id, bd.id, "Vacant")}
                          className="px-2 py-0.5 bg-muted border hover:text-red-500 rounded text-[9px] font-bold uppercase"
                        >
                          Vacate
                        </button>
                      )}
                      {bd.status !== "Maintenance" && (
                        <button
                          onClick={() => handleBedStatusChange(rm.id, bd.id, "Maintenance")}
                          title="Flag Maintenance"
                          className="p-1 border rounded hover:bg-muted text-muted-foreground"
                        >
                          <AlertTriangle className="h-3 w-3" />
                        </button>
                      )}
                      {bd.status === "Maintenance" && (
                        <button
                          onClick={() => handleBedStatusChange(rm.id, bd.id, "Vacant")}
                          title="Restore to Vacant"
                          className="p-1 border rounded hover:bg-muted text-green-500"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Home className="h-4.5 w-4.5 text-primary" />
                Configure New Room Entry
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 103"
                    value={newRoomNo}
                    onChange={(e) => setNewRoomNo(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Floor Level</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Hostel Block</label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value as any)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Block A (Boys)">Block A (Boys)</option>
                    <option value="Block B (Girls)">Block B (Girls)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Room Sharing Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Single">Single (1 Bed)</option>
                    <option value="Double">Double (2 Beds)</option>
                    <option value="Triple">Triple (3 Beds)</option>
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
                  Save Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
