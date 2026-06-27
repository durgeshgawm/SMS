"use client";

import React, { use, useState } from "react";
import { Laptop, Tablet, Projector, HelpCircle, Plus, Search, Filter, RefreshCw, PenSquare, Trash2, CheckCircle, AlertTriangle, Monitor } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/common";

interface Asset {
  id: string;
  assetCode: string;
  type: "Laptop" | "Tablet" | "Projector" | "Other";
  brandModel: string;
  serialNo: string;
  allocatedTo: string;
  department: string;
  allocationDate: string;
  status: "Allocated" | "Available" | "In Repair";
}

export default function AssetManagementPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "ast-1",
      assetCode: "GW-AST-0102",
      type: "Laptop",
      brandModel: "Lenovo ThinkPad E14 Gen 5",
      serialNo: "S/N: L3-PF38KL0B",
      allocatedTo: "Ms. Shalini Gupta",
      department: "Academics",
      allocationDate: "2024-06-16",
      status: "Allocated",
    },
    {
      id: "ast-2",
      assetCode: "GW-AST-0245",
      type: "Tablet",
      brandModel: "Apple iPad Air 10.9 (2024)",
      serialNo: "S/N: GG7F9401QLG",
      allocatedTo: "Mr. Rajesh Kumar",
      department: "Administration",
      allocationDate: "2025-01-10",
      status: "Allocated",
    },
    {
      id: "ast-3",
      assetCode: "GW-AST-0144",
      type: "Laptop",
      brandModel: "Dell Latitude 5440",
      serialNo: "S/N: CN-0V89TY-701",
      allocatedTo: "Mrs. Priya Patel",
      department: "Academics",
      allocationDate: "2025-03-22",
      status: "Allocated",
    },
    {
      id: "ast-4",
      assetCode: "GW-AST-0389",
      type: "Projector",
      brandModel: "Epson EB-E01 XGA",
      serialNo: "S/N: EPS-9982463",
      allocatedTo: "Available (Lab 2)",
      department: "Academics",
      allocationDate: "-",
      status: "Available",
    },
    {
      id: "ast-5",
      assetCode: "GW-AST-0105",
      type: "Laptop",
      brandModel: "HP ProBook 440 G10",
      serialNo: "S/N: HP-5CG3382R8Y",
      allocatedTo: "Mr. Amit Verma",
      department: "Sports",
      allocationDate: "2026-02-05",
      status: "In Repair",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New asset form state
  const [newType, setNewType] = useState<"Laptop" | "Tablet" | "Projector" | "Other">("Laptop");
  const [newModel, setNewModel] = useState("");
  const [newSerial, setNewSerial] = useState("");
  const [newAllocated, setNewAllocated] = useState("");
  const [newDept, setNewDept] = useState("Academics");
  const [newStatus, setNewStatus] = useState<"Allocated" | "Available" | "In Repair">("Available");

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel || !newSerial) return;

    const newAst: Asset = {
      id: `ast-${Date.now()}`,
      assetCode: `GW-AST-0${assets.length + 100}`,
      type: newType,
      brandModel: newModel,
      serialNo: newSerial.startsWith("S/N:") ? newSerial : `S/N: ${newSerial}`,
      allocatedTo: newStatus === "Available" ? "Available" : newAllocated || "Unassigned",
      department: newStatus === "Available" ? "-" : newDept,
      allocationDate: newStatus === "Available" ? "-" : new Date().toISOString().split("T")[0],
      status: newStatus,
    };

    setAssets([newAst, ...assets]);
    setIsModalOpen(false);

    // Reset Form
    setNewModel("");
    setNewSerial("");
    setNewAllocated("");
    setNewStatus("Available");
  };

  const handleStatusChange = (id: string, nextStatus: "Allocated" | "Available" | "In Repair") => {
    setAssets(
      assets.map((ast) => {
        if (ast.id === id) {
          return {
            ...ast,
            status: nextStatus,
            allocatedTo: nextStatus === "Available" ? "Available" : ast.allocatedTo === "Available" ? "Unassigned" : ast.allocatedTo,
            allocationDate: nextStatus === "Available" ? "-" : ast.allocationDate === "-" ? new Date().toISOString().split("T")[0] : ast.allocationDate,
          };
        }
        return ast;
      })
    );
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm("Are you sure you want to remove this hardware asset from inventory registry?")) {
      setAssets(assets.filter((ast) => ast.id !== id));
    }
  };

  const filteredAssets = assets.filter((ast) => {
    const matchesSearch =
      ast.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.allocatedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.serialNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || ast.type === selectedType;
    const matchesStatus = selectedStatus === "all" || ast.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return <Laptop className="h-4 w-4" />;
      case "Tablet":
        return <Tablet className="h-4 w-4" />;
      case "Projector":
        return <Projector className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Asset Allocation Register"
        description="Register and trace institution hardware inventory (laptops, tablets, classroom projectors) allocated to teachers & departments."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <Plus className="h-4 w-4" />
            <span>Add Asset Item</span>
          </Button>
        }
      />

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Managed Hardware</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{assets.length} Units</h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Laptops, tablets & lab devices</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Currently Assigned</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-green-500 tracking-tight">
              {assets.filter((a) => a.status === "Allocated").length} Units
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Deployed across departments</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">In Service / Repair</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-amber-500 tracking-tight">
              {assets.filter((a) => a.status === "In Repair").length} Units
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Under active repair or QA cycle</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Stock Reserves Available</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-blue-500 tracking-tight">
              {assets.filter((a) => a.status === "Available").length} Units
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Ready for quick distribution</div>
        </div>
      </div>

      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by code, model, staff..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Item Types</option>
            <option value="Laptop">Laptops</option>
            <option value="Tablet">Tablets</option>
            <option value="Projector">Projectors</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Allocated">Allocated</option>
            <option value="Available">Available</option>
            <option value="In Repair">In Repair</option>
          </select>
        </div>
      </div>

      {/* Asset Table Container */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Asset Code</th>
              <th className="p-4 font-semibold">Hardware Type</th>
              <th className="p-4 font-semibold">Model / Specification</th>
              <th className="p-4 font-semibold">Serial Number</th>
              <th className="p-4 font-semibold">Custodian Allocation</th>
              <th className="p-4 font-semibold">Assigned Dept</th>
              <th className="p-4 font-semibold">Date Assigned</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">
                  No matching assets registered in Greenwood database.
                </td>
              </tr>
            ) : (
              filteredAssets.map((ast) => (
                <tr key={ast.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{ast.assetCode}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      {getAssetIcon(ast.type)}
                      {ast.type}
                    </div>
                  </td>
                  <td className="p-4 text-foreground font-semibold">{ast.brandModel}</td>
                  <td className="p-4 text-muted-foreground font-mono text-[10px]">{ast.serialNo}</td>
                  <td className="p-4 font-medium text-foreground">{ast.allocatedTo}</td>
                  <td className="p-4">
                    {ast.department !== "-" ? (
                      <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded">
                        {ast.department}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{ast.allocationDate}</td>
                  <td className="p-4 text-center">
                    {ast.status === "Allocated" && (
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase text-[9px] border border-green-500/20">
                        Allocated
                      </span>
                    )}
                    {ast.status === "Available" && (
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-bold uppercase text-[9px] border border-blue-500/20">
                        Available
                      </span>
                    )}
                    {ast.status === "In Repair" && (
                      <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-500 rounded-full font-bold uppercase text-[9px] border border-amber-500/20">
                        In Repair
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ast.status === "Allocated" && (
                        <button
                          onClick={() => handleStatusChange(ast.id, "Available")}
                          title="Return Asset to Stock"
                          className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {ast.status === "Available" && (
                        <button
                          onClick={() => {
                            const custodian = prompt("Enter employee name to allocate this asset:");
                            if (custodian) {
                              setAssets(
                                assets.map((a) =>
                                  a.id === ast.id
                                    ? {
                                        ...a,
                                        status: "Allocated",
                                        allocatedTo: custodian,
                                        department: "Academics",
                                        allocationDate: new Date().toISOString().split("T")[0],
                                      }
                                    : a
                                )
                              );
                            }
                          }}
                          title="Allocate custodian"
                          className="px-2 py-1 text-[10px] bg-primary text-primary-foreground rounded hover:bg-primary/90 font-medium"
                        >
                          Allocate
                        </button>
                      )}
                      {ast.status !== "In Repair" && (
                        <button
                          onClick={() => handleStatusChange(ast.id, "In Repair")}
                          title="Send to Repair Room"
                          className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-amber-500 transition-colors"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAsset(ast.id)}
                        title="Remove from inventory registry"
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

      {/* Add Asset Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Laptop className="h-4 w-4 text-primary" />
                Register New Asset Item
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Asset Hardware Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Projector">Projector</option>
                  <option value="Other">Other Device</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Model Specification & Brand</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Latitude 5440"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Serial Number (S/N)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S/N: CN-0V89TY"
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  >
                    <option value="Available">Available (Stock)</option>
                    <option value="Allocated">Allocated</option>
                    <option value="In Repair">In Repair</option>
                  </select>
                </div>
                {newStatus === "Allocated" && (
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">Department</label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Administration">Administration</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                )}
              </div>

              {newStatus === "Allocated" && (
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Allocated custodian Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ms. Shalini Gupta"
                    value={newAllocated}
                    onChange={(e) => setNewAllocated(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              )}

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
                  Register Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
