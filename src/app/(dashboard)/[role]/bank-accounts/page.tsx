"use client";

import React, { use, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormInput, FormSelect } from "@/components/forms";
import { UserRole } from "@/types/common";

const bankColumns: ColumnDef<any>[] = [
  { accessorKey: "bankName", header: "Bank Name" },
  { accessorKey: "accountNo", header: "Account Number" },
  { accessorKey: "ifscCode", header: "IFSC Code" },
  { accessorKey: "accountType", header: "Account Type" },
  {
    accessorKey: "balance",
    header: "Available Balance (₹)",
    cell: ({ row }) => `₹${row.original.balance.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
          s === "active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {s}
        </span>
      );
    }
  },
];

export default function BankAccountsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [accounts, setAccounts] = useState([
    { id: "bnk-1", bankName: "State Bank of India (SBI)", accountNo: "30541289654", ifscCode: "SBIN0001428", accountType: "Primary Current Account", balance: 1250000, status: "active" },
    { id: "bnk-2", bankName: "HDFC Bank Ltd", accountNo: "98421058312", ifscCode: "HDFC0001428", accountType: "Salary Disbursement Account", balance: 850000, status: "active" },
    { id: "bnk-3", bankName: "ICICI Bank Ltd", accountNo: "45892100411", ifscCode: "ICIC0000104", accountType: "Online Fee Collection Node", balance: 450000, status: "active" },
  ]);

  if (role !== "super-admin" && role !== "finance" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `bnk-${Math.floor(Math.random() * 900) + 100}`,
      ...values,
      balance: parseFloat(values.balance),
    };
    setAccounts([newRec, ...accounts]);
  };

  const handleRecordDelete = (row: any) => {
    setAccounts(accounts.filter((a) => a.id !== row.id));
  };

  const fields = (
    <>
      <FormInput name="bankName" label="Bank Full Name" required placeholder="e.g. State Bank of India" />
      <FormInput name="accountNo" label="Account Number" required placeholder="e.g. 30541289654" />
      <FormInput name="ifscCode" label="IFSC Branch Code" required placeholder="e.g. SBIN0001428" />
      <FormSelect
        name="accountType"
        label="Account Category"
        required
        options={[
          { value: "Primary Current Account", label: "Primary Current Account" },
          { value: "Salary Disbursement Account", label: "Salary Disbursement Account" },
          { value: "Online Fee Collection Node", label: "Online Fee Collection Node" },
          { value: "Campus Savings Account", label: "Campus Savings Account" },
        ]}
      />
      <FormInput name="balance" label="Starting Balance (₹)" type="number" required placeholder="e.g. 1250000" />
      <FormSelect
        name="status"
        label="Reconciliation status"
        required
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </>
  );

  return (
    <ListViewTemplate
      title="Bank Accounts & Reconciliation"
      description="Monitor corporate bank account balances, audit deposit nodes, and track salary disbursement caches."
      addLabel="Add Bank Account"
      data={accounts}
      columns={bankColumns}
      searchKey="bankName"
      searchPlaceholder="Search bank accounts..."
      exportFileName="Greenwood_reconciliation_accounts"
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
