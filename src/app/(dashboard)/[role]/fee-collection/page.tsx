"use client";

import React, { use, useState } from "react";
import { CreditCard, Printer, User, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";
import { useRouter } from "next/navigation";

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "paid" | "unpaid";
}

export default function FeeCollectionPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const router = useRouter();

  if (role !== "super-admin" && role !== "finance" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const [selectedStudent, setSelectedStudent] = useState("Aarav Sharma");
  const [selectedMode, setSelectedMode] = useState("Online UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    { id: "fi-1", name: "Academic Tuition Fees (Term 1)", amount: 12500, dueDate: "2026-07-05", status: "unpaid" },
    { id: "fi-2", name: "Computer Laboratory Lab Charges", amount: 1500, dueDate: "2026-07-05", status: "unpaid" },
    { id: "fi-3", name: "Library Maintenance Fees", amount: 1000, dueDate: "2026-07-05", status: "unpaid" },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>(["fi-1", "fi-2", "fi-3"]);

  const handleToggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const calculatedTotal = feeItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.amount, 0);

  const handleProcessCollection = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one fee item to collect!");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setFeeItems(
        feeItems.map((item) =>
          selectedItems.includes(item.id) ? { ...item, status: "paid" } : item
        )
      );
      setSelectedItems([]);
      toast.success(`Fee collected successfully via ${selectedMode}!`);
    }, 1500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Fee Collection Terminal"
        description="Select student profiles, select outstanding fee categories, and log transactions."
        actions={
          <Button onClick={() => router.push(`/${role}/print`)} variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>Go to Print Center</span>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 text-left">
        {/* Left Side: Select student and payment details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              <span>Select Student Account</span>
            </h3>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground block mb-1">Student Name</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full h-8 border bg-card text-xs rounded-lg px-2"
              >
                <option value="Aarav Sharma">Aarav Sharma (Class 10-A | GW-2026-401)</option>
                <option value="Priya Patel">Priya Patel (Class 10-B | GW-2026-508)</option>
                <option value="Kabir Dev">Kabir Dev (Class 9-A | GW-2026-214)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground block mb-1">Payment Method</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full h-8 border bg-card text-xs rounded-lg px-2"
              >
                <option value="Online UPI">Online UPI Transaction</option>
                <option value="Net Banking">Net Banking Ledger</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Cash Payment">Cash Payment Counter</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>Collection Receipt Summary</span>
            </h3>
            <div className="space-y-2 border-y border-border/40 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payer Name:</span>
                <span className="font-semibold text-foreground">{selectedStudent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway Node:</span>
                <span className="font-semibold text-foreground">{selectedMode}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-dashed pt-2">
                <span>Total Collection:</span>
                <span className="text-green-500">₹{calculatedTotal.toLocaleString()}</span>
              </div>
            </div>
            <Button
              onClick={handleProcessCollection}
              disabled={isProcessing || calculatedTotal === 0}
              className="w-full h-9 text-xs font-semibold bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Process Collection"}
            </Button>
          </div>
        </div>

        {/* Right Side: Outstanding items list */}
        <div className="lg:col-span-8 bg-card rounded-xl border border-border p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Outstanding Fee ledger items ({feeItems.filter((f) => f.status === "unpaid").length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {feeItems.map((item) => (
              <div
                key={item.id}
                onClick={() => item.status === "unpaid" && handleToggleItem(item.id)}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  item.status === "paid"
                    ? "bg-green-500/5 border-green-500/20 cursor-default"
                    : selectedItems.includes(item.id)
                    ? "bg-primary/5 border-primary"
                    : "bg-card border-border hover:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.status === "paid" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => {}} // handled by parent div onClick
                      className="h-4 w-4 text-primary rounded border border-border focus:ring-primary cursor-pointer shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <h4 className="font-bold text-xs text-foreground leading-tight">{item.name}</h4>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Due Date: {item.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-bold text-xs shrink-0">
                  <span className="text-foreground">₹{item.amount.toLocaleString()}</span>
                  {item.status === "paid" && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase">Paid</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
