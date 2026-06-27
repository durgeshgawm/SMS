"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Bus,
  Home,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  Plus,
  Send,
  FileCheck,
  Calendar,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  Briefcase,
  History,
  FileText,
  Printer,
  ChevronRight,
  UserCheck,
  Search,
  ArrowRight,
  Database,
  Wifi,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { UserRole } from "@/types/common";
import { ListViewTemplate } from "@/components/templates/list-view";
import { FormWizardTemplate } from "@/components/templates/form-wizard";
import { FormInput, FormSelect, FormSwitch } from "@/components/forms";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FeeReceipt,
  ReportCard,
  AdmitCard,
  IDCard,
  Payslip,
  BonafideCertificate,
  LibrarySlip,
} from "@/components/print";
import {
  mockBranches,
  mockStudents,
  mockEmployees,
  mockFees,
  mockBooks,
  mockTransport,
  mockHostelRooms,
} from "@/data/mock-db";
import { ColumnDef } from "@tanstack/react-table";
import { ChartContainer, LineChart, BarChart, DonutChart } from "@/components/charts";
import { toast } from "@/components/ui/toast";

// Format helper
const getModuleName = (slugStr: string): string => {
  return slugStr
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// Form validation fallback
const dummyFields = (
  <>
    <FormInput name="name" label="Full Name" required placeholder="Enter name" />
    <FormSelect
      name="status"
      label="Status"
      options={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      required
    />
  </>
);

export default function CatchAllDashboardPage({
  params,
}: {
  params: Promise<{ role: string; slug: string[] }>;
}) {
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;
  const slug = resolvedParams.slug;
  const router = useRouter();

  const moduleName = slug[0];
  const isCreate = slug.includes("create") || slug.includes("add");
  const isEdit = slug.includes("edit");
  const isDetail = slug.length === 2 && !isCreate && !isEdit;

  // Render State
  const [activePrintTab, setActivePrintTab] = useState<string>("receipt");

  // Mock collections state for lists
  const [branches, setBranches] = useState(mockBranches);
  const [students, setStudents] = useState(mockStudents);
  const [employees, setEmployees] = useState(mockEmployees);
  const [fees, setFees] = useState(mockFees);
  const [books, setBooks] = useState(mockBooks);
  const [transport, setTransport] = useState(mockTransport);
  const [hostel, setHostel] = useState(mockHostelRooms);

  // Column definitions
  const studentCols: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Student Name" },
    { accessorKey: "admissionNo", header: "Admission No" },
    { accessorKey: "rollNo", header: "Roll No" },
    { accessorKey: "class", header: "Class" },
    { accessorKey: "section", header: "Section" },
    { accessorKey: "fatherName", header: "Father Name" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "feeStatus", header: "Fees Status" },
  ];

  const branchCols: ColumnDef<any>[] = [
    { accessorKey: "name", header: "Branch Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "studentsCount", header: "Students Count" },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => `₹${row.original.revenue.toLocaleString()}`,
    },
    { accessorKey: "status", header: "Status" },
  ];

  const employeeCols: ColumnDef<any>[] = [
    { accessorKey: "employeeNo", header: "Employee No" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => `₹${row.original.salary.toLocaleString()}`,
    },
  ];

  const feeCols: ColumnDef<any>[] = [
    { accessorKey: "receiptNo", header: "Receipt No" },
    { accessorKey: "studentName", header: "Student" },
    { accessorKey: "class", header: "Class" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
    },
    { accessorKey: "mode", header: "Payment Mode" },
    { accessorKey: "status", header: "Status" },
  ];

  const bookCols: ColumnDef<any>[] = [
    { accessorKey: "code", header: "Book Code" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "available", header: "Available" },
    { accessorKey: "location", header: "Location" },
  ];

  const transportCols: ColumnDef<any>[] = [
    { accessorKey: "vehicleNo", header: "Vehicle No" },
    { accessorKey: "routeTitle", header: "Route" },
    { accessorKey: "driverName", header: "Driver" },
    { accessorKey: "driverPhone", header: "Driver Phone" },
    { accessorKey: "allocationCount", header: "Allocated Students" },
    { accessorKey: "status", header: "Status" },
  ];

  const hostelCols: ColumnDef<any>[] = [
    { accessorKey: "roomNo", header: "Room No" },
    { accessorKey: "block", header: "Block" },
    { accessorKey: "capacity", header: "Capacity" },
    { accessorKey: "allocated", header: "Allocated" },
    {
      accessorKey: "rentPerMonth",
      header: "Rent/Month",
      cell: ({ row }) => `₹${row.original.rentPerMonth.toLocaleString()}`,
    },
    { accessorKey: "wardenName", header: "Warden" },
  ];

  const crmCols: ColumnDef<any>[] = [
    { accessorKey: "id", header: "Lead ID" },
    { accessorKey: "name", header: "Lead Name" },
    { accessorKey: "contact", header: "Contact No" },
    { accessorKey: "courseInquiry", header: "Inquiry For" },
    { accessorKey: "status", header: "Lead Status" },
    { accessorKey: "assignCounselor", header: "Counselor" },
  ];

  // PRINTING TEMPLATES ROUTE CASE
  if (moduleName.includes("print") || moduleName.includes("receipts") || moduleName.includes("reports") && slug.includes("print")) {
    return (
      <PageContainer>
        <PageHeader
          title="ERP Print & Documentation Center"
          description="Interactive hub to preview and print high-fidelity documents (A4/A5 receipts, ID cards, grade records)."
          actions={
            <Button size="sm" onClick={() => window.print()} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Print Selected Document
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-4 text-left">
          <div className="lg:col-span-1 bg-card rounded-xl border p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 px-2">Document Templates</h3>
            <button
              onClick={() => setActivePrintTab("receipt")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "receipt" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Fee Receipt (A5)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePrintTab("reportcard")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "reportcard" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Student Report Card (A4)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePrintTab("admitcard")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "admitcard" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Exam Admit Card (A5)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePrintTab("idcard")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "idcard" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Student ID Card (Portrait)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePrintTab("payslip")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "payslip" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Staff Payslip (A4)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePrintTab("bonafide")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "bonafide" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Bonafide Certificate (A4)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActivePrintTab("libraryslip")}
              className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                activePrintTab === "libraryslip" ? "bg-primary text-white" : "hover:bg-muted text-foreground"
              }`}
            >
              <span>Library Issue Slip</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="lg:col-span-3 bg-white text-black rounded-xl border p-8 shadow-sm flex items-center justify-center overflow-auto print:border-none print:shadow-none print:p-0">
            {activePrintTab === "receipt" && (
              <FeeReceipt
                receiptNo="GW-F-2026-1049"
                date="2026-06-25T11:00:00Z"
                studentName="Aarav Sharma"
                admissionNo="GW-2026-401"
                className="Class 10 - A"
                paymentMode="Online UPI Transaction"
                txnId="UPI586249150"
                items={[
                  { description: "Academic Tuition Fees (Term 1)", amount: 12500 },
                  { description: "Computer Laboratory Lab Charges", amount: 1500 },
                  { description: "Library Maintenance Fees", amount: 1000 },
                ]}
                receivedBy="Greenwood Accounts Bureau"
              />
            )}
            {activePrintTab === "reportcard" && (
              <ReportCard
                studentName="Aarav Sharma"
                rollNo="10"
                admissionNo="GW-2026-401"
                className="Class 10 - A"
                term="First Semester Final Exam"
                attendance="94.5% (175/185 Days)"
                remarks="Outstanding performance in Mathematics. Needs slight enhancement in English Literature analysis."
                subjects={[
                  { name: "Mathematics", maxMarks: 100, obtainedMarks: 96, grade: "A+" },
                  { name: "General Science", maxMarks: 100, obtainedMarks: 88, grade: "A" },
                  { name: "Social Studies", maxMarks: 100, obtainedMarks: 84, grade: "B+" },
                  { name: "English Language", maxMarks: 100, obtainedMarks: 76, grade: "B" },
                  { name: "Computer Applications", maxMarks: 100, obtainedMarks: 98, grade: "A+" },
                ]}
              />
            )}
            {activePrintTab === "admitcard" && (
              <AdmitCard
                rollNo="10"
                studentName="Aarav Sharma"
                className="Class 10 - A"
                admissionNo="GW-2026-401"
                examName="Semester Final Exams 2026"
                timetable={[
                  { subject: "Mathematics Paper", date: "2026-07-02T09:00:00Z", time: "09:00 AM - 12:00 PM" },
                  { subject: "General Science Paper", date: "2026-07-04T09:00:00Z", time: "09:00 AM - 12:00 PM" },
                  { subject: "Social Studies Paper", date: "2026-07-06T09:00:00Z", time: "09:00 AM - 12:00 PM" },
                  { subject: "English Literature", date: "2026-07-08T09:00:00Z", time: "09:00 AM - 12:00 PM" },
                ]}
              />
            )}
            {activePrintTab === "idcard" && (
              <IDCard
                name="Aarav Sharma"
                role="Student Profile"
                idNo="GW-2026-401"
                phone="+91 98765 43210"
                email="aarav.sharma@school.com"
              />
            )}
            {activePrintTab === "payslip" && (
              <Payslip
                payslipId="GW-PAY-06-2026"
                employeeId="GW-EMP-001"
                name="Ms. Shalini Gupta"
                designation="Senior Mathematics Lecturer"
                month="June 2026"
                earnings={[
                  { name: "Basic Salary Pay", amount: 50000 },
                  { name: "House Rent Allowance (HRA)", amount: 15000 },
                  { name: "Special Academic Allowance", amount: 10000 },
                ]}
                deductions={[
                  { name: "Provident Fund Contribution", amount: 4500 },
                  { name: "Professional Income Tax", amount: 2500 },
                  { name: "Medical Insurance Premium Deductions", amount: 3000 },
                ]}
              />
            )}
            {activePrintTab === "bonafide" && (
              <BonafideCertificate
                studentName="Aarav Sharma"
                fatherName="Shri Rajesh Sharma"
                admissionNo="GW-2026-401"
                className="Class 10"
                session="2026 - 2027"
                issueDate="2026-06-25T12:00:00Z"
              />
            )}
            {activePrintTab === "libraryslip" && (
              <LibrarySlip
                slipNo="LIB-TX-9842"
                studentName="Aarav Sharma"
                bookTitle="Introduction to Physics (HC Verma)"
                bookCode="PHY-102"
                issueDate="2026-06-20T00:00:00Z"
                dueDate="2026-07-05T00:00:00Z"
              />
            )}
          </div>
        </div>
      </PageContainer>
    );
  }

  // WIZARD FORMS ROUTE CASE
  if (isCreate || isEdit) {
    let wizardSteps = [
      {
        title: "Basic Profile",
        description: "Primary user authentication & name identifiers.",
        fields: (
          <>
            <FormInput name="name" label="Full Name" required placeholder="e.g. Aditya Sen" />
            <FormInput name="email" label="Institutional Email" required placeholder="e.g. aditya@school.com" />
            <FormInput name="phone" label="Indian Phone Number" required placeholder="e.g. 9876543210" />
            <FormSelect
              name="gender"
              label="Gender Designation"
              required
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </>
        ),
      },
      {
        title: "Academic Cohorts",
        description: "Assigned class levels, roles, or departments.",
        fields: (
          <>
            <FormInput name="class" label="Assigned Class / Rank" placeholder="e.g. Class 10" />
            <FormInput name="rollNo" label="Roll Number Designation" placeholder="e.g. 23" />
            <FormInput name="code" label="Administrative Code" placeholder="e.g. GW-024" />
            <FormSelect
              name="branch"
              label="Selected Branch Campus"
              options={[
                { value: "br-delhi", label: "Delhi Main Branch" },
                { value: "br-mumbai", label: "Mumbai campus" },
                { value: "br-bangalore", label: "Bangalore Academy" },
              ]}
            />
          </>
        ),
      },
      {
        title: "Security & Guard Details",
        description: "Secondary security credentials or emergency guardians.",
        fields: (
          <>
            <FormInput name="fatherName" label="Guardian Full Name" placeholder="e.g. Rajesh Sen" />
            <FormInput name="fatherPhone" label="Guardian Contact No" placeholder="e.g. 9123456780" />
            <FormSwitch name="smsConsent" label="Enable SMS Alerts Broadcasts" description="Send instant notifications to guardian's phone." />
          </>
        ),
      },
    ];

    if (moduleName.includes("branch")) {
      wizardSteps = [
        {
          title: "Branch Profile",
          description: "Details concerning name and code designations.",
          fields: (
            <>
              <FormInput name="name" label="Branch Name" required placeholder="e.g. Mumbai Campus" />
              <FormInput name="code" label="Campus Code Designation" required placeholder="e.g. GW-MUM-02" />
            </>
          ),
        },
        {
          title: "Locations & Billing",
          description: "Branch city and initial projected revenue ledger.",
          fields: (
            <>
              <FormInput name="city" label="Metro City Name" required placeholder="e.g. Mumbai" />
              <FormInput name="revenue" label="Projected Yearly Revenue (₹)" type="number" required placeholder="e.g. 800000" />
            </>
          ),
        },
      ];
    }

    return (
      <FormWizardTemplate
        title={`Enroll New ${getModuleName(moduleName)}`}
        description={`Interactive wizard to compile and enroll a new ${moduleName} entry.`}
        steps={wizardSteps}
        defaultValues={{
          smsConsent: true,
          gender: "male",
          branch: "br-delhi",
        }}
        onSubmit={(values) => {
          toast.success("Registration compiled successfully!");
          router.push(`/${role}/${moduleName}`);
        }}
        onCancel={() => router.push(`/${role}/${moduleName}`)}
      />
    );
  }

  // AUDIT LOGS ROUTE CASE
  if (moduleName.includes("audit-logs") || moduleName.includes("logs")) {
    return (
      <PageContainer>
        <PageHeader
          title="System Audit Ledger"
          description="Chronological audit records tracking portal user logins, access points, and metadata actions."
        />
        <div className="bg-card rounded-xl border p-6 text-left space-y-6">
          <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-4 rounded-xl border">
            <div className="flex h-10 items-center justify-center rounded-lg bg-indigo-500/10 text-[#6366f1] px-3 font-semibold text-xs border border-indigo-500/20">
              <Database className="h-4 w-4 mr-2" /> Database Sync Status: Active
            </div>
            <div className="flex h-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500 px-3 font-semibold text-xs border border-green-500/20">
              <Wifi className="h-4 w-4 mr-2" /> Connected Node IP: 192.168.1.154
            </div>
          </div>
          <table className="w-full text-xs text-left border-collapse border border-border">
            <thead>
              <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                <th className="p-3 font-semibold border-r">Timestamp</th>
                <th className="p-3 font-semibold border-r">Category</th>
                <th className="p-3 font-semibold border-r">User Account</th>
                <th className="p-3 font-semibold border-r">Access Action</th>
                <th className="p-3 font-semibold">Security IP</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: "2026-06-26 12:05:40", cat: "Login Action", user: "superadmin@school.com", action: "User authenticated session key successfully", ip: "103.45.191.12" },
                { time: "2026-06-26 11:42:15", cat: "Fee Payment", user: "finance@school.com", action: "Generated Fee Receipt #GW-F-2026-901", ip: "103.45.191.45" },
                { time: "2026-06-26 10:15:30", cat: "Syllabus Mod", user: "dean@school.com", action: "Updated grade 10 Mathematics syllabus criteria", ip: "182.49.201.76" },
                { time: "2026-06-26 09:30:12", cat: "Student Catalog", user: "teacher@school.com", action: "Registered student #std-5 (Aanya Verma)", ip: "182.49.201.81" },
                { time: "2026-06-26 08:00:00", cat: "Database Backup", user: "System Scheduler", action: "Automated daily system cluster snapshot written to AWS S3 node", ip: "localhost" },
              ].map((log, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30">
                  <td className="p-3 font-mono text-[11px] border-r">{log.time}</td>
                  <td className="p-3 font-semibold border-r text-[#6366f1]">{log.cat}</td>
                  <td className="p-3 border-r font-medium">{log.user}</td>
                  <td className="p-3 border-r text-muted-foreground">{log.action}</td>
                  <td className="p-3 font-mono text-muted-foreground">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
    );
  }

  // DETAIL PAGES ROUTE CASE
  if (isDetail) {
    const detailId = slug[1];
    let title = "Student File Dossier";
    let subTitle = "Individual student file credentials & analytics.";
    let profileCard = (
      <div className="flex flex-col items-center sm:flex-row gap-6 p-6 border rounded-xl bg-card shadow-sm text-left">
        <div className="h-24 w-24 rounded-full border bg-muted flex items-center justify-center text-3xl font-extrabold text-primary shrink-0">
          AS
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Aarav Sharma</h2>
            <span className="px-2.5 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase">
              Active Student
            </span>
          </div>
          <p className="text-xs text-muted-foreground">ID: GW-2026-401 | Class 10-A (Roll 10)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div><strong>Father:</strong> Rajesh Sharma</div>
            <div><strong>Contact:</strong> +91 98765 43210</div>
            <div><strong>Email:</strong> aarav@gmail.com</div>
            <div><strong>Fee Status:</strong> Paid in Full</div>
          </div>
        </div>
      </div>
    );

    if (detailId.startsWith("br-")) {
      const bObj = mockBranches.find((b) => b.id === detailId) || mockBranches[0];
      title = "Campus Branch Dossier";
      subTitle = "Details concerning physical assets & academic performance of this campus branch.";
      profileCard = (
        <div className="flex flex-col items-center sm:flex-row gap-6 p-6 border rounded-xl bg-card shadow-sm text-left">
          <div className="h-24 w-24 rounded-full border bg-muted flex items-center justify-center text-3xl font-extrabold text-primary shrink-0">
            {bObj.name[0]}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{bObj.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                bObj.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}>
                {bObj.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Code: {bObj.code} | Region: {bObj.city}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div><strong>Students:</strong> {bObj.studentsCount} Enrolled</div>
              <div><strong>Staff Admins:</strong> {bObj.adminsCount} Assigned</div>
              <div><strong>Yearly Revenue:</strong> ₹{bObj.revenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <PageContainer>
        <PageHeader title={title} description={subTitle} />
        <div className="space-y-6">
          {profileCard}

          <Tabs defaultValue="overview" className="w-full text-left">
            <TabsList className="bg-card border h-10 p-0.5 rounded-lg flex justify-start max-w-md">
              <TabsTrigger value="overview" className="text-xs">File Overview</TabsTrigger>
              <TabsTrigger value="academics" className="text-xs">Academic Ledger</TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs">Attendance Metrics</TabsTrigger>
              <TabsTrigger value="fees" className="text-xs">Collections History</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 bg-card rounded-xl border p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Recent File Activity Logs</h3>
                  <div className="space-y-3.5">
                    {[
                      { title: "Attendance Marked", desc: "Marked present for 26th June 2026", date: "Today, 09:30 AM" },
                      { title: "Fee Collection Receipt Generated", desc: "Receipt #GW-F-2026-901 for ₹15,000", date: "15 Jun 2026" },
                      { title: "Exam Grade Cards Published", desc: "A+ achieved in Mathematics in Term 1", date: "10 Jun 2026" },
                    ].map((act, idx) => (
                      <div key={idx} className="flex gap-4 items-start text-xs border-b pb-3.5 last:border-0 last:pb-0">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-foreground">{act.title}</h4>
                          <p className="text-muted-foreground text-[11px]">{act.desc}</p>
                          <span className="text-[10px] text-muted-foreground block pt-1">{act.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Documents Catalog</h3>
                  <div className="space-y-2">
                    {["Transfer_Certificate.pdf", "Final_Marksheet_T1.pdf", "Aadhar_Verification.pdf"].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border text-xs">
                        <span className="font-medium truncate max-w-[150px]">{doc}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-primary hover:bg-muted">
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="academics" className="pt-4">
              <div className="bg-card rounded-xl border p-5 shadow-sm text-center py-12">
                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-sm text-foreground">Term Report Card Ledger Ready</h4>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto mt-1 mb-4">
                  Fully compiled exam results with subject grades are ready.
                </p>
                <Button size="sm" onClick={() => router.push(`/${role}/print`)} className="h-8 text-xs font-semibold">
                  Go to Print Hub
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="attendance" className="pt-4">
              <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Current Semester Attendance Trends</h3>
                <div className="h-[200px] w-full">
                  <LineChart
                    data={[
                      { week: "Wk 1", rate: 92 },
                      { week: "Wk 2", rate: 95 },
                      { week: "Wk 3", rate: 94 },
                      { week: "Wk 4", rate: 96 },
                    ]}
                    xAxisKey="week"
                    series={[{ key: "rate", name: "Attendance Rate (%)", color: "#22c55e" }]}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="fees" className="pt-4">
              <div className="bg-card rounded-xl border p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-foreground">Completed Collections Transactions</h3>
                <table className="w-full text-xs text-left border-collapse border">
                  <thead>
                    <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                      <th className="p-3 border-r">Receipt</th>
                      <th className="p-3 border-r">Details</th>
                      <th className="p-3 border-r">Amount</th>
                      <th className="p-3">Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 border-r font-mono">GW-F-2026-901</td>
                      <td className="p-3 border-r font-medium">Academic Tuition Fees</td>
                      <td className="p-3 border-r font-semibold">₹15,000</td>
                      <td className="p-3">Online UPI</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    );
  }

  // SETTINGS ROUTE CASE
  if (moduleName.includes("settings")) {
    return (
      <PageContainer>
        <PageHeader
          title="General Settings Panel"
          description="Configure Greenwood Academy metadata variables, SMS gateways, payment modes, and UI theme profiles."
        />
        <div className="grid gap-6 md:grid-cols-3 text-left">
          <div className="md:col-span-2 bg-card rounded-xl border p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b">Primary School Profile</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">Academy Full Name</label>
                <input
                  type="text"
                  defaultValue="Greenwood International Academy"
                  className="w-full h-9 border bg-card text-xs px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">Affiliation Code</label>
                <input
                  type="text"
                  defaultValue="CBSE-AFF-2730554"
                  className="w-full h-9 border bg-card text-xs px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">Institutional Support Email</label>
                <input
                  type="text"
                  defaultValue="admin@greenwood.edu.in"
                  className="w-full h-9 border bg-card text-xs px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-foreground block mb-1">Support Contact Desk</label>
                <input
                  type="text"
                  defaultValue="+91 11 2758 9642"
                  className="w-full h-9 border bg-card text-xs px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground pb-2 border-b pt-4">External Communication Integrations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-xs font-bold">WhatsApp Alert Gateway</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Send real-time attendance and fee receipts direct to parent's WhatsApp.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded border" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-xs font-bold">Twilio SMS Broadcast Gateway</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Automated SMS broadcasting dispatch when students mark attendance late.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded border" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="text-xs font-bold">Razorpay Fee Gateway Node</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Configure UPI Apps, credit cards, and bank net-banking ledger endpoints.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded border" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button size="sm" variant="outline" className="h-8 text-xs">Reset Changes</Button>
              <Button size="sm" onClick={() => toast.success("Academy configurations saved!")} className="h-8 text-xs font-semibold">
                Save Profiles
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6 space-y-6 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b">Backup & System Audit</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border text-xs">
                <div>
                  <p className="font-semibold">Local Storage Cache</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">5 Mock Records/Table</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    localStorage.clear();
                    toast.success("Storage registry cleared!");
                    router.push("/login");
                  }}
                  className="h-8 text-xs font-semibold"
                >
                  Reset Cache
                </Button>
              </div>

              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border text-xs">
                <div>
                  <p className="font-semibold">AWS S3 Cloud Database Backup</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Last Sync: Today 08:00 AM</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => toast.success("S3 cluster snapshot complete!")}
                  className="h-8 text-xs font-semibold"
                >
                  Sync Now
                </Button>
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed border-t pt-4">
                <strong>System Security Check:</strong>
                <br />
                All active routes are encrypted via end-to-end frontend dynamic routing patterns. TLS 1.3 nodes verified.
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // REPORTS & ANALYTICS DASHBOARD Builder
  if (moduleName.includes("report") || moduleName.includes("analytics")) {
    return (
      <PageContainer>
        <PageHeader
          title="Analysis Dashboard & Report Builder"
          description="Interactive builder to filter academic, transport, library, and payroll aggregates and compile PDF logs."
        />
        <div className="space-y-6 text-left">
          {/* Filters card */}
          <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Report Query Filters</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Campus Branch</label>
                <select className="w-full h-8 border bg-card text-xs rounded-lg px-2">
                  <option>Delhi Main Branch</option>
                  <option>Mumbai Campus</option>
                  <option>Bangalore Academy</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Category Domain</label>
                <select className="w-full h-8 border bg-card text-xs rounded-lg px-2">
                  <option>Fee Collection Ledger</option>
                  <option>Student Academic Grades</option>
                  <option>Employee Payroll Logs</option>
                  <option>Library Fine Transactions</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">Academic Year</label>
                <select className="w-full h-8 border bg-card text-xs rounded-lg px-2">
                  <option>2026 - 2027 (Current)</option>
                  <option>2025 - 2026</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button size="sm" onClick={() => toast.success("Aggregates updated successfully!")} className="w-full h-8 text-xs font-semibold">
                  Refresh Aggregates
                </Button>
              </div>
            </div>
          </div>

          {/* Analysis Charts Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <ChartContainer title="Yearly Financial Revenue Split" subtitle="Collection ledger comparing fee values vs expenses">
                <BarChart
                  data={[
                    { month: "Jan", Fees: 240000, Expense: 110000 },
                    { month: "Feb", Fees: 260000, Expense: 130000 },
                    { month: "Mar", Fees: 310000, Expense: 120000 },
                    { month: "Apr", Fees: 290000, Expense: 140000 },
                    { month: "May", Fees: 350000, Expense: 150000 },
                    { month: "Jun", Fees: 325000, Expense: 160000 },
                  ]}
                  xAxisKey="month"
                  series={[
                    { key: "Fees", name: "Fee Income (₹)", color: "#22c55e" },
                    { key: "Expense", name: "Outflow Expenses (₹)", color: "#ef4444" },
                  ]}
                />
              </ChartContainer>
            </div>
            <div>
              <ChartContainer title="User Attendance Density" subtitle="Average daily portal check-in values">
                <DonutChart
                  data={[
                    { name: "Super Admins", value: 5, color: "#6366f1" },
                    { name: "Finance Desk", value: 3, color: "#3b82f6" },
                    { name: "Librarians", value: 2, color: "#22c55e" },
                    { name: "Hostel Wardens", value: 4, color: "#8b5cf6" },
                    { name: "Active Students", value: 1200, color: "#ef4444" },
                  ]}
                />
              </ChartContainer>
            </div>
          </div>

          {/* Output Ledger */}
          <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3.5">
              <h3 className="text-sm font-bold text-foreground">Compiled Output Registry</h3>
              <Button size="sm" onClick={() => router.push(`/${role}/print`)} className="h-8 text-xs font-semibold flex items-center gap-1">
                <Printer className="h-4 w-4" /> Go to Printable Templates
              </Button>
            </div>
            <table className="w-full text-xs text-left border-collapse border border-border">
              <thead>
                <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                  <th className="p-3 border-r">Receipt/ID No</th>
                  <th className="p-3 border-r">Recipient Name</th>
                  <th className="p-3 border-r">Details Info</th>
                  <th className="p-3 border-r">Total (₹)</th>
                  <th className="p-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {mockFees.map((fee, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-mono border-r">{fee.receiptNo}</td>
                    <td className="p-3 font-semibold border-r">{fee.studentName}</td>
                    <td className="p-3 border-r text-muted-foreground">{fee.class} Tuition Fees</td>
                    <td className="p-3 border-r font-semibold">₹{fee.amount.toLocaleString()}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-semibold text-[9px] uppercase">{fee.mode}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    );
  }

  // GENERAL LIST VIEW ROUTE CASE (Students, Branch Management, Books, CRM, Transport, Hostel, HR Directory, Payroll, Fees, etc.)
  let dataArray: any[] = mockStudents;
  let cols: ColumnDef<any>[] = studentCols;
  let label = "Student";
  let fields: React.ReactNode = dummyFields;

  if (moduleName.includes("branch")) {
    dataArray = branches;
    cols = branchCols;
    label = "Branch";
    fields = (
      <>
        <FormInput name="name" label="Branch Name" required placeholder="e.g. Mumbai Campus" />
        <FormInput name="code" label="Campus Code Designation" required placeholder="e.g. GW-MUM-02" />
        <FormInput name="city" label="City" required placeholder="e.g. Mumbai" />
        <FormInput name="revenue" label="Projected Yearly Revenue (₹)" type="number" required placeholder="e.g. 800000" />
        <FormSelect
          name="status"
          label="Branch Active Status"
          required
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </>
    );
  } else if (moduleName.includes("crm") || moduleName.includes("leads") || moduleName.includes("inquiries")) {
    dataArray = [
      { id: "GW-L-501", name: "Ananya Roy", contact: "9876543122", courseInquiry: "Class 11 Science", status: "Hot Followup", assignCounselor: "Ms. Shalini Gupta" },
      { id: "GW-L-502", name: "Rohan Das", contact: "9988771144", courseInquiry: "Class 6 Primary", status: "New Lead", assignCounselor: "Mr. Dean Rao" },
      { id: "GW-L-503", name: "Preeti Singh", contact: "9564871239", courseInquiry: "Class 9 General", status: "Contacted", assignCounselor: "Ms. Shalini Gupta" },
      { id: "GW-L-504", name: "Aman Varma", contact: "9215487611", courseInquiry: "Class 10 General", status: "Registered", assignCounselor: "Mr. Dean Rao" },
      { id: "GW-L-505", name: "Neha Roy", contact: "9812457800", courseInquiry: "Class 11 Humanities", status: "Closed Lost", assignCounselor: "Ms. Shalini Gupta" },
    ];
    cols = crmCols;
    label = "CRM Lead";
    fields = (
      <>
        <FormInput name="name" label="Lead Name" required placeholder="e.g. Aman Verma" />
        <FormInput name="contact" label="Contact No" required placeholder="e.g. 9876543210" />
        <FormInput name="courseInquiry" label="Inquiry For Course" required placeholder="e.g. Class 10" />
        <FormSelect
          name="status"
          label="Lead status"
          required
          options={[
            { value: "New Lead", label: "New Lead" },
            { value: "Contacted", label: "Contacted" },
            { value: "Hot Followup", label: "Hot Followup" },
            { value: "Registered", label: "Registered" },
          ]}
        />
      </>
    );
  } else if (moduleName.includes("student")) {
    dataArray = students;
    cols = studentCols;
    label = "Student Record";
    fields = (
      <>
        <FormInput name="name" label="Student Full Name" required placeholder="e.g. Aarav Sharma" />
        <FormInput name="rollNo" label="Roll Number" required placeholder="e.g. 10" />
        <FormInput name="admissionNo" label="Admission Register No" required placeholder="e.g. GW-2026-401" />
        <FormInput name="class" label="Assigned Class Level" required placeholder="e.g. Class 10" />
        <FormInput name="section" label="Class Section Division" required placeholder="e.g. A" />
        <FormInput name="fatherName" label="Father / Guardian Full Name" required placeholder="e.g. Rajesh Sharma" />
        <FormInput name="phone" label="Emergency Contact No" required placeholder="e.g. 9876543210" />
        <FormSelect
          name="feeStatus"
          label="Fee Ledger Status"
          required
          options={[
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
            { value: "partial", label: "Partial" },
            { value: "overdue", label: "Overdue" },
          ]}
        />
      </>
    );
  } else if (moduleName.includes("library") || moduleName.includes("books")) {
    dataArray = books;
    cols = bookCols;
    label = "Book Copy";
    fields = (
      <>
        <FormInput name="code" label="Book Unique Code" required placeholder="e.g. PHY-102" />
        <FormInput name="title" label="Book Title Description" required placeholder="e.g. Introduction to Physics" />
        <FormInput name="author" label="Author Full Name" required placeholder="e.g. H.C. Verma" />
        <FormInput name="quantity" label="Total Copy Quantity" type="number" required placeholder="e.g. 15" />
        <FormInput name="available" label="Available Catalog Quantity" type="number" required placeholder="e.g. 12" />
        <FormInput name="location" label="Library Shelf Location" required placeholder="e.g. Shelf A-3" />
      </>
    );
  } else if (moduleName.includes("fees") || moduleName.includes("accounts") || moduleName.includes("receipt") || moduleName.includes("payment")) {
    dataArray = fees;
    cols = feeCols;
    label = "Receipt Invoice";
    fields = (
      <>
        <FormInput name="receiptNo" label="Receipt Reference No" required placeholder="e.g. GW-F-2026-901" />
        <FormInput name="studentName" label="Student Full Name" required placeholder="e.g. Aarav Sharma" />
        <FormInput name="class" label="Class Cohort Division" required placeholder="e.g. Class 10-A" />
        <FormInput name="amount" label="Paid Amount Value (₹)" type="number" required placeholder="e.g. 15000" />
        <FormSelect
          name="mode"
          label="Payment Gateway Mode"
          required
          options={[
            { value: "Online UPI", label: "Online UPI" },
            { value: "Net Banking", label: "Net Banking" },
            { value: "Credit Card", label: "Credit Card" },
            { value: "Cash Payment", label: "Cash Payment" },
          ]}
        />
      </>
    );
  } else if (moduleName.includes("transport") || moduleName.includes("vehicle") || moduleName.includes("route")) {
    dataArray = transport;
    cols = transportCols;
    label = "Vehicle / Route Entry";
    fields = (
      <>
        <FormInput name="vehicleNo" label="Vehicle Registration No" required placeholder="e.g. DL-01-PA-1054" />
        <FormInput name="routeTitle" label="Bus Route Details" required placeholder="e.g. Route 1: Dwarka - Janakpuri" />
        <FormInput name="driverName" label="Driver Assigned Name" required placeholder="e.g. Ramesh Singh" />
        <FormInput name="driverPhone" label="Driver Phone Number" required placeholder="e.g. 9874563210" />
        <FormInput name="allocationCount" label="Allocated Student Capacity" type="number" required placeholder="e.g. 42" />
        <FormSelect
          name="status"
          label="Route status"
          required
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </>
    );
  } else if (moduleName.includes("hostel") || moduleName.includes("room")) {
    dataArray = hostel;
    cols = hostelCols;
    label = "Hostel Room Unit";
    fields = (
      <>
        <FormInput name="roomNo" label="Room Number" required placeholder="e.g. Room 101" />
        <FormInput name="block" label="Hostel Campus Block" required placeholder="e.g. Boys A-Block" />
        <FormInput name="capacity" label="Total Bed Capacity" type="number" required placeholder="e.g. 4" />
        <FormInput name="allocated" label="Allocated Occupants" type="number" required placeholder="e.g. 4" />
        <FormInput name="rentPerMonth" label="Rent Value / Month (₹)" type="number" required placeholder="e.g. 6500" />
        <FormInput name="wardenName" label="Assigned Warden Name" required placeholder="e.g. Rajesh Kumar" />
      </>
    );
  } else if (moduleName.includes("hr") || moduleName.includes("staff") || moduleName.includes("employee") || moduleName.includes("payroll")) {
    dataArray = employees;
    cols = employeeCols;
    label = "Employee Profile";
    fields = (
      <>
        <FormInput name="employeeNo" label="Employee ID No" required placeholder="e.g. GW-EMP-001" />
        <FormInput name="name" label="Full Staff Name" required placeholder="e.g. Ms. Shalini Gupta" />
        <FormInput name="department" label="Department" required placeholder="e.g. Academics" />
        <FormInput name="designation" label="Designation Title" required placeholder="e.g. Senior Lecturer" />
        <FormInput name="phone" label="Contact No" required placeholder="e.g. 9876543210" />
        <FormInput name="email" label="Email Address" required placeholder="e.g. teacher@school.com" />
        <FormInput name="salary" label="Monthly Base Salary (₹)" type="number" required placeholder="e.g. 75000" />
      </>
    );
  } else {
    // Default general cohorts fallback lists (Syllabus, Timetable, notices)
    dataArray = students;
    cols = studentCols;
    label = getModuleName(moduleName);
  }

  // LIST DATA SUBMIT MUTATION HANDLER (client-side only for visual simulation review)
  const handleRecordAdd = (values: any) => {
    const newRec = {
      id: `rec-${Math.random().toString(36).substring(2, 9)}`,
      ...values,
    };
    if (moduleName.includes("branch")) {
      setBranches([newRec, ...branches]);
    } else if (moduleName.includes("student")) {
      setStudents([newRec, ...students]);
    } else if (moduleName.includes("library") || moduleName.includes("book")) {
      setBooks([newRec, ...books]);
    } else if (moduleName.includes("fees") || moduleName.includes("account")) {
      setFees([newRec, ...fees]);
    } else if (moduleName.includes("transport") || moduleName.includes("vehicle")) {
      setTransport([newRec, ...transport]);
    } else if (moduleName.includes("hostel") || moduleName.includes("room")) {
      setHostel([newRec, ...hostel]);
    } else if (moduleName.includes("hr") || moduleName.includes("staff")) {
      setEmployees([newRec, ...employees]);
    }
    toast.success(`New ${label} added successfully to demo view!`);
  };

  const handleRecordDelete = (row: any) => {
    if (moduleName.includes("branch")) {
      setBranches(branches.filter((b) => b.id !== row.id));
    } else if (moduleName.includes("student")) {
      setStudents(students.filter((s) => s.id !== row.id));
    } else if (moduleName.includes("library") || moduleName.includes("book")) {
      setBooks(books.filter((b) => b.id !== row.id));
    } else if (moduleName.includes("fees") || moduleName.includes("account")) {
      setFees(fees.filter((f) => f.id !== row.id));
    } else if (moduleName.includes("transport") || moduleName.includes("vehicle")) {
      setTransport(transport.filter((t) => t.id !== row.id));
    } else if (moduleName.includes("hostel") || moduleName.includes("room")) {
      setHostel(hostel.filter((h) => h.id !== row.id));
    } else if (moduleName.includes("hr") || moduleName.includes("staff")) {
      setEmployees(employees.filter((e) => e.id !== row.id));
    }
    toast.success(`Removed ${label} entry from current session.`);
  };

  // RENDER DYNAMIC LIST VIEW
  return (
    <ListViewTemplate
      title={`${getModuleName(moduleName)} Module`}
      description={`Greenwood administration ledger for managing all ${moduleName} data records.`}
      addLabel={`Add New ${label}`}
      data={dataArray}
      columns={cols}
      searchKey="name"
      searchPlaceholder={`Search ${moduleName} lists...`}
      exportFileName={`Greenwood_${moduleName}_ledger`}
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
