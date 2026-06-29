"use client";

import React, { use } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Briefcase,
  CreditCard,
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
  PlusCircle,
  FileCheck,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  UserPlus,
  Truck,
  ClipboardList,
  FileText,
  Eye,
  Bell,
  BookOpenCheck,
  UserCheck,
  AlertCircle,
  Search,
  Settings,
  CheckSquare,
  ChevronRight,
  Megaphone,
  IndianRupee,
  CalendarRange,

} from "lucide-react";
import { UserRole } from "@/types/common";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";
import { KPICard } from "@/components/dashboard/kpi-card";
import { KPICardRow } from "@/components/dashboard/kpi-card-row";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { QuickActionsGrid } from "@/components/dashboard/quick-actions-grid";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  ChartContainer,
  LineChart,
  BarChart,
  AreaChart,
  DonutChart,
  HorizontalBarChart,
} from "@/components/charts";
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
import { DataTable } from "@/components/data-table";

// --- Columns definitions for dashboards list tables ---
const branchColumns: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Branch Name" },
  { accessorKey: "code", header: "Branch Code" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "studentsCount", header: "Students" },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => `₹${row.original.revenue.toLocaleString()}`,
  },
  { accessorKey: "status", header: "Status" },
];

const studentColumns: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Student Name" },
  { accessorKey: "rollNo", header: "Roll No" },
  { accessorKey: "class", header: "Class" },
  { accessorKey: "fatherName", header: "Father's Name" },
  { accessorKey: "feeStatus", header: "Fees Status" },
];

