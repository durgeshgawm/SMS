"use client";

import React, { use, useState } from "react";
import { CreditCard, Plus, Search, Filter, Trash2, CheckCircle, Receipt, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Invoice {
  id: string;
  invoiceNo: string;
  residentName: string;
  roomNo: string;
  feeType: "Hostel Rent" | "Mess Charges" | "Laundry / Utility";
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid";
}

export default function HostelBillingPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const allowedRoles = ["super-admin", "hostel", "student", "parent"];
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const isWarden = role === "hostel" || role === "super-admin";

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-1",
      invoiceNo: "GW-HINV-1024",
      residentName: "Rahul Verma",
      roomNo: "101",
      feeType: "Hostel Rent",
      amount: 12000,
      dueDate: "2026-06-30",
      status: "Pending",
    },
    {
      id: "inv-2",
      invoiceNo: "GW-HINV-1025",
      residentName: "Rahul Verma",
      roomNo: "101",
      feeType: "Mess Charges",
      amount: 4500,
      dueDate: "2026-06-30",
      status: "Pending",
    },
    {
      id: "inv-3",
      invoiceNo: "GW-HINV-1026",
      residentName: "Sneha Sharma",
      roomNo: "201",
      feeType: "Hostel Rent",
      amount: 12000,
      dueDate: "2026-06-25",
      status: "Paid",
    },
    {
      id: "inv-4",
      invoiceNo: "GW-HINV-1027",
      residentName: "Pooja Gupta",
      roomNo: "201",
      feeType: "Laundry / Utility",
      amount: 1500,
      dueDate: "2026-06-28",
      status: "Paid",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newType, setNewType] = useState<"Hostel Rent" | "Mess Charges" | "Laundry / Utility">("Mess Charges");
  const [newAmount, setNewAmount] = useState("4500");

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRoom || !newAmount) return;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `GW-HINV-${invoices.length + 1024}`,
      residentName: newName,
      roomNo: newRoom,
      feeType: newType,
      amount: parseFloat(newAmount) || 1000,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Pending",
    };

    setInvoices([newInv, ...invoices]);
    setIsModalOpen(false);
    toast.success(`Billing invoice ${newInv.invoiceNo} registered!`);

    // Reset Form
    setNewName("");
    setNewRoom("");
    setNewAmount("4500");
  };

  const handleCollectPayment = (id: string) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === id) {
          toast.success(`Mess / Rent collected for invoice ${inv.invoiceNo}!`);
          return { ...inv, status: "Paid" };
        }
        return inv;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to write-off this billing invoice?")) {
      setInvoices(invoices.filter((i) => i.id !== id));
      toast.success("Billing invoice deleted.");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || inv.feeType === selectedType;
    const matchesStatus = selectedStatus === "all" || inv.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Hostel Billing & Mess Invoices"
        description="Release monthly mess vouchers, trace student boarding rent collections, and audit pending invoice payments."
        actions={
          isWarden && (
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
              <Plus className="h-4 w-4" />
              <span>Bill Resident</span>
            </Button>
          )
        }
      />

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-green-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Income Collected</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            ₹{invoices.filter((i) => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </h3>
          <div className="text-[10px] text-muted-foreground font-semibold">Rent, mess & laundry streams</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-red-500 border-red-500/20 bg-red-500/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-500">Outstanding Hostel Dues</span>
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            ₹{invoices.filter((i) => i.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </h3>
          <div className="text-[10px] text-muted-foreground font-semibold">Pending next invoicing cycle</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left text-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Invoices Sent</span>
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{invoices.length} Bills</h3>
          <div className="text-[10px] text-muted-foreground font-semibold">Tracked in warden ledger</div>
        </div>
      </div>

      {/* Filter and Search header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoice number, student, room..."
            className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Billings</option>
            <option value="Hostel Rent">Hostel Rent</option>
            <option value="Mess Charges">Mess Charges</option>
            <option value="Laundry / Utility">Laundry & Utilities</option>
          </select>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All States</option>
            <option value="Pending">Pending Dues</option>
            <option value="Paid">Paid Out</option>
          </select>
        </div>
      </div>

      {/* Invoices table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Invoice Number</th>
              <th className="p-4 font-semibold">Resident Name</th>
              <th className="p-4 font-semibold">Room No</th>
              <th className="p-4 font-semibold">Fee category</th>
              <th className="p-4 font-semibold text-center">Amount Due (₹)</th>
              <th className="p-4 font-semibold text-center">Due Date</th>
              <th className="p-4 font-semibold text-center">Payment Status</th>
              {isWarden && <th className="p-4 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={isWarden ? 8 : 7} className="p-8 text-center text-muted-foreground">
                  No billing invoices mapped.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">{inv.invoiceNo}</td>
                  <td className="p-4 font-semibold text-foreground">{inv.residentName}</td>
                  <td className="p-4 font-mono font-bold text-foreground">{inv.roomNo}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded font-semibold text-[10px]">
                      {inv.feeType}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-foreground">₹{inv.amount.toLocaleString()}</td>
                  <td className="p-4 text-center text-muted-foreground font-mono">{inv.dueDate}</td>
                  <td className="p-4 text-center">
                    {inv.status === "Pending" ? (
                      <span className="px-2.5 py-0.5 bg-red-500/10 text-red-500 rounded-full font-bold uppercase text-[9px] border border-red-500/20">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold uppercase text-[9px] border border-green-500/20">
                        Paid
                      </span>
                    )}
                  </td>
                  {isWarden && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === "Pending" ? (
                          <button
                            onClick={() => handleCollectPayment(inv.id)}
                            className="px-2.5 py-1 text-[9px] bg-green-500 hover:bg-green-600 text-white rounded font-bold uppercase"
                          >
                            Collect
                          </button>
                        ) : (
                          <span className="text-green-500 text-[10px] font-semibold flex items-center justify-end gap-0.5">
                            <CheckCircle className="h-3 w-3" /> Collected
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-1 border rounded text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Resident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <CreditCard className="h-4.5 w-4.5 text-primary" />
                Bill Hostel Resident
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Resident Full Name</label>
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
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Room No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Billing Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Billing Fee Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none font-semibold"
                >
                  <option value="Hostel Rent">Hostel Boarding Rent</option>
                  <option value="Mess Charges">Hostel Mess Charges</option>
                  <option value="Laundry / Utility">Laundry / Utilities fee</option>
                </select>
              </div>

              <div className="p-3 bg-muted rounded-lg text-[10px] text-muted-foreground">
                Invoiced due deadline will be set automatically to <strong>7 days from today</strong>.
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
                  Confirm Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
