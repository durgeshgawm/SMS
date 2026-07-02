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
  AlertCircle,
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
import { SettingsPageTemplate } from "@/components/templates/settings-page";
import { ApprovalPageTemplate } from "@/components/templates/approval-page";
import { CommunicationPageTemplate } from "@/components/templates/communication-page";
import { ReportPageTemplate } from "@/components/templates/report-page";
import { CalendarPageTemplate } from "@/components/templates/calendar-page";
import { AnalyticsPageTemplate } from "@/components/templates/analytics-page";
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
  mockAuditLogs,
  mockNotices,
  mockApprovals,
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
  const [notices, setNotices] = useState(mockNotices);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);
  const [approvals, setApprovals] = useState(mockApprovals);
  const [inventory, setInventory] = useState([
    { id: "ast-1", assetCode: "GW-AST-0102", type: "Laptop", brandModel: "Lenovo ThinkPad E14 Gen 5", allocatedTo: "Ms. Shalini Gupta", status: "Allocated" },
    { id: "ast-2", assetCode: "GW-AST-0245", type: "Tablet", brandModel: "Apple iPad Air 10.9 (2024)", allocatedTo: "Mr. Rajesh Kumar", status: "Allocated" },
    { id: "ast-3", assetCode: "GW-AST-0144", type: "Laptop", brandModel: "Dell Latitude 5440", allocatedTo: "Mrs. Priya Patel", status: "Allocated" },
    { id: "ast-4", assetCode: "GW-AST-0389", type: "Projector", brandModel: "Epson EB-E01 XGA", allocatedTo: "Available (Lab 2)", status: "Available" },
  ]);

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

  // --- SUPER ADMIN CUSTOM SUB-PAGES ROUTER ---
  if (role === "super-admin") {
    const subPath = slug[1];

    // 1. Academic Operations
    if (moduleName === "academic") {
      if (subPath === "classes") {
        const classesData = [
          { id: "1", className: "Class 10 - A", code: "C10A", capacity: 40, occupied: 38, teacher: "Ms. Gupta" },
          { id: "2", className: "Class 10 - B", code: "C10B", capacity: 40, occupied: 36, teacher: "Mr. Kumar" },
          { id: "3", className: "Class 9 - A", code: "C9A", capacity: 45, occupied: 42, teacher: "Mrs. Sen" },
          { id: "4", className: "Class 8 - A", code: "C8A", capacity: 45, occupied: 40, teacher: "Mr. Joshi" },
        ];
        return (
          <ListViewTemplate
            title="Class Management"
            description="Manage academic classes, sections, and check capacity allocations."
            addLabel="Create Class"
            data={classesData}
            columns={[
              { accessorKey: "className", header: "Class / Section" },
              { accessorKey: "code", header: "Class Code" },
              { accessorKey: "capacity", header: "Max Capacity" },
              { accessorKey: "occupied", header: "Occupied Seats" },
              { accessorKey: "teacher", header: "Class Teacher" },
            ]}
            searchKey="className"
            formFields={
              <>
                <FormInput name="className" label="Class Name" required placeholder="e.g. Class 10 - A" />
                <FormInput name="code" label="Class Code" required placeholder="e.g. C10A" />
                <FormInput name="capacity" label="Max Capacity" type="number" required placeholder="e.g. 40" />
                <FormInput name="teacher" label="Class Teacher" required placeholder="e.g. Ms. Gupta" />
              </>
            }
          />
        );
      }
      if (subPath === "syllabus") {
        const syllabusData = [
          { id: "1", subject: "Mathematics", grade: "Class 10", completion: 85, chapters: "12/15 Completed", teacher: "Ms. Gupta" },
          { id: "2", subject: "General Science", grade: "Class 10", completion: 78, chapters: "10/13 Completed", teacher: "Mr. Kumar" },
          { id: "3", subject: "English Language", grade: "Class 10", completion: 92, chapters: "11/12 Completed", teacher: "Mrs. Sen" },
          { id: "4", subject: "Social Studies", grade: "Class 9", completion: 65, chapters: "8/12 Completed", teacher: "Mr. Joshi" },
        ];
        return (
          <ListViewTemplate
            title="Syllabus Progress Tracker"
            description="Track chapter distributions and completion metrics across grades."
            data={syllabusData}
            columns={[
              { accessorKey: "subject", header: "Subject" },
              { accessorKey: "grade", header: "Class Level" },
              {
                accessorKey: "completion",
                header: "Completion Rate",
                cell: ({ row }) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-24 bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: `${row.original.completion}%` }} />
                    </div>
                    <span className="font-bold">{row.original.completion}%</span>
                  </div>
                ),
              },
              { accessorKey: "chapters", header: "Chapters Covered" },
              { accessorKey: "teacher", header: "Assigned Faculty" },
            ]}
            searchKey="subject"
          />
        );
      }
      if (subPath === "timetable") {
        const timetableData = [
          { id: "1", class: "Class 10 - A", time: "09:00 AM - 10:00 AM", subject: "Mathematics", teacher: "Ms. Gupta", room: "Room 101" },
          { id: "2", class: "Class 10 - A", time: "10:00 AM - 11:00 AM", subject: "General Science", teacher: "Mr. Kumar", room: "Room 101" },
          { id: "3", class: "Class 10 - B", time: "09:00 AM - 10:00 AM", subject: "English Literature", teacher: "Mrs. Sen", room: "Room 102" },
          { id: "4", class: "Class 10 - B", time: "10:00 AM - 11:00 AM", subject: "Social Studies", teacher: "Mr. Joshi", room: "Room 102" },
        ];
        return (
          <ListViewTemplate
            title="Academic Master Timetable"
            description="Manage and schedule classes period intervals, rooms, and supervisors allocation."
            data={timetableData}
            columns={[
              { accessorKey: "class", header: "Class" },
              { accessorKey: "time", header: "Time Slot" },
              { accessorKey: "subject", header: "Subject" },
              { accessorKey: "teacher", header: "Faculty assigned" },
              { accessorKey: "room", header: "Allocated Room" },
            ]}
            searchKey="subject"
          />
        );
      }
    }

    // 2. Staff & HR
    if (moduleName === "staff-hr") {
      if (!subPath) {
        return (
          <ListViewTemplate
            title="Staff Directory"
            description="Monitor, update, and manage all campus staff members profiles."
            addLabel="Add Staff Member"
            data={employees}
            columns={employeeCols}
            searchKey="name"
            formFields={
              <>
                <FormInput name="employeeNo" label="Employee ID No" required placeholder="e.g. GW-EMP-006" />
                <FormInput name="name" label="Full Staff Name" required placeholder="e.g. Ms. Priya Patel" />
                <FormInput name="department" label="Department" required placeholder="e.g. Academics" />
                <FormInput name="designation" label="Designation Title" required placeholder="e.g. Senior Lecturer" />
                <FormInput name="phone" label="Contact No" required placeholder="e.g. 9876543210" />
                <FormInput name="email" label="Email Address" required placeholder="e.g. staff@school.com" />
                <FormInput name="salary" label="Monthly Base Salary (₹)" type="number" required placeholder="e.g. 60000" />
              </>
            }
            onAddSubmit={(values) => {
              setEmployees([{ id: `emp-${Date.now()}`, ...values }, ...employees]);
              toast.success("Staff profile added!");
            }}
          />
        );
      }
      if (subPath === "recruitment") {
        const recruitmentData = [
          { id: "1", title: "Senior Physics Lecturer", department: "Academics", openings: 2, status: "Active Interviews", candidates: 18 },
          { id: "2", title: "Librarian Assistant", department: "Library Operations", openings: 1, status: "Shortlisting", candidates: 8 },
          { id: "3", title: "Bus Driver (Route 6)", department: "Transport Division", openings: 1, status: "Offer Released", candidates: 4 },
        ];
        return (
          <ListViewTemplate
            title="Recruitment Portal"
            description="Manage campus job postings, interviews, and candidate listings."
            addLabel="Post Job Opening"
            data={recruitmentData}
            columns={[
              { accessorKey: "title", header: "Job Position" },
              { accessorKey: "department", header: "Department" },
              { accessorKey: "openings", header: "Open Positions" },
              { accessorKey: "candidates", header: "Applicants" },
              { accessorKey: "status", header: "Hiring Status" },
            ]}
            searchKey="title"
            formFields={
              <>
                <FormInput name="title" label="Job Title" required placeholder="e.g. Senior Chemistry Teacher" />
                <FormInput name="department" label="Department" required placeholder="e.g. Academics" />
                <FormInput name="openings" label="Positions Open" type="number" required placeholder="e.g. 1" />
                <FormSelect
                  name="status"
                  label="Hiring Status"
                  required
                  options={[
                    { value: "Open", label: "Open" },
                    { value: "Shortlisting", label: "Shortlisting" },
                    { value: "Closed", label: "Closed" },
                  ]}
                />
              </>
            }
          />
        );
      }
    }

    // 3. Payroll Processing
    if (moduleName === "payroll") {
      if (subPath === "structure") {
        const salaryStructureData = [
          { id: "1", designation: "Chief Finance Manager", basic: 55000, hra: 15000, allowances: 15000, pf: 4500, tax: 2500, net: 78000 },
          { id: "2", designation: "Senior Mathematics Lecturer", basic: 50000, hra: 15000, allowances: 10000, pf: 4500, tax: 2500, net: 68000 },
          { id: "3", designation: "Chief Hostel Warden", basic: 30000, hra: 10000, allowances: 10000, pf: 3000, tax: 1500, net: 45500 },
        ];
        return (
          <ListViewTemplate
            title="Salary Structure Templates"
            description="Configure default basic pay structures, HRA ratios, PF contributions, and taxes per designation."
            addLabel="Create Structure"
            data={salaryStructureData}
            columns={[
              { accessorKey: "designation", header: "Designation" },
              { accessorKey: "basic", header: "Basic Pay (₹)", cell: ({ row }) => `₹${row.original.basic.toLocaleString()}` },
              { accessorKey: "hra", header: "HRA Allowance (₹)", cell: ({ row }) => `₹${row.original.hra.toLocaleString()}` },
              { accessorKey: "allowances", header: "Allowances (₹)", cell: ({ row }) => `₹${row.original.allowances.toLocaleString()}` },
              { accessorKey: "pf", header: "PF Deduction (₹)", cell: ({ row }) => `₹${row.original.pf.toLocaleString()}` },
              { accessorKey: "tax", header: "TDS Tax (₹)", cell: ({ row }) => `₹${row.original.tax.toLocaleString()}` },
              { accessorKey: "net", header: "Net Salary (₹)", cell: ({ row }) => `₹${row.original.net.toLocaleString()}` },
            ]}
            searchKey="designation"
            formFields={
              <>
                <FormInput name="designation" label="Designation" required placeholder="e.g. Junior Teacher" />
                <FormInput name="basic" label="Basic Pay" type="number" required placeholder="e.g. 25000" />
                <FormInput name="hra" label="HRA" type="number" required placeholder="e.g. 8000" />
                <FormInput name="allowances" label="Allowances" type="number" required placeholder="e.g. 4000" />
                <FormInput name="pf" label="PF Contribution" type="number" required placeholder="e.g. 2000" />
                <FormInput name="tax" label="Professional TDS Tax" type="number" required placeholder="e.g. 1000" />
              </>
            }
          />
        );
      }
      if (subPath === "process") {
        const processedPayrollData = [
          { id: "1", month: "June 2026", totalEmployees: 5, processed: 415000, status: "Paid", paidDate: "2026-06-30" },
          { id: "2", month: "May 2026", totalEmployees: 5, processed: 415000, status: "Paid", paidDate: "2026-05-31" },
        ];
        return (
          <PageContainer>
            <PageHeader
              title="Process Payroll Log"
              description="Review and trigger monthly payroll processes for all school campus employees."
              actions={
                <Button onClick={() => toast.success("Current month payroll processed successfully!")}>
                  Run July Payroll
                </Button>
              }
            />
            <div className="bg-card rounded-xl border p-6 text-left">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="p-3 font-semibold text-muted-foreground">Month</th>
                    <th className="p-3 font-semibold text-muted-foreground">Total Employees</th>
                    <th className="p-3 font-semibold text-muted-foreground">Processed Salary Volume</th>
                    <th className="p-3 font-semibold text-muted-foreground">Disbursal Status</th>
                    <th className="p-3 font-semibold text-muted-foreground">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {processedPayrollData.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/10">
                      <td className="p-3 font-bold">{p.month}</td>
                      <td className="p-3">{p.totalEmployees} Employees</td>
                      <td className="p-3 font-semibold">₹{p.processed.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{p.paidDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageContainer>
        );
      }
      if (subPath === "payslips") {
        const payslipsList = employees.map(e => ({
          id: e.id,
          employeeNo: e.employeeNo,
          name: e.name,
          designation: e.designation,
          month: "June 2026",
          netPaid: e.salary,
        }));
        return (
          <ListViewTemplate
            title="Employee Payslips Index"
            description="Search, view, and print generated employee monthly payslips."
            data={payslipsList}
            columns={[
              { accessorKey: "employeeNo", header: "Employee ID" },
              { accessorKey: "name", header: "Employee Name" },
              { accessorKey: "designation", header: "Designation" },
              { accessorKey: "month", header: "Month" },
              { accessorKey: "netPaid", header: "Net Salary Disbursed", cell: ({ row }) => `₹${row.original.netPaid.toLocaleString()}` },
              {
                id: "actions",
                header: "Action",
                cell: () => (
                  <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold" onClick={() => router.push(`/${role}/print`)}>
                    Print Slip
                  </Button>
                )
              }
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "bonuses") {
        const bonusesData = [
          { id: "1", name: "Ms. Gupta", type: "Festive Bonus", amount: 5000, reason: "Excellent academic ratings", date: "2026-06-25" },
          { id: "2", name: "Mr. Kumar", type: "Overtime Duty", amount: 3000, reason: "Special hostel camp supervision", date: "2026-06-22" },
          { id: "3", name: "Mr. Rao", type: "Late Deduction", amount: -1500, reason: "3 Late marks registered", date: "2026-06-24" },
        ];
        return (
          <ListViewTemplate
            title="Bonuses & Deductions Ledger"
            description="Record one-off salary bonuses, incentives, or policy deduction charges."
            addLabel="Add Bonus/Deduction"
            data={bonusesData}
            columns={[
              { accessorKey: "name", header: "Staff Member" },
              {
                accessorKey: "type",
                header: "Type",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.amount > 0 ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {row.original.type}
                  </span>
                )
              },
              {
                accessorKey: "amount",
                header: "Amount (₹)",
                cell: ({ row }) => (
                  <span className={`font-bold ${row.original.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {row.original.amount > 0 ? `+₹${row.original.amount}` : `-₹${Math.abs(row.original.amount)}`}
                  </span>
                )
              },
              { accessorKey: "reason", header: "Reason Description" },
              { accessorKey: "date", header: "Recorded Date", cell: ({ row }) => <span className="font-mono">{row.original.date}</span> },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Staff Name" required placeholder="e.g. Ms. Gupta" />
                <FormSelect
                  name="type"
                  label="Category Type"
                  required
                  options={[
                    { value: "Bonus", label: "Bonus / Incentive" },
                    { value: "Deduction", label: "Policy Deduction" },
                  ]}
                />
                <FormInput name="amount" label="Amount Value (₹)" type="number" required placeholder="e.g. 5000" />
                <FormInput name="reason" label="Reason Context" required placeholder="e.g. Special performance reward" />
              </>
            }
          />
        );
      }
    }

    // 4. Fees & Accounts
    if (moduleName === "fees-accounts") {
      if (subPath === "structure") {
        const feesStructureData = [
          { id: "1", feeHead: "Admission Registration Fee", frequency: "One Time", class: "All Classes", amount: 1500, dueDate: "At Registration" },
          { id: "2", feeHead: "First Semester Tuition Fees", frequency: "Per Semester", class: "Class 10", amount: 12500, dueDate: "2026-07-15" },
          { id: "3", feeHead: "Computer Laboratory Charges", frequency: "Annually", class: "Class 9 & 10", amount: 1500, dueDate: "2026-07-20" },
          { id: "4", feeHead: "Library Maintenance Fees", frequency: "Annually", class: "All Classes", amount: 1000, dueDate: "2026-07-20" },
        ];
        return (
          <ListViewTemplate
            title="School Fee Structure Setup"
            description="Define administrative fee heads, due dates, class applicability, and amount targets."
            addLabel="Create Fee Head"
            data={feesStructureData}
            columns={[
              { accessorKey: "feeHead", header: "Fee Particular Head" },
              { accessorKey: "frequency", header: "Frequency Billing" },
              { accessorKey: "class", header: "Applicable Class" },
              { accessorKey: "amount", header: "Fee Amount (₹)", cell: ({ row }) => `₹${row.original.amount.toLocaleString()}` },
              { accessorKey: "dueDate", header: "Due Date Window", cell: ({ row }) => <span className="font-mono">{row.original.dueDate}</span> },
            ]}
            searchKey="feeHead"
            formFields={
              <>
                <FormInput name="feeHead" label="Fee Head Name" required placeholder="e.g. Second Semester Tuition Fee" />
                <FormSelect
                  name="frequency"
                  label="Billing Cycle"
                  required
                  options={[
                    { value: "One Time", label: "One Time" },
                    { value: "Per Semester", label: "Per Semester" },
                    { value: "Annually", label: "Annually" },
                    { value: "Monthly", label: "Monthly" },
                  ]}
                />
                <FormInput name="class" label="Class Applicability" required placeholder="e.g. Class 10" />
                <FormInput name="amount" label="Fee Amount" type="number" required placeholder="e.g. 12000" />
                <FormInput name="dueDate" label="Due Date" required placeholder="e.g. YYYY-MM-DD" />
              </>
            }
          />
        );
      }
      if (subPath === "categories") {
        const feeCategoriesData = [
          { id: "1", name: "Tuition Fees", code: "TUIT", desc: "Core educational instruction expenses" },
          { id: "2", name: "Co-curricular/Sports Fees", code: "SPRT", desc: "Annual physical education and tournaments fund" },
          { id: "3", name: "Laboratory Infrastructure Fees", code: "LAB", desc: "Computer and science lab tools maintenance" },
        ];
        return (
          <ListViewTemplate
            title="Fee Categories Ledger"
            description="Manage specific categories of fees for itemized accounts audit log."
            addLabel="Add Fee Category"
            data={feeCategoriesData}
            columns={[
              { accessorKey: "name", header: "Category Name" },
              { accessorKey: "code", header: "Category Code" },
              { accessorKey: "desc", header: "Detailed Description" },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Category Name" required placeholder="e.g. Transport Fees" />
                <FormInput name="code" label="Category Code" required placeholder="e.g. TRSP" />
                <FormInput name="desc" label="Description" required placeholder="e.g. Route shuttle maintenance expenses" />
              </>
            }
          />
        );
      }
      if (subPath === "collection") {
        return (
          <ListViewTemplate
            title="Fee Collections Log"
            description="Review transactional log reports of all student fee collection payments."
            data={fees}
            columns={feeCols}
            searchKey="studentName"
          />
        );
      }
      if (subPath === "pending") {
        const pendingFeesData = [
          { id: "1", name: "Kabir Dev", class: "Class 9-A", amount: 15000, dueDate: "2026-06-10", lastReminder: "2026-06-24" },
          { id: "2", name: "Rohan Sen", class: "Class 9-C", amount: 12000, dueDate: "2026-06-15", lastReminder: "2026-06-25" },
          { id: "3", name: "Priya Patel", class: "Class 10-B", amount: 5000, dueDate: "2026-06-18", lastReminder: "2026-06-25" },
        ];
        return (
          <ListViewTemplate
            title="Outstanding Dues Monitor"
            description="Audit pending student fees, track deadlines, and trigger alert reminders."
            addLabel="Send Global Dues Alert"
            data={pendingFeesData}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "amount", header: "Outstanding Balance (₹)", cell: ({ row }) => `₹${row.original.amount.toLocaleString()}` },
              { accessorKey: "dueDate", header: "Due Date", cell: ({ row }) => <span className="font-mono text-red-500 font-bold">{row.original.dueDate}</span> },
              { accessorKey: "lastReminder", header: "Last Dues Reminder Sent", cell: ({ row }) => <span className="font-mono">{row.original.lastReminder}</span> },
            ]}
            searchKey="name"
            onAddSubmit={() => toast.success("Dues reminder SMS queue triggered for all pending parent contacts!")}
          />
        );
      }
      if (subPath === "transactions") {
        const transactionsLedgerData = [
          { id: "TXN-001", date: "2026-06-26", desc: "Aarav Sharma Tuition Fees collection", type: "Income", amount: 15000, account: "ICICI Operational A/c" },
          { id: "TXN-002", date: "2026-06-25", desc: "Diesel Purchase for Bus Fleet (HP Fuel)", type: "Expense", amount: 25000, account: "Petty Cash Ledger" },
          { id: "TXN-003", date: "2026-06-25", desc: "Library Books Purchase - Wren&Martin 25 Copies", type: "Expense", amount: 5200, account: "ICICI Operational A/c" },
          { id: "TXN-004", date: "2026-06-24", desc: "Merit Scholar Grant funding release", type: "Income", amount: 80000, account: "School Capital Endowment A/c" },
        ];
        return (
          <ListViewTemplate
            title="Transactions General Ledger"
            description="Consolidated log tracking all incoming school fee revenue and outgoing operational expenses."
            addLabel="Log Manual Transaction"
            data={transactionsLedgerData}
            columns={[
              { accessorKey: "id", header: "Transaction ID" },
              { accessorKey: "date", header: "Date", cell: ({ row }) => <span className="font-mono">{row.original.date}</span> },
              { accessorKey: "desc", header: "Description Details" },
              {
                accessorKey: "type",
                header: "Type",
                cell: ({ row }) => (
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    row.original.type === "Income" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {row.original.type}
                  </span>
                )
              },
              {
                accessorKey: "amount",
                header: "Value (₹)",
                cell: ({ row }) => (
                  <span className={`font-bold ${row.original.type === "Income" ? "text-green-500" : "text-red-500"}`}>
                    {row.original.type === "Income" ? `+₹${row.original.amount.toLocaleString()}` : `-₹${row.original.amount.toLocaleString()}`}
                  </span>
                )
              },
              { accessorKey: "account", header: "Source/Target Account" },
            ]}
            searchKey="desc"
            formFields={
              <>
                <FormInput name="desc" label="Description" required placeholder="e.g. Utility Bills electricity" />
                <FormSelect
                  name="type"
                  label="Transaction Type"
                  required
                  options={[
                    { value: "Income", label: "Income / Cash-In" },
                    { value: "Expense", label: "Expense / Cash-Out" },
                  ]}
                />
                <FormInput name="amount" label="Amount Value (₹)" type="number" required placeholder="e.g. 15000" />
                <FormInput name="account" label="Associated Account" required placeholder="e.g. ICICI Bank A/c" />
              </>
            }
          />
        );
      }
    }

    // 5. Library Operations
    if (moduleName === "library") {
      if (subPath === "books") {
        return (
          <ListViewTemplate
            title="Books Catalog"
            description="Manage library books list, shelf indices, authors, and active quantities."
            addLabel="Add Book Entry"
            data={books}
            columns={bookCols}
            searchKey="title"
            formFields={
              <>
                <FormInput name="code" label="Book Unique Code" required placeholder="e.g. PHY-102" />
                <FormInput name="title" label="Book Title Description" required placeholder="e.g. Introduction to Physics" />
                <FormInput name="author" label="Author Full Name" required placeholder="e.g. H.C. Verma" />
                <FormInput name="quantity" label="Total Copy Quantity" type="number" required placeholder="e.g. 15" />
                <FormInput name="available" label="Available Catalog Quantity" type="number" required placeholder="e.g. 12" />
                <FormInput name="location" label="Library Shelf Location" required placeholder="e.g. Shelf A-3" />
              </>
            }
            onAddSubmit={(values) => {
              setBooks([{ id: `bk-${Date.now()}`, ...values }, ...books]);
              toast.success("Book copy added to library catalog!");
            }}
          />
        );
      }
      if (subPath === "categories") {
        const libCatsData = [
          { id: "1", name: "Physics & Chemistry", section: "Science Wing - A", count: 145 },
          { id: "2", name: "Calculus & Geometry", section: "Math Wing - B", count: 88 },
          { id: "3", name: "Social Studies History", section: "Humanities Wing - C", count: 210 },
        ];
        return (
          <ListViewTemplate
            title="Book Categories Ledger"
            description="Organize library catalogs inside wing codes and sub-genres."
            addLabel="Add Genre Category"
            data={libCatsData}
            columns={[
              { accessorKey: "name", header: "Genre Category Name" },
              { accessorKey: "section", header: "Campus Library Wing Location" },
              { accessorKey: "count", header: "Total Catalog Volume Count" },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Category Name" required placeholder="e.g. Biology & Biotech" />
                <FormInput name="section" label="Wing Location" required placeholder="e.g. Science Wing - D" />
              </>
            }
          />
        );
      }
      if (subPath === "issue-return") {
        const issueReturnData = [
          { id: "1", title: "Introduction to Physics (HC Verma)", student: "Aarav Sharma", issueDate: "2026-06-20", dueDate: "2026-07-05", returnDate: "-", status: "Issued" },
          { id: "2", title: "Advanced Mathematics (RD Sharma)", student: "Priya Patel", issueDate: "2026-06-15", dueDate: "2026-06-30", returnDate: "2026-06-28", status: "Returned" },
          { id: "3", title: "Computer Networks (Tanenbaum)", student: "Kabir Dev", issueDate: "2026-06-10", dueDate: "2026-06-25", returnDate: "-", status: "Overdue" },
        ];
        return (
          <ListViewTemplate
            title="Issue & Return Register"
            description="Audit library books release dates, returning status checklist, and alert logs."
            addLabel="Issue Book Copy"
            data={issueReturnData}
            columns={[
              { accessorKey: "title", header: "Book Title" },
              { accessorKey: "student", header: "Issued Student" },
              { accessorKey: "issueDate", header: "Issue Date", cell: ({ row }) => <span className="font-mono">{row.original.issueDate}</span> },
              { accessorKey: "dueDate", header: "Due Date", cell: ({ row }) => <span className="font-mono">{row.original.dueDate}</span> },
              { accessorKey: "returnDate", header: "Return Log Date", cell: ({ row }) => <span className="font-mono">{row.original.returnDate}</span> },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    row.original.status === "Returned" ? "bg-green-500/10 text-green-500 border border-green-500/20" : row.original.status === "Issued" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="title"
            formFields={
              <>
                <FormInput name="title" label="Book Title" required placeholder="e.g. Introduction to Physics" />
                <FormInput name="student" label="Student Full Name" required placeholder="e.g. Aarav Sharma" />
                <FormInput name="issueDate" label="Issue Date" required placeholder="e.g. YYYY-MM-DD" />
                <FormInput name="dueDate" label="Due Date" required placeholder="e.g. YYYY-MM-DD" />
              </>
            }
          />
        );
      }
      if (subPath === "fines") {
        const fineTrackerData = [
          { id: "1", student: "Kabir Dev", title: "Computer Networks (Tanenbaum)", daysOverdue: 7, amount: 70, status: "Unpaid" },
          { id: "2", student: "Rohan Sen", title: "History of India (Bipin Chandra)", daysOverdue: 0, amount: 0, status: "Paid" },
        ];
        return (
          <ListViewTemplate
            title="Library Fine Tracker"
            description="Audit library overdue charges and fines ledger collections."
            addLabel="Collect Fine"
            data={fineTrackerData}
            columns={[
              { accessorKey: "student", header: "Student Name" },
              { accessorKey: "title", header: "Book Title" },
              { accessorKey: "daysOverdue", header: "Days Overdue", cell: ({ row }) => <span className="font-bold text-red-500">{row.original.daysOverdue} Days</span> },
              { accessorKey: "amount", header: "Fine Amount (₹)", cell: ({ row }) => `₹${row.original.amount}` },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "Paid" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="student"
            formFields={
              <>
                <FormInput name="student" label="Student Name" required placeholder="e.g. Kabir Dev" />
                <FormInput name="amount" label="Fine Amount (₹)" type="number" required placeholder="e.g. 50" />
              </>
            }
          />
        );
      }
    }

    // 6. Inventory & Assets
    if (moduleName === "inventory") {
      if (subPath === "assets") {
        return (
          <ListViewTemplate
            title="Products & Assets Inventory"
            description="Configure infrastructure hardware assets, laptops, projectors, and maintenance logs."
            addLabel="Add Asset Entry"
            data={inventory}
            columns={[
              { accessorKey: "assetCode", header: "Asset Code" },
              { accessorKey: "type", header: "Category" },
              { accessorKey: "brandModel", header: "Brand & Model Info" },
              { accessorKey: "allocatedTo", header: "Allocated Staff Host" },
              { accessorKey: "status", header: "Operational Status" },
            ]}
            searchKey="brandModel"
            formFields={
              <>
                <FormInput name="brandModel" label="Brand & Model" required placeholder="e.g. Dell Latitude 5440" />
                <FormInput name="assetCode" label="Asset Code" required placeholder="e.g. GW-AST-0144" />
                <FormSelect
                  name="type"
                  label="Category"
                  required
                  options={[
                    { value: "Laptop", label: "Laptop" },
                    { value: "Tablet", label: "Tablet" },
                    { value: "Projector", label: "Projector" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <FormSelect
                  name="status"
                  label="Status"
                  required
                  options={[
                    { value: "Allocated", label: "Allocated" },
                    { value: "Available", label: "Available" },
                    { value: "In Repair", label: "In Repair" },
                  ]}
                />
              </>
            }
            onAddSubmit={(values) => {
              setInventory([{ id: `ast-${Date.now()}`, ...values }, ...inventory]);
              toast.success("Asset copy created successfully!");
            }}
          />
        );
      }
      if (subPath === "categories") {
        const invCatsData = [
          { id: "1", name: "IT Assets (Laptops, Tablets)", code: "IT-AST", count: 85 },
          { id: "2", name: "Lab Chemical Consumables", code: "LAB-CNS", count: 120 },
          { id: "3", name: "Office Stationery Supplies", code: "OFC-STN", count: 450 },
        ];
        return (
          <ListViewTemplate
            title="Product Categories"
            description="Manage specific inventory categories of school logistics."
            addLabel="Add Inventory Group"
            data={invCatsData}
            columns={[
              { accessorKey: "name", header: "Inventory Category" },
              { accessorKey: "code", header: "Identifier Code" },
              { accessorKey: "count", header: "Items Registered Count" },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Category Name" required placeholder="e.g. Lab glassware" />
                <FormInput name="code" label="Category Code" required placeholder="e.g. LAB-GLS" />
              </>
            }
          />
        );
      }
      if (subPath === "stock") {
        const stockLevelsData = [
          { id: "1", name: "Lenovo ThinkPad E14 Laptop", category: "IT Assets", stock: 12, reorder: 5, status: "Good" },
          { id: "2", name: "A4 Printing Paper Reams", category: "Stationery", stock: 18, reorder: 20, status: "Low Stock Alert" },
          { id: "3", name: "Board Chalk Box (White)", category: "Stationery", stock: 8, reorder: 15, status: "Low Stock Alert" },
        ];
        return (
          <ListViewTemplate
            title="Stock Levels Register"
            description="Monitor real-time warehouse stock levels, alert thresholds, and reorder alerts."
            data={stockLevelsData}
            columns={[
              { accessorKey: "name", header: "Item Description Name" },
              { accessorKey: "category", header: "Category Domain" },
              { accessorKey: "stock", header: "Quantity In-Stock", cell: ({ row }) => <span className="font-bold">{row.original.stock} Units</span> },
              { accessorKey: "reorder", header: "Reorder Trigger Level", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.reorder} Units</span> },
              {
                accessorKey: "status",
                header: "Alert Level",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "Good" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "purchase-orders") {
        const poData = [
          { id: "PO-2026-001", vendor: "Delhi IT Solutions", itemsCount: 15, amount: 620000, date: "2026-06-20", status: "Approved" },
          { id: "PO-2026-002", vendor: "Kwality Papers Ltd", itemsCount: 50, amount: 15000, date: "2026-06-25", status: "Pending Review" },
        ];
        return (
          <ListViewTemplate
            title="Purchase Orders Ledger"
            description="Track operational purchase orders sent to vendors, log billing details, and verify deliveries."
            addLabel="Create Purchase Order"
            data={poData}
            columns={[
              { accessorKey: "id", header: "PO Reference No" },
              { accessorKey: "vendor", header: "Supplier Vendor" },
              { accessorKey: "itemsCount", header: "Total Items Count" },
              { accessorKey: "amount", header: "Total Value (₹)", cell: ({ row }) => `₹${row.original.amount.toLocaleString()}` },
              { accessorKey: "date", header: "Issue Date", cell: ({ row }) => <span className="font-mono">{row.original.date}</span> },
              {
                accessorKey: "status",
                header: "PO Status",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "Approved" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="vendor"
            formFields={
              <>
                <FormInput name="vendor" label="Supplier Vendor" required placeholder="e.g. Amul Milk Distributors" />
                <FormInput name="itemsCount" label="Total Items" type="number" required placeholder="e.g. 10" />
                <FormInput name="amount" label="PO Value (₹)" type="number" required placeholder="e.g. 50000" />
              </>
            }
          />
        );
      }
    }

    // 7. Transport Management
    if (moduleName === "transport") {
      if (subPath === "vehicles") {
        return (
          <ListViewTemplate
            title="Vehicles Fleet Manager"
            description="Manage campus transport bus fleet, registration details, and seating allocation capacities."
            addLabel="Add Vehicle"
            data={transport}
            columns={transportCols}
            searchKey="vehicleNo"
            formFields={
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
            }
            onAddSubmit={(values) => {
              setTransport([{ id: `tr-${Date.now()}`, ...values }, ...transport]);
              toast.success("Vehicle registered successfully in fleet!");
            }}
          />
        );
      }
      if (subPath === "drivers") {
        const driversData = [
          { id: "1", name: "Ramesh Singh", license: "DL-142026589", phone: "9874563210", status: "On Duty" },
          { id: "2", name: "Manjeet Yadav", license: "DL-152026214", phone: "9988445566", status: "On Duty" },
          { id: "3", name: "Satish Kumar", license: "DL-122026328", phone: "9564872130", status: "On Duty" },
          { id: "4", name: "Devender Dutt", license: "DL-112026511", phone: "9812457890", status: "On Leave" },
        ];
        return (
          <ListViewTemplate
            title="Drivers Directory"
            description="Manage transport staff drivers contact sheets, license details, and status updates."
            addLabel="Add Driver"
            data={driversData}
            columns={[
              { accessorKey: "name", header: "Driver Name" },
              { accessorKey: "license", header: "License Number", cell: ({ row }) => <span className="font-mono">{row.original.license}</span> },
              { accessorKey: "phone", header: "Phone Contact", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.phone}</span> },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "On Duty" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Driver Name" required placeholder="e.g. Ramesh Singh" />
                <FormInput name="license" label="License No" required placeholder="e.g. DL-142026589" />
                <FormInput name="phone" label="Phone" required placeholder="e.g. 9874563210" />
              </>
            }
          />
        );
      }
      if (subPath === "routes") {
        const routesData = [
          { id: "1", code: "RT-01", start: "Dwarka Sector 10", end: "Campus Academy", stops: 12, vehicle: "DL-01-PA-1054" },
          { id: "2", code: "RT-02", start: "Rohini West Terminal", end: "Campus Academy", stops: 8, vehicle: "DL-01-PA-2144" },
          { id: "3", code: "RT-03", start: "Saket Metro station", end: "Campus Academy", stops: 10, vehicle: "DL-01-PA-3288" },
        ];
        return (
          <ListViewTemplate
            title="Routes & Stops Map"
            description="Define shuttle routes, calculate stops frequency, and assign vehicles."
            addLabel="Create Route"
            data={routesData}
            columns={[
              { accessorKey: "code", header: "Route Code" },
              { accessorKey: "start", header: "Route Origin" },
              { accessorKey: "end", header: "Campus Destination" },
              { accessorKey: "stops", header: "Stops Count" },
              { accessorKey: "vehicle", header: "Assigned Bus" },
            ]}
            searchKey="code"
            formFields={
              <>
                <FormInput name="code" label="Route Code" required placeholder="e.g. RT-04" />
                <FormInput name="start" label="Route Origin" required placeholder="e.g. Noida Sector 62" />
                <FormInput name="end" label="Campus Destination" required placeholder="e.g. Campus Academy" />
                <FormInput name="stops" label="Stops Count" type="number" required placeholder="e.g. 10" />
                <FormInput name="vehicle" label="Assigned Bus No" required placeholder="e.g. DL-01-PA-4022" />
              </>
            }
          />
        );
      }
      if (subPath === "fuel") {
        const fuelLogsData = [
          { id: "1", vehicle: "DL-01-PA-1054", date: "2026-06-25", liters: 65, amount: 6200, mileage: "6.2 km/l", driver: "Ramesh Singh" },
          { id: "2", vehicle: "DL-01-PA-2144", date: "2026-06-24", liters: 50, amount: 4800, mileage: "5.8 km/l", driver: "Manjeet Yadav" },
        ];
        return (
          <ListViewTemplate
            title="Fuel Logbook"
            description="Audit daily/weekly diesel fuel purchase logs, track mileage metrics, and check drivers."
            addLabel="Log Fuel Purchase"
            data={fuelLogsData}
            columns={[
              { accessorKey: "vehicle", header: "Vehicle" },
              { accessorKey: "date", header: "Purchase Date", cell: ({ row }) => <span className="font-mono">{row.original.date}</span> },
              { accessorKey: "liters", header: "Liters filled", cell: ({ row }) => `${row.original.liters} L` },
              { accessorKey: "amount", header: "Billing Value (₹)", cell: ({ row }) => `₹${row.original.amount.toLocaleString()}` },
              { accessorKey: "mileage", header: "Avg Mileage", cell: ({ row }) => <span className="font-bold">{row.original.mileage}</span> },
              { accessorKey: "driver", header: "Purchased By Driver" },
            ]}
            searchKey="vehicle"
            formFields={
              <>
                <FormInput name="vehicle" label="Vehicle No" required placeholder="e.g. DL-01-PA-1054" />
                <FormInput name="date" label="Date" required placeholder="e.g. YYYY-MM-DD" />
                <FormInput name="liters" label="Liters Filled" type="number" required placeholder="e.g. 60" />
                <FormInput name="amount" label="Total Cost" type="number" required placeholder="e.g. 5800" />
                <FormInput name="driver" label="Driver" required placeholder="e.g. Ramesh Singh" />
              </>
            }
          />
        );
      }
    }

    // 8. Hostel Management
    if (moduleName === "hostel") {
      if (subPath === "blocks") {
        const blocksData = [
          { id: "1", name: "Boys A-Block", gender: "Male", rooms: 20, beds: 80, allocated: 72, warden: "Rajesh Kumar" },
          { id: "2", name: "Girls B-Block", gender: "Female", rooms: 15, beds: 45, allocated: 38, warden: "Aarti Deshpande" },
          { id: "3", name: "Special Suite C", gender: "Co-Ed Wing", rooms: 5, beds: 10, allocated: 8, warden: "Rajesh Kumar" },
        ];
        return (
          <ListViewTemplate
            title="Hostel Blocks Directory"
            description="Manage hostel campus buildings, capacities split by gender, and supervisor wardens."
            addLabel="Create Hostel Block"
            data={blocksData}
            columns={[
              { accessorKey: "name", header: "Block Name" },
              { accessorKey: "gender", header: "Allowed Gender" },
              { accessorKey: "rooms", header: "Total Rooms Count" },
              { accessorKey: "beds", header: "Total Bed Capacity" },
              { accessorKey: "allocated", header: "Assigned Occupants" },
              { accessorKey: "warden", header: "Campus Warden Supervisor" },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Block Name" required placeholder="e.g. Boys B-Block" />
                <FormSelect
                  name="gender"
                  label="Allowed Gender"
                  required
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                />
                <FormInput name="rooms" label="Total Rooms" type="number" required placeholder="e.g. 15" />
                <FormInput name="warden" label="Campus Warden" required placeholder="e.g. Rajesh Kumar" />
              </>
            }
          />
        );
      }
      if (subPath === "rooms-beds") {
        return (
          <ListViewTemplate
            title="Rooms & Beds Status"
            description="Log triple, double, and single occupancy room types, rent rates, and active occupancies."
            addLabel="Add Hostel Room"
            data={hostel}
            columns={hostelCols}
            searchKey="roomNo"
            formFields={
              <>
                <FormInput name="roomNo" label="Room Number" required placeholder="e.g. Room 101" />
                <FormInput name="block" label="Hostel Campus Block" required placeholder="e.g. Boys A-Block" />
                <FormInput name="capacity" label="Total Bed Capacity" type="number" required placeholder="e.g. 4" />
                <FormInput name="allocated" label="Allocated Occupants" type="number" required placeholder="e.g. 4" />
                <FormInput name="rentPerMonth" label="Rent Value / Month (₹)" type="number" required placeholder="e.g. 6500" />
                <FormInput name="wardenName" label="Assigned Warden Name" required placeholder="e.g. Rajesh Kumar" />
              </>
            }
            onAddSubmit={(values) => {
              setHostel([{ id: `hs-${Date.now()}`, ...values }, ...hostel]);
              toast.success("Hostel room added to inventory register!");
            }}
          />
        );
      }
      if (subPath === "allocation") {
        const allocationsData = [
          { id: "1", name: "Aarav Sharma", class: "Class 10-A", block: "Boys A-Block", room: "Room 101", bed: "Bed A", date: "2026-06-15" },
          { id: "2", name: "Priya Patel", class: "Class 10-B", block: "Girls B-Block", room: "Room 201", bed: "Bed C", date: "2026-06-18" },
          { id: "3", name: "Kabir Dev", class: "Class 9-A", block: "Boys A-Block", room: "Room 102", bed: "Bed B", date: "2026-06-20" },
        ];
        return (
          <ListViewTemplate
            title="Bed Allocations Log"
            description="Assign and shift student rooms allocations, track dates, and check occupancies."
            addLabel="Allocate Bed Space"
            data={allocationsData}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "block", header: "Hostel Block" },
              { accessorKey: "room", header: "Assigned Room No", cell: ({ row }) => <span className="font-bold">{row.original.room}</span> },
              { accessorKey: "bed", header: "Bed No" },
              { accessorKey: "date", header: "Allocation Date", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.date}</span> },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Student Name" required placeholder="e.g. Kabir Dev" />
                <FormInput name="class" label="Class Cohort" required placeholder="e.g. Class 9-A" />
                <FormInput name="block" label="Hostel Block" required placeholder="e.g. Boys A-Block" />
                <FormInput name="room" label="Room Number" required placeholder="e.g. Room 102" />
                <FormInput name="bed" label="Bed Number" required placeholder="e.g. Bed A" />
              </>
            }
          />
        );
      }
    }

    // 9. Health Center
    if (moduleName === "health-center") {
      if (subPath === "records") {
        const medicalRecordsData = [
          { id: "1", student: "Aarav Sharma", class: "Class 10-A", bloodGroup: "O+", allergies: "None", weight: "55 kg", height: "168 cm" },
          { id: "2", student: "Priya Patel", class: "Class 10-B", bloodGroup: "A+", allergies: "Peanuts, Dust", weight: "50 kg", height: "160 cm" },
          { id: "3", student: "Kabir Dev", class: "Class 9-A", bloodGroup: "B-", allergies: "Penicillin", weight: "62 kg", height: "172 cm" },
        ];
        return (
          <ListViewTemplate
            title="Student Medical Records"
            description="Manage pupil primary bio-statistics, blood groups, and medical allergies alerts."
            addLabel="Create Record Card"
            data={medicalRecordsData}
            columns={[
              { accessorKey: "student", header: "Student Name" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "bloodGroup", header: "Blood Group", cell: ({ row }) => <span className="font-bold text-red-600">{row.original.bloodGroup}</span> },
              { accessorKey: "allergies", header: "Allergies Alerts", cell: ({ row }) => <span className="text-amber-500 font-semibold">{row.original.allergies}</span> },
              { accessorKey: "weight", header: "Weight" },
              { accessorKey: "height", header: "Height" },
            ]}
            searchKey="student"
            formFields={
              <>
                <FormInput name="student" label="Student Name" required placeholder="e.g. Aarav Sharma" />
                <FormInput name="class" label="Class" required placeholder="e.g. Class 10-A" />
                <FormInput name="bloodGroup" label="Blood Group" required placeholder="e.g. O+" />
                <FormInput name="allergies" label="Allergies" required placeholder="e.g. None" />
                <FormInput name="weight" label="Weight" required placeholder="e.g. 55 kg" />
                <FormInput name="height" label="Height" required placeholder="e.g. 165 cm" />
              </>
            }
          />
        );
      }
      if (subPath === "visits") {
        const medicalVisitsData = [
          { id: "1", student: "Aarav Sharma", date: "2026-06-25 10:15 AM", complaint: "Mild Headache & Fatigue", treatment: "Paracetamol 500mg, Rest for 1 Hour", doctor: "Dr. Sandeep Verma" },
          { id: "2", student: "Kabir Dev", date: "2026-06-24 11:30 AM", complaint: "Sprained Left Ankle (Sports)", treatment: "Cold pack, crepe bandage, rest", doctor: "Dr. Sandeep Verma" },
        ];
        return (
          <ListViewTemplate
            title="Medical Visits Logbook"
            description="Record clinic walk-ins, diagnostic notes, treatment cards, and doctor listings."
            addLabel="Log Clinic Visit"
            data={medicalVisitsData}
            columns={[
              { accessorKey: "student", header: "Student Visitor" },
              { accessorKey: "date", header: "Visit Timestamp", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.date}</span> },
              { accessorKey: "complaint", header: "Symptom Complaint" },
              { accessorKey: "treatment", header: "Treatment Administered" },
              { accessorKey: "doctor", header: "Attending Doctor" },
            ]}
            searchKey="student"
            formFields={
              <>
                <FormInput name="student" label="Student Name" required placeholder="e.g. Aarav Sharma" />
                <FormInput name="date" label="Timestamp" required placeholder="e.g. YYYY-MM-DD HH:MM" />
                <FormInput name="complaint" label="Symptom Complaint" required placeholder="e.g. Stomach ache" />
                <FormInput name="treatment" label="Treatment" required placeholder="e.g. Antacid tablet" />
                <FormInput name="doctor" label="Attending Doctor" required placeholder="e.g. Dr. Sandeep Verma" />
              </>
            }
          />
        );
      }
      if (subPath === "vaccinations") {
        const vaccinationsData = [
          { id: "1", student: "Aarav Sharma", class: "Class 10-A", vaccine: "Tetanus Toxoid Booster", dose: "Dose 1", date: "2026-06-20" },
          { id: "2", student: "Priya Patel", class: "Class 10-B", vaccine: "Hepatitis B Vaccine", dose: "Dose 2", date: "2026-06-18" },
        ];
        return (
          <ListViewTemplate
            title="Vaccinations Register"
            description="Manage institutional vaccination drives, booster dosages records, and dates."
            addLabel="Add Dose Entry"
            data={vaccinationsData}
            columns={[
              { accessorKey: "student", header: "Student Name" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "vaccine", header: "Vaccine Name" },
              { accessorKey: "dose", header: "Dose No", cell: ({ row }) => <span className="font-bold">{row.original.dose}</span> },
              { accessorKey: "date", header: "Date Administered", cell: ({ row }) => <span className="font-mono">{row.original.date}</span> },
            ]}
            searchKey="student"
            formFields={
              <>
                <FormInput name="student" label="Student Name" required placeholder="e.g. Aarav Sharma" />
                <FormInput name="class" label="Class" required placeholder="e.g. Class 10-A" />
                <FormInput name="vaccine" label="Vaccine" required placeholder="e.g. Covid Booster" />
                <FormInput name="dose" label="Dose No" required placeholder="e.g. Dose 1" />
                <FormInput name="date" label="Date" required placeholder="e.g. YYYY-MM-DD" />
              </>
            }
          />
        );
      }
      if (subPath === "medicine") {
        const medicineInventoryData = [
          { id: "1", name: "Paracetamol 500mg (Crocin)", type: "Analgesic", batch: "BATCH-PAR-258", expiry: "2028-05-31", qty: 250, status: "Good" },
          { id: "2", name: "Cetirizine 10mg (Okacet)", type: "Antihistamine", batch: "BATCH-CET-144", expiry: "2027-11-30", qty: 120, status: "Good" },
          { id: "3", name: "Betadine Ointment 15g", type: "Analgesic", batch: "BATCH-BET-089", expiry: "2026-09-30", qty: 15, status: "Low Stock Alert" },
        ];
        return (
          <ListViewTemplate
            title="Medicine Stock Inventory"
            description="Track health clinic medical items, batches, expiry alerts, and stock quantities."
            addLabel="Add Medicine Batch"
            data={medicineInventoryData}
            columns={[
              { accessorKey: "name", header: "Medicine Description" },
              { accessorKey: "type", header: "Category Group" },
              { accessorKey: "batch", header: "Batch Identification", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.batch}</span> },
              { accessorKey: "expiry", header: "Expiry Date", cell: ({ row }) => <span className="font-mono text-red-500 font-bold">{row.original.expiry}</span> },
              { accessorKey: "qty", header: "In-Stock Quantity", cell: ({ row }) => <span className="font-bold">{row.original.qty} Units</span> },
              {
                accessorKey: "status",
                header: "Stock Alert",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "Good" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Medicine Name" required placeholder="e.g. Paracetamol 500mg" />
                <FormInput name="type" label="Category" required placeholder="e.g. Analgesic" />
                <FormInput name="batch" label="Batch No" required placeholder="e.g. BATCH-PAR-901" />
                <FormInput name="expiry" label="Expiry Date" required placeholder="e.g. YYYY-MM-DD" />
                <FormInput name="qty" label="Stock Quantity" type="number" required placeholder="e.g. 100" />
              </>
            }
          />
        );
      }
    }

    // 10. Visitor Management
    if (moduleName === "visitor-management") {
      if (subPath === "visitors") {
        const visitorsLogData = [
          { id: "1", passNo: "GW-VPASS-01", name: "Mr. Ramesh Patel", phone: "9876543210", purpose: "Meet Child", host: "Priya Patel", checkIn: "04:30 PM", checkOut: "-", status: "In Campus" },
          { id: "2", passNo: "GW-VPASS-02", name: "Mr. A. K. Verma", phone: "9811223344", purpose: "Guardian Visit", host: "Amit Verma", checkIn: "02:00 PM", checkOut: "03:30 PM", status: "Checked Out" },
        ];
        return (
          <ListViewTemplate
            title="Visitor Entry Logbook"
            description="Manage campus gate visitor listings, release entry passes, and check check-out status."
            addLabel="Visitor Entry Pass"
            data={visitorsLogData}
            columns={[
              { accessorKey: "passNo", header: "Pass No" },
              { accessorKey: "name", header: "Visitor Name" },
              { accessorKey: "phone", header: "Contact Phone" },
              { accessorKey: "purpose", header: "Purpose of Visit" },
              { accessorKey: "host", header: "Person to Meet" },
              { accessorKey: "checkIn", header: "Check-In" },
              { accessorKey: "checkOut", header: "Check-Out" },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "In Campus" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="name"
            formFields={
              <>
                <FormInput name="name" label="Visitor Name" required placeholder="e.g. Suresh Kumar" />
                <FormInput name="phone" label="Phone" required placeholder="e.g. 9876543210" />
                <FormInput name="purpose" label="Purpose" required placeholder="e.g. Parent Visit" />
                <FormInput name="host" label="Person to Meet" required placeholder="e.g. Priya Patel" />
              </>
            }
          />
        );
      }
      if (subPath === "complaints") {
        const complaintsData = [
          { id: "CMP-001", student: "Kabir Dev", category: "Hostel Maintenance", title: "Room 102 Ceiling Fan malfunction", date: "2026-06-25", status: "Pending Allocation" },
          { id: "CMP-002", student: "Rohan Sen", category: "Library Infrastructure", title: "Damaged study chair on shelf B-1", date: "2026-06-24", status: "Resolved" },
        ];
        return (
          <ListViewTemplate
            title="Complaints Box Roster"
            description="Manage infrastructure complaints filed by students, track resolutions, and assign technicians."
            addLabel="File Complaint"
            data={complaintsData}
            columns={[
              { accessorKey: "id", header: "Ticket ID" },
              { accessorKey: "student", header: "Reporter Student" },
              { accessorKey: "category", header: "Category Domain" },
              { accessorKey: "title", header: "Issue description" },
              { accessorKey: "date", header: "Reported Date", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.date}</span> },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    row.original.status === "Resolved" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                  }`}>
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="title"
            formFields={
              <>
                <FormInput name="student" label="Reporter Student Name" required placeholder="e.g. Kabir Dev" />
                <FormInput name="category" label="Category Domain" required placeholder="e.g. Hostel Maintenance" />
                <FormInput name="title" label="Issue Details" required placeholder="e.g. Leakage in room tap" />
              </>
            }
          />
        );
      }
    }

    // 11. Reports & Analytics
    if (moduleName === "reports") {
      if (subPath === "export") {
        return (
          <PageContainer>
            <PageHeader
              title="Custom Reports Export Hub"
              description="Export customized data tables, logs, and fee transactions to CSV, Excel, or PDF sheets."
            />
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-left max-w-xl space-y-6">
              <h3 className="text-sm font-bold text-foreground">Select Export configurations</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Target Data Ledger</label>
                  <select className="w-full h-9 border bg-card rounded-lg px-2">
                    <option>Tuition Fees Collections</option>
                    <option>Student Academic Grade Sheets</option>
                    <option>Staff Salary Disbursements Log</option>
                    <option>Campus Branch Performance</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1">Start Date</label>
                    <input type="date" className="w-full h-9 border bg-card rounded-lg px-3" defaultValue="2026-06-01" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground block mb-1">End Date</label>
                    <input type="date" className="w-full h-9 border bg-card rounded-lg px-3" defaultValue="2026-06-30" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button onClick={() => toast.success("PDF report generated successfully!")} size="sm" className="font-semibold text-xs h-9">
                    Export to PDF
                  </Button>
                  <Button onClick={() => toast.success("Excel ledger compiled and downloaded!")} size="sm" variant="outline" className="font-semibold text-xs h-9">
                    Export to Excel
                  </Button>
                  <Button onClick={() => toast.success("CSV file downloaded!")} size="sm" variant="ghost" className="font-semibold text-xs h-9 border border-border">
                    Export to CSV
                  </Button>
                </div>
              </div>
            </div>
          </PageContainer>
        );
      }
    }

    // 12. System Logs
    if (moduleName === "audit-logs") {
      if (subPath === "activity") {
        const sessionActivityData = [
          { id: "1", user: "superadmin@school.com", action: "Updated School Profile configuration details", time: "Today 12:05 PM", status: "Success" },
          { id: "2", user: "finance@school.com", action: "Created Fee Head (Computer laboratory charges)", time: "Today 11:42 AM", status: "Success" },
          { id: "3", user: "branchadmin@greenfield.edu", action: "Approved discount request #app-2 (Rohan Sen)", time: "Today 10:15 AM", status: "Success" },
        ];
        return (
          <ListViewTemplate
            title="Session Activity Tracker"
            description="Audit user clicks, configuration edits, and portal metadata updates."
            data={sessionActivityData}
            columns={[
              { accessorKey: "user", header: "User Account" },
              { accessorKey: "action", header: "Action details" },
              { accessorKey: "time", header: "Timestamp", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.time}</span> },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="user"
          />
        );
      }
    }

    // 13. General Settings
    if (moduleName === "settings") {
      if (subPath === "roles") {
        const userRolesData = [
          { id: "1", role: "Super Admin", count: 2, desc: "Complete master administrative keys over all campuses." },
          { id: "2", role: "Branch Admin", count: 12, desc: "Campus operations coordinator, manages users & approvals." },
          { id: "3", role: "Academic Head", count: 12, desc: "Manages class schedules, timetables, subjects, and grading." },
          { id: "4", role: "Finance Manager", count: 8, desc: "Fee collection registers, salary payrolls, utility expense logs." },
        ];
        return (
          <ListViewTemplate
            title="User Roles & Access Control"
            description="Manage security designations and administrative groups permissions."
            addLabel="Create Access Role"
            data={userRolesData}
            columns={[
              { accessorKey: "role", header: "Access Role Designation" },
              { accessorKey: "count", header: "Total Assigned Users Count" },
              { accessorKey: "desc", header: "Permissions Scope Details" },
            ]}
            searchKey="role"
            formFields={
              <>
                <FormInput name="role" label="Role Name" required placeholder="e.g. Library Supervisor" />
                <FormInput name="desc" label="Permissions Scope" required placeholder="e.g. Catalog books, collect library fines" />
              </>
            }
          />
        );
      }
    }

    // Generic fallback mapping for new expanded sub-pages
    // This allows us to handle 100+ pages dynamically and beautifully without bloated code
    if (subPath) {
      const pageLabel = subPath.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

      // A. Settings sub-pages
      if (moduleName === "settings" || subPath === "settings") {
        return (
          <PageContainer>
            <PageHeader
              title={`${pageLabel} Settings`}
              description={`Configure and update school portal ${pageLabel.toLowerCase()} parameters.`}
            />
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-left max-w-xl space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Configure Parameters</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Configuration Profile Name</label>
                  <input type="text" className="w-full h-9 border bg-card rounded-lg px-3" defaultValue={`Default ${pageLabel} Profile`} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Activation Status</label>
                  <select className="w-full h-9 border bg-card rounded-lg px-2">
                    <option>Active / Operational</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Detailed Logs & Debugging</label>
                  <select className="w-full h-9 border bg-card rounded-lg px-2">
                    <option>Enabled (Verbose logs)</option>
                    <option>Disabled (Error only)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <Button onClick={() => toast.success(`${pageLabel} settings updated successfully!`)} size="sm" className="font-semibold text-xs h-9">
                    Save Configuration
                  </Button>
                </div>
              </div>
            </div>
          </PageContainer>
        );
      }

      // B. Reports sub-pages
      if (moduleName === "reports" || subPath.includes("report") || subPath === "pdf" || subPath === "excel" || subPath === "scheduled") {
        const dummyReportData = [
          { id: "REP-001", title: `June 2026 Monthly ${pageLabel} Analysis`, scope: "All Campuses", date: "2026-06-30", status: "Generated" },
          { id: "REP-002", title: `Q2 Academic Term ${pageLabel} Summary`, scope: "All Campuses", date: "2026-06-15", status: "Archived" },
        ];
        return (
          <ListViewTemplate
            title={`${pageLabel} Logs`}
            description={`Review, schedule, and compile detailed reports for ${pageLabel.toLowerCase()} operations.`}
            data={dummyReportData}
            columns={[
              { accessorKey: "id", header: "Report ID" },
              { accessorKey: "title", header: "Report Title" },
              { accessorKey: "scope", header: "Operational Scope" },
              { accessorKey: "date", header: "Generation Date", cell: ({ row }) => <span className="font-mono">{row.original.date}</span> },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                    {row.original.status}
                  </span>
                )
              },
            ]}
            searchKey="title"
          />
        );
      }

      // C. System Logs / Audits sub-pages
      if (moduleName === "audit-logs" || subPath.includes("log") || subPath.includes("activity")) {
        const dummyLogs = [
          { id: "1", timestamp: "2026-07-02 11:30:15", user: "superadmin@school.com", scope: pageLabel, action: `Accessed portal parameters for ${pageLabel.toLowerCase()}`, ip: "103.45.191.12" },
          { id: "2", timestamp: "2026-07-02 10:15:42", user: "finance@school.com", scope: pageLabel, action: `Modified config profile indices`, ip: "182.49.201.76" },
        ];
        return (
          <ListViewTemplate
            title={`${pageLabel} Audits`}
            description={`System activity logs and trace audits for ${pageLabel.toLowerCase()} entries.`}
            data={dummyLogs}
            columns={[
              { accessorKey: "timestamp", header: "Timestamp", cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.timestamp}</span> },
              { accessorKey: "user", header: "User Account" },
              { accessorKey: "scope", header: "Scope domain" },
              { accessorKey: "action", header: "Audit Action Details" },
              { accessorKey: "ip", header: "Access IP", cell: ({ row }) => <span className="font-mono">{row.original.ip}</span> },
            ]}
            searchKey="action"
          />
        );
      }

      // D. Default dynamic data listing for all other sub-paths (like sections, subjects, stops, GPS tracking, medical info, mess mgmt, etc.)
      const dummyListingData = [
        { id: "1", name: `Primary ${pageLabel} Record A`, reference: "REF-001", details: `High-fidelity active dataset config entry for ${pageLabel.toLowerCase()} listing A.`, status: "Active" },
        { id: "2", name: `Secondary ${pageLabel} Record B`, reference: "REF-002", details: `High-fidelity active dataset config entry for ${pageLabel.toLowerCase()} listing B.`, status: "Active" },
      ];
      return (
        <ListViewTemplate
          title={pageLabel}
          description={`Manage, audit, and update detailed records and allocations for school ${pageLabel.toLowerCase()} operations.`}
          addLabel={`Add ${pageLabel.split(" ")[0]} Record`}
          data={dummyListingData}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Record Particular" },
            { accessorKey: "reference", header: "Reference No", cell: ({ row }) => <span className="font-mono">{row.original.reference}</span> },
            { accessorKey: "details", header: "Detailed Description Context" },
            {
              accessorKey: "status",
              header: "Status",
              cell: ({ row }) => (
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {row.original.status}
                </span>
              )
            },
          ]}
          searchKey="name"
          formFields={
            <>
              <FormInput name="name" label="Record Name" required placeholder={`e.g. ${pageLabel} Particular`} />
              <FormInput name="reference" label="Reference ID" required placeholder="e.g. REF-100" />
              <FormInput name="details" label="Detailed Description Context" required placeholder="Add details..." />
            </>
          }
        />
      );
    }
  }

  // --- BRANCH ADMIN CUSTOM SUB-PAGES ROUTER ---
  if (role === "branch-admin") {
    const subPath = slug[1];

    // 1. Dashboard Sub-Pages
    if (moduleName === "dashboard") {
      if (subPath === "summary") {
        return (
          <PageContainer>
            <PageHeader title="Today's Operational Summary" description="Overview of campus active attendance, admissions inquiries, and daily fee logs." />
            <div className="grid gap-6 md:grid-cols-3 text-left">
              <div className="md:col-span-2 bg-card rounded-xl border p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Today's Transactions</h3>
                <table className="w-full text-xs text-left border-collapse border">
                  <thead>
                    <tr className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b">
                      <th className="p-3 border-r">Time</th>
                      <th className="p-3 border-r">Particulars</th>
                      <th className="p-3 border-r">Amount</th>
                      <th className="p-3">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 border-r font-mono">09:30 AM</td>
                      <td className="p-3 border-r font-medium">Aarav Sharma - Tuition Fee Term 1</td>
                      <td className="p-3 border-r font-semibold">₹15,000</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-semibold text-[9px] uppercase">Online UPI</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 border-r font-mono">10:15 AM</td>
                      <td className="p-3 border-r font-medium">Priya Patel - Registration Fee</td>
                      <td className="p-3 border-r font-semibold">₹1,500</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-semibold text-[9px] uppercase">Online UPI</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Today's Attendance Status</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Students Present</span>
                    <span className="font-bold text-green-500">94.2%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Teachers Present</span>
                    <span className="font-bold text-green-500">98.0%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Staff Present</span>
                    <span className="font-bold text-green-500">96.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        );
      } else if (subPath === "notifications") {
        return (
          <PageContainer>
            <PageHeader title="Notification Feed" description="All recent system-generated notifications and broadcast alerts." />
            <div className="bg-card rounded-xl border p-5 shadow-sm space-y-4 text-left">
              {[
                { title: "Fee reminder sent to 120 students", date: "Today, 10:30 AM", type: "system" },
                { title: "PTM scheduled on 25 May 2025", date: "Today, 09:15 AM", type: "sms" },
                { title: "New admission inquiry received", date: "Today, 08:45 AM", type: "crm" },
                { title: "Exam schedule published", date: "Yesterday, 04:30 PM", type: "announcement" },
              ].map((n, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-muted/20 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{n.title}</h4>
                    <span className="text-[10px] text-muted-foreground block pt-1">{n.date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] uppercase font-bold">{n.type}</span>
                </div>
              ))}
            </div>
          </PageContainer>
        );
      } else if (subPath === "pending-approvals") {
        return (
          <ApprovalPageTemplate
            title="Pending Approvals Feed"
            description="Manage pending approvals across Fee Discounts, Leave Requests, and Hostel Room Allotments."
            requests={approvals.filter(r => r.status === "pending")}
            onApprove={(id) => {
              setApprovals(approvals.map(r => r.id === id ? { ...r, status: "approved" } : r));
              toast.success("Request approved successfully.");
            }}
            onReject={(id) => {
              setApprovals(approvals.map(r => r.id === id ? { ...r, status: "rejected" } : r));
              toast.success("Request rejected successfully.");
            }}
          />
        );
      } else if (subPath === "analytics") {
        return (
          <AnalyticsPageTemplate
            title="Branch Analytics Hub"
            description="Overview of student enrollment trends, financial revenue split, and attendance density metrics."
            metrics={[
              { title: "Total Students", value: "1,240", icon: Users, color: "blue" },
              { title: "Average Attendance", value: "94.5%", icon: UserCheck, color: "green" },
              { title: "Revenue Collection", value: "₹25.6L", icon: CreditCard, color: "purple" },
              { title: "Outstanding Fees", value: "₹6.78L", icon: AlertCircle, color: "orange" },
            ]}
            charts={[
              {
                title: "Enrollment Trends (Class-wise)",
                colSpan: "col-span-2",
                component: (
                  <BarChart
                    data={[
                      { name: "Class 6", Count: 180 },
                      { name: "Class 7", Count: 220 },
                      { name: "Class 8", Count: 240 },
                      { name: "Class 9", Count: 310 },
                      { name: "Class 10", Count: 290 },
                    ]}
                    xAxisKey="name"
                    series={[{ key: "Count", name: "Students Count", color: "#6366f1" }]}
                  />
                )
              },
              {
                title: "Fee Collection Split",
                colSpan: "col-span-1",
                component: (
                  <DonutChart
                    data={[
                      { name: "Paid Fees", value: 1845200, color: "#22c55e" },
                      { name: "Outstanding Fees", value: 678550, color: "#f97316" },
                    ]}
                  />
                )
              }
            ]}
          />
        );
      }
    }

    // 2. User Management Sub-Pages
    if (moduleName === "user-management") {
      if (subPath === "roles") {
        const roleCols: ColumnDef<any>[] = [
          { accessorKey: "role", header: "Role Designation" },
          { accessorKey: "count", header: "Active Users" },
          { accessorKey: "permissions", header: "Permissions Granted" },
        ];
        const mockRoles = [
          { id: "1", role: "Academic Admin", count: 2, permissions: "All academic controls, sections, subjects" },
          { id: "2", role: "Finance Admin", count: 2, permissions: "Fee collection, pay slips, invoices, payroll" },
          { id: "3", role: "HR Admin", count: 1, permissions: "Staff directory, leave, salary structures" },
          { id: "4", role: "Library Admin", count: 2, permissions: "Catalog books, issue, fines ledger" },
          { id: "5", role: "Transport Admin", count: 2, permissions: "Routes, drivers, fuel logs" },
        ];
        return (
          <ListViewTemplate
            title="Role Management Portal"
            description="Manage campus administrative roles and permissions assignment."
            addLabel="Add Custom Role"
            data={mockRoles}
            columns={roleCols}
            searchKey="role"
            searchPlaceholder="Search roles..."
            exportFileName="greenwood_roles"
            formFields={
              <>
                <FormInput name="role" label="Role Designation" required placeholder="e.g. Hostels Assistant" />
                <FormInput name="permissions" label="Permissions Scope" required placeholder="e.g. Room bookings, wardens management" />
              </>
            }
            onAddSubmit={() => toast.success("Role created successfully!")}
            onDeleteConfirm={() => toast.success("Role deleted successfully.")}
          />
        );
      } else if (subPath === "logs") {
        const logCols: ColumnDef<any>[] = [
          { accessorKey: "time", header: "Timestamp" },
          { accessorKey: "cat", header: "Category" },
          { accessorKey: "user", header: "User" },
          { accessorKey: "action", header: "Action details" },
          { accessorKey: "ip", header: "IP Address" },
        ];
        return (
          <ListViewTemplate
            title="Login & Audit Logs"
            description="Secure tracking of branch administrative logins, updates, and configuration resets."
            data={auditLogs}
            columns={logCols}
            searchKey="user"
            searchPlaceholder="Search audit logs by user..."
            exportFileName="greenwood_audit_logs"
          />
        );
      } else if (subPath && ["academic", "finance", "hr", "library", "transport", "hostel", "teachers"].includes(subPath)) {
        const filteredEmployees = employees.filter(e => e.role === subPath || (subPath === "teachers" && e.role === "teacher"));
        return (
          <ListViewTemplate
            title={`${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Division Users`}
            description={`Registered user profiles designated to ${subPath} campus activities.`}
            addLabel={`Add ${subPath.charAt(0).toUpperCase() + subPath.slice(1)} User`}
            data={filteredEmployees}
            columns={employeeCols}
            searchKey="name"
            searchPlaceholder="Search profiles..."
            exportFileName={`greenwood_${subPath}_users`}
            formFields={
              <>
                <FormInput name="employeeNo" label="Employee ID No" required placeholder="e.g. GW-EMP-001" />
                <FormInput name="name" label="Full Staff Name" required placeholder="e.g. Ms. Shalini Gupta" />
                <FormInput name="department" label="Department" required placeholder="e.g. Academics" />
                <FormInput name="designation" label="Designation Title" required placeholder="e.g. Senior Lecturer" />
                <FormInput name="phone" label="Contact No" required placeholder="e.g. 9876543210" />
                <FormInput name="email" label="Email Address" required placeholder="e.g. teacher@school.com" />
                <FormInput name="salary" label="Monthly Base Salary (₹)" type="number" required placeholder="e.g. 75000" />
              </>
            }
            onAddSubmit={(values) => {
              const newRec = { id: `emp-${Date.now()}`, role: subPath === "teachers" ? "teacher" : subPath, ...values };
              setEmployees([newRec, ...employees]);
              toast.success("User registered successfully!");
            }}
            onDeleteConfirm={(row) => {
              setEmployees(employees.filter(e => e.id !== row.id));
              toast.success("User removed successfully.");
            }}
          />
        );
      }
    }

    // 3. Students Sub-Pages
    if (moduleName === "students") {
      if (subPath === "profiles") {
        return (
          <ListViewTemplate
            title="Student Profile Index"
            description="Click any student row to view their high-fidelity dossier file, documents, and fees history."
            data={students}
            columns={studentCols}
            searchKey="name"
            searchPlaceholder="Search profiles..."
            exportFileName="greenwood_students_profiles"
          />
        );
      } else if (subPath === "documents") {
        const docCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Student Name" },
          { accessorKey: "docType", header: "Document Category" },
          { accessorKey: "fileName", header: "File Name" },
          { accessorKey: "status", header: "Verification Status" },
        ];
        const mockDocs = [
          { id: "1", name: "Aarav Sharma", docType: "Aadhar Verification", fileName: "Aadhar_Verification.pdf", status: "Verified" },
          { id: "2", name: "Priya Patel", docType: "Transfer Certificate", fileName: "Transfer_Certificate.pdf", status: "Verified" },
          { id: "3", name: "Kabir Dev", docType: "Medical Report Certificate", fileName: "Medical_Report.pdf", status: "Pending" },
        ];
        return (
          <ListViewTemplate
            title="Student Documents Directory"
            description="Manage academic certificates, identity verification, and medical records uploads."
            addLabel="Upload New Document"
            data={mockDocs}
            columns={docCols}
            searchKey="name"
            searchPlaceholder="Search documents by student name..."
            exportFileName="greenwood_student_documents"
            formFields={
              <>
                <FormInput name="name" label="Student Name" required placeholder="e.g. Aarav Sharma" />
                <FormInput name="docType" label="Document Category" required placeholder="e.g. Aadhar card" />
                <FormInput name="fileName" label="File Upload Name" required placeholder="e.g. aadhar.pdf" />
              </>
            }
            onAddSubmit={() => toast.success("Document uploaded successfully!")}
            onDeleteConfirm={() => toast.success("Document removed.")}
          />
        );
      } else if (subPath === "categories") {
        const catCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Category Name" },
          { accessorKey: "code", header: "Category Code" },
          { accessorKey: "count", header: "Total Enrolled Students" },
        ];
        const mockCats = [
          { id: "1", name: "General Cohort", code: "GEN", count: 850 },
          { id: "2", name: "Merit Scholarship Cohort", code: "SCHOLAR", count: 120 },
          { id: "3", name: "Staff Child Benefit", code: "STAFF", count: 15 },
        ];
        return (
          <ListViewTemplate
            title="Student Category Ledger"
            description="Define and track admissions groupings, fee benefits, and student distributions."
            addLabel="Create Student Category"
            data={mockCats}
            columns={catCols}
            searchKey="name"
            searchPlaceholder="Search categories..."
            exportFileName="greenwood_student_categories"
            formFields={
              <>
                <FormInput name="name" label="Category Name" required placeholder="e.g. OBC" />
                <FormInput name="code" label="Category Code" required placeholder="e.g. OBC-C" />
              </>
            }
            onAddSubmit={() => toast.success("Category created successfully!")}
            onDeleteConfirm={() => toast.success("Category deleted.")}
          />
        );
      } else if (subPath === "guardians") {
        const guardCols: ColumnDef<any>[] = [
          { accessorKey: "studentName", header: "Student Name" },
          { accessorKey: "name", header: "Parent/Guardian Name" },
          { accessorKey: "phone", header: "Primary Phone" },
          { accessorKey: "relation", header: "Relation Status" },
        ];
        const mockGuards = [
          { id: "1", studentName: "Aarav Sharma", name: "Rajesh Sharma", phone: "9876543210", relation: "Father" },
          { id: "2", studentName: "Priya Patel", name: "Dinesh Patel", phone: "9988776655", relation: "Father" },
          { id: "3", studentName: "Kabir Dev", name: "Sanjay Dev", phone: "9123456789", relation: "Father" },
        ];
        return (
          <ListViewTemplate
            title="Parent & Guardian Directory"
            description="Access contact numbers, addresses, and emergency phone channels for class sections."
            addLabel="Add Guardian"
            data={mockGuards}
            columns={guardCols}
            searchKey="name"
            searchPlaceholder="Search parent name..."
            exportFileName="greenwood_guardians"
            formFields={
              <>
                <FormInput name="studentName" label="Student Name" required placeholder="e.g. Kabir Dev" />
                <FormInput name="name" label="Guardian Name" required placeholder="e.g. Sanjay Dev" />
                <FormInput name="phone" label="Primary Phone" required placeholder="e.g. 9123456789" />
                <FormInput name="relation" label="Relation" required placeholder="e.g. Father" />
              </>
            }
            onAddSubmit={() => toast.success("Guardian profile added!")}
            onDeleteConfirm={() => toast.success("Guardian profile removed.")}
          />
        );
      } else if (subPath === "promotions") {
        return (
          <FormWizardTemplate
            title="Student Promotion Wizard"
            description="Promote students in bulk from current sessions to the next academic level."
            steps={[
              {
                title: "Source Class Section",
                description: "Select the class sections which you want to promote.",
                fields: (
                  <>
                    <FormSelect
                      name="fromClass"
                      label="Current Class Level"
                      required
                      options={[
                        { value: "Class 9", label: "Class 9" },
                        { value: "Class 10", label: "Class 10" },
                      ]}
                    />
                    <FormSelect
                      name="fromSection"
                      label="Current Section Division"
                      required
                      options={[
                        { value: "A", label: "Section A" },
                        { value: "B", label: "Section B" },
                      ]}
                    />
                  </>
                )
              },
              {
                title: "Target Class Section",
                description: "Select the class sections students should migrate to.",
                fields: (
                  <>
                    <FormSelect
                      name="toClass"
                      label="Target Class Level"
                      required
                      options={[
                        { value: "Class 10", label: "Class 10 (Next Year)" },
                        { value: "Class 11", label: "Class 11 (Next Year)" },
                      ]}
                    />
                    <FormSelect
                      name="toSection"
                      label="Target Section Division"
                      required
                      options={[
                        { value: "A", label: "Section A" },
                        { value: "B", label: "Section B" },
                      ]}
                    />
                  </>
                )
              }
            ]}
            defaultValues={{ fromClass: "Class 9", fromSection: "A", toClass: "Class 10", toSection: "A" }}
            onSubmit={() => {
              toast.success("Bulk class promotion initiated successfully!");
              router.push(`/${role}/students`);
            }}
            onCancel={() => router.push(`/${role}/students`)}
          />
        );
      } else if (subPath === "id-cards" || subPath === "certificates") {
        return (
          <PageContainer>
            <PageHeader title="Print & Documentation Center" description="Click button to redirect to the interactive printing preview layout." />
            <div className="bg-card rounded-xl border p-8 text-center shadow-sm">
              <Printer className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-sm font-bold text-foreground">Print & Document Generation Hub</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
                Preview and print Student ID Cards, Bonafide Certificates, Admit Cards, and Fee Receipts.
              </p>
              <Button className="mt-6 text-xs font-semibold" onClick={() => router.push(`/${role}/print`)}>
                Go to Print Hub
              </Button>
            </div>
          </PageContainer>
        );
      } else if (subPath === "medical" || subPath === "discipline" || subPath === "achievements") {
        const generalCols: ColumnDef<any>[] = [
          { accessorKey: "studentName", header: "Student Name" },
          { accessorKey: "title", header: "Title/Category" },
          { accessorKey: "date", header: "Recorded Date" },
          { accessorKey: "status", header: "Status/Remarks" },
        ];
        const mockRecs = [
          { id: "1", studentName: "Aarav Sharma", title: subPath === "medical" ? "Eye checkup clear" : subPath === "discipline" ? "Late arrivals check" : "First prize Science olympiad", date: "2026-06-18", status: "Closed" },
          { id: "2", studentName: "Priya Patel", title: subPath === "medical" ? "Influenza recovery notes" : subPath === "discipline" ? "Uniform warning" : "State level athlete merit", date: "2026-06-20", status: "Active" },
        ];
        return (
          <ListViewTemplate
            title={`Student ${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Ledger`}
            description={`Log and track class student ${subPath} profiles and records.`}
            addLabel={`Add ${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Record`}
            data={mockRecs}
            columns={generalCols}
            searchKey="studentName"
            searchPlaceholder="Search records..."
            exportFileName={`greenwood_${subPath}`}
            formFields={
              <>
                <FormInput name="studentName" label="Student Name" required placeholder="e.g. Aarav Sharma" />
                <FormInput name="title" label="Record Title" required placeholder="e.g. Description" />
                <FormInput name="date" label="Date" required placeholder="e.g. YYYY-MM-DD" />
                <FormInput name="status" label="Remarks" required placeholder="e.g. Verified" />
              </>
            }
            onAddSubmit={() => toast.success("Record created successfully!")}
            onDeleteConfirm={() => toast.success("Record removed.")}
          />
        );
      } else if (subPath === "bulk-import") {
        return (
          <FormWizardTemplate
            title="Student Bulk CSV Import"
            description="Upload student files to bulk register entire batches at once."
            steps={[
              {
                title: "Upload CSV File",
                description: "Select file format validation sheet.",
                fields: (
                  <>
                    <div className="border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-xl p-8 text-center text-xs text-muted-foreground bg-muted/10 cursor-pointer">
                      <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                      <strong>Drag and drop student_records.csv here</strong>
                      <span className="block text-[10px] text-muted-foreground/60 mt-1">Accepts CSV, XLSX files up to 10MB</span>
                    </div>
                  </>
                )
              }
            ]}
            onSubmit={() => {
              toast.success("Student database sync completed! 120 new profiles uploaded.");
              router.push(`/${role}/students`);
            }}
            onCancel={() => router.push(`/${role}/students`)}
          />
        );
      }
    }

    // 4. Admission CRM Sub-Pages
    if (moduleName === "admission-crm") {
      if (subPath === "follow-ups") {
        const followCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Lead Name" },
          { accessorKey: "phone", header: "Contact Number" },
          { accessorKey: "nextFollowUp", header: "Scheduled Date" },
          { accessorKey: "notes", header: "Last Discussion Notes" },
        ];
        const mockFollows = [
          { id: "1", name: "Ananya Roy", phone: "9876543122", nextFollowUp: "2026-06-30", notes: "Interested in Science, parent requested PTM" },
          { id: "2", name: "Rohan Das", phone: "9988771144", nextFollowUp: "2026-07-02", notes: "Documents under review, will call back" },
        ];
        return (
          <ListViewTemplate
            title="CRM Follow-Ups Feed"
            description="Manage active inquiry callbacks, counselor logs, and appointment reminders."
            addLabel="Add Callback Task"
            data={mockFollows}
            columns={followCols}
            searchKey="name"
            searchPlaceholder="Search leads..."
            exportFileName="greenwood_crm_callbacks"
            formFields={
              <>
                <FormInput name="name" label="Lead Name" required placeholder="e.g. Preeti Singh" />
                <FormInput name="phone" label="Contact No" required placeholder="e.g. 9876543210" />
                <FormInput name="nextFollowUp" label="Date" required placeholder="e.g. YYYY-MM-DD" />
                <FormInput name="notes" label="Notes" required placeholder="e.g. Call back details" />
              </>
            }
            onAddSubmit={() => toast.success("Callback task scheduled!")}
            onDeleteConfirm={() => toast.success("Task cleared.")}
          />
        );
      } else if (subPath === "forms") {
        const formCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Form Template Name" },
          { accessorKey: "code", header: "Template Code" },
          { accessorKey: "status", header: "Publishing Status" },
        ];
        const mockForms = [
          { id: "1", name: "Senior Secondary Admission Form 2026", code: "ADM-SR-26", status: "Active" },
          { id: "2", name: "Primary Class General Inquiry Sheet", code: "INQ-PR-26", status: "Active" },
        ];
        return (
          <ListViewTemplate
            title="Admission Form Templates"
            description="Build and configure student admission forms, sections, and document lists."
            addLabel="Create Form Template"
            data={mockForms}
            columns={formCols}
            searchKey="name"
            searchPlaceholder="Search forms..."
            exportFileName="greenwood_crm_forms"
            formFields={
              <>
                <FormInput name="name" label="Template Name" required placeholder="e.g. Kindergarten Admission Form" />
                <FormInput name="code" label="Template Code" required placeholder="e.g. ADM-KG-26" />
              </>
            }
            onAddSubmit={() => toast.success("Admission Form published!")}
            onDeleteConfirm={() => toast.success("Template archived.")}
          />
        );
      } else if (subPath === "sources") {
        const sourceCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Lead Source Channel" },
          { accessorKey: "count", header: "Total Inquiries Received" },
          { accessorKey: "conversion", header: "Conversion Rate (%)" },
        ];
        const mockSources = [
          { id: "1", name: "Website Online Inquiries Form", count: 240, conversion: "15.4%" },
          { id: "2", name: "Local Newspaper Advertisements", count: 84, conversion: "8.2%" },
          { id: "3", name: "Direct Walk-In Registrations", count: 120, conversion: "32.0%" },
        ];
        return (
          <ListViewTemplate
            title="Lead Source Channel Analytics"
            description="Review conversion ratios and lead acquisition values across all channels."
            addLabel="Add Source Channel"
            data={mockSources}
            columns={sourceCols}
            searchKey="name"
            searchPlaceholder="Search channels..."
            exportFileName="greenwood_lead_sources"
            formFields={
              <>
                <FormInput name="name" label="Channel Name" required placeholder="e.g. Facebook Ads" />
              </>
            }
            onAddSubmit={() => toast.success("Source channel configured!")}
            onDeleteConfirm={() => toast.success("Channel removed.")}
        />
        );
      } else if (subPath === "pipeline") {
        return (
          <PageContainer>
            <PageHeader title="CRM Inquiry Pipeline" description="Kanban tracker showcasing leads progress through enrollment milestones." />
            <div className="grid gap-6 md:grid-cols-4 text-left">
              {[
                { title: "New Inquiries", count: 120, bg: "bg-blue-500/10 text-blue-500" },
                { title: "Contacted Leads", count: 85, bg: "bg-indigo-500/10 text-indigo-500" },
                { title: "Documents Verified", count: 42, bg: "bg-amber-500/10 text-amber-500" },
                { title: "Fees Paid", count: 28, bg: "bg-green-500/10 text-green-500" },
              ].map((col, idx) => (
                <div key={idx} className="bg-card rounded-xl border p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-foreground">{col.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${col.bg}`}>{col.count} Leads</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 border rounded bg-muted/20 text-xs">
                      <strong className="font-semibold block text-foreground">Ananya Roy</strong>
                      <span className="text-muted-foreground text-[10px]">Contacted today 10:30 AM</span>
                    </div>
                    <div className="p-3 border rounded bg-muted/20 text-xs">
                      <strong className="font-semibold block text-foreground">Preeti Singh</strong>
                      <span className="text-muted-foreground text-[10px]">Follow up call scheduled</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageContainer>
        );
      } else if (subPath === "verification" || subPath === "approval") {
        return (
          <ApprovalPageTemplate
            title={`Admissions CRM ${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Queue`}
            description={`Verify identity credentials and give final approvals for enrolling new students.`}
            requests={approvals.filter(r => r.type === "Admission Approval" || r.type === "Document Verification" || r.id === "app-2")}
            onApprove={() => toast.success("Admissions request verified successfully.")}
            onReject={() => toast.success("Admissions request rejected.")}
          />
        );
      } else if (subPath === "reports" || subPath === "settings") {
        if (subPath === "reports") {
          return (
            <ReportPageTemplate
              title="Admissions & CRM Conversion Reports"
              description="Acquisition funnel, monthly registrations, and counselor workloads graphs."
              data={mockFees}
              columns={feeCols}
              summaryKPIs={[
                { title: "Total Inquiries Received", value: 444, icon: Users, color: "blue" },
                { title: "Total Enrolled", value: 84, icon: GraduationCap, color: "green" },
                { title: "Conversion Ratio", value: "18.9%", icon: UserCheck, color: "purple" },
              ]}
            />
          );
        } else {
          return (
            <SettingsPageTemplate
              title="CRM Configuration Settings"
              description="Set counselors thresholds, SMS templates, and automated followup reminders."
              groups={[
                {
                  id: "1",
                  title: "Counselors Thresholds",
                  icon: Briefcase,
                  items: [
                    { id: "c-cap", label: "Maximum inquiry cap/counselor", type: "number", defaultValue: 50 },
                    { id: "c-sms", label: "Auto SMS Alerts to Leads", type: "toggle", defaultValue: true },
                  ]
                }
              ]}
              onSave={() => toast.success("CRM Settings update saved!")}
            />
          );
        }
      }
    }

    // 5. Attendance Sub-Pages
    if (moduleName === "attendance") {
      if (subPath === "teacher" || subPath === "staff") {
        const attCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Employee Name" },
          { accessorKey: "designation", header: "Designation" },
          { accessorKey: "department", header: "Department" },
          { accessorKey: "status", header: "Today's Status" },
        ];
        const mockAtt = employees.filter(e => subPath === "teacher" ? e.role === "teacher" : e.role !== "teacher").map(e => ({
          ...e,
          status: "Present"
        }));
        return (
          <ListViewTemplate
            title={`${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Attendance Tracker`}
            description={`Review checklist and daily mark checkout statuses for campus ${subPath}.`}
            addLabel="Mark Bulk Present"
            data={mockAtt}
            columns={attCols}
            searchKey="name"
            searchPlaceholder="Search staff by name..."
            exportFileName={`greenwood_${subPath}_attendance`}
            formFields={
              <>
                <FormInput name="name" label="Employee Name" required placeholder="e.g. Shalini Gupta" />
                <FormSelect
                  name="status"
                  label="Attendance Status"
                  required
                  options={[
                    { value: "Present", label: "Present" },
                    { value: "Absent", label: "Absent" },
                    { value: "Late Arrival", label: "Late Arrival" },
                  ]}
                />
              </>
            }
            onAddSubmit={() => toast.success("Attendance updated successfully!")}
            onDeleteConfirm={() => toast.success("Record cleared.")}
          />
        );
      } else if (subPath === "reports" || subPath === "leave-reports" || subPath === "monthly") {
        return (
          <ReportPageTemplate
            title={`Attendance & ${subPath === "leave-reports" ? "Leave" : "Monthly"} Aggregates`}
            description="Analyze branch daily checkin trends, student absent logs, and monthly reports."
            data={mockStudents.map(s => ({ id: s.id, name: s.name, class: s.class, rate: "94.5%" }))}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class Cohort" },
              { accessorKey: "rate", header: "Attendance Rate" },
            ]}
            summaryKPIs={[
              { title: "Average Student Rate", value: "94.2%", icon: UserCheck, color: "green" },
              { title: "Total Leaves Pending", value: "3 Leaves", icon: Clock, color: "orange" },
            ]}
          />
        );
      } else if (subPath === "holiday-calendar") {
        return (
          <CalendarPageTemplate
            title="School Holiday & Event Calendar"
            description="Review academic terms, examinations, parent meetings, and public holiday logs."
            events={[
              { id: "1", title: "PTM Schedule May 2026", category: "event", date: "2026-06-28", time: "09:00 AM", location: "Academy Campus" },
              { id: "2", title: "Summer Vacation starts", category: "holiday", date: "2026-07-01", time: "All Day", location: "N/A" },
              { id: "3", title: "Semester Final Exams 2026", category: "exam", date: "2026-07-02", time: "09:00 AM", location: "Exam Hall A" },
            ]}
          />
        );
      } else if (subPath === "settings") {
        return (
          <SettingsPageTemplate
            title="Attendance Policy Configurations"
            description="Define late arrival thresholds, half-day leaves parameters, and notifications dispatch timings."
            groups={[
              {
                id: "1",
                title: "Late Arrival Parameters",
                icon: SettingsIcon,
                items: [
                  { id: "lat", label: "Late cutoff time (Minutes)", type: "number", defaultValue: 15 },
                  { id: "not", label: "Dispatch SMS to parents instantly on absence", type: "toggle", defaultValue: true },
                ]
              }
            ]}
            onSave={() => toast.success("Attendance policies saved!")}
          />
        );
      }
    }

    // 6. Communications Sub-Pages
    if (moduleName === "communications") {
      if (!subPath || subPath === "noticeboard") {
        return (
          <CommunicationPageTemplate
            title="Campus Announcements Notice Board"
            description="Compose notice bulletins, publish newsletters, and broadcast administrative circulars."
            notices={notices}
          />
        );
      } else if (subPath === "sms" || subPath === "email" || subPath === "whatsapp" || subPath === "push" || subPath === "parent" || subPath === "teacher") {
        return (
          <FormWizardTemplate
            title={`Compose ${subPath.toUpperCase()} Broadcast Alert`}
            description={`Send customized message content directly to parent or teacher devices.`}
            steps={[
              {
                title: "Audience Target",
                description: "Select target recipient batches.",
                fields: (
                  <>
                    <FormSelect
                      name="target"
                      label="Audience Range"
                      required
                      options={[
                        { value: "parents", label: "All Parents" },
                        { value: "teachers", label: "All Teachers" },
                        { value: "staff", label: "All Employees" },
                      ]}
                    />
                    <FormInput name="title" label="Announcement Title" required placeholder="e.g. Emergency Campus Notice" />
                  </>
                )
              },
              {
                title: "Message Body",
                description: "Write content to be dispatched.",
                fields: (
                  <>
                    <FormInput name="content" label="Message Text" required placeholder="Type your text content here..." />
                    {subPath === "email" && <FormInput name="subject" label="Email Subject Line" required placeholder="e.g. Quarterly PTM circular" />}
                  </>
                )
              }
            ]}
            onSubmit={(values) => {
              const newNotice = {
                id: `nt-${Date.now()}`,
                title: values.title,
                sender: "Branch Admin Desk",
                date: new Date().toISOString().split("T")[0],
                type: subPath === "sms" || subPath === "email" || subPath === "whatsapp" ? "sms" : "announcement",
                audience: values.target,
                content: values.content
              } as any;
              setNotices([newNotice, ...notices]);
              toast.success(`${subPath.toUpperCase()} Broadcast dispatch queued successfully!`);
              router.push(`/${role}/communications`);
            }}
            onCancel={() => router.push(`/${role}/communications`)}
          />
        );
      } else if (subPath === "templates") {
        const templateCols: ColumnDef<any>[] = [
          { accessorKey: "name", header: "Template Name" },
          { accessorKey: "type", header: "Alert Channel" },
          { accessorKey: "body", header: "Message Layout" },
        ];
        const mockTemplates = [
          { id: "1", name: "Fee reminder circular", type: "SMS", body: "Dear Parent, fee payment due of ₹{amount} for term 2 is pending. Please pay by {date}." },
          { id: "2", name: "Student absence alert", type: "WhatsApp", body: "Hello, {name} is marked Absent for class today {date}." },
        ];
        return (
          <ListViewTemplate
            title="Message Template Designs"
            description="Manage premade layout alerts for automated gateway dispatch."
            addLabel="Add Custom Template"
            data={mockTemplates}
            columns={templateCols}
            searchKey="name"
            searchPlaceholder="Search templates..."
            exportFileName="greenwood_templates"
            formFields={
              <>
                <FormInput name="name" label="Template Name" required placeholder="e.g. Holiday Announcement" />
                <FormInput name="body" label="Message Text" required placeholder="e.g. Campus closed on {date} due to PTM" />
              </>
            }
            onAddSubmit={() => toast.success("Template created successfully!")}
            onDeleteConfirm={() => toast.success("Template archived.")}
          />
        );
      } else if (subPath === "logs") {
        const commCols: ColumnDef<any>[] = [
          { accessorKey: "date", header: "Date" },
          { accessorKey: "recipient", header: "Audience Target" },
          { accessorKey: "type", header: "Broadcast Type" },
          { accessorKey: "title", header: "Alert Topic" },
        ];
        const mockLogs = notices.map(n => ({
          id: n.id,
          date: n.date,
          recipient: n.audience,
          type: n.type.toUpperCase(),
          title: n.title,
        }));
        return (
          <ListViewTemplate
            title="Communication Logs Registry"
            description="Chronological log history of all circular broadcasts, SMS notices, and emails."
            data={mockLogs}
            columns={commCols}
            searchKey="title"
            searchPlaceholder="Search logs..."
            exportFileName="greenwood_communication_logs"
          />
        );
      }
    }

    // 7. Approvals Sub-Pages
    if (moduleName === "approvals") {
      const filteredApprovals = subPath && subPath !== "pending"
        ? approvals.filter(a => a.type.toLowerCase().includes(subPath.slice(0, 4)))
        : approvals;
      return (
        <ApprovalPageTemplate
          title={`${subPath ? subPath.charAt(0).toUpperCase() + subPath.slice(1) : "System"} Requests Feed`}
          description="Verify document checklists, discount percentages, and process administrative approvals."
          requests={filteredApprovals}
          onApprove={(id) => {
            setApprovals(approvals.map(a => a.id === id ? { ...a, status: "approved" } : a));
            toast.success("Request approved successfully.");
          }}
          onReject={(id) => {
            setApprovals(approvals.map(a => a.id === id ? { ...a, status: "rejected" } : a));
            toast.success("Request rejected successfully.");
          }}
        />
      );
    }

    // 8. Settings Sub-Pages
    if (moduleName === "settings") {
      if (subPath && subPath !== "profile") {
        let groupFields: any[] = [
          { id: "1", label: "Default parameter config", type: "text" as const, defaultValue: "Greenwood System" },
          { id: "2", label: "Enable security logs monitoring", type: "toggle" as const, defaultValue: true },
        ];
        if (subPath === "academic") {
          groupFields = [
            { id: "academic-year", label: "Current Session Year", type: "text" as const, defaultValue: "2026 - 2027" },
            { id: "grade-scale", label: "Grading Scale Metric", type: "select" as const, defaultValue: "CBSE 10-point scale", options: [{ label: "CBSE 10-point scale", value: "CBSE 10-point scale" }] },
          ];
        } else if (subPath === "fee") {
          groupFields = [
            { id: "due-grace", label: "Fee Due Grace Period (Days)", type: "number" as const, defaultValue: 5 },
            { id: "penalty-rate", label: "Monthly Late Penalty Interest (%)", type: "number" as const, defaultValue: 2.5 },
          ];
        } else if (subPath === "integrations") {
          groupFields = [
            { id: "whatsapp-node", label: "WhatsApp Gateway Integration Link", type: "text" as const, defaultValue: "https://api.twilio-whatsapp.node" },
            { id: "razorpay-creds", label: "Razorpay Production Merchant ID", type: "text" as const, defaultValue: "rzp_live_5849102" },
          ];
        }
        return (
          <SettingsPageTemplate
            title={`${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Configurations`}
            description={`Update metadata rules, policies, and parameters for Greenwood ${subPath} operations.`}
            groups={[
              {
                id: subPath,
                title: `${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Settings Group`,
                icon: SettingsIcon,
                items: groupFields,
              }
            ]}
            onSave={() => toast.success("Configuration modifications saved successfully!")}
          />
        );
      }
    }

    // 9. Reports Sub-Pages
    if (moduleName === "reports") {
      if (subPath) {
        return (
          <ReportPageTemplate
            title={`${subPath.charAt(0).toUpperCase() + subPath.slice(1)} Analytics Report`}
            description={`Interactive aggregates compiler and PDF utility for campus ${subPath} transactions.`}
            data={mockFees}
            columns={feeCols}
            summaryKPIs={[
              { title: "Aggregated Count", value: "1,240 records", icon: FileText, color: "blue" },
              { title: "Active Status", value: "Operational", icon: UserCheck, color: "green" },
            ]}
          />
        );
      }
    }
  }

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
  } else if (role === "academic") {
    const subPath = slug[1];

    // 1. Dashboard sub-pages
    if (moduleName === "dashboard") {
      if (subPath === "analytics" || subPath === "attendance-analytics" || subPath === "exam-analytics") {
        return (
          <PageContainer>
            <PageHeader title={`${getModuleName(moduleName)} - ${subPath === "analytics" ? "Academic Analytics" : subPath === "attendance-analytics" ? "Attendance Analytics" : "Exam Analytics"}`} description="Detailed graphical analytics reports." />
            <div className="grid gap-6 md:grid-cols-2 text-left">
              <ChartContainer title="Historical Trend Overview" subtitle="Comparing performance indices across cohorts">
                <LineChart
                  data={[
                    { month: "Jan", index: 78 },
                    { month: "Feb", index: 82 },
                    { month: "Mar", index: 85 },
                    { month: "Apr", index: 89 },
                    { month: "May", index: 91 },
                  ]}
                  xAxisKey="month"
                  series={[{ key: "index", name: "Performance Index (%)", color: "#3b82f6" }]}
                />
              </ChartContainer>
              <ChartContainer title="Cohort Distribution Comparison" subtitle="Detailed distribution data by class level">
                <BarChart
                  data={[
                    { level: "Primary", Rate: 92 },
                    { level: "Middle", Rate: 88 },
                    { level: "Secondary", Rate: 94 },
                  ]}
                  xAxisKey="level"
                  series={[{ key: "Rate", name: "Average Rate (%)", color: "#10b981" }]}
                />
              </ChartContainer>
            </div>
          </PageContainer>
        );
      } else if (subPath === "notifications") {
        return (
          <ListViewTemplate
            title="Notice Board & Notifications"
            description="System notifications and academic alerts."
            data={mockNotices || []}
            columns={[
              { accessorKey: "title", header: "Notification Title" },
              { accessorKey: "date", header: "Date Published" },
              { accessorKey: "audience", header: "Audience Target" },
              { accessorKey: "status", header: "Status" },
            ]}
            searchKey="title"
          />
        );
      }
    }

    // 2. Classes & Sections
    if (moduleName === "classes-sections") {
      const classesData = [
        { id: "1", className: "Class 10 - A", code: "C10A", capacity: 40, occupied: 38, teacher: "Ms. Shalini Gupta" },
        { id: "2", className: "Class 10 - B", code: "C10B", capacity: 40, occupied: 36, teacher: "Mr. Rajeev Kumar" },
        { id: "3", className: "Class 9 - A", code: "C9A", capacity: 45, occupied: 42, teacher: "Mrs. Anjali Sen" },
        { id: "4", className: "Class 8 - A", code: "C8A", capacity: 45, occupied: 40, teacher: "Mr. Vikram Joshi" },
      ];
      if (!subPath) {
        return (
          <ListViewTemplate
            title="Classes Directory"
            description="Manage academic classes, assign class teachers, and monitor capacities."
            addLabel="Create Class"
            data={classesData}
            columns={[
              { accessorKey: "className", header: "Class" },
              { accessorKey: "code", header: "Class Code" },
              { accessorKey: "capacity", header: "Max Capacity" },
              { accessorKey: "occupied", header: "Occupied Seats" },
              { accessorKey: "teacher", header: "Class Teacher" },
            ]}
            searchKey="className"
          />
        );
      }
      if (subPath === "sections") {
        return (
          <ListViewTemplate
            title="Section Allocations"
            description="Manage section partitions within grades."
            data={classesData}
            columns={[
              { accessorKey: "className", header: "Section Code" },
              { accessorKey: "teacher", header: "Assigned Supervisor" },
              { accessorKey: "occupied", header: "Students Count" },
            ]}
            searchKey="className"
          />
        );
      }
      if (subPath === "assign-teacher") {
        return (
          <ListViewTemplate
            title="Assign Class Teacher"
            description="Link master educators to class cohorts."
            data={classesData}
            columns={[
              { accessorKey: "className", header: "Class / Section" },
              { accessorKey: "teacher", header: "Primary Educator" },
            ]}
            searchKey="className"
          />
        );
      }
      if (subPath === "capacity") {
        return (
          <ListViewTemplate
            title="Class Capacity Report"
            description="Monitor student thresholds and available seats."
            data={classesData.map(c => ({ ...c, available: c.capacity - c.occupied }))}
            columns={[
              { accessorKey: "className", header: "Class" },
              { accessorKey: "capacity", header: "Total Capacity" },
              { accessorKey: "occupied", header: "Filled Seats" },
              { accessorKey: "available", header: "Available Seats" },
            ]}
            searchKey="className"
          />
        );
      }
      if (subPath === "overview" || subPath === "reports") {
        return (
          <PageContainer>
            <PageHeader title="Classes & Sections Overview" description="Summary statistics and demographic distributions." />
            <div className="grid gap-6 md:grid-cols-2 text-left">
              <ChartContainer title="Enrollment Density" subtitle="Comparing filled vs available capacities">
                <BarChart
                  data={classesData.map(c => ({ name: c.className, Filled: c.occupied, Capacity: c.capacity }))}
                  xAxisKey="name"
                  series={[
                    { key: "Filled", name: "Filled Seats", color: "#3b82f6" },
                    { key: "Capacity", name: "Total Capacity", color: "#e2e8f0" }
                  ]}
                />
              </ChartContainer>
            </div>
          </PageContainer>
        );
      }
    }

    // 3. Subjects
    if (moduleName === "subjects") {
      const subjectsData = [
        { id: "1", name: "Mathematics", code: "MATH-101", credits: 4, type: "Core Subject", teacher: "Ms. Shalini Gupta" },
        { id: "2", name: "General Science", code: "SCI-102", credits: 4, type: "Core Subject", teacher: "Mr. Rajeev Kumar" },
        { id: "3", name: "English Literature", code: "ENG-103", credits: 3, type: "Language", teacher: "Mrs. Anjali Sen" },
        { id: "4", name: "Social Studies", code: "SST-104", credits: 3, type: "Humanities", teacher: "Mr. Vikram Joshi" },
      ];
      if (!subPath) {
        return (
          <ListViewTemplate
            title="Subjects Catalog"
            description="Manage course catalogs, mapping allocations, and credit scales."
            addLabel="Create Subject"
            data={subjectsData}
            columns={[
              { accessorKey: "name", header: "Subject Name" },
              { accessorKey: "code", header: "Code" },
              { accessorKey: "credits", header: "Credits" },
              { accessorKey: "type", header: "Course Type" },
              { accessorKey: "teacher", header: "Assigned Faculty" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "allocations" || subPath === "mapping" || subPath === "teachers") {
        return (
          <ListViewTemplate
            title="Faculty allocations & Mapping"
            description="Assign courses and subject files to teachers."
            data={subjectsData}
            columns={[
              { accessorKey: "name", header: "Course" },
              { accessorKey: "teacher", header: "Assigned Faculty Educator" },
              { accessorKey: "code", header: "Course Code" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "credits") {
        return (
          <ListViewTemplate
            title="Subject Credit Scale"
            description="View and verify academic units."
            data={subjectsData}
            columns={[
              { accessorKey: "name", header: "Course Title" },
              { accessorKey: "credits", header: "Credits Allocated" },
              { accessorKey: "type", header: "Category" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "reports" || subPath === "settings") {
        return (
          <PageContainer>
            <PageHeader title="Subjects Analytics" description="Credit allocations and subject-wise averages." />
            <div className="grid gap-6 md:grid-cols-2 text-left">
              <ChartContainer title="Subject Distribution by Credits" subtitle="Credits allocation graph">
                <BarChart
                  data={subjectsData}
                  xAxisKey="name"
                  series={[{ key: "credits", name: "Credits", color: "#10b981" }]}
                />
              </ChartContainer>
            </div>
          </PageContainer>
        );
      }
    }

    // 4. Timetable
    if (moduleName === "timetable") {
      const timetableData = [
        { id: "1", class: "Class 10 - A", time: "09:00 AM - 10:00 AM", subject: "Mathematics", teacher: "Ms. Shalini Gupta", room: "Room 101" },
        { id: "2", class: "Class 10 - A", time: "10:00 AM - 11:00 AM", subject: "General Science", teacher: "Mr. Rajeev Kumar", room: "Room 101" },
        { id: "3", class: "Class 10 - B", time: "09:00 AM - 10:00 AM", subject: "English Literature", teacher: "Mrs. Anjali Sen", room: "Room 102" },
        { id: "4", class: "Class 10 - B", time: "10:00 AM - 11:00 AM", subject: "Social Studies", teacher: "Mr. Vikram Joshi", room: "Room 102" },
      ];
      if (!subPath || subPath === "class" || subPath === "teacher") {
        return (
          <ListViewTemplate
            title="Academic Master Timetable"
            description="Review class division slots and faculty allocations."
            data={timetableData}
            columns={[
              { accessorKey: "class", header: "Class" },
              { accessorKey: "time", header: "Time Slot" },
              { accessorKey: "subject", header: "Subject Course" },
              { accessorKey: "teacher", header: "Educator" },
              { accessorKey: "room", header: "Allocated Room" },
            ]}
            searchKey="subject"
          />
        );
      }
      if (subPath === "rooms" || subPath === "periods") {
        return (
          <ListViewTemplate
            title="Room Allocation Ledger"
            description="Manage physical rooms and period structures."
            data={timetableData}
            columns={[
              { accessorKey: "room", header: "Room Designation" },
              { accessorKey: "class", header: "Assigned Grade Cohort" },
              { accessorKey: "time", header: "Period Slot" },
            ]}
            searchKey="room"
          />
        );
      }
      if (subPath === "substitutes") {
        return (
          <ListViewTemplate
            title="Substitute Teacher Allocations"
            description="Assign stand-in teachers for absent faculty members."
            data={timetableData.map(t => ({ ...t, substitute: "Ms. Priyanka Sen", reason: "Casual Leave" }))}
            columns={[
              { accessorKey: "teacher", header: "Absent Faculty" },
              { accessorKey: "substitute", header: "Substitute assigned" },
              { accessorKey: "subject", header: "Subject Class" },
              { accessorKey: "time", header: "Time Slot" },
              { accessorKey: "reason", header: "Leave Context" },
            ]}
            searchKey="teacher"
          />
        );
      }
      if (subPath === "generator" || subPath === "exams" || subPath === "reports") {
        return (
          <PageContainer>
            <PageHeader title="Timetable Generation Tool" description="Initiate class allocation algorithms or export schedules." />
            <div className="rounded-xl border border-border bg-card p-6 text-left max-w-xl space-y-4">
              <h3 className="text-sm font-bold text-foreground">Auto-Generate Timetable Configuration</h3>
              <p className="text-xs text-muted-foreground">Select criteria to trigger the automated scheduler agent.</p>
              <div className="grid gap-4 text-xs">
                <div>
                  <label className="font-bold text-muted-foreground mb-1 block">Target Academic Session</label>
                  <input type="text" className="w-full bg-muted border p-2 rounded-lg" defaultValue="2026 - 2027 Session" readOnly />
                </div>
                <div>
                  <label className="font-bold text-muted-foreground mb-1 block">Timetable Period Intervals</label>
                  <select className="w-full bg-muted border p-2 rounded-lg"><option>45 Minutes Slots</option><option>60 Minutes Slots</option></select>
                </div>
                <button onClick={() => alert("Timetable auto-generator execution finished successfully!")} className="w-full bg-primary text-white py-2 rounded-lg font-bold">Generate Timetable</button>
              </div>
            </div>
          </PageContainer>
        );
      }
    }

    // 5. Academic Calendar
    if (moduleName === "academic-calendar") {
      const calendarData = [
        { id: "1", date: "2026-07-02", event: "Semester Final Exams Start", type: "Examination", status: "Active" },
        { id: "2", date: "2026-07-10", event: "Parent Teacher Meeting (PTM)", type: "Meeting", status: "Scheduled" },
        { id: "3", date: "2026-08-15", event: "Independence Day Holiday", type: "Holiday", status: "Scheduled" },
        { id: "4", date: "2026-09-05", event: "Teachers' Day Celebrations", type: "Special Event", status: "Planned" },
      ];
      if (!subPath || subPath === "events" || subPath === "holidays" || subPath === "exams") {
        return (
          <ListViewTemplate
            title="School Calendar Planner"
            description="View official academic terms, holidays, and event schedules."
            data={calendarData}
            columns={[
              { accessorKey: "date", header: "Event Date" },
              { accessorKey: "event", header: "Particular Title" },
              { accessorKey: "type", header: "Category Type" },
              { accessorKey: "status", header: "Status" },
            ]}
            searchKey="event"
          />
        );
      }
      if (subPath === "ptm" || subPath === "special" || subPath === "reports") {
        return (
          <ListViewTemplate
            title="Special Events & PTM Planner"
            description="Manage specific PTM meetings or co-curricular event schedules."
            data={calendarData.filter(c => c.type !== "Holiday")}
            columns={[
              { accessorKey: "date", header: "Date" },
              { accessorKey: "event", header: "Meeting / Event Name" },
              { accessorKey: "type", header: "Category" },
            ]}
            searchKey="event"
          />
        );
      }
    }

    // 6. Syllabus Management
    if (moduleName === "syllabus") {
      const syllabusData = [
        { id: "1", subject: "Mathematics", grade: "Class 10", completion: 85, chapters: "12/15 Completed", teacher: "Ms. Shalini Gupta" },
        { id: "2", subject: "General Science", grade: "Class 10", completion: 78, chapters: "10/13 Completed", teacher: "Mr. Rajeev Kumar" },
        { id: "3", subject: "English Language", grade: "Class 10", completion: 92, chapters: "11/12 Completed", teacher: "Mrs. Anjali Sen" },
        { id: "4", subject: "Social Studies", grade: "Class 9", completion: 65, chapters: "8/12 Completed", teacher: "Mr. Vikram Joshi" },
      ];
      if (!subPath || subPath === "subject" || subPath === "tracking") {
        return (
          <ListViewTemplate
            title="Syllabus Progress Tracker"
            description="Track chapter distributions and syllabus completion rates across grades."
            data={syllabusData}
            columns={[
              { accessorKey: "subject", header: "Subject" },
              { accessorKey: "grade", header: "Grade Cohort" },
              {
                accessorKey: "completion",
                header: "Completion rate",
                cell: ({ row }) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-24 bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: `${row.original.completion}%` }} />
                    </div>
                    <span className="font-bold">{row.original.completion}%</span>
                  </div>
                ),
              },
              { accessorKey: "chapters", header: "Chapters Covered" },
              { accessorKey: "teacher", header: "Assigned Faculty" },
            ]}
            searchKey="subject"
          />
        );
      }
      if (subPath === "chapters" || subPath === "lessons" || subPath === "teachers" || subPath === "classes" || subPath === "subjects" || subPath === "reports") {
        return (
          <ListViewTemplate
            title="Chapter Management & Progress Details"
            description="Monitor lesson plan outlines and detailed class coverage charts."
            data={syllabusData}
            columns={[
              { accessorKey: "subject", header: "Subject Course" },
              { accessorKey: "teacher", header: "Class Faculty" },
              { accessorKey: "chapters", header: "Lesson coverage status" },
            ]}
            searchKey="subject"
          />
        );
      }
    }

    // 7. Attendance Monitoring
    if (moduleName === "attendance") {
      const attendanceSummary = [
        { id: "1", date: "29 Jun 2026", class: "Class 10 - A", present: 38, absent: 2, percent: 95.0, supervisor: "Ms. Shalini Gupta" },
        { id: "2", date: "29 Jun 2026", class: "Class 10 - B", present: 36, absent: 4, percent: 90.0, supervisor: "Mr. Rajeev Kumar" },
        { id: "3", date: "29 Jun 2026", class: "Class 9 - A", present: 41, absent: 1, percent: 97.6, supervisor: "Mrs. Anjali Sen" },
        { id: "4", date: "29 Jun 2026", class: "Class 8 - A", present: 40, absent: 0, percent: 100.0, supervisor: "Mr. Vikram Joshi" },
      ];
      if (!subPath || subPath === "class" || subPath === "subject" || subPath === "teacher") {
        return (
          <ListViewTemplate
            title="Student Attendance Summary"
            description="Log daily check-ins, record subject logs, and track staff attendance."
            data={attendanceSummary}
            columns={[
              { accessorKey: "date", header: "Date" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "present", header: "Present count" },
              { accessorKey: "absent", header: "Absent count" },
              { accessorKey: "percent", header: "Attendance Rate (%)" },
              { accessorKey: "supervisor", header: "Supervisor Teacher" },
            ]}
            searchKey="class"
          />
        );
      }
      if (subPath === "defaulters") {
        return (
          <ListViewTemplate
            title="Attendance Defaulters List"
            description="Students falling below the mandatory 75% attendance threshold."
            data={[
              { id: "1", name: "Rahul Verma", class: "Class 10 - A", rate: 68.4, missedDays: 12, parentContact: "+91 98765 00123" },
              { id: "2", name: "Sneha Gupta", class: "Class 9 - A", rate: 71.2, missedDays: 10, parentContact: "+91 98765 00456" },
            ]}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "rate", header: "Attendance Rate" },
              { accessorKey: "missedDays", header: "Missed Days" },
              { accessorKey: "parentContact", header: "Parent Contact" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "analytics" || subPath === "reports" || subPath === "trends" || subPath === "monthly") {
        return (
          <PageContainer>
            <PageHeader title="Attendance Analytics Console" description="Detailed graphical trends and monthly reports." />
            <div className="grid gap-6 md:grid-cols-2 text-left">
              <ChartContainer title="Weekly Presence Density" subtitle="School-wide weekly average charts">
                <LineChart
                  data={[
                    { week: "Week 1", Rate: 94 },
                    { week: "Week 2", Rate: 92 },
                    { week: "Week 3", Rate: 95 },
                    { week: "Week 4", Rate: 91 },
                  ]}
                  xAxisKey="week"
                  series={[{ key: "Rate", name: "Attendance Rate (%)", color: "#10b981" }]}
                />
              </ChartContainer>
            </div>
          </PageContainer>
        );
      }
    }

    // 8. Examinations
    if (moduleName === "examinations") {
      const examSchedule = [
        { id: "1", name: "Mathematics Term 1 Final", type: "Written Paper", date: "2026-07-02", time: "09:00 AM - 12:00 PM", status: "Scheduled" },
        { id: "2", name: "General Science Practical", type: "Practical Lab", date: "2026-07-04", time: "10:00 AM - 01:00 PM", status: "Scheduled" },
        { id: "3", name: "English Oral Assessment", type: "Oral Speaking", date: "2026-07-06", time: "09:00 AM - 11:30 AM", status: "Scheduled" },
        { id: "4", name: "Computer Applications Viva", type: "Viva-Voce Lab", date: "2026-07-08", time: "01:00 PM - 03:00 PM", status: "Scheduled" },
      ];
      if (!subPath || subPath === "types" || subPath === "schedule" || subPath === "centers" || subPath === "halls") {
        return (
          <ListViewTemplate
            title="Examinations Schedules & Halls"
            description="Configure exam templates, set up seat arrangements, and check schedules."
            data={examSchedule}
            columns={[
              { accessorKey: "name", header: "Exam Name" },
              { accessorKey: "type", header: "Evaluation Mode" },
              { accessorKey: "date", header: "Date" },
              { accessorKey: "time", header: "Time duration" },
              { accessorKey: "status", header: "Status" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "questions" || subPath === "instructions" || subPath === "invigilators") {
        return (
          <ListViewTemplate
            title="Question Bank & Invigilator Allocations"
            description="Manage official test questions and map staff members to supervisors."
            data={examSchedule}
            columns={[
              { accessorKey: "name", header: "Exam Subject File" },
              { accessorKey: "type", header: "Type" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "marks" || subPath === "practical") {
        return (
          <ListViewTemplate
            title="Marks Entry Spreadsheet"
            description="Enter and verify student marks for examinations."
            data={[
              { id: "1", name: "Aarav Sharma", rollNo: "10", math: 95, science: 88, english: 76, status: "Submitted" },
              { id: "2", name: "Rahul Verma", rollNo: "23", math: 74, science: 65, english: 70, status: "Pending" },
            ]}
            columns={[
              { accessorKey: "name", header: "Student Profile" },
              { accessorKey: "rollNo", header: "Roll No" },
              { accessorKey: "math", header: "Mathematics Marks (100)" },
              { accessorKey: "science", header: "Science Marks (100)" },
              { accessorKey: "english", header: "English Marks (100)" },
              { accessorKey: "status", header: "Entry Status" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "analytics" || subPath === "grades" || subPath === "reports" || subPath === "results") {
        return (
          <PageContainer>
            <PageHeader title="Examinations Grading & Processing" description="Process grades or compile report templates." />
            <div className="rounded-xl border border-border bg-card p-6 text-left max-w-md space-y-4">
              <h3 className="text-sm font-bold text-foreground">Trigger Grade Sheet Compilation</h3>
              <p className="text-xs text-muted-foreground">Select exam term to execute final report card generation.</p>
              <div className="space-y-4 text-xs">
                <select className="w-full bg-muted border p-2 rounded-lg"><option>Term 1 Examinations 2026</option></select>
                <button onClick={() => alert("Report cards processed successfully!")} className="w-full bg-primary text-white py-2 rounded-lg font-bold">Process & Publish Results</button>
              </div>
            </div>
          </PageContainer>
        );
      }
    }

    // 9. Result Monitoring
    if (moduleName === "results") {
      const resultsSummary = [
        { id: "1", class: "Class 10 - A", totalStudents: 38, passed: 36, failed: 2, passRate: 94.7, status: "Pending Review" },
        { id: "2", class: "Class 10 - B", totalStudents: 36, passed: 34, failed: 2, passRate: 94.4, status: "Approved" },
        { id: "3", class: "Class 9 - A", totalStudents: 42, passed: 41, failed: 1, passRate: 97.6, status: "Approved" },
      ];
      if (!subPath || subPath === "publish" || subPath === "classes") {
        return (
          <ListViewTemplate
            title="Result Verification Ledger"
            description="Verify class performance sheets and trigger publications."
            data={resultsSummary}
            columns={[
              { accessorKey: "class", header: "Class" },
              { accessorKey: "totalStudents", header: "Total Students" },
              { accessorKey: "passed", header: "Passed" },
              { accessorKey: "failed", header: "Failed" },
              { accessorKey: "passRate", header: "Pass Rate (%)" },
              { accessorKey: "status", header: "Verification Status" },
            ]}
            searchKey="class"
          />
        );
      }
      if (subPath === "students" || subPath === "subjects" || subPath === "ranks" || subPath === "top" || subPath === "failures") {
        return (
          <ListViewTemplate
            title="Student Scorecards Directory"
            description="Browse grades, rank lists, and subject averages."
            data={[
              { id: "1", name: "Aarav Sharma", class: "Class 10 - A", gpa: 9.4, rank: 1, remarks: "Outstanding" },
              { id: "2", name: "Priya Patel", class: "Class 10 - A", gpa: 9.1, rank: 2, remarks: "Excellent" },
              { id: "3", name: "Rohan Das", class: "Class 10 - A", gpa: 8.7, rank: 3, remarks: "Very Good" },
            ]}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class Section" },
              { accessorKey: "gpa", header: "Academic GPA Score" },
              { accessorKey: "rank", header: "Class Rank" },
              { accessorKey: "remarks", header: "Remarks" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "report-cards") {
        return (
          <PageContainer>
            <PageHeader title="Student Report Card Compilation" description="Draft, inspect, print, and archive grade sheets." />
            <div className="grid gap-6 lg:grid-cols-4 text-left">
              <div className="bg-card rounded-xl border p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Print Preview Selector</h4>
                <p className="text-xs text-muted-foreground">Select a report layout format to preview dynamically.</p>
                <div className="space-y-2">
                  <button className="w-full bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-between">
                    <span>Standard Report Card (A4)</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-3 bg-white text-black rounded-xl border p-8 shadow-sm flex items-center justify-center overflow-auto">
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
              </div>
            </div>
          </PageContainer>
        );
      }
    }

    // 10. Teachers
    if (moduleName === "teachers") {
      const teachersData = [
        { id: "1", name: "Ms. Shalini Gupta", designation: "Senior Mathematics Lecturer", department: "Science", workload: "18 Hours/Week", attendance: "98.2%" },
        { id: "2", name: "Mr. Rajeev Kumar", designation: "Senior Science Lecturer", department: "Science", workload: "16 Hours/Week", attendance: "96.4%" },
        { id: "3", name: "Mrs. Anjali Sen", designation: "English Faculty Coordinator", department: "Languages", workload: "15 Hours/Week", attendance: "95.0%" },
        { id: "4", name: "Mr. Vikram Joshi", designation: "Social Studies Educator", department: "Humanities", workload: "16 Hours/Week", attendance: "97.1%" },
      ];
      if (!subPath) {
        return (
          <ListViewTemplate
            title="Faculty Directory"
            description="Manage teacher assignments, attendance logs, and workloads."
            data={teachersData}
            columns={[
              { accessorKey: "name", header: "Teacher Name" },
              { accessorKey: "designation", header: "Designation" },
              { accessorKey: "department", header: "Department" },
              { accessorKey: "workload", header: "Weekly Workload" },
              { accessorKey: "attendance", header: "Attendance Rate" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "allocations" || subPath === "workloads" || subPath === "timetable" || subPath === "attendance") {
        return (
          <ListViewTemplate
            title="Teacher allocations & Duty Logs"
            description="Detailed timetable details and weekly teaching schedules."
            data={teachersData}
            columns={[
              { accessorKey: "name", header: "Educator" },
              { accessorKey: "designation", header: "Designation" },
              { accessorKey: "workload", header: "Assigned Workload" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "performance" || subPath === "observations" || subPath === "training" || subPath === "appraisals" || subPath === "reports" || subPath === "documents") {
        return (
          <ListViewTemplate
            title="Professional Appraisals Panel"
            description="Monitor teacher training programs and class observations reports."
            data={teachersData.map(t => ({ ...t, rating: "4.8 / 5.0", trainingStatus: "Completed" }))}
            columns={[
              { accessorKey: "name", header: "Teacher" },
              { accessorKey: "rating", header: "Observation Rating" },
              { accessorKey: "trainingStatus", header: "Training Status" },
            ]}
            searchKey="name"
          />
        );
      }
    }

    // 11. Students Performance
    if (moduleName === "students-performance") {
      const studentPerfData = [
        { id: "1", name: "Aarav Sharma", class: "Class 10 - A", gpa: 9.4, attendance: "94.5%", status: "Excellent" },
        { id: "2", name: "Priya Patel", class: "Class 10 - A", gpa: 9.1, attendance: "92.0%", status: "Excellent" },
        { id: "3", name: "Rahul Verma", class: "Class 10 - A", gpa: 7.4, attendance: "86.5%", status: "Average" },
        { id: "4", name: "Sneha Gupta", class: "Class 9 - A", gpa: 6.8, attendance: "82.0%", status: "Needs Improvement" },
      ];
      if (!subPath || subPath === "classes" || subPath === "subjects" || subPath === "ranks" || subPath === "top") {
        return (
          <ListViewTemplate
            title="Students Academic Performance Ledger"
            description="Browse GPAs, ranking files, and progress indicators."
            data={studentPerfData}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class" },
              { accessorKey: "gpa", header: "Academic GPA Score" },
              { accessorKey: "attendance", header: "Attendance Rate" },
              { accessorKey: "status", header: "Evaluation Category" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "weak") {
        return (
          <ListViewTemplate
            title="Remedial/Weak Student Focus Group"
            description="Identify and monitor students needing academic guidance."
            data={studentPerfData.filter(s => s.gpa < 7.5)}
            columns={[
              { accessorKey: "name", header: "Student Name" },
              { accessorKey: "class", header: "Class Cohort" },
              { accessorKey: "gpa", header: "Current GPA" },
              { accessorKey: "status", header: "Alert status" },
            ]}
            searchKey="name"
          />
        );
      }
      if (subPath === "progress" || subPath === "analytics" || subPath === "comparisons" || subPath === "improvements" || subPath === "report-cards") {
        return (
          <PageContainer>
            <PageHeader title="Academic Progress analytics" description="Inspect general cohort charts and progress summaries." />
            <div className="grid gap-6 md:grid-cols-2 text-left">
              <ChartContainer title="GPA Distribution curve" subtitle="Summary averages across sections">
                <BarChart
                  data={studentPerfData.map(s => ({ name: s.name, GPA: s.gpa }))}
                  xAxisKey="name"
                  series={[{ key: "GPA", name: "GPA Score", color: "#3b82f6" }]}
                />
              </ChartContainer>
            </div>
          </PageContainer>
        );
      }
    }

    // 12. Reports
    if (moduleName === "reports") {
      const reportsList = [
        { id: "1", title: "Semester 1 Academic Averages", format: "PDF & Excel", date: "2026-06-28", type: "Academic" },
        { id: "2", title: "Monthly Attendance Defaulters List", format: "Excel Export Only", date: "2026-06-25", type: "Attendance" },
        { id: "3", title: "Final Grade Sheets Compilation Ledger", format: "PDF Export Only", date: "2026-06-20", type: "Examination" },
      ];
      return (
        <ListViewTemplate
          title="Administrative & Academic Reports Portal"
          description="Download PDF/Excel reports, view attendance metrics, or query logs."
          data={reportsList}
          columns={[
            { accessorKey: "title", header: "Report Title" },
            { accessorKey: "format", header: "Available Formats" },
            { accessorKey: "date", header: "Compiled Date" },
            { accessorKey: "type", header: "Report Category" },
          ]}
          searchKey="title"
        />
      );
    }

    // 13. Communications
    if (moduleName === "communications") {
      return (
        <ListViewTemplate
          title="Notice Board & Announcements"
          description="Send SMS broadcasts, publish notices, or email student groups."
          data={mockNotices || []}
          columns={[
            { accessorKey: "title", header: "Notice Title" },
            { accessorKey: "date", header: "Date Published" },
            { accessorKey: "audience", header: "Audience Target" },
            { accessorKey: "status", header: "Publish status" },
          ]}
          searchKey="title"
        />
      );
    }

    // 14. Settings
    if (moduleName === "settings") {
      const academicSettingsData = [
        { id: "1", category: "Grading system", settingName: "Standard Letter Scale (A+ to F)", description: "Controls GPA scoring thresholds." },
        { id: "2", category: "Attendance Rules", settingName: "75% Mandatory Attendance", description: "Flag defaulters automatically." },
        { id: "3", category: "Academic Session", settingName: "Session 2026 - 2027", description: "Currently active school calendar year." },
      ];
      return (
        <ListViewTemplate
          title="Academic Settings"
          description="Manage grading systems, session config templates, and threshold rules."
          data={academicSettingsData}
          columns={[
            { accessorKey: "category", header: "Category Group" },
            { accessorKey: "settingName", header: "Active Rule Option" },
            { accessorKey: "description", header: "Detailed Description" },
          ]}
          searchKey="settingName"
        />
      );
    }
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
  } else if (moduleName.includes("inventory") || moduleName.includes("asset")) {
    const inventoryCols: ColumnDef<any>[] = [
      { accessorKey: "assetCode", header: "Asset Code" },
      { accessorKey: "brandModel", header: "Brand & Model" },
      { accessorKey: "type", header: "Category" },
      { accessorKey: "allocatedTo", header: "Allocated To" },
      { accessorKey: "status", header: "Status" },
    ];
    dataArray = inventory;
    cols = inventoryCols;
    label = "Asset Item";
    fields = (
      <>
        <FormInput name="brandModel" label="Brand & Model" required placeholder="e.g. Dell Latitude 5440" />
        <FormInput name="assetCode" label="Asset Code" required placeholder="e.g. GW-AST-0144" />
        <FormSelect
          name="type"
          label="Category"
          required
          options={[
            { value: "Laptop", label: "Laptop" },
            { value: "Tablet", label: "Tablet" },
            { value: "Projector", label: "Projector" },
            { value: "Other", label: "Other" },
          ]}
        />
        <FormSelect
          name="status"
          label="Status"
          required
          options={[
            { value: "Allocated", label: "Allocated" },
            { value: "Available", label: "Available" },
            { value: "In Repair", label: "In Repair" },
          ]}
        />
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
    } else if (moduleName.includes("inventory") || moduleName.includes("asset")) {
      setInventory([newRec, ...inventory]);
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
    } else if (moduleName.includes("inventory") || moduleName.includes("asset")) {
      setInventory(inventory.filter((i) => i.id !== row.id));
    }
    toast.success(`Removed ${label} entry from current session.`);
  };

  // RENDER DYNAMIC LIST VIEW
  const searchKey = (moduleName.includes("inventory") || moduleName.includes("asset")) ? "brandModel" : (moduleName.includes("transport") || moduleName.includes("vehicle") || moduleName.includes("route")) ? "vehicleNo" : "name";
  return (
    <ListViewTemplate
      title={`${getModuleName(moduleName)} Module`}
      description={`Greenwood administration ledger for managing all ${moduleName} data records.`}
      addLabel={`Add New ${label}`}
      data={dataArray}
      columns={cols}
      searchKey={searchKey}
      searchPlaceholder={`Search ${moduleName} lists...`}
      exportFileName={`Greenwood_${moduleName}_ledger`}
      formFields={fields}
      onAddSubmit={handleRecordAdd}
      onDeleteConfirm={handleRecordDelete}
    />
  );
}