const bookColumns: ColumnDef<any>[] = [
  { accessorKey: "title", header: "Book Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "available", header: "Available" },
  { accessorKey: "location", header: "Location" },
];

const feeColumns: ColumnDef<any>[] = [
  { accessorKey: "receiptNo", header: "Receipt No" },
  { accessorKey: "studentName", header: "Student" },
  { accessorKey: "class", header: "Class" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
  },
  { accessorKey: "mode", header: "Payment Mode" },
];

const getRoleName = (role: UserRole): string => {
  return role
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/* ─────────────────────────────────────────────────────────
   Super Admin Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function SuperAdminDashboard() {
  // -- Branch Performance table columns matching reference --
  const branchPerfColumns: ColumnDef<any>[] = [
    { accessorKey: "branch", header: "Branch" },
    { accessorKey: "students", header: "Students" },
    {
      accessorKey: "feeCollection",
      header: "Fee Collection (May)",
      cell: ({ row }) => `₹${row.original.feeCollection}`,
    },
    { accessorKey: "attendance", header: "Attendance" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`text-xs font-semibold ${row.original.status === "Active" ? "text-green-500" : "text-red-500"}`}>
          {row.original.status}
        </span>
      ),
    },
  ];

  const branchPerfData = [
    { branch: "Head Office", students: "2,568", feeCollection: "45,68,900", attendance: "93.2%", status: "Active" },
    { branch: "Branch - North", students: "2,245", feeCollection: "38,45,200", attendance: "92.1%", status: "Active" },
    { branch: "Branch - South", students: "1,987", feeCollection: "36,78,600", attendance: "91.4%", status: "Active" },
    { branch: "Branch - East", students: "1,854", feeCollection: "28,45,600", attendance: "90.2%", status: "Active" },
    { branch: "Branch - West", students: "1,654", feeCollection: "25,45,800", attendance: "89.7%", status: "Active" },
  ];

  // -- Recent Activities data matching reference --
  const recentActivities = [
    { icon: UserPlus, title: "New admission created", desc: "Class 10 - Rahul Verma", time: "10:30 AM", color: "text-blue-500 bg-blue-500/10" },
    { icon: CreditCard, title: "Fee collected", desc: "Receipt #RCPT5289", time: "10:15 AM", color: "text-green-500 bg-green-500/10" },
    { icon: Briefcase, title: "Staff payroll generated", desc: "May 2025 Payroll", time: "09:45 AM", color: "text-purple-500 bg-purple-500/10" },
    { icon: Search, title: "New inquiry received", desc: "From Neha Sharma", time: "09:20 AM", color: "text-orange-500 bg-orange-500/10" },
    { icon: BookOpen, title: "Library book issued", desc: "ISBN: 978-81-123456-7", time: "09:05 AM", color: "text-rose-500 bg-rose-500/10" },
  ];

  // -- Alerts data matching reference --
  const alerts = [
    { icon: AlertTriangle, text: "5 students have pending fee", color: "text-amber-500 bg-amber-500/10" },
    { icon: Bus, text: "3 vehicles are due for maintenance", color: "text-red-500 bg-red-500/10" },
    { icon: BookOpen, text: "12 books are overdue", color: "text-blue-500 bg-blue-500/10" },
    { icon: FileText, text: "7 staff documents are expiring soon", color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard title="Total Students" value="12,568" icon={GraduationCap} trend={{ value: 8.5, isPositive: true }} color="blue" />
        <KPICard title="Total Staff" value="1,256" icon={Users} trend={{ value: 4.3, isPositive: true }} color="green" />
        <KPICard title="Fee Collection (May)" value="₹2,45,68,900" icon={CreditCard} trend={{ value: 12.6, isPositive: true }} color="purple" />
        <KPICard title="Total Expenses (May)" value="₹1,32,45,600" icon={Briefcase} trend={{ value: 3.1, isPositive: false }} color="red" />
        <KPICard title="Outstanding Fees" value="₹98,45,200" icon={AlertTriangle} trend={{ value: 2.8, isPositive: false }} color="orange" />
      </div>

      {/* ── Row 2: Secondary 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard title="Attendance (Today)" value="92.6%" icon={UserCheck} description="↑ 3.2% vs yesterday" color="green" />
        <KPICard title="Library Books" value="28,745" icon={BookOpen} description="Total Books" color="purple" />
        <KPICard title="Hostel Occupancy" value="1,256 / 1,650" icon={Home} description="76.12% Occupied" color="red" />
        <KPICard title="Transport Vehicles" value="48" icon={Bus} description="Active Vehicles" color="orange" />
        <KPICard title="Active Branches" value="12" icon={Building2} description="Total Branches" color="blue" />
      </div>

      {/* ── Row 3: Charts + Recent Activities (3 columns) ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Fee Collection Bar Chart */}
        <div className="lg:col-span-5">
          <ChartContainer title="Fee Collection Overview" subtitle="">
            <BarChart
              data={[
                { month: "Jan", Collection: 80, Outstanding: 40 },
                { month: "Feb", Collection: 100, Outstanding: 50 },
                { month: "Mar", Collection: 140, Outstanding: 60 },
                { month: "Apr", Collection: 160, Outstanding: 70 },
                { month: "May", Collection: 200, Outstanding: 80 },
                { month: "Jun", Collection: 220, Outstanding: 60 },
                { month: "Jul", Collection: 240, Outstanding: 50 },
                { month: "Aug", Collection: 260, Outstanding: 70 },
                { month: "Sep", Collection: 290, Outstanding: 55 },
                { month: "Oct", Collection: 270, Outstanding: 45 },
                { month: "Nov", Collection: 280, Outstanding: 65 },
                { month: "Dec", Collection: 300, Outstanding: 60 },
              ]}
              xAxisKey="month"
              series={[
                { key: "Collection", name: "Collection", color: "#6366f1" },
                { key: "Outstanding", name: "Outstanding", color: "#c7d2fe" },
              ]}
            />
          </ChartContainer>
        </div>

        {/* Student Attendance Trend Line Chart */}
        <div className="lg:col-span-4">
          <ChartContainer title="Student Attendance Trend" subtitle="">
            <LineChart
              data={[
                { date: "01 May", rate: 88 },
                { date: "06 May", rate: 92 },
                { date: "11 May", rate: 90 },
                { date: "16 May", rate: 95 },
                { date: "21 May", rate: 93 },
              ]}
              xAxisKey="date"
              series={[{ key: "rate", name: "Attendance %", color: "#22c55e" }]}
            />
          </ChartContainer>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${act.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-tight truncate">{act.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{act.desc}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">{act.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link href="/super-admin/reports" className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:underline self-start">
              View All Activities <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 4: Branch Performance + Quick Actions + Alerts (3 columns) ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Branch Performance Overview Table */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4">Branch Performance Overview</h3>
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-xs text-left min-w-[450px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2.5 font-semibold text-muted-foreground">Branch</th>
                      <th className="pb-2.5 font-semibold text-muted-foreground">Students</th>
                      <th className="pb-2.5 font-semibold text-muted-foreground">Fee Collection (May)</th>
                      <th className="pb-2.5 font-semibold text-muted-foreground">Attendance</th>
                      <th className="pb-2.5 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchPerfData.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50 last:border-0">
                        <td className="py-2.5 font-medium text-foreground">{row.branch}</td>
                        <td className="py-2.5 text-foreground">{row.students}</td>
                        <td className="py-2.5 text-foreground">₹{row.feeCollection}</td>
                        <td className="py-2.5 text-foreground">{row.attendance}</td>
                        <td className="py-2.5">
                          <span className="text-green-500 font-semibold">{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Link href="/super-admin/branch-management" className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:underline self-start">
              View All Branches <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Quick Actions 2×4 Grid */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 content-center">
              {[
                { icon: UserPlus, label: "Add Student", href: "/super-admin/students/create", color: "text-blue-500 bg-blue-500/10" },
                { icon: CreditCard, label: "Collect Fee", href: "/super-admin/fees-accounts", color: "text-green-500 bg-green-500/10" },
                { icon: Users, label: "Add Staff", href: "/super-admin/staff-hr/recruitment", color: "text-purple-500 bg-purple-500/10" },
                { icon: FileCheck, label: "Create Exam", href: "/super-admin/examinations", color: "text-orange-500 bg-orange-500/10" },
                { icon: BookOpen, label: "Issue Book", href: "/super-admin/library", color: "text-rose-500 bg-rose-500/10" },
                { icon: Bus, label: "Add Vehicle", href: "/super-admin/transport", color: "text-cyan-500 bg-cyan-500/10" },
                { icon: Search, label: "New Inquiry", href: "/super-admin/admission-crm", color: "text-amber-500 bg-amber-500/10" },
                { icon: FileText, label: "Create Report", href: "/super-admin/reports", color: "text-indigo-500 bg-indigo-500/10" },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    href={action.href}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-border/40 hover:bg-muted/50 hover:border-border transition-all group"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color} group-hover:scale-105 transition-transform shrink-0`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-foreground text-center leading-tight">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4">Alerts & Notifications</h3>
              <div className="space-y-3">
                {alerts.map((alert, idx) => {
                  const Icon = alert.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${alert.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-foreground truncate">{alert.text}</span>
                      </div>
                      <Link href="/super-admin/reports" className="text-[10px] font-bold text-primary whitespace-nowrap hover:underline">
                        View Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link href="/super-admin/reports" className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:underline self-start">
              View All Alerts <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}


export default function RoleDashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const role = resolvedParams.role as UserRole;

  // --- Dynamic Dashboard Configs mapping ---
  const renderDashboardContent = () => {
    switch (role) {
      case "super-admin":
        return <SuperAdminDashboard />;

      case "branch-admin":
        {
          const notifications = [
            { icon: CreditCard, title: "Fee reminder sent to 120 students", time: "Today, 10:30 AM", color: "text-green-500 bg-green-500/10" },
            { icon: Calendar, title: "PTM scheduled on 25 May 2025", time: "Today, 09:15 AM", color: "text-orange-500 bg-orange-500/10" },
            { icon: UserPlus, title: "New admission inquiry received", time: "Today, 08:45 AM", color: "text-purple-500 bg-purple-500/10" },
            { icon: FileCheck, title: "Exam schedule published", time: "Yesterday, 04:30 PM", color: "text-blue-500 bg-blue-500/10" },
            { icon: Clock, title: "Staff leave request pending", time: "Yesterday, 11:20 AM", color: "text-red-500 bg-red-500/10" },
          ];

          const modulesData = [
            {
              name: "Students",
              icon: GraduationCap,
              color: "text-blue-500 bg-blue-500/10",
              links: [
                { label: "Student List", href: "/branch-admin/students" },
                { label: "Student Categories", href: "/branch-admin/students/categories" },
                { label: "Student Transfer", href: "/branch-admin/students/transfers" },
                { label: "Student Documents", href: "/branch-admin/students/documents" },
              ],
              viewAllHref: "/branch-admin/students",
            },
            {
              name: "Admission CRM",
              icon: Users,
              color: "text-green-500 bg-green-500/10",
              links: [
                { label: "Inquiry Management", href: "/branch-admin/admission-crm/inquiries" },
                { label: "Follow Ups", href: "/branch-admin/admission-crm/follow-ups" },
                { label: "Lead Sources", href: "/branch-admin/admission-crm/sources" },
                { label: "Conversion Tracking", href: "/branch-admin/admission-crm/reports" },
              ],
              viewAllHref: "/branch-admin/admission-crm",
            },
            {
              name: "Academic",
              icon: BookOpen,
              color: "text-blue-500 bg-blue-500/10",
              links: [
                { label: "Classes", href: "/branch-admin/classes-sections" },
                { label: "Sections", href: "/branch-admin/classes-sections" },
                { label: "Subjects", href: "/branch-admin/subjects" },
                { label: "Timetable", href: "/branch-admin/timetable" },
              ],
              viewAllHref: "/branch-admin/classes-sections",
            },
            {
              name: "Attendance",
              icon: UserCheck,
              color: "text-orange-500 bg-orange-500/10",
              links: [
                { label: "Student Attendance", href: "/branch-admin/attendance" },
                { label: "Staff Attendance", href: "/branch-admin/attendance/staff" },
                { label: "Attendance Reports", href: "/branch-admin/attendance/reports" },
              ],
              viewAllHref: "/branch-admin/attendance",
            },
            {
              name: "Examination",
              icon: FileCheck,
              color: "text-red-500 bg-red-500/10",
              links: [
                { label: "Exam Setup", href: "/branch-admin/examinations" },
                { label: "Marks Entry", href: "/branch-admin/examinations" },
                { label: "Result Processing", href: "/branch-admin/examinations" },
                { label: "Report Cards", href: "/branch-admin/examinations" },
              ],
              viewAllHref: "/branch-admin/examinations",
            },
            {
              name: "Staff Management",
              icon: Briefcase,
              color: "text-teal-500 bg-teal-500/10",
              links: [
                { label: "Staff List", href: "/branch-admin/employees" },
                { label: "Departments", href: "/branch-admin/employees" },
                { label: "Leave Management", href: "/branch-admin/attendance/leaves" },
                { label: "Staff Documents", href: "/branch-admin/employees" },
              ],
              viewAllHref: "/branch-admin/employees",
            },
            {
              name: "Fees",
              icon: CreditCard,
              color: "text-orange-500 bg-orange-500/10",
              links: [
                { label: "Fee Collection", href: "/branch-admin/fee-collection" },
                { label: "Fee Structure", href: "/branch-admin/fee-management" },
                { label: "Discounts", href: "/branch-admin/approvals/discounts" },
                { label: "Due Management", href: "/branch-admin/due-management" },
              ],
              viewAllHref: "/branch-admin/fee-management",
            },
            {
              name: "Payroll",
              icon: CheckSquare,
              color: "text-purple-500 bg-purple-500/10",
              links: [
                { label: "Payroll Processing", href: "/branch-admin/payroll" },
                { label: "Payslips", href: "/branch-admin/payroll" },
                { label: "Salary Structure", href: "/branch-admin/payroll" },
                { label: "Payroll Reports", href: "/branch-admin/payroll" },
              ],
              viewAllHref: "/branch-admin/payroll",
            },
            {
              name: "Library",
              icon: BookOpen,
              color: "text-indigo-500 bg-indigo-500/10",
              links: [
                { label: "Books", href: "/branch-admin/books" },
                { label: "Issue / Return", href: "/branch-admin/issue-return" },
                { label: "Fine Management", href: "/branch-admin/fines" },
                { label: "Library Reports", href: "/branch-admin/reports/library" },
              ],
              viewAllHref: "/branch-admin/books",
            },
            {
              name: "Reports",
              icon: FileText,
              color: "text-blue-500 bg-blue-500/10",
              links: [
                { label: "Academic Reports", href: "/branch-admin/reports/academic" },
                { label: "Attendance Reports", href: "/branch-admin/reports/attendance" },
                { label: "Fee Reports", href: "/branch-admin/reports/finance" },
                { label: "Financial Reports", href: "/branch-admin/reports/finance" },
              ],
              viewAllHref: "/branch-admin/reports",
            },
          ];

          return (
            <div className="space-y-6 text-left">
              {/* ── Row 1: Top 5 KPI Cards ── */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <KPICard title="Total Students" value="1,248" icon={GraduationCap} trend={{ value: 8.6, isPositive: true }} color="blue" />
                <KPICard title="Total Staff" value="124" icon={Users} trend={{ value: 4.3, isPositive: true }} color="blue" />
                <KPICard title="Fee Collection (May)" value="₹18,45,200" icon={CreditCard} trend={{ value: 12.5, isPositive: true }} color="green" />
                <KPICard title="Outstanding Fees" value="₹6,78,550" icon={CreditCard} trend={{ value: 3.2, isPositive: false }} color="orange" />
                <KPICard title="New Admissions" value="84" icon={UserPlus} trend={{ value: 11.4, isPositive: true }} color="red" />
              </div>

              {/* ── Row 2: Charts & Notifications (Fee Collection, Attendance, Recent Notifications) ── */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
                {/* Fee Collection Overview */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
                      <h3 className="text-sm font-bold text-foreground">Fee Collection Overview</h3>
                      <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                        <option>This Month</option>
                        <option>This Quarter</option>
                        <option>This Year</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2 flex-1">
                      <div className="relative flex items-center justify-center h-36 w-36 shrink-0 mx-auto sm:mx-0">
                        {/* Circular Progress SVG */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" className="stroke-muted/20" strokeWidth="9" fill="transparent" />
                          <circle cx="50" cy="50" r="40" className="stroke-[#6366f1]" strokeWidth="9" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 72) / 100} strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-extrabold text-foreground leading-none">72%</span>
                          <span className="text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wide">Collected</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 text-xs w-full">
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="text-muted-foreground font-medium">Total Fee (May)</span>
                          <span className="font-bold text-foreground">₹25,68,750</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
                            <span className="text-muted-foreground font-medium">Collected Amount</span>
                          </div>
                          <span className="font-bold text-foreground">₹18,45,200</span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            <span className="text-muted-foreground font-medium">Pending Amount</span>
                          </div>
                          <span className="font-bold text-foreground">₹7,23,550</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Attendance Overview Line Chart */}
                <div className="lg:col-span-4 flex flex-col">
                  <ChartContainer
                    title="Student Attendance Overview"
                    className="flex-1 flex flex-col justify-between"
                    action={
                      <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                        <option>This Week</option>
                        <option>This Month</option>
                      </select>
                    }
                  >
                    <LineChart
                      data={[
                        { day: "Mon", Attendance: 80 },
                        { day: "Tue", Attendance: 70 },
                        { day: "Wed", Attendance: 86 },
                        { day: "Thu", Attendance: 92 },
                        { day: "Fri", Attendance: 85 },
                        { day: "Sat", Attendance: 92 },
                      ]}
                      xAxisKey="day"
                      series={[{ key: "Attendance", name: "Attendance Rate (%)", color: "#6366f1" }]}
                    />
                  </ChartContainer>
                </div>

                {/* Recent Notifications */}
                <div className="lg:col-span-3 flex flex-col">
                  <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-4">Recent Notifications</h3>
                      <div className="space-y-4">
                        {notifications.map((act, idx) => {
                          const Icon = act.icon;
                          return (
                            <div key={idx} className="flex items-start gap-3 text-left">
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${act.color}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground leading-tight truncate">{act.title}</p>
                                <p className="text-[10px] text-muted-foreground">{act.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <Link href="/branch-admin/communications" className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:underline self-start">
                      View All <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Row 3: Quick Actions ── */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                    { icon: UserPlus, label: "Add Student", href: "/branch-admin/students/create", color: "text-blue-500 bg-blue-500/10" },
                    { icon: FileText, label: "New Admission", href: "/branch-admin/admission-crm", color: "text-green-500 bg-green-500/10" },
                    { icon: IndianRupee, label: "Collect Fee", href: "/branch-admin/fee-collection", color: "text-orange-500 bg-orange-500/10" },
                    { icon: Calendar, label: "Mark Attendance", href: "/branch-admin/attendance", color: "text-blue-500 bg-blue-500/10" },
                    { icon: UserPlus, label: "Add Staff", href: "/branch-admin/user-management/create", color: "text-purple-500 bg-purple-500/10" },
                    { icon: FileCheck, label: "Create Exam", href: "/branch-admin/examinations", color: "text-red-500 bg-red-500/10" },
                    { icon: FileText, label: "Generate Report", href: "/branch-admin/reports", color: "text-green-500 bg-green-500/10" },
                    { icon: Megaphone, label: "Send Notice", href: "/branch-admin/communications", color: "text-blue-500 bg-blue-500/10" },
                  ].map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={idx}
                        href={action.href}
                        className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-border/40 hover:bg-muted/50 hover:border-border transition-all group"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} group-hover:scale-105 transition-transform shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold text-foreground text-center leading-tight">{action.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* ── Row 4: Operational Modules Grid (10 Cards) ── */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">Operational Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {modulesData.map((mod, idx) => {
                    const Icon = mod.icon;
                    return (
                      <div key={idx} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${mod.color}`}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-xs font-bold text-foreground">{mod.name}</span>
                          </div>
                          <div className="space-y-1 mb-4">
                            {mod.links.map((link, lIdx) => (
                              <Link
                                key={lIdx}
                                href={link.href}
                                className="flex items-center justify-between text-[11px] py-1.5 px-1 hover:text-primary transition-colors text-muted-foreground group/link"
                              >
                                <span className="truncate">{link.label}</span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground/45 group-hover/link:text-primary group-hover/link:translate-x-0.5 transition-transform" />
                              </Link>
                            ))}
                          </div>
                        </div>
                        <Link
                          href={mod.viewAllHref}
                          className="flex items-center justify-center w-full pt-2.5 mt-auto text-[11px] font-bold text-primary hover:underline border-t border-border/45"
                        >
                          View All
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

      case "academic":
        const academicModulesData = [
          {
            name: "Classes & Sections",
            icon: Building2,
            color: "text-blue-500 bg-blue-500/10",
            links: [
              { label: "Manage Classes", href: "/academic/classes-sections" },
              { label: "Manage Sections", href: "/academic/classes-sections/sections" },
              { label: "Assign Class Teacher", href: "/academic/classes-sections/assign-teacher" },
              { label: "Class Overview", href: "/academic/classes-sections/overview" },
            ],
            viewAllHref: "/academic/classes-sections",
          },
          {
            name: "Subjects",
            icon: BookOpen,
            color: "text-green-500 bg-green-500/10",
            links: [
              { label: "Manage Subjects", href: "/academic/subjects" },
              { label: "Assign Subjects", href: "/academic/subjects/mapping" },
              { label: "Subject Allocation", href: "/academic/subjects/allocations" },
              { label: "Subject Overview", href: "/academic/subjects/reports" },
            ],
            viewAllHref: "/academic/subjects",
          },
          {
            name: "Timetable",
            icon: CalendarRange,
            color: "text-purple-500 bg-purple-500/10",
            links: [
              { label: "Create Timetable", href: "/academic/timetable/generator" },
              { label: "Manage Timetable", href: "/academic/timetable" },
              { label: "Teacher Timetable", href: "/academic/timetable/teacher" },
              { label: "Room Allocation", href: "/academic/timetable/rooms" },
            ],
            viewAllHref: "/academic/timetable",
          },
          {
            name: "Academic Calendar",
            icon: Calendar,
            color: "text-orange-500 bg-orange-500/10",
            links: [
              { label: "Holidays", href: "/academic/academic-calendar/holidays" },
              { label: "Events", href: "/academic/academic-calendar/events" },
              { label: "Exam Calendar", href: "/academic/academic-calendar/exams" },
              { label: "Important Dates", href: "/academic/academic-calendar" },
            ],
            viewAllHref: "/academic/academic-calendar",
          },
          {
            name: "Syllabus Management",
            icon: FileText,
            color: "text-red-500 bg-red-500/10",
            links: [
              { label: "Upload Syllabus", href: "/academic/syllabus" },
              { label: "Syllabus Overview", href: "/academic/syllabus/subject" },
              { label: "Track Completion", href: "/academic/syllabus/tracking" },
              { label: "Subjectwise Progress", href: "/academic/syllabus/subjects" },
            ],
            viewAllHref: "/academic/syllabus",
          },
          {
            name: "Attendance Monitoring",
            icon: UserCheck,
            color: "text-teal-500 bg-teal-500/10",
            links: [
              { label: "Student Attendance", href: "/academic/attendance" },
              { label: "Attendance Analytics", href: "/academic/attendance/analytics" },
              { label: "Class Attendance Report", href: "/academic/attendance/class" },
              { label: "Subject Attendance", href: "/academic/attendance/subject" },
            ],
            viewAllHref: "/academic/attendance",
          },
          {
            name: "Examinations",
            icon: FileCheck,
            color: "text-indigo-500 bg-indigo-500/10",
            links: [
              { label: "Exam Setup", href: "/academic/examinations" },
              { label: "Exam Schedule", href: "/academic/examinations/schedule" },
              { label: "Mark Entry", href: "/academic/examinations/marks" },
              { label: "Exam Reports", href: "/academic/examinations/reports" },
            ],
            viewAllHref: "/academic/examinations",
          },
          {
            name: "Result Monitoring",
            icon: CheckSquare,
            color: "text-pink-500 bg-pink-500/10",
            links: [
              { label: "Verify Results", href: "/academic/results" },
              { label: "Publish Results", href: "/academic/results/publish" },
              { label: "Grade Settings", href: "/academic/settings/grading" },
              { label: "Result Analytics", href: "/academic/results/analytics" },
            ],
            viewAllHref: "/academic/results",
          },
          {
            name: "Teachers",
            icon: Users,
            color: "text-blue-500 bg-blue-500/10",
            links: [
              { label: "Teacher Directory", href: "/academic/teachers" },
              { label: "Teacher Workload", href: "/academic/teachers/workloads" },
              { label: "Performance Review", href: "/academic/teachers/performance" },
              { label: "Training & Development", href: "/academic/teachers/training" },
            ],
            viewAllHref: "/academic/teachers",
          },
          {
            name: "Students Performance",
            icon: GraduationCap,
            color: "text-orange-500 bg-orange-500/10",
            links: [
              { label: "Class Performance", href: "/academic/students-performance/classes" },
              { label: "Student Performance", href: "/academic/students-performance" },
              { label: "Subject Performance", href: "/academic/students-performance/subjects" },
              { label: "Report Cards", href: "/academic/students-performance/report-cards" },
            ],
            viewAllHref: "/academic/students-performance",
          },
        ];

        return (
          <div className="space-y-6 text-left">
            {/* ── Row 1: Top 5 KPI Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <KPICard title="Total Students" value="1,248" icon={GraduationCap} trend={{ value: 8.6, isPositive: true }} color="blue" />
              <KPICard title="Total Teachers" value="76" icon={Users} trend={{ value: 4.3, isPositive: true }} color="blue" />
              <KPICard title="Average Attendance" value="92.6%" icon={UserCheck} trend={{ value: 2.5, isPositive: true }} color="green" />
              <KPICard title="Exams Conducted" value="12" icon={FileCheck} trend={{ value: 20.0, isPositive: true }} color="orange" />
              <KPICard title="Pass Percentage" value="88.4%" icon={Award} trend={{ value: 3.2, isPositive: true }} color="red" />
            </div>

            {/* ── Row 2: Charts & Upcoming Exams ── */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
              {/* Performance Doughnut Chart */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1 border-b border-border/40 shrink-0">
                    <h3 className="text-sm font-bold text-foreground">Student Performance Overview</h3>
                    <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                      <option>This Term</option>
                      <option>Last Term</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2 flex-1">
                    <div className="relative flex items-center justify-center h-32 w-32 shrink-0 mx-auto sm:mx-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="stroke-muted/20" strokeWidth="10" fill="transparent" />
                        <circle cx="50" cy="50" r="40" className="stroke-blue-500" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 25) / 100} />
                        <circle cx="50" cy="50" r="40" className="stroke-green-500" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 64) / 100} strokeDashdelay="25" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-lg font-extrabold text-foreground leading-none">1,248</span>
                        <span className="text-[8px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wide">Students</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2.5 text-xs w-full">
                      <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                        <span className="text-muted-foreground font-medium">Excellent (90%+)</span>
                        <span className="font-bold text-foreground">312 (25%)</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                        <span className="text-muted-foreground font-medium">Good (75%-89%)</span>
                        <span className="font-bold text-foreground">486 (38.9%)</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                        <span className="text-muted-foreground font-medium">Average (60%-74%)</span>
                        <span className="font-bold text-foreground">324 (26%)</span>
                      </div>
                      <div className="flex items-center justify-between pb-0.5">
                        <span className="text-muted-foreground font-medium">Needs Imp. (&lt;60%)</span>
                        <span className="font-bold text-foreground">126 (10.1%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Trend Line Chart */}
              <div className="lg:col-span-5 flex flex-col">
                <ChartContainer
                  title="Attendance Trend"
                  subtitle="Daily average presence log (01 May - 21 May)"
                  className="flex-1 flex flex-col justify-between"
                  action={
                    <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                      <option>This Month</option>
                      <option>This Week</option>
                    </select>
                  }
                >
                  <LineChart
                    data={[
                      { day: "01 May", Attendance: 82 },
                      { day: "06 May", Attendance: 85 },
                      { day: "11 May", Attendance: 92 },
                      { day: "16 May", Attendance: 83 },
                      { day: "21 May", Attendance: 91 },
                    ]}
                    xAxisKey="day"
                    series={[{ key: "Attendance", name: "Attendance Rate (%)", color: "#6366f1" }]}
                  />
                </ChartContainer>
              </div>

              {/* Upcoming Exams Feed */}
              <div className="lg:col-span-3 flex flex-col">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-4">Upcoming Exams</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Unit Test - I", desc: "Class 6 - 10", date: "28 May 2025" },
                        { title: "Half Yearly Exam", desc: "Class 1 - 12", date: "05 Jun 2025" },
                        { title: "Science Practical", desc: "Class 9 - 12", date: "15 Jun 2025" },
                        { title: "Pre Board Exam", desc: "Class 10 - 12", date: "20 Jun 2025" },
                      ].map((exam, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-left">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[10px] flex-col leading-none">
                            <span>{exam.date.split(" ")[0]}</span>
                            <span className="text-[7px] uppercase mt-0.5">{exam.date.split(" ")[1]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground leading-tight truncate">{exam.title}</p>
                            <p className="text-[10px] text-muted-foreground">{exam.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href="/academic/examinations" className="flex items-center gap-1 text-xs font-semibold text-primary mt-4 hover:underline self-start">
                    View Exam Schedule <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Row 3: Quick Actions ── */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                {[
                  { icon: Calendar, label: "Create Timetable", href: "/academic/timetable/generator", color: "text-blue-500 bg-blue-500/10" },
                  { icon: UserPlus, label: "Assign Teacher", href: "/academic/classes-sections/assign-teacher", color: "text-indigo-500 bg-indigo-500/10" },
                  { icon: FileCheck, label: "Create Exam", href: "/academic/examinations", color: "text-green-500 bg-green-500/10" },
                  { icon: FileText, label: "Upload Syllabus", href: "/academic/syllabus", color: "text-amber-500 bg-amber-500/10" },
                  { icon: FileText, label: "View Reports", href: "/academic/reports", color: "text-red-500 bg-red-500/10" },
                  { icon: Megaphone, label: "Send Announcement", href: "/academic/communications", color: "text-blue-500 bg-blue-500/10" },
                ].map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={idx}
                      href={action.href}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-border/40 hover:bg-muted/50 hover:border-border transition-all group"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} group-hover:scale-105 transition-transform shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold text-foreground text-center leading-tight">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Row 4: Operational Modules Grid ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Operational Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {academicModulesData.map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div key={idx} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-border/40 pb-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${mod.color}`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-xs font-bold text-foreground">{mod.name}</span>
                        </div>
                        <div className="space-y-1 mb-4">
                          {mod.links.map((link, lIdx) => (
                            <Link
                              key={lIdx}
                              href={link.href}
                              className="flex items-center justify-between text-[11px] py-1.5 px-1 hover:text-primary transition-colors text-muted-foreground group/link"
                            >
                              <span className="truncate">{link.label}</span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground/45 group-hover/link:text-primary group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={mod.viewAllHref}
                        className="flex items-center justify-center w-full pt-2.5 mt-auto text-[11px] font-bold text-primary hover:underline border-t border-border/45"
                      >
                        View All
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "finance":
        return (
          <div className="space-y-6">
            <KPICardRow>
              <KPICard title="Total Income" value="₹4,25,000" icon={CreditCard} trend={{ value: 14, isPositive: true }} color="green" />
              <KPICard title="Due Receivables" value="₹1,12,000" icon={Clock} trend={{ value: 6, isPositive: false }} color="red" />
              <KPICard title="Total Expenses" value="₹85,000" icon={Briefcase} trend={{ value: 3, isPositive: true }} color="orange" />
              <KPICard title="Scholarships Approved" value="5" icon={Award} trend={{ value: 20, isPositive: true }} color="blue" />
            </KPICardRow>

            <QuickActionsGrid>
              <QuickActionCard label="Collect Student Fee" icon={PlusCircle} href="/finance/fee-collection" color="green" />
              <QuickActionCard label="Record Expense" icon={Briefcase} href="/finance/expenses" color="orange" />
              <QuickActionCard label="Receipt Register" icon={FileCheck} href="/finance/receipts" color="blue" />
            </QuickActionsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ChartContainer title="Fee Collections by Grade" subtitle="Comparing collections vs pending dues">
                  <BarChart
                    data={[
                      { grade: "Class 6", Collected: 42000, Pending: 8000 },
                      { grade: "Class 7", Collected: 48000, Pending: 6000 },
                      { grade: "Class 8", Collected: 55000, Pending: 12000 },
                      { grade: "Class 9", Collected: 64000, Pending: 15000 },
                      { grade: "Class 10", Collected: 72000, Pending: 20000 },
                    ]}
                    xAxisKey="grade"
                    series={[
                      { key: "Collected", name: "Collected (₹)", color: "#22c55e" },
                      { key: "Pending", name: "Pending (₹)", color: "#ef4444" },
                    ]}
                  />
                </ChartContainer>
              </div>
              <div>
                <ChartContainer title="Revenue Split by Mode" subtitle="Payment gateway share">
                  <DonutChart
                    data={[
                      { name: "UPI Apps", value: 180000, color: "#22c55e" },
                      { name: "Net Banking", value: 120000, color: "#3b82f6" },
                      { name: "Credit/Debit", value: 85000, color: "#6366f1" },
                      { name: "Cash", value: 40000, color: "#f59e0b" },
                    ]}
                  />
                </ChartContainer>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-sm font-bold text-foreground mb-4">Recent Receipts Directory</h3>
              <DataTable columns={feeColumns} data={mockFees} />
            </div>
          </div>
        );

      case "library":
        return (
          <div className="space-y-6">
            <KPICardRow>
              <KPICard title="Total Books" value="12,500" icon={BookOpen} trend={{ value: 2, isPositive: true }} color="blue" />
              <KPICard title="Books Checked Out" value="124" icon={CheckCircle} trend={{ value: 8, isPositive: true }} color="purple" />
              <KPICard title="Active Members" value="480" icon={Users} trend={{ value: 15, isPositive: true }} color="green" />
              <KPICard title="Pending Overdue Fines" value="₹4,250" icon={AlertTriangle} trend={{ value: 12, isPositive: false }} color="red" />
            </KPICardRow>

            <QuickActionsGrid>
              <QuickActionCard label="Issue New Book" icon={Plus} href="/library/issue-return" color="blue" />
              <QuickActionCard label="Add Book to Catalog" icon={BookOpen} href="/library/books" color="purple" />
              <QuickActionCard label="Register Library Member" icon={Users} href="/library/members" color="green" />
            </QuickActionsGrid>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartContainer title="Book Issues Trend" subtitle="Monthly issue distributions">
                <LineChart
                  data={[
                    { month: "Jan", Issues: 180 },
                    { month: "Feb", Issues: 210 },
                    { month: "Mar", Issues: 290 },
                    { month: "Apr", Issues: 250 },
                    { month: "May", Issues: 320 },
                    { month: "Jun", Issues: 280 },
                  ]}
                  xAxisKey="month"
                  series={[{ key: "Issues", name: "Issues Checked", color: "#6366f1" }]}
                />
              </ChartContainer>
              <ChartContainer title="Top Issued Books List" subtitle="Top performing educational booklets">
                <HorizontalBarChart
                  data={[
                    { title: "Intro to Physics", count: 48 },
                    { title: "Advanced Maths", count: 42 },
                    { title: "History of India", count: 35 },
                    { title: "Computer Networks", count: 28 },
                    { title: "English Grammar", count: 22 },
                  ]}
                  yAxisKey="title"
                  barKey="count"
                  barName="Issue Count"
                  color="#8b5cf6"
                />
              </ChartContainer>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-sm font-bold text-foreground mb-4">Library Catalog Registry</h3>
              <DataTable columns={bookColumns} data={mockBooks} />
            </div>
          </div>
        );

      case "hr":
        return (
          <div className="space-y-6">
            <KPICardRow>
              <KPICard title="Total Employees" value="156 Staff" icon={Users} trend={{ value: 3.1, isPositive: true }} color="blue" />
              <KPICard title="Daily Attendance" value="94.2%" icon={UserCheck} trend={{ value: 1.2, isPositive: true }} color="green" />
              <KPICard title="Pending Leave Requests" value="8 Claims" icon={Calendar} trend={{ value: 15.2, isPositive: false }} color="orange" />
              <KPICard title="Open Vacancies" value="5 Openings" icon={Briefcase} description="Hiring pipeline" color="purple" />
            </KPICardRow>

            <QuickActionsGrid>
              <QuickActionCard label="Staff Directory" icon={Users} href="/hr/employees" color="blue" />
              <QuickActionCard label="Add Employee Profile" icon={UserPlus} href="/hr/employees/create" color="green" />
              <QuickActionCard label="Leave Approvals" icon={ClipboardList} href="/hr/leave" color="orange" />
              <QuickActionCard label="Recruitment Kanban" icon={Briefcase} href="/hr/recruitment" color="purple" />
            </QuickActionsGrid>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartContainer title="HR Recruitment Funnel" subtitle="Number of active candidates in stages">
                <BarChart
                  data={[
                    { stage: "Applied", Candidates: 42 },
                    { stage: "Screening", Candidates: 24 },
                    { stage: "Interview", Candidates: 15 },
                    { stage: "Offered", Candidates: 6 },
                    { stage: "Hired", Candidates: 4 },
                  ]}
                  xAxisKey="stage"
                  series={[{ key: "Candidates", name: "Candidates", color: "#6366f1" }]}
                />
              </ChartContainer>

              <ChartContainer title="Staff Absentees Trend" subtitle="Daily average absentees count">
                <LineChart
                  data={[
                    { day: "Mon", Staff: 5 },
                    { day: "Tue", Staff: 3 },
                    { day: "Wed", Staff: 4 },
                    { day: "Thu", Staff: 2 },
                    { day: "Fri", Staff: 6 },
                  ]}
                  xAxisKey="day"
                  series={[{ key: "Staff", name: "Absent Employees", color: "#ef4444" }]}
                />
              </ChartContainer>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-sm font-bold text-foreground mb-4">Pending Leave Approval Board</h3>
              <DataTable
                columns={[
                  { accessorKey: "name", header: "Staff Member" },
                  { accessorKey: "type", header: "Leave Type" },
                  { accessorKey: "range", header: "Date Range" },
                  { accessorKey: "reason", header: "Reason Summary" },
                  { accessorKey: "status", header: "Status" },
                ]}
                data={[
                  { name: "Ms. Shalini Gupta", type: "Casual Leave", range: "02 Jul - 03 Jul (2 days)", reason: "Personal family emergency", status: "Pending HR Approval" },
                  { name: "Mr. Amit Verma", type: "Sick Leave", range: "05 Jul (1 day)", reason: "Doctor appointment", status: "Pending HR Approval" },
                ]}
              />
            </div>
          </div>
        );

      case "transport":
        return (
          <div className="space-y-6">
            <KPICardRow>
              <KPICard title="Fleet Vehicles" value="48 Active" icon={Bus} description="Buses & Vans" color="blue" />
              <KPICard title="Active Routes" value="12 Main Routes" icon={Building2} description="148 stops mapped" color="purple" />
              <KPICard title="Drivers on Duty" value="45 Personnel" icon={Users} trend={{ value: 2.1, isPositive: true }} color="green" />
              <KPICard title="In Repair / Service" value="3 Units" icon={AlertTriangle} trend={{ value: 20, isPositive: false }} color="red" />
            </KPICardRow>

            <QuickActionsGrid>
              <QuickActionCard label="Add New Vehicle" icon={Plus} href="/transport/vehicles" color="blue" />
              <QuickActionCard label="Configure Routes" icon={Building2} href="/transport/routes" color="purple" />
              <QuickActionCard label="Driver Directory" icon={Users} href="/transport/drivers" color="green" />
              <QuickActionCard label="GPS Allocation" icon={UserCheck} href="/transport/allocation" color="orange" />
            </QuickActionsGrid>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartContainer title="Fuel Consumption Ledger" subtitle="Liters consumed per vehicle group this month">
                <BarChart
                  data={[
                    { group: "Buses North", Consumption: 850 },
                    { group: "Buses South", Consumption: 940 },
                    { group: "Buses Central", Consumption: 1120 },
                    { group: "Staff Vans", Consumption: 430 },
                    { group: "Other Cars", Consumption: 210 },
                  ]}
                  xAxisKey="group"
                  series={[{ key: "Consumption", name: "Fuel (Liters)", color: "#10b981" }]}
                />
              </ChartContainer>

              <ChartContainer title="Route Load Densities" subtitle="Average pupil riders count per bus route">
                <LineChart
                  data={[
                    { route: "Route 1", Pupils: 48 },
                    { route: "Route 2", Pupils: 35 },
                    { route: "Route 3", Pupils: 52 },
                    { route: "Route 4", Pupils: 40 },
                    { route: "Route 5", Pupils: 28 },
                  ]}
                  xAxisKey="route"
                  series={[{ key: "Pupils", name: "Pupil Seatings Mapped", color: "#6366f1" }]}
                />
              </ChartContainer>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-sm font-bold text-foreground mb-4">Urgent Fleet Maintenance Alerts</h3>
              <DataTable
                columns={[
                  { accessorKey: "code", header: "Vehicle Code" },
                  { accessorKey: "model", header: "Vehicle Model" },
                  { accessorKey: "issue", header: "Reported Issue / Audit" },
                  { accessorKey: "status", header: "Urgency Status" },
                ]}
                data={[
                  { code: "GW-BUS-04", model: "Tata Starbus 40-Seater", issue: "Engine oil change overdue by 350km", status: "High Priority" },
                  { code: "GW-VAN-02", model: "Maruti Suzuki Eeco", issue: "Brake pads inspection required", status: "Medium Priority" },
                ]}
              />
            </div>
          </div>
        );

      case "hostel":
        return (
          <div className="space-y-6">
            <KPICardRow>
              <KPICard title="Bed Occupancy" value="412 / 500" icon={Home} trend={{ value: 5.4, isPositive: true }} color="blue" />
              <KPICard title="Vacant Rooms" value="24 Rooms" icon={CheckCircle} description="Ready for allotment" color="green" />
              <KPICard title="Guest Logs Today" value="6 Visitors" icon={Users} description="Active check-in passes" color="purple" />
              <KPICard title="Open Complaints" value="12 Cases" icon={AlertCircle} trend={{ value: 8, isPositive: false }} color="red" />
            </KPICardRow>

            <QuickActionsGrid>
              <QuickActionCard label="Allot Room Bed" icon={Plus} href="/hostel/allocation" color="blue" />
              <QuickActionCard label="Guest Pass Log" icon={Users} href="/hostel/visitors" color="purple" />
              <QuickActionCard label="Log Repair Complaint" icon={AlertTriangle} href="/hostel/complaints" color="red" />
              <QuickActionCard label="Mess Billing Ledger" icon={CreditCard} href="/hostel/finance" color="green" />
            </QuickActionsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ChartContainer title="Hostel Occupancy by Block" subtitle="Beds taken vs beds vacant">
                  <BarChart
                    data={[
                      { block: "Block A (Boys)", Occupied: 180, Vacant: 20 },
                      { block: "Block B (Girls)", Occupied: 192, Vacant: 8 },
                      { block: "Block C (Staff)", Occupied: 40, Vacant: 60 },
                    ]}
                    xAxisKey="block"
                    series={[
                      { key: "Occupied", name: "Beds Occupied", color: "#3b82f6" },
                      { key: "Vacant", name: "Beds Vacant", color: "#cbd5e1" },
                    ]}
                  />
                </ChartContainer>
              </div>

              <div>
                <ChartContainer title="Complaints Distribution" subtitle="Categories of logged issues">
                  <DonutChart
                    data={[
                      { name: "Electrical", value: 5, color: "#ef4444" },
                      { name: "Plumbing", value: 4, color: "#f59e0b" },
                      { name: "Furniture", value: 2, color: "#3b82f6" },
                      { name: "Internet / Wi-Fi", value: 1, color: "#10b981" },
                    ]}
                  />
                </ChartContainer>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5 shadow-sm text-left">
              <h3 className="text-sm font-bold text-foreground mb-4">Recent Visitor Check-In Log</h3>
              <DataTable
                columns={[
                  { accessorKey: "visitor", header: "Visitor Name" },
                  { accessorKey: "contact", header: "Contact Phone" },
                  { accessorKey: "relation", header: "Relation / Mapped Host" },
                  { accessorKey: "checkIn", header: "Check-In Time" },
                  { accessorKey: "status", header: "Validity" },
                ]}
                data={[
                  { visitor: "Mr. Ramesh Patel", contact: "+91 98765 43210", relation: "Father of Priya Patel (Room 102)", checkIn: "Today, 04:30 PM", status: "Active Visitor Pass" },
                  { visitor: "Vendor (Amul Milk)", contact: "+91 99887 76655", relation: "Kitchen Supplies Delivery", checkIn: "Today, 05:15 PM", status: "Active Visitor Pass" },
                ]}
              />
            </div>
          </div>
        );

      default:
        // --- General Fallback UI for other roles ---
        return (
          <div className="space-y-6">
            <KPICardRow>
              <KPICard title="Active Students" value="240" icon={GraduationCap} color="indigo" />
              <KPICard title="Attendance Rate" value="94.5%" icon={CheckCircle} color="green" />
              <KPICard title="Events Configured" value="4" icon={CalendarIcon} color="blue" />
              <KPICard title="Inbox Messages" value="2" icon={MessageSquareIcon} color="orange" />
            </KPICardRow>

            <QuickActionsGrid>
              <QuickActionCard label="Go to Profile" icon={Users} href={`/${role}/profile`} color="indigo" />
              <QuickActionCard label="View Timetable" icon={CalendarIcon} href={`/${role}/timetable`} color="blue" />
              <QuickActionCard label="My Tasks" icon={CheckCircle} href={`/${role}/dashboard`} color="green" />
            </QuickActionsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 bg-card border rounded-xl p-5 shadow-sm text-left">
                <h3 className="text-sm font-bold text-foreground mb-4">Linked Student Cohorts</h3>
                <DataTable columns={studentColumns} data={mockStudents} />
              </div>
              <RecentActivity />
            </div>
          </div>
        );
    }
  };

  return (
    <PageContainer>
      {renderDashboardContent()}
    </PageContainer>
  );
}

// Dummy Icon aliases for build fallback
const CalendarIcon = Calendar;
const MessageSquareIcon = MessageSquare;
