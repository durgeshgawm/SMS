"use client";

import React, { use, useState } from "react";
import { CreditCard, Search, Plus, Trash2, CheckCircle, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface Fine {
  id: string;
  cardId: string;
  memberName: string;
  bookTitle: string;
  daysLate: number;
  fineAmount: number;
  status: "Pending" | "Paid";
  dateCharged: string;
}

export default function LibraryFinesLedgerPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const allowedRoles = ["super-admin", "library", "student", "parent"];
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const isLibrarian = role === "library" || role === "super-admin";

  const [fines, setFines] = useState<Fine[]>([
    {
      id: "fn-1",
      cardId: "GW-LIB-0001",
      memberName: "Rahul Verma",
      bookTitle: "Introduction to Classical Physics",
      daysLate: 12,
      fineAmount: 60, // ₹5/day
      status: "Pending",
      dateCharged: "2026-06-25",
    },
    {
      id: "fn-2",
      cardId: "GW-LIB-0004",
      memberName: "Mr. Rajesh Kumar",
      bookTitle: "History of Ancient India",
      daysLate: 18,
      fineAmount: 90,
      status: "Pending",
      dateCharged: "2026-06-20",
    },
    {
      id: "fn-3",
      cardId: "GW-LIB-0003",
      memberName: "Sneha Sharma",
      bookTitle: "The C Programming Language",
      daysLate: 4,
      fineAmount: 20,
      status: "Paid",
      dateCharged: "2026-06-18",
    },
    {
      id: "fn-4",
      cardId: "GW-LIB-0002",
      memberName: "Ms. Shalini Gupta",
      bookTitle: "Higher Engineering Mathematics",
      daysLate: 10,
      fineAmount: 50,
      status: "Paid",
      dateCharged: "2026-06-10",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  // Collect form state
  const [selectedFineId, setSelectedFineId] = useState("");

  const handleCollectFine = (fineId: string) => {
    setFines(
      fines.map((fn) => {
        if (fn.id === fineId) {
          toast.success(`Collected ₹${fn.fineAmount} fine successfully!`);
          return { ...fn, status: "Paid" };
        }
        return fn;
      })
    );
  };

  const handleAddCustomFine = (e: React.FormEvent) => {
    e.preventDefault();
    // mock add custom fine for lost book or extreme delay
    const memberName = prompt("Enter member name:");
    const cardId = prompt("Enter card ID:");
    const bookTitle = prompt("Enter book title:");
    const amountStr = prompt("Enter fine amount (INR):");

    if (memberName && cardId && bookTitle && amountStr) {
      const newFine: Fine = {
        id: `fn-${Date.now()}`,
        cardId,
        memberName,
        bookTitle,
        daysLate: 0,
        fineAmount: parseFloat(amountStr) || 10,
        status: "Pending",
        dateCharged: new Date().toISOString().split("T")[0],
      };
      setFines([newFine, ...fines]);
      toast.success(`Fine mapped for ${memberName}.`);
    }
  };

  const filteredFines = fines.filter((fn) => {
    const matchesSearch =
      fn.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fn.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fn.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || fn.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Library Fine Collections Ledger"
        description="Monitor outstanding late returns fines, customize billing policy parameters, and collect payments."
        actions={
          isLibrarian && (
            <Button onClick={handleAddCustomFine} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
              <Plus className="h-4 w-4" />
              <span>Charge Fine</span>
            </Button>
          )
        }
      />

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Paid Fine Collected</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-green-500">
              ₹{fines.filter((f) => f.status === "Paid").reduce((acc, curr) => acc + curr.fineAmount, 0)}
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Invoiced and verified by cashier</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Pending Outstanding Fines</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-red-500 tracking-tight">
              ₹{fines.filter((f) => f.status === "Pending").reduce((acc, curr) => acc + curr.fineAmount, 0)}
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Requires reminder alert broadcasts</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">System Late Fee Rules</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-bold text-foreground">₹5.00 INR / Day</h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Triggered after 14 days standard hold</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Fines Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters header */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search fines records..."
                className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-xs bg-background focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
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

          <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <th className="p-4 font-semibold">Card ID</th>
                  <th className="p-4 font-semibold">Member Name</th>
                  <th className="p-4 font-semibold">Overdue Book Title</th>
                  <th className="p-4 font-semibold text-center">Days Late</th>
                  <th className="p-4 font-semibold text-center">Fine (₹)</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  {isLibrarian && <th className="p-4 font-semibold text-right">Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredFines.length === 0 ? (
                  <tr>
                    <td colSpan={isLibrarian ? 7 : 6} className="p-8 text-center text-muted-foreground">
                      No library fines logged.
                    </td>
                  </tr>
                ) : (
                  filteredFines.map((fn) => (
                    <tr key={fn.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="p-4 font-mono font-semibold text-foreground">{fn.cardId}</td>
                      <td className="p-4 font-semibold text-foreground">{fn.memberName}</td>
                      <td className="p-4 text-muted-foreground">{fn.bookTitle}</td>
                      <td className="p-4 text-center font-semibold text-foreground">{fn.daysLate} Days</td>
                      <td className="p-4 text-center font-bold text-foreground">₹{fn.fineAmount}</td>
                      <td className="p-4 text-center">
                        {fn.status === "Pending" ? (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-bold uppercase text-[9px]">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full font-bold uppercase text-[9px]">
                            Paid
                          </span>
                        )}
                      </td>
                      {isLibrarian && (
                        <td className="p-4 text-right">
                          {fn.status === "Pending" ? (
                            <button
                              onClick={() => handleCollectFine(fn.id)}
                              className="px-2 py-1 text-[9px] bg-green-500 hover:bg-green-600 text-white rounded font-bold uppercase"
                            >
                              Collect
                            </button>
                          ) : (
                            <span className="text-green-500 text-[10px] font-semibold flex items-center justify-end gap-0.5">
                              <CheckCircle className="h-3 w-3" /> Collected
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fine Policy Side Panel */}
        <div className="bg-card border rounded-xl p-5 shadow-sm text-left space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 border-b pb-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            Library Fine Policy rules
          </h3>

          <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
            <div>
              <strong className="text-foreground block">1. Late Return Fee Rate</strong>
              <span>₹5.00 INR per day charge is applicable starting from the 15th day since checkout.</span>
            </div>

            <div>
              <strong className="text-foreground block">2. Lost Book Policy</strong>
              <span>100% replacement value of the latest catalog printing + ₹100 processing fee. Card is suspended until resolved.</span>
            </div>

            <div>
              <strong className="text-foreground block">3. Damaged Book Penalty</strong>
              <span>Assessed dynamically (from 25% up to 100% original price) depending on damage level.</span>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-primary text-[11px] font-semibold">
              Note: Fine collection balances are routed directly to Greenwood corporate bank reconciliation entries.
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
