"use client";

import React, { use, useState } from "react";
import { FileText, Search, Filter, AlertCircle, Bell, UploadCloud, CheckCircle, Clock, Trash2, ShieldCheck, Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserRole } from "@/types/common";

interface EmployeeDoc {
  id: string;
  docName: string;
  docType: "Visa" | "Passport" | "Educational" | "ID Card" | "Contract";
  employeeName: string;
  employeeNo: string;
  department: string;
  expiryDate: string;
  daysRemaining: number;
  status: "Active" | "Expiring Soon" | "Expired";
  verified: boolean;
}

export default function StaffDocumentsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  const [documents, setDocuments] = useState<EmployeeDoc[]>([
    {
      id: "doc-1",
      docName: "Work Visa Extension Permit",
      docType: "Visa",
      employeeName: "Ms. Shalini Gupta",
      employeeNo: "GW-EMP-001",
      department: "Academics",
      expiryDate: "2026-07-15",
      daysRemaining: 19,
      status: "Expiring Soon",
      verified: true,
    },
    {
      id: "doc-2",
      docName: "National Passport Registry",
      docType: "Passport",
      employeeName: "Mr. Rajesh Kumar",
      employeeNo: "GW-EMP-004",
      department: "Administration",
      expiryDate: "2026-06-20",
      daysRemaining: -6,
      status: "Expired",
      verified: true,
    },
    {
      id: "doc-3",
      docName: "Master of Science Degree (M.Sc)",
      docType: "Educational",
      employeeName: "Mrs. Priya Patel",
      employeeNo: "GW-EMP-007",
      department: "Academics",
      expiryDate: "2035-12-31",
      daysRemaining: 3474,
      status: "Active",
      verified: true,
    },
    {
      id: "doc-4",
      docName: "Staff Medical Fitness Certificate",
      docType: "ID Card",
      employeeName: "Mr. Amit Verma",
      employeeNo: "GW-EMP-012",
      department: "Sports",
      expiryDate: "2026-07-28",
      daysRemaining: 32,
      status: "Active",
      verified: false,
    },
    {
      id: "doc-5",
      docName: "Institutional Employment Contract 2026",
      docType: "Contract",
      employeeName: "Dr. A. K. Sridhar",
      employeeNo: "GW-EMP-002",
      department: "Academics",
      expiryDate: "2026-07-02",
      daysRemaining: 6,
      status: "Expiring Soon",
      verified: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<"Visa" | "Passport" | "Educational" | "ID Card" | "Contract">("Visa");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpNo, setNewEmpNo] = useState("GW-EMP-");
  const [newDept, setNewDept] = useState("Academics");
  const [newExpiry, setNewExpiry] = useState("");

  if (role !== "super-admin" && role !== "hr" && role !== "branch-admin") {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Access Denied.
      </div>
    );
  }

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newEmpName || !newExpiry) return;

    const expiryDate = new Date(newExpiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: "Active" | "Expiring Soon" | "Expired" = "Active";
    if (diffDays < 0) {
      status = "Expired";
    } else if (diffDays <= 30) {
      status = "Expiring Soon";
    }

    const newDoc: EmployeeDoc = {
      id: `doc-${Date.now()}`,
      docName: newDocName,
      docType: newDocType,
      employeeName: newEmpName,
      employeeNo: newEmpNo,
      department: newDept,
      expiryDate: newExpiry,
      daysRemaining: diffDays,
      status,
      verified: false,
    };

    setDocuments([newDoc, ...documents]);
    setIsModalOpen(false);

    // Reset Form
    setNewDocName("");
    setNewEmpName("");
    setNewExpiry("");
  };

  const handleSendReminder = (doc: EmployeeDoc) => {
    toast.success(`Expiry alert broadcast sent to ${doc.employeeName} (${doc.employeeNo}) successfully.`);
  };

  const handleVerifyToggle = (id: string) => {
    setDocuments(
      documents.map((doc) => {
        if (doc.id === id) {
          const nextVerified = !doc.verified;
          toast.success(nextVerified ? "Document verified successfully!" : "Verification revoked.");
          return { ...doc, verified: nextVerified };
        }
        return doc;
      })
    );
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm("Are you sure you want to remove this document tracking log?")) {
      setDocuments(documents.filter((d) => d.id !== id));
      toast.success("Document tracking log deleted.");
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employeeNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || doc.docType === selectedType;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Staff Credentials & Visa Expirations"
        description="Verify visa extension timelines, passport validity registers, and academic certification documents for school personnel."
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-9 rounded-lg">
            <UploadCloud className="h-4 w-4" />
            <span>Track New Document</span>
          </Button>
        }
      />

      {/* Expiry Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <span className="text-xs font-medium text-muted-foreground">Total Documents Tracked</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">{documents.length} Files</h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Passports, Visas & Certifications</div>
        </div>

        <div className="bg-card text-card-foreground border border-red-500/20 bg-red-500/[0.02] rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-500">Already Expired</span>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-red-500 tracking-tight">
              {documents.filter((d) => d.status === "Expired").length} Files
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Requires immediate renewal action</div>
        </div>

        <div className="bg-card text-card-foreground border border-amber-500/20 bg-amber-500/[0.02] rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-500">Expiring in 30 Days</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-amber-500 tracking-tight">
              {documents.filter((d) => d.status === "Expiring Soon").length} Files
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">Reminder emails active</div>
        </div>

        <div className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-600">Verification Rate</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-green-500 tracking-tight">
              {Math.round((documents.filter((d) => d.verified).length / documents.length) * 100)}%
            </h3>
          </div>
          <div className="text-[10px] text-muted-foreground">ISO certified document audit</div>
        </div>
      </div>

      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents or employees..."
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
            <option value="all">All Document Types</option>
            <option value="Visa">Visa Permits</option>
            <option value="Passport">Passports</option>
            <option value="Educational">Degrees / Certificates</option>
            <option value="Contract">Contracts</option>
            <option value="ID Card">ID Cards</option>
          </select>

          <select
            className="border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Expirations</option>
            <option value="Active">Active / Mapped</option>
            <option value="Expiring Soon">Expiring Soon (&lt; 30d)</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Document Records Sheet */}
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto text-left">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
              <th className="p-4 font-semibold">Document Title</th>
              <th className="p-4 font-semibold">Doc Category</th>
              <th className="p-4 font-semibold">Employee Mapped</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold">Date of Expiration</th>
              <th className="p-4 font-semibold">Validity State</th>
              <th className="p-4 font-semibold text-center">Verified</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No matching staff documents registered under Greenwood records.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">{doc.docName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground border rounded">
                      {doc.docType}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      {doc.employeeName}{" "}
                      <span className="text-[10px] text-muted-foreground">({doc.employeeNo})</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-foreground">{doc.department}</td>
                  <td className="p-4 text-muted-foreground font-mono">{doc.expiryDate}</td>
                  <td className="p-4">
                    {doc.status === "Active" && (
                      <span className="text-green-500 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                        Active ({doc.daysRemaining} days)
                      </span>
                    )}
                    {doc.status === "Expiring Soon" && (
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                        Expiring ({doc.daysRemaining} days)
                      </span>
                    )}
                    {doc.status === "Expired" && (
                      <span className="text-red-500 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-red-500 rounded-full" />
                        Expired ({Math.abs(doc.daysRemaining)} days ago)
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleVerifyToggle(doc.id)}
                      title={doc.verified ? "Revoke Verification" : "Verify Document"}
                      className={`inline-flex items-center justify-center p-1 rounded-full border transition-all ${
                        doc.verified
                          ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                          : "bg-muted text-muted-foreground border-border hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSendReminder(doc)}
                        title="Email Expiry Broadcast Reminder"
                        className="p-1 border rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        title="Delete record"
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

      {/* Add Document Tracker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-md p-6 text-left">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                Track Expiring Credential File
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                >
                  <option value="Visa">Visa Permit</option>
                  <option value="Passport">Passport Registry</option>
                  <option value="Educational">Academic Degree / Credential</option>
                  <option value="Contract">Employment Contract</option>
                  <option value="ID Card">Government ID Certificate</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greenwood Work Visa extension"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Employee ID Code</label>
                  <input
                    type="text"
                    required
                    value={newEmpNo}
                    onChange={(e) => setNewEmpNo(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Employee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Gupta"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs bg-background focus:outline-none"
                  />
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
                  Start Tracking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
