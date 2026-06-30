"use client";

import React, { use, useState } from "react";
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
  BadgePercent,
  Shield,
  Check,
  X,
  Cake,
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
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/data-table";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "@/components/ui/toast";

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

/* ─────────────────────────────────────────────────────────
   Parent Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function ParentDashboard() {
  const attendanceOverviewData = [
    { name: "Present", value: 23, color: "#22c55e" },
    { name: "Absent", value: 2, color: "#ef4444" },
    { name: "Leave", value: 1, color: "#f59e0b" },
  ];

  const kids = [
    { name: "Aditya Verma", class: "Class 10-B", rollNo: 23, status: "Active", avatarColor: "bg-blue-500/10 text-blue-600 border border-blue-500/20" },
    { name: "Ananya Verma", class: "Class 7-A", rollNo: 11, status: "Active", avatarColor: "bg-purple-500/10 text-purple-600 border border-purple-500/20" },
  ];

  const timetableToday = [
    { period: 1, time: "08:30 AM - 09:15 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "201" },
    { period: 2, time: "09:15 AM - 10:00 AM", subject: "Physics", teacher: "Ms. Neha Gupta", room: "Lab 2" },
    { period: 3, time: "10:00 AM - 10:20 AM", subject: "Break", teacher: "-", room: "-" },
    { period: 4, time: "10:20 AM - 11:05 AM", subject: "English", teacher: "Mr. Amit Verma", room: "103" },
    { period: 5, time: "11:05 AM - 11:50 AM", subject: "Chemistry", teacher: "Ms. Pooja Singh", room: "Lab 1" },
    { period: 6, time: "11:50 AM - 12:35 PM", subject: "Computer Science", teacher: "Mr. Rohit Kumar", room: "Lab 3" },
  ];

  const recentHomework = [
    { topic: "Quadratic Equations Worksheet", subject: "Mathematics", due: "Due: 30 May 2025", isUrgent: true },
    { topic: "Lab Report - Motion", subject: "Physics", due: "Due: 31 May 2025", isUrgent: true },
    { topic: "Chemical Reactions Worksheet", subject: "Chemistry", due: "Due: 02 Jun 2025", isUrgent: false },
    { topic: "Essay on Democracy", subject: "English", due: "Due: 03 Jun 2025", isUrgent: false },
  ];

  const upcomingExams = [
    { name: "Unit Test - 1", subject: "Mathematics", date: "05 Jun 2025" },
    { name: "Unit Test - 1", subject: "Physics", date: "09 Jun 2025" },
    { name: "Unit Test - 1", subject: "Chemistry", date: "12 Jun 2025" },
    { name: "Unit Test - 1", subject: "English", date: "16 Jun 2025" },
  ];

  const announcements = [
    { text: "Summer holiday from 15 June 2025.", date: "28 May 2025", color: "bg-blue-500" },
    { text: "PTM is scheduled on 07 June 2025.", date: "27 May 2025", color: "bg-green-500" },
    { text: "Science Exhibition on 10 June 2025.", date: "25 May 2025", color: "bg-amber-500" },
    { text: "School will remain closed on 02 June 2025 due to public holiday.", date: "24 May 2025", color: "bg-blue-500" },
  ];

  const upcomingEvents = [
    { title: "Parent Teacher Meeting", desc: "Saturday, 07 June 2025", time: "10:00 AM - 12:00 PM", day: "07", month: "JUN" },
    { title: "Science Exhibition", desc: "Tuesday, 10 June 2025", time: "09:00 AM - 02:00 PM", day: "10", month: "JUN" },
    { title: "Annual Sports Day", desc: "Friday, 20 June 2025", time: "08:00 AM - 03:00 PM", day: "20", month: "JUN" },
  ];

  const performanceList = [
    { subject: "Mathematics", grade: "A+", marks: "92%", avg: "78%" },
    { subject: "Physics", grade: "A", marks: "88%", avg: "75%" },
    { subject: "Chemistry", grade: "A", marks: "85%", avg: "72%" },
    { subject: "English", grade: "A+", marks: "90%", avg: "80%" },
    { subject: "Computer Science", grade: "A", marks: "87%", avg: "76%" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Parent Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-muted-foreground">Welcome back,</span>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-1.5 mt-0.5">
            Rajesh Verma <span className="animate-pulse">👏</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
            <option>Session 2024-25</option>
          </select>
          <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
            <option>Green Valley School</option>
          </select>
        </div>
      </div>

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="My Children"
          value="2"
          icon={Users}
          description="Active Students"
          color="purple"
        />
        <KPICard
          title="Attendance"
          value="92%"
          icon={UserCheck}
          trend={{ value: 5.4, isPositive: true }}
          description="Average This Month"
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value="₹6,250"
          icon={CreditCard}
          description="Due for 1 Child"
          color="blue"
        />
        <KPICard
          title="Overall Performance"
          value="A"
          icon={Award}
          description="Aditya Verma (Class 10-B)"
          color="orange"
        />
        <KPICard
          title="Unread Messages"
          value="3"
          icon={MessageSquare}
          description="From School"
          color="purple"
        />
      </div>

      {/* ── Row 2: My Children + Attendance Overview + Fee Summary ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* My Children Profile Selectors */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">My Children</h3>
              <Link href="/parent/children" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-3.5">
              {kids.map((kid, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-border/60 rounded-xl hover:bg-muted/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0", kid.avatarColor)}>
                      {kid.name.split(" ")[0][0]}{kid.name.split(" ")[1][0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{kid.name}</p>
                      <p className="text-[10px] text-muted-foreground">{kid.class} • Roll No. {kid.rollNo}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-600 border border-green-500/20 text-[9px] font-bold rounded uppercase">
                    {kid.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-dashed border-border hover:border-primary/50 text-[11px] font-bold text-primary rounded-xl transition-all">
            + Add Another Child
          </button>
        </div>

        {/* Attendance donut */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Attendance Overview (This Month)</h3>
              <Link href="/parent/attendance" className="text-xs font-bold text-primary hover:underline">View Details</Link>
            </div>
            <div className="h-[150px] flex items-center justify-between gap-1">
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={attendanceOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {attendanceOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} Days`, "Days"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-foreground leading-none">92%</span>
                  <span className="text-[7px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Present</span>
                </div>
              </div>

              <div className="w-[55%] flex flex-col justify-center space-y-1.5 text-[10px] sm:text-[11px] pr-1">
                {attendanceOverviewData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-1 border-b border-border/30 pb-1 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                    </div>
                    <span className="font-bold text-foreground shrink-0">{item.value} Days</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-green-500/10 text-green-700 border border-green-500/10 rounded-lg p-2 text-center text-[10px] font-bold mt-2">
              Good job! Aditya's attendance is excellent.
            </div>
          </div>
        </div>

        {/* Fee Summary */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Fee Summary</h3>
              <Link href="/parent/fees" className="text-xs font-bold text-primary hover:underline">View Details</Link>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2 border-b border-border/40 pb-3">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Total Fees (Annual)</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">₹52,000</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Paid Amount</p>
                  <p className="text-sm font-bold text-green-600 mt-0.5">₹45,750</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">Pending Amount</p>
                  <p className="text-sm font-bold text-red-500 mt-0.5">₹6,250</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[11px] border-b border-border/30 pb-2">
                <div>
                  <p className="text-muted-foreground font-medium">Last Payment</p>
                  <p className="font-bold text-foreground mt-0.5">₹10,000</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold">Date: 15 May 2025</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">Next Due Date</p>
                  <p className="text-xs font-extrabold text-red-500 mt-0.5">10 Jun 2025</p>
                </div>
                <Link href="/parent/fees" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">
                  Pay Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Timetable + Recent Notices + Upcoming Events ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Today's Timetable (Aditya Verma) */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Today's Timetable (Aditya Verma)</h3>
              <Link href="/parent/timetable" className="text-xs font-bold text-primary hover:underline">View Timetable</Link>
            </div>
            
            <div className="space-y-2 text-xs">
              {timetableToday.slice(0, 5).map((item) => (
                <div key={item.period} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[9px]">
                      {item.period}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-muted-foreground w-[100px] shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{item.subject}</p>
                      <p className="text-[9px] text-muted-foreground">{item.teacher}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded border">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notices */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Notices</h3>
              <Link href="/parent/notices" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-2">
              {announcements.map((item, idx) => (
                <div key={idx} className="p-2 border border-border/60 rounded-lg bg-muted/10 flex flex-col gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", item.color)} />
                    <p className="text-[11px] font-semibold text-foreground leading-tight">{item.text}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono self-end">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/parent/notices" className="text-[11px] text-center font-bold text-primary hover:underline mt-3 self-center">
            View All Notices
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Events</h3>
              <Link href="/parent/calendar" className="text-xs font-bold text-primary hover:underline">View Calendar</Link>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.map((ev, idx) => (
                <div key={idx} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 font-bold border border-blue-500/10">
                    <span className="text-xs leading-none">{ev.day}</span>
                    <span className="text-[8px] uppercase mt-0.5 leading-none">{ev.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">{ev.title}</p>
                    <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{ev.desc}</p>
                    <p className="text-[9px] text-primary/75 font-semibold mt-0.5">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/parent/calendar" className="text-[11px] text-center font-bold text-primary hover:underline mt-3 self-center">
            View All Events
          </Link>
        </div>
      </div>

      {/* ── Row 4: Recent Homework + Upcoming Examinations + Performance Overview ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Recent Homework (Aditya Verma) */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Homework (Aditya Verma)</h3>
              <Link href="/parent/homework" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-2 text-xs">
              {recentHomework.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground truncate max-w-[150px]">{item.topic}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{item.subject}</p>
                  </div>
                  <span className={cn("text-[9px] font-bold", item.isUrgent ? "text-red-500" : "text-muted-foreground")}>
                    {item.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Examinations */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Examinations</h3>
              <Link href="/parent/examinations" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Exam Code</th>
                    <th className="pb-2 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingExams.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-[9px] text-muted-foreground">{item.subject}</p>
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground font-mono">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Overview (Aditya Verma) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Performance Overview (Aditya Verma)</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Term</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[300px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-1.5 font-semibold">Subject</th>
                    <th className="pb-1.5 font-semibold text-center">Overall Grade</th>
                    <th className="pb-1.5 font-semibold text-center">Marks (%)</th>
                    <th className="pb-1.5 font-semibold text-right">Class Average</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceList.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2 font-medium text-foreground">{item.subject}</td>
                      <td className="py-2 text-center font-bold text-green-600">{item.grade}</td>
                      <td className="py-2 text-center text-muted-foreground font-mono">{item.marks}</td>
                      <td className="py-2 text-right text-muted-foreground font-mono">{item.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Link href="/parent/results" className="text-[11px] text-center font-bold text-primary hover:underline mt-3 self-center">
            View Detailed Report
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Student Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function StudentDashboard() {
  const attendanceOverviewData = [
    { name: "Present", value: 23, color: "#22c55e" },
    { name: "Absent", value: 2, color: "#ef4444" },
    { name: "Leave", value: 1, color: "#f59e0b" },
  ];

  const subjectPerformanceData = [
    { block: "Maths", Percentage: 88, color: "#3b82f6" },
    { block: "Physics", Percentage: 82, color: "#22c55e" },
    { block: "Chemistry", Percentage: 78, color: "#f59e0b" },
    { block: "English", Percentage: 90, color: "#8b5cf6" },
    { block: "Computer", Percentage: 85, color: "#ec4899" },
  ];

  const timetableToday = [
    { period: 1, time: "08:30 AM - 09:15 AM", subject: "Mathematics", teacher: "Mr. Rajesh Sharma", room: "Room 201" },
    { period: 2, time: "09:15 AM - 10:00 AM", subject: "Physics", teacher: "Ms. Neha Gupta", room: "Lab 2" },
    { period: 3, time: "10:00 AM - 10:20 AM", subject: "Break", teacher: "-", room: "-" },
    { period: 4, time: "10:20 AM - 11:05 AM", subject: "English", teacher: "Mr. Amit Verma", room: "Room 103" },
    { period: 5, time: "11:05 AM - 11:50 AM", subject: "Chemistry", teacher: "Ms. Pooja Singh", room: "Lab 1" },
    { period: 6, time: "11:50 AM - 12:35 PM", subject: "Computer Science", teacher: "Mr. Rohit Kumar", room: "Lab 3" },
  ];

  const pendingHomework = [
    { topic: "Quadratic Equations", subject: "Mathematics", due: "Due Today", badgeColor: "bg-red-500/10 text-red-600 border-red-500/20 font-bold" },
    { topic: "Lab Report - Motion", subject: "Physics", due: "Due Tomorrow", badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold" },
    { topic: "Chemical Reactions", subject: "Chemistry", due: "02 Jun 2025", badgeColor: "text-muted-foreground" },
    { topic: "Essay on Democracy", subject: "English", due: "03 Jun 2025", badgeColor: "text-muted-foreground" },
    { topic: "Python Functions", subject: "Computer Science", due: "04 Jun 2025", badgeColor: "text-muted-foreground" },
  ];

  const upcomingExams = [
    { name: "Unit Test - 1", subject: "Mathematics", date: "05 Jun 2025" },
    { name: "Unit Test - 1", subject: "Physics", date: "09 Jun 2025" },
    { name: "Unit Test - 1", subject: "Chemistry", date: "12 Jun 2025" },
    { name: "Unit Test - 1", subject: "English", date: "16 Jun 2025" },
  ];

  const announcements = [
    { text: "Summer holiday from 15 June 2025.", date: "28 May 2025", color: "bg-blue-500" },
    { text: "PTM is scheduled on 07 June 2025.", date: "27 May 2025", color: "bg-green-500" },
    { text: "Maths Quiz for Class 10 on 03 June.", date: "26 May 2025", color: "bg-purple-500" },
    { text: "Science Exhibition on 10 June 2025.", date: "25 May 2025", color: "bg-amber-500" },
  ];

  const downloads = [
    { name: "Admit Card - Annual Exam" },
    { name: "Date Sheet - Term 1" },
    { name: "Holiday Calendar 2025" },
    { name: "Bus Route Map" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Student Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-muted-foreground">Welcome back,</span>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-1.5 mt-0.5">
            Aditya Verma <span className="animate-pulse">👏</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
            <option>Session 2024-25</option>
          </select>
          <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
            <option>Green Valley School</option>
          </select>
        </div>
      </div>

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Attendance"
          value="92%"
          icon={UserCheck}
          trend={{ value: 5.4, isPositive: true }}
          description="↑ 5% from last month"
          color="purple"
        />
        <KPICard
          title="Assignments"
          value="05"
          icon={ClipboardList}
          description="2 Due Today"
          color="blue"
        />
        <KPICard
          title="Exams"
          value="02"
          icon={FileCheck}
          description="Next: 05 Jun 2025"
          color="green"
        />
        <KPICard
          title="Fee Balance"
          value="₹6,250"
          icon={CreditCard}
          description="Due on 10 Jun 2025"
          color="red"
        />
        <KPICard
          title="Overall Grade"
          value="A"
          icon={Award}
          description="CGPA: 8.6/10"
          color="orange"
        />
      </div>

      {/* ── Row 2: Timetable + Attendance overview + Announcements ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Today's Timetable */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Today's Timetable</h3>
              <Link href="/student/timetable" className="text-xs font-bold text-primary hover:underline">View Full Timetable</Link>
            </div>
            
            <div className="space-y-2 text-xs">
              {timetableToday.map((item) => (
                <div key={item.period} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[9px]">
                      {item.period}
                    </span>
                    <span className="text-[10px] font-bold font-mono text-muted-foreground w-[110px] shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{item.subject}</p>
                      <p className="text-[9px] text-muted-foreground">{item.teacher}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Attendance Overview (This Month)</h3>
            <div className="h-[180px] flex items-center justify-between gap-1">
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={attendanceOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {attendanceOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} Days`, "Days"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-foreground leading-none">92%</span>
                  <span className="text-[7px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Present</span>
                </div>
              </div>

              <div className="w-[55%] flex flex-col justify-center space-y-2 text-[10px] sm:text-[11px] pr-1">
                {attendanceOverviewData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-1 border-b border-border/30 pb-1 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                    </div>
                    <span className="font-bold text-foreground shrink-0">{item.value} Days</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-green-500/10 text-green-700 border border-green-500/10 rounded-lg p-2 text-center text-[10px] font-bold mt-2">
              Good going! Your attendance is excellent.
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Announcements</h3>
              <Link href="/student/notices" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-3">
              {announcements.map((item, idx) => (
                <div key={idx} className="p-2.5 border border-border/60 rounded-xl bg-muted/10 flex flex-col gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", item.color)} />
                    <p className="text-[11px] font-semibold text-foreground leading-tight">{item.text}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono self-end">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Pending Homework + Upcoming Exams + Performance + Fee status ── */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Pending Homework */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Pending Homework</h3>
              <Link href="/student/homework" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-1.5 font-semibold">Topic</th>
                    <th className="pb-1.5 font-semibold text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingHomework.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5">
                        <p className="font-bold text-foreground truncate max-w-[120px]" title={item.topic}>{item.topic}</p>
                        <p className="text-[9px] text-muted-foreground">{item.subject}</p>
                      </td>
                      <td className="py-2.5 text-right font-mono">
                        <span className={cn("px-1.5 py-0.5 rounded text-[9px] border inline-block whitespace-nowrap", item.badgeColor)}>
                          {item.due}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Exams</h3>
              <Link href="/student/examinations" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Exam Code</th>
                    <th className="pb-2 font-semibold">Subject</th>
                    <th className="pb-2 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingExams.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 text-muted-foreground">{item.subject}</td>
                      <td className="py-2.5 text-right text-muted-foreground font-mono">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Subject Wise Performance</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Term</option>
              </select>
            </div>
            <div className="h-[180px]">
              <HorizontalBarChart
                data={subjectPerformanceData}
                yAxisKey="block"
                barKey="Percentage"
                barName="Score %"
                color="#3b82f6"
              />
            </div>
          </div>
        </div>

        {/* Fee Payment status circular gauge */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Fee Payment Status</h3>
              <Link href="/student/fees" className="text-xs font-bold text-primary hover:underline">View Details</Link>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center h-24 w-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-muted/20" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="stroke-success" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 87.98) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-muted-foreground font-bold uppercase leading-none">Total Fees</span>
                  <span className="text-sm font-extrabold text-foreground mt-0.5">₹52,000</span>
                </div>
              </div>

              <div className="w-full space-y-1 text-[11px] border-b border-border/40 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                    <span className="text-muted-foreground font-medium">Paid</span>
                  </div>
                  <span className="font-bold text-foreground">₹45,750</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-muted-foreground font-medium">Pending</span>
                  </div>
                  <span className="font-bold text-foreground">₹6,250</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center w-full mt-1">
                <span className="text-[10px] text-red-500 font-bold">Due Date: 10 Jun 2025</span>
                <Link href="/student/fees" className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold shadow-sm transition-colors">
                  Pay Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Library + Transport + Downloads + Quick Actions ── */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Library Info */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Library</h3>
              <Link href="/student/library" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="flex gap-3">
              <div className="h-16 w-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary text-[8px] font-bold text-center p-1 uppercase shrink-0">
                Physics
              </div>
              <div className="min-w-0 text-xs flex flex-col justify-center">
                <p className="font-bold text-foreground truncate">Fundamentals of Physics</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">Author: David Halliday</p>
                <p className="text-[9px] text-muted-foreground font-mono mt-1">Issued: 20 May 2025</p>
                <p className="text-[9px] text-red-500 font-bold font-mono mt-0.5">Due: 03 Jun 2025</p>
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 border border-green-500/20 text-[9px] font-bold rounded uppercase self-start mt-3">
            Issued
          </span>
        </div>

        {/* Transport Info */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Transport</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-border/30 pb-1">
                <span className="text-muted-foreground font-medium">Bus No.</span>
                <span className="font-mono font-bold text-foreground">UP32 AB 1234</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-1">
                <span className="text-muted-foreground font-medium">Route</span>
                <span className="text-foreground truncate max-w-[120px] font-semibold" title="City Center - Green Valley">City Center - Green Valley</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-1">
                <span className="text-muted-foreground font-medium">Pickup Time</span>
                <span className="font-mono text-foreground">07:15 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Drop Time</span>
                <span className="font-mono text-foreground">02:30 PM</span>
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 border border-green-500/20 text-[9px] font-bold rounded uppercase self-start mt-3">
            Active
          </span>
        </div>

        {/* Downloads */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Downloads</h3>
              <Link href="/student/downloads" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            
            <div className="space-y-2 text-xs">
              {downloads.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-1.5 last:border-0 last:pb-0 group hover:bg-muted/10 cursor-pointer">
                  <span className="text-muted-foreground font-medium truncate max-w-[160px]" title={item.name}>{item.name}</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary border border-primary/10 shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Apply Leave", color: "bg-green-500/10 text-green-500 border-green-500/10 hover:bg-green-500/20", href: "/student/leave" },
                { label: "Fee Payment", color: "bg-red-500/10 text-red-500 border-red-500/10 hover:bg-red-500/20", href: "/student/fees" },
                { label: "Ask Doubt", color: "bg-blue-500/10 text-blue-500 border-blue-500/10 hover:bg-blue-500/20", href: "/student/messages" },
                { label: "Online Classes", color: "bg-purple-500/10 text-purple-500 border-purple-500/10 hover:bg-purple-500/20", href: "/student/timetable" },
              ].map((act, idx) => (
                <Link
                  key={idx}
                  href={act.href}
                  className={cn("flex flex-col items-center justify-center p-2 rounded-lg border text-center text-[10px] font-bold transition-all shadow-sm", act.color)}
                >
                  {act.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Teacher Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function TeacherDashboard() {
  const attendanceOverviewData = [
    { name: "Present", value: 92, color: "#22c55e" },
    { name: "Absent", value: 6, color: "#ef4444" },
    { name: "Leave", value: 2, color: "#f59e0b" },
  ];

  const classPerformanceData = [
    { block: "Class 7-B", Percentage: 72, color: "#8b5cf6" },
    { block: "Class 8-A", Percentage: 83, color: "#22c55e" },
    { block: "Class 9-A", Percentage: 78, color: "#f59e0b" },
    { block: "Class 9-B", Percentage: 68, color: "#ec4899" },
    { block: "Class 10-B", Percentage: 85, color: "#3b82f6" },
  ];

  const timetableToday = [
    { time: "08:30 AM", class: "Class 9-A", subject: "Mathematics", status: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { time: "09:30 AM", class: "Class 10-B", subject: "Mathematics", status: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { time: "10:30 AM", class: "Class 8-A", subject: "Mathematics", status: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { time: "11:30 AM", class: "Class 7-B", subject: "Mathematics", status: "Upcoming", color: "bg-muted text-muted-foreground border-border" },
    { time: "01:00 PM", class: "Class 9-B", subject: "Mathematics", status: "Upcoming", color: "bg-muted text-muted-foreground border-border" },
  ];

  const classesOverview = [
    { class: "Class 9-A", subject: "Mathematics", students: 28 },
    { class: "Class 10-B", subject: "Mathematics", students: 23 },
    { class: "Class 8-A", subject: "Mathematics", students: 25 },
    { class: "Class 7-B", subject: "Mathematics", students: 26 },
    { class: "Class 9-B", subject: "Mathematics", students: 26 },
    { class: "Class 10-A", subject: "Mathematics", students: 28 },
  ];

  const recentHomework = [
    { topic: "Quadratic Equations", class: "Class 9-A", ratio: "12/28 Submitted" },
    { topic: "Surface Areas & Volumes", class: "Class 10-B", ratio: "18/23 Submitted" },
    { topic: "Linear Equations", class: "Class 8-A", ratio: "10/25 Submitted" },
    { topic: "Integers", class: "Class 7-B", ratio: "8/26 Submitted" },
    { topic: "Real Numbers", class: "Class 9-B", ratio: "20/26 Submitted" },
  ];

  const announcements = [
    { text: "PTM is scheduled on 07 June 2025.", date: "29 May 2025", color: "bg-blue-500" },
    { text: "Summer holiday from 15 June 2025.", date: "28 May 2025", color: "bg-amber-500" },
    { text: "Maths Quiz for Class 8 on 03 June.", date: "27 May 2025", color: "bg-purple-500" },
    { text: "Submit assignment on time.", date: "26 May 2025", color: "bg-green-500" },
    { text: "Extra classes for weak students on 31 May 2025.", date: "25 May 2025", color: "bg-green-500" },
  ];

  const evaluationList = [
    { test: "Unit Test - 1", class: "Class 10-B", subject: "Mathematics", total: 23, evaluated: 20, pending: 3, status: "Evaluate", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer" },
    { test: "Mid Term Exam", class: "Class 9-A", subject: "Mathematics", total: 28, evaluated: 25, pending: 3, status: "Evaluate", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer" },
    { test: "Unit Test - 1", class: "Class 8-A", subject: "Mathematics", total: 25, evaluated: 25, pending: 0, status: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { test: "Monthly Test", class: "Class 7-B", subject: "Mathematics", total: 26, evaluated: 18, pending: 8, status: "Evaluate", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer" },
  ];

  const upcomingClassesReminders = [
    { class: "Class 9-A", subject: "Mathematics", date: "30 May 2025", time: "08:30 AM" },
    { class: "Class 10-B", subject: "Mathematics", date: "30 May 2025", time: "09:30 AM" },
    { class: "Class 8-A", subject: "Mathematics", date: "30 May 2025", time: "10:30 AM" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <PageHeader
        title="Teacher Dashboard"
        description="Plan classes, register roll calls, publish assignments, configure exams, and manage reports."
        actions={
          <div className="flex items-center gap-3">
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Session 2024-25</option>
              <option>Session 2025-26</option>
            </select>
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Green Valley School</option>
            </select>
          </div>
        }
      />

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 6 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="My Classes"
          value="6"
          icon={GraduationCap}
          description="All Classes"
          color="purple"
        />
        <KPICard
          title="My Students"
          value="156"
          icon={Users}
          description="Total Students"
          color="blue"
        />
        <KPICard
          title="Today's Classes"
          value="4"
          icon={Calendar}
          description="Next: 10:30 AM"
          color="green"
        />
        <KPICard
          title="Pending Homework"
          value="3"
          icon={ClipboardList}
          description="To Be Checked"
          color="orange"
        />
        <KPICard
          title="Pending Exams"
          value="2"
          icon={FileCheck}
          description="To Be Evaluated"
          color="red"
        />
        <KPICard
          title="Leave Balance"
          value="12"
          icon={CalendarRange}
          description="Days Remaining"
          color="blue"
        />
      </div>

      {/* ── Row 2: Timetable + Attendance overview + Classes list ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Timetable Card */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Today's Timetable</h3>
              <Link href="/teacher/timetable" className="text-xs font-bold text-primary hover:underline">View Full Timetable</Link>
            </div>
            
            <div className="space-y-3">
              {timetableToday.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold font-mono text-muted-foreground">{item.time}</span>
                    <span className="h-4 w-0.5 bg-border shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.class}</p>
                      <p className="text-[10px] text-muted-foreground">{item.subject}</p>
                    </div>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold border inline-block uppercase", item.color)}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Overview Donut Chart */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Attendance Overview (This Month)</h3>
            <div className="h-[180px] flex items-center justify-between gap-1">
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={attendanceOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {attendanceOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value}%`, "Share"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-foreground leading-none">92%</span>
                  <span className="text-[6.5px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Average Attendance</span>
                </div>
              </div>

              <div className="w-[55%] flex flex-col justify-center space-y-2 text-[10px] sm:text-[11px] pr-1">
                {attendanceOverviewData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-1 border-b border-border/30 pb-1 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                    </div>
                    <span className="font-bold text-foreground shrink-0">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Classes Overview Table */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">My Classes Overview</h3>
              <Link href="/teacher/my-classes" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-1.5 font-semibold">Class</th>
                    <th className="pb-1.5 font-semibold">Subject</th>
                    <th className="pb-1.5 font-semibold text-center">Students</th>
                    <th className="pb-1.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classesOverview.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-bold text-foreground">{item.class}</td>
                      <td className="py-2.5 text-muted-foreground">{item.subject}</td>
                      <td className="py-2.5 text-center text-muted-foreground font-mono">{item.students}</td>
                      <td className="py-2.5 text-right">
                        <Link href={`/teacher/students?class=${item.class}`} className="text-primary font-bold hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Homework + Recent Announcements + Student Performance Overview ── */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Recent Homework */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Homework</h3>
              <Link href="/teacher/homework" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Homework Topic</th>
                    <th className="pb-2 font-semibold">Class</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHomework.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-medium text-foreground">{item.topic}</td>
                      <td className="py-2.5 text-muted-foreground font-mono">{item.class}</td>
                      <td className="py-2.5 text-right font-bold font-mono text-green-500">{item.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Announcements</h3>
              <Link href="/teacher/notice-board" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {announcements.map((n, idx) => (
                <div key={idx} className="p-2 border border-border/60 rounded-lg bg-muted/10 flex flex-col gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", n.color)} />
                    <p className="text-[11px] font-semibold text-foreground leading-tight">{n.text}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono self-end">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Performance Overview Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Student Performance Overview</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Month</option>
              </select>
            </div>
            <div className="h-[180px]">
              <HorizontalBarChart
                data={classPerformanceData}
                yAxisKey="block"
                barKey="Percentage"
                barName="Class Average %"
                color="#3b82f6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Examination/Evaluation + Upcoming Classes ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Examination / Evaluation Table */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Examination / Evaluation</h3>
            <Link href="/teacher/examinations" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 font-semibold">Exam / Test</th>
                  <th className="pb-2 font-semibold">Class</th>
                  <th className="pb-2 font-semibold">Subject</th>
                  <th className="pb-2 font-semibold text-center">Total Students</th>
                  <th className="pb-2 font-semibold text-center">Evaluated</th>
                  <th className="pb-2 font-semibold text-center">Pending</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {evaluationList.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                    <td className="py-2.5 font-medium text-foreground">{item.test}</td>
                    <td className="py-2.5 font-bold text-foreground">{item.class}</td>
                    <td className="py-2.5 text-muted-foreground">{item.subject}</td>
                    <td className="py-2.5 text-center text-muted-foreground font-mono">{item.total}</td>
                    <td className="py-2.5 text-center text-muted-foreground font-mono">{item.evaluated}</td>
                    <td className="py-2.5 text-center text-red-500 font-bold font-mono">{item.pending}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn("px-3 py-1 rounded text-[10px] font-bold border inline-block", item.color)}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Classes reminders */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Upcoming Classes</h3>
            <div className="space-y-3">
              {upcomingClassesReminders.map((item, idx) => (
                <div key={idx} className="p-3 border border-border/60 rounded-xl bg-muted/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-500/10 text-blue-500 border border-blue-500/10">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.class}</p>
                      <p className="text-[10px] text-muted-foreground">{item.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground font-mono">{item.time}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold font-mono">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Hostel Warden Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function HostelDashboard() {
  const occupancyOverviewData = [
    { name: "Occupied Beds", value: 256, color: "#8b5cf6" },
    { name: "Vacant Beds", value: 64, color: "#22c55e" },
  ];

  const blockOccupancyData = [
    { block: "A Block", Percentage: 90, color: "#8b5cf6" },
    { block: "B Block", Percentage: 75, color: "#22c55e" },
    { block: "C Block", Percentage: 85, color: "#f59e0b" },
    { block: "D Block", Percentage: 70, color: "#3b82f6" },
    { block: "E Block", Percentage: 60, color: "#ec4899" },
  ];

  const pendingFeesData = [
    { name: "Rohan Verma", room: "Room B-203", amount: 8500 },
    { name: "Arjun Singh", room: "Room C-105", amount: 7500 },
    { name: "Karan Gupta", room: "Room A-101", amount: 6000 },
    { name: "Vivek Kumar", room: "Room D-201", amount: 5750 },
    { name: "Manish Patel", room: "Room B-204", amount: 5000 },
  ];

  const recentCheckIns = [
    { name: "Rohan Verma", room: "Room B-203", date: "29 May 2025", time: "09:15 AM" },
    { name: "Arjun Singh", room: "Room C-105", date: "29 May 2025", time: "10:20 AM" },
    { name: "Vivek Kumar", room: "Room A-101", date: "28 May 2025", time: "08:45 AM" },
    { name: "Karan Gupta", room: "Room B-204", date: "28 May 2025", time: "07:30 PM" },
    { name: "Suresh Kumar", room: "Room D-104", date: "28 May 2025", time: "06:10 PM" },
  ];

  const leaveRequests = [
    { name: "Rohan Verma", room: "Room B-203", status: "Pending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { name: "Aryan Mishra", room: "Room A-202", status: "Approved", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { name: "Vivek Kumar", room: "Room C-105", status: "Pending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { name: "Manish Patel", room: "Room D-201", status: "Approved", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { name: "Karan Gupta", room: "Room B-204", status: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  ];

  const todaysVisitors = [
    { name: "Ravi Verma", relation: "Father of Rohan", time: "11:30 AM" },
    { name: "Suresh Kumar", relation: "Father of Aryan", time: "12:15 PM" },
    { name: "Pooja Sharma", relation: "Mother of Vivek", time: "02:20 PM" },
    { name: "Anil Patel", relation: "Uncle of Manish", time: "04:10 PM" },
    { name: "Neha Gupta", relation: "Sister of Karan", time: "05:05 PM" },
  ];

  const recentComplaints = [
    { title: "Wi-Fi not working", room: "Room C-105", date: "28 May 2025", status: "Resolved", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { title: "Mess food quality", room: "Room A-101", date: "28 May 2025", status: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { title: "Water problem in washroom", room: "Room B-203", date: "27 May 2025", status: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { title: "TV in common room not working", room: "Room D-201", date: "27 May 2025", status: "Resolved", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { title: "Ac cooler not working", room: "Room E-102", date: "26 May 2025", status: "Resolved", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  ];

  const feeSummaryData = [
    { block: "A Block", students: 68, collected: 124000, pending: 16000, total: 140000 },
    { block: "B Block", students: 72, collected: 120000, pending: 15000, total: 135000 },
    { block: "C Block", students: 50, collected: 92000, pending: 12000, total: 104000 },
    { block: "D Block", students: 40, collected: 56000, pending: 9000, total: 65000 },
    { block: "E Block", students: 26, collected: 40000, pending: 6750, total: 46750 },
  ];

  const roomStatusData = [
    { name: "Occupied", value: 38, color: "#8b5cf6" },
    { name: "Vacant", value: 2, color: "#22c55e" },
    { name: "Maintenance", value: 2, color: "#f59e0b" },
  ];

  const notices = [
    { text: "Mess will be closed on 02 June 2025 (Monday) due to public holiday.", date: "29 May 2025", color: "bg-purple-500" },
    { text: "Library timing in hostel is 6:00 PM to 9:00 PM.", date: "28 May 2025", color: "bg-green-500" },
    { text: "All students are requested to keep their rooms clean.", date: "27 May 2025", color: "bg-amber-500" },
    { text: "Hostel fee for June month is due before 05 June 2025.", date: "27 May 2025", color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <PageHeader
        title="Hostel Warden Dashboard"
        description="Monitor student accommodation status, review leave registrations, audit collections, and track complaints."
        actions={
          <div className="flex items-center gap-3">
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Session 2024-25</option>
              <option>Session 2025-26</option>
            </select>
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Green Valley School</option>
            </select>
          </div>
        }
      />

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Total Students"
          value="256"
          icon={Users}
          trend={{ value: 4.9, isPositive: true }}
          description="↑ 12 this month"
          color="purple"
        />
        <KPICard
          title="Rooms"
          value="42"
          icon={Home}
          description="Allotted: 38"
          color="blue"
        />
        <KPICard
          title="Beds"
          value="320"
          icon={Home}
          description="Occupied: 256"
          color="orange"
        />
        <KPICard
          title="Occupancy"
          value="80%"
          icon={CheckCircle}
          trend={{ value: 6.67, isPositive: true }}
          description="↑ 5% this month"
          color="green"
        />
        <KPICard
          title="Pending Fees"
          value="₹48,750"
          icon={CreditCard}
          description="12 Students"
          color="red"
        />
      </div>

      {/* ── Row 2: Charts + Right side details ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Occupancy Donut Chart */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Hostel Occupancy Overview</h3>
            <div className="h-[180px] flex items-center justify-between gap-1">
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={occupancyOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {occupancyOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} Beds`, "Beds"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-extrabold text-foreground leading-none">256</span>
                  <span className="text-[7px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Occupied</span>
                </div>
              </div>

              <div className="w-[55%] flex flex-col justify-center space-y-2 text-[10px] sm:text-[11px] pr-1">
                {occupancyOverviewData.map((item) => {
                  const percent = ((item.value / 320) * 100).toFixed(0);
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground shrink-0">{item.value} ({percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-center pt-2.5 mt-2.5 border-t border-border/45">
              <span className="text-[11px] font-bold text-muted-foreground">Total Beds: 320</span>
            </div>
          </div>
        </div>

        {/* Room Occupancy Block Wise */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Room Occupancy (Block Wise)</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Month</option>
              </select>
            </div>
            <div className="h-[180px]">
              <HorizontalBarChart
                data={blockOccupancyData}
                yAxisKey="block"
                barKey="Percentage"
                barName="Occupancy %"
                color="#8b5cf6"
              />
            </div>
          </div>
        </div>

        {/* Today's Check-In / Check-Out */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Today's Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10 text-green-500 border border-green-500/10">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Check-In</p>
                    <p className="text-[10px] text-muted-foreground">8 Students</p>
                  </div>
                </div>
                <Link href="/hostel/visitors" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/10">
                    <X className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Check-Out</p>
                    <p className="text-[10px] text-muted-foreground">3 Students</p>
                  </div>
                </div>
                <Link href="/hostel/visitors" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
              </div>

              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/10">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Total Present</p>
                    <p className="text-[10px] text-muted-foreground">234 Students</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/10">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Total Absent</p>
                    <p className="text-[10px] text-muted-foreground">22 Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Hostel Fees */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Pending Hostel Fees</h3>
              <Link href="/hostel/finance" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {pendingFeesData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-[9px] text-muted-foreground">{item.room}</p>
                  </div>
                  <span className="font-bold text-foreground shrink-0">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-border/45 text-xs">
              <span className="font-semibold text-muted-foreground">Total Pending</span>
              <span className="font-extrabold text-red-500">₹48,750</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Four Columns (Logs & Milestones) ── */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Recent Check-Ins */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Check-Ins</h3>
              <Link href="/hostel/visitors" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Student</th>
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCheckIns.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-[9px] text-muted-foreground">{item.room}</p>
                      </td>
                      <td className="py-2 text-muted-foreground font-mono">{item.date}</td>
                      <td className="py-2 text-right text-muted-foreground font-mono">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Leave Requests</h3>
              <Link href="/hostel/leave" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Student</th>
                    <th className="pb-2 font-semibold">Room</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2 font-medium text-foreground">{item.name}</td>
                      <td className="py-2 text-muted-foreground font-mono">{item.room}</td>
                      <td className="py-2 text-right">
                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold border inline-block", item.color)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Today's Visitors */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Today's Visitors</h3>
              <Link href="/hostel/visitors" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Visitor</th>
                    <th className="pb-2 font-semibold">Relation</th>
                    <th className="pb-2 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysVisitors.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 text-muted-foreground">{item.relation}</td>
                      <td className="py-2.5 text-right text-muted-foreground font-mono">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Complaints</h3>
              <Link href="/hostel/complaints" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Complaint</th>
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2">
                        <p className="font-medium text-foreground truncate max-w-[90px]" title={item.title}>{item.title}</p>
                        <p className="text-[9px] text-muted-foreground">{item.room}</p>
                      </td>
                      <td className="py-2 text-muted-foreground font-mono">{item.date.split(" ")[0]}</td>
                      <td className="py-2 text-right">
                        <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold border inline-block whitespace-nowrap", item.color)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Fee collection summary & notices ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Hostel Fee Collection Summary */}
        <div className="lg:col-span-6 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Hostel Fee Collection Summary</h3>
            <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
              <option>This Month</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[450px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 font-semibold">Block</th>
                  <th className="pb-2 font-semibold text-center">Total Students</th>
                  <th className="pb-2 font-semibold">Collected (₹)</th>
                  <th className="pb-2 font-semibold">Pending (₹)</th>
                  <th className="pb-2 font-semibold text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {feeSummaryData.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                    <td className="py-2.5 font-medium text-foreground">{item.block}</td>
                    <td className="py-2.5 text-center text-muted-foreground">{item.students}</td>
                    <td className="py-2.5 text-muted-foreground font-mono">₹{item.collected.toLocaleString()}</td>
                    <td className="py-2.5 text-muted-foreground font-mono">₹{item.pending.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-foreground font-mono">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="border-t border-border/60 font-bold bg-muted/5">
                  <td className="py-2.5 text-foreground">Total</td>
                  <td className="py-2.5 text-center text-foreground">256</td>
                  <td className="py-2.5 text-foreground font-mono">₹4,32,000</td>
                  <td className="py-2.5 text-red-500 font-mono">₹58,750</td>
                  <td className="py-2.5 text-right text-foreground font-mono">₹4,90,750</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Status Overview Donut Chart */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Room Status Overview</h3>
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={roomStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {roomStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} Rooms`, "Rooms"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-foreground leading-none">42</span>
                  <span className="text-[7px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wide">Total Rooms</span>
                </div>
              </div>

              <div className="w-full space-y-1 text-[11px]">
                {roomStatusData.map((item) => {
                  const percent = ((item.value / 42) * 100).toFixed(0);
                  return (
                    <div key={item.name} className="flex items-center justify-between border-b border-border/40 pb-1 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{item.value} ({percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Important Notices */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Important Notices</h3>
              <Link href="/hostel/dashboard" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {notices.map((n, idx) => (
                <div key={idx} className="p-2 border border-border/60 rounded-lg bg-muted/10 flex flex-col gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", n.color)} />
                    <p className="text-[11px] font-medium text-foreground leading-tight">{n.text}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono self-end">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Transport Manager Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function TransportDashboard() {
  const vehicleStatusData = [
    { name: "Running", value: 28, color: "#22c55e" },
    { name: "In Maintenance", value: 2, color: "#f59e0b" },
    { name: "Inactive", value: 1, color: "#ef4444" },
    { name: "Pending Service", value: 1, color: "#ec4899" },
  ];

  const tripsOverviewData = [
    { day: "23 May", Completed: 45, Upcoming: 15 },
    { day: "24 May", Completed: 50, Upcoming: 18 },
    { day: "25 May", Completed: 40, Upcoming: 12 },
    { day: "26 May", Completed: 70, Upcoming: 25 },
    { day: "27 May", Completed: 60, Upcoming: 20 },
    { day: "28 May", Completed: 55, Upcoming: 22 },
    { day: "29 May", Completed: 48, Upcoming: 16 },
  ];

  const topRoutesData = [
    { title: "Route 1 (City Center)", count: 185, color: "#3b82f6" },
    { title: "Route 4 (Green Park)", count: 142, color: "#22c55e" },
    { title: "Route 2 (Airport Road)", count: 128, color: "#f59e0b" },
    { title: "Route 7 (Royal Enclave)", count: 110, color: "#8b5cf6" },
    { title: "Route 3 (Civil Lines)", count: 98, color: "#ec4899" },
  ];

  const maintenanceAlerts = [
    { vehicleNo: "UP32 AB 1234", name: "Bus 01", date: "31 May 2025", status: "Due Soon", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { vehicleNo: "UP32 CD 5678", name: "Bus 07", date: "02 Jun 2025", status: "Due Soon", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { vehicleNo: "UP32 EF 9012", name: "Bus 12", date: "21 May 2025", status: "Overdue", color: "bg-red-500/10 text-red-600 border-red-500/20" },
    { vehicleNo: "UP32 GH 3456", name: "Bus 18", date: "04 Jun 2025", status: "Due Soon", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { vehicleNo: "UP32 IJ 7890", name: "Bus 25", date: "05 Jun 2025", status: "Overdue", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  ];

  const todaysTrips = [
    { route: "Route 1", vehicle: "UP32 AB 1234", driver: "Amit Kumar", type: "Morning", status: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { route: "Route 2", vehicle: "UP32 CD 5678", driver: "Rakesh Singh", type: "Morning", status: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { route: "Route 3", vehicle: "UP32 EF 9012", driver: "Suresh Yadav", type: "Morning", status: "Completed", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { route: "Route 4", vehicle: "UP32 GH 3456", driver: "Mahesh Pal", type: "Evening", status: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { route: "Route 5", vehicle: "UP32 IJ 7890", driver: "Vikram Singh", type: "Evening", status: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  ];

  const driverAttendanceData = [
    { name: "Present", value: 24, color: "#22c55e" },
    { name: "Absent", value: 1, color: "#ef4444" },
    { name: "On Leave", value: 1, color: "#f59e0b" },
  ];

  const fuelTransactions = [
    { date: "29 May 2025", vehicleNo: "UP32 AB 1234", name: "Bus 01", qty: 40.00, amt: 4320, driver: "Amit Kumar", station: "Fuel Station 1" },
    { date: "29 May 2025", vehicleNo: "UP32 CD 5678", name: "Bus 07", qty: 35.50, amt: 3827, driver: "Rakesh Singh", station: "Fuel Station 2" },
    { date: "29 May 2025", vehicleNo: "UP32 EF 9012", name: "Bus 12", qty: 42.00, amt: 4536, driver: "Suresh Yadav", station: "Fuel Station 1" },
    { date: "28 May 2025", vehicleNo: "UP32 GH 3456", name: "Bus 18", qty: 38.00, amt: 4104, driver: "Mahesh Pal", station: "Fuel Station 3" },
    { date: "28 May 2025", vehicleNo: "UP32 IJ 7890", name: "Bus 25", qty: 36.00, amt: 3888, driver: "Vikram Singh", station: "Fuel Station 2" },
  ];

  const notifications = [
    { text: "Vehicle UP32 EF 9012 Insurance will expire on 15 Jun 2025.", date: "29 May 2025", color: "bg-rose-500" },
    { text: "Driver Rakesh Singh document (DL) will expire on 10 Jun 2025.", date: "29 May 2025", color: "bg-amber-500" },
    { text: "Bus 07 is due for service on 02 Jun 2025.", date: "29 May 2025", color: "bg-blue-500" },
    { text: "Fitness certificate of Bus 18 will expire on 20 Jun 2025.", date: "28 May 2025", color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Greenwood School Toolbar */}
      <PageHeader
        title="Transport Manager Dashboard"
        description="Oversee fleet status, monitor daily trip schedules, track fuel costs, and manage driver attendance."
        actions={
          <div className="flex items-center gap-3">
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Session 2024-25</option>
              <option>Session 2025-26</option>
            </select>
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Green Valley School</option>
            </select>
          </div>
        }
      />

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Total Vehicles"
          value="32"
          icon={Bus}
          description="Active: 28 | Inactive: 4"
          color="blue"
        />
        <KPICard
          title="Total Routes"
          value="18"
          icon={Building2}
          description="Active Routes"
          color="green"
        />
        <KPICard
          title="Total Drivers"
          value="26"
          icon={Users}
          description="Active: 24 | Inactive: 2"
          color="orange"
        />
        <KPICard
          title="Total Students"
          value="1,248"
          icon={Users}
          trend={{ value: 2.97, isPositive: true }}
          description="↑ 36 this month"
          color="purple"
        />
        <KPICard
          title="Today's Fuel Cost"
          value="₹12,450"
          icon={CreditCard}
          description="Total Trips Today: 48"
          color="red"
        />
      </div>

      {/* ── Row 2: Charts + Right side list ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Vehicle Status Overview Donut Chart */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Vehicle Status Overview</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>All Fleet</option>
              </select>
            </div>
            
            <div className="h-[200px] flex items-center justify-between gap-1">
              {/* Chart */}
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={vehicleStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {vehicleStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${Number(value)} Vehicles (${((Number(value) / 32) * 100).toFixed(1)}%)`,
                        "Vehicles",
                      ]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                {/* Centered Total */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-foreground leading-none">32</span>
                  <span className="text-[7.5px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-[55%] flex flex-col justify-center space-y-2 text-[10px] sm:text-[11px] pr-1">
                {vehicleStatusData.map((item) => {
                  const percent = ((item.value / 32) * 100).toFixed(1);
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground shrink-0 whitespace-nowrap pl-0.5">
                        {item.value} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link href="/transport/vehicles" className="flex items-center justify-center w-full pt-2.5 mt-auto text-[11px] font-bold text-primary hover:underline border-t border-border/45">
              View All Vehicles
            </Link>
          </div>
        </div>

        {/* Trips Overview Line Chart */}
        <div className="lg:col-span-5">
          <ChartContainer
            title="Trips Overview (This Week)"
            subtitle="Completed and upcoming runs over the past week"
            action={
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Week</option>
              </select>
            }
          >
            <LineChart
              data={tripsOverviewData}
              xAxisKey="day"
              series={[
                { key: "Completed", name: "Completed Trips", color: "#3b82f6" },
                { key: "Upcoming", name: "Upcoming Trips", color: "#22c55e" },
              ]}
            />
          </ChartContainer>
          <div className="text-right -mt-2.5 mb-1.5">
            <Link href="/transport/trips" className="text-xs font-bold text-primary hover:underline">View Trip Management →</Link>
          </div>
        </div>

        {/* Top Routes Horizontal Bar Chart */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Top Routes (By Students)</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>All Routes</option>
              </select>
            </div>
            
            <div className="h-[180px]">
              <HorizontalBarChart
                data={topRoutesData}
                yAxisKey="title"
                barKey="count"
                barName="Students"
                color="#3b82f6"
              />
            </div>
            <Link href="/transport/routes" className="flex items-center justify-center w-full pt-2.5 mt-auto text-[11px] font-bold text-primary hover:underline border-t border-border/45">
              View All Routes
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 3: Tables & Attendance ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Vehicle Maintenance Alerts */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                <h3 className="text-sm font-semibold tracking-tight text-foreground">Vehicle Maintenance Alerts</h3>
              </div>
              <Link href="/transport/vehicles/maintenance" className="text-xs font-bold text-primary hover:underline">View All Maintenance →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[320px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Vehicle No.</th>
                    <th className="pb-2 font-semibold">Vehicle Name</th>
                    <th className="pb-2 font-semibold">Next Service Date</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceAlerts.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-bold font-mono text-primary hover:underline cursor-pointer">{item.vehicleNo}</td>
                      <td className="py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 text-muted-foreground font-mono">{item.date}</td>
                      <td className="py-2.5 text-right">
                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold border inline-block", item.color)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Today's Trips */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Today's Trips</h3>
              <Link href="/transport/trips" className="text-xs font-bold text-primary hover:underline">View All Trips →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[280px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Route</th>
                    <th className="pb-2 font-semibold">Vehicle</th>
                    <th className="pb-2 font-semibold">Driver</th>
                    <th className="pb-2 font-semibold">Type</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysTrips.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-medium text-foreground">{item.route}</td>
                      <td className="py-2.5 font-mono text-muted-foreground">{item.vehicle}</td>
                      <td className="py-2.5 text-muted-foreground">{item.driver}</td>
                      <td className="py-2.5 text-muted-foreground">{item.type}</td>
                      <td className="py-2.5 text-right">
                        <span className={cn("px-2 py-0.5 rounded text-[9px] font-bold border inline-block", item.color)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Driver Attendance Donut Chart */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Driver Attendance (Today)</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>Today</option>
              </select>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-muted/20" strokeWidth="9" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="stroke-success" strokeWidth="9" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 92.31) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-foreground leading-none">26</span>
                  <span className="text-[7px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wide">Total Drivers</span>
                </div>
              </div>

              <div className="w-full space-y-1.5 text-[11px]">
                {driverAttendanceData.map((item) => {
                  const percent = ((item.value / 26) * 100).toFixed(2);
                  return (
                    <div key={item.name} className="flex items-center justify-between border-b border-border/40 pb-1 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{item.value} ({percent}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link href="/transport/attendance" className="flex items-center justify-center w-full pt-2.5 mt-auto text-[11px] font-bold text-primary hover:underline border-t border-border/45">
              View Attendance →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 4: Recent Fuel Transactions & Important Notifications ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Recent Fuel Transactions */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Fuel Transactions</h3>
            <Link href="/transport/fuel" className="text-xs font-bold text-primary hover:underline">View All Fuel Records →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Vehicle No.</th>
                  <th className="pb-2 font-semibold">Vehicle Name</th>
                  <th className="pb-2 font-semibold">Quantity (Ltr)</th>
                  <th className="pb-2 font-semibold">Amount (₹)</th>
                  <th className="pb-2 font-semibold">Driver</th>
                  <th className="pb-2 font-semibold text-right">Filled By</th>
                </tr>
              </thead>
              <tbody>
                {fuelTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                    <td className="py-2.5 text-muted-foreground font-mono">{tx.date}</td>
                    <td className="py-2.5 font-bold font-mono text-primary hover:underline cursor-pointer">{tx.vehicleNo}</td>
                    <td className="py-2.5 font-medium text-foreground">{tx.name}</td>
                    <td className="py-2.5 text-muted-foreground font-mono">{tx.qty.toFixed(2)}</td>
                    <td className="py-2.5 font-bold text-foreground">₹{tx.amt.toLocaleString()}</td>
                    <td className="py-2.5 text-muted-foreground">{tx.driver}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{tx.station}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notifications */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Important Notifications</h3>
              <Link href="/transport/dashboard" className="text-xs font-bold text-primary hover:underline">View All Notifications →</Link>
            </div>
            <div className="space-y-3.5">
              {notifications.map((n, idx) => (
                <div key={idx} className="p-3 border border-border/60 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all flex justify-between items-start gap-3">
                  <div className="flex gap-2 min-w-0">
                    <span className={cn("h-2.5 w-2.5 rounded-full shrink-0 mt-1", n.color)} />
                    <p className="text-xs font-semibold text-foreground leading-normal">{n.text}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold shrink-0 font-mono pt-0.5">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Librarian Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function LibrarianDashboard() {
  const issueReturnData = [
    { day: "23 May", Issued: 42, Returned: 48 },
    { day: "24 May", Issued: 35, Returned: 30 },
    { day: "25 May", Issued: 60, Returned: 40 },
    { day: "26 May", Issued: 40, Returned: 35 },
    { day: "27 May", Issued: 48, Returned: 32 },
    { day: "28 May", Issued: 58, Returned: 38 },
    { day: "29 May", Issued: 45, Returned: 35 },
  ];

  const bookCategoryData = [
    { name: "Academic", value: 3245, color: "#8b5cf6" },
    { name: "Reference", value: 2150, color: "#3b82f6" },
    { name: "Fiction", value: 1820, color: "#22c55e" },
    { name: "Biography", value: 780, color: "#f59e0b" },
    { name: "Others", value: 659, color: "#ef4444" },
  ];

  const recentlyIssued = [
    { name: "Aarav Sharma", title: "Advanced Physics", date: "29 May 2025", due: "12 Jun 2025" },
    { name: "Diya Singh", title: "Business Studies", date: "29 May 2025", due: "12 Jun 2025" },
    { name: "Kabir Verma", title: "The Alchemist", date: "29 May 2025", due: "12 Jun 2025" },
    { name: "Myra Patel", title: "Computer Networks", date: "28 May 2025", due: "11 Jun 2025" },
    { name: "Vivaan Gupta", title: "Indian Economy", date: "28 May 2025", due: "11 Jun 2025" },
  ];

  const overdueBooks = [
    { name: "Rohan Mehta", title: "Wings of Fire", due: "20 May 2025", fine: 50 },
    { name: "Ananya Reddy", title: "Organic Chemistry", due: "21 May 2025", fine: 30 },
    { name: "Ishaan Malhotra", title: "Rich Dad Poor Dad", due: "22 May 2025", fine: 30 },
    { name: "Sara Khan", title: "General Knowledge 2024", due: "23 May 2025", fine: 20 },
    { name: "Arjun Nair", title: "Environmental Science", due: "24 May 2025", fine: 20 },
  ];

  const topBooks = [
    { title: "A Brief History of Time", count: 25 },
    { title: "The Alchemist", count: 22 },
    { title: "Indian Polity", count: 18 },
    { title: "Rich Dad Poor Dad", count: 16 },
    { title: "Wings of Fire", count: 15 },
  ];

  const recentTransactions = [
    { id: "TXN10245", type: "Issued", name: "Aarav Sharma", book: "Advanced Physics", date: "29 May 2025", due: "12 Jun 2025", status: "Issued", fine: 0 },
    { id: "TXN10244", type: "Returned", name: "Diya Singh", book: "Business Studies", date: "29 May 2025", due: "29 May 2025", status: "Returned", fine: 0 },
    { id: "TXN10243", type: "Issued", name: "Kabir Verma", book: "The Alchemist", date: "29 May 2025", due: "12 Jun 2025", status: "Issued", fine: 0 },
    { id: "TXN10242", type: "Renewed", name: "Myra Patel", book: "Computer Networks", date: "28 May 2025", due: "18 Jun 2025", status: "Renewed", fine: 0 },
    { id: "TXN10241", type: "Returned", name: "Vivaan Gupta", book: "Indian Economy", date: "28 May 2025", due: "28 May 2025", status: "Returned", fine: 0 },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Greenwood School Toolbar */}
      <PageHeader
        title="Librarian Dashboard"
        description="Catalog books, monitor borrowings, audit membership lists, and trace late fees."
        actions={
          <div className="flex items-center gap-3">
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Session 2024-25</option>
              <option>Session 2025-26</option>
            </select>
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Green Valley School</option>
            </select>
          </div>
        }
      />

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Total Books"
          value="8,654"
          icon={BookOpen}
          trend={{ value: 1.4, isPositive: true }}
          description="↑ 120 this month"
          color="blue"
        />
        <KPICard
          title="Books Issued"
          value="215"
          icon={ClipboardList}
          trend={{ value: 9.1, isPositive: true }}
          description="↑ 18 today"
          color="blue"
        />
        <KPICard
          title="Books Returned"
          value="198"
          icon={CheckCircle}
          trend={{ value: 8.8, isPositive: true }}
          description="↑ 16 today"
          color="green"
        />
        <KPICard
          title="Active Members"
          value="1,245"
          icon={Users}
          trend={{ value: 2.89, isPositive: true }}
          description="↑ 35 this month"
          color="orange"
        />
        <KPICard
          title="Overdue Books"
          value="27"
          icon={AlertTriangle}
          trend={{ value: 15.6, isPositive: false }}
          description="↓ 5 from yesterday"
          color="red"
        />
      </div>

      {/* ── Row 2: Charts + Quick Actions ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Issue / Return Overview */}
        <div className="lg:col-span-5">
          <ChartContainer
            title="Issue / Return Overview"
            subtitle="Comparing book issuances and returns over the past week"
            action={
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Week</option>
              </select>
            }
          >
            <BarChart
              data={issueReturnData}
              xAxisKey="day"
              series={[
                { key: "Issued", name: "Issued", color: "#8b5cf6" },
                { key: "Returned", name: "Returned", color: "#22c55e" },
              ]}
            />
          </ChartContainer>
        </div>

        {/* Books by Category Donut Chart */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Books by Category</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>All Branches</option>
              </select>
            </div>
            
            <div className="h-[200px] flex items-center justify-between gap-1">
              {/* Chart */}
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={bookCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {bookCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${Number(value).toLocaleString()} Books (${((Number(value) / 8654) * 100).toFixed(1)}%)`,
                        "Books",
                      ]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        color: "black",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                {/* Centered Total */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-foreground leading-none">8,654</span>
                  <span className="text-[7.5px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Total Books</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-[55%] flex flex-col justify-center space-y-2 text-[10px] sm:text-[11px] pr-1">
                {bookCategoryData.map((item) => {
                  const percent = ((item.value / 8654) * 100).toFixed(0);
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground shrink-0 whitespace-nowrap pl-0.5">
                        {item.value.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Quick Actions</h3>
          <div className="flex-1 flex flex-col justify-center gap-2">
            {[
              { label: "Issue Book", icon: ClipboardList, href: "/library/issue-return/issue", color: "text-blue-500 bg-blue-500/10 border-blue-500/10" },
              { label: "Return Book", icon: CheckCircle, href: "/library/issue-return/return", color: "text-green-500 bg-green-500/10 border-green-500/10" },
              { label: "Add New Book", icon: Plus, href: "/library/books/create", color: "text-orange-500 bg-orange-500/10 border-orange-500/10" },
              { label: "Add Member", icon: UserPlus, href: "/library/members/create", color: "text-purple-500 bg-purple-500/10 border-purple-500/10" },
              { label: "Manage Fines", icon: CreditCard, href: "/library/fines", color: "text-teal-500 bg-teal-500/10 border-teal-500/10" },
              { label: "Generate Report", icon: FileText, href: "/library/reports", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/10" },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-border transition-all group"
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", action.color)}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recently Issued + Overdue Books + Top Books Chart ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Recently Issued */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recently Issued Books</h3>
              <Link href="/library/issue-return" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[320px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Member Name</th>
                    <th className="pb-2 font-semibold">Book Title</th>
                    <th className="pb-2 font-semibold">Issue Date</th>
                    <th className="pb-2 font-semibold text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyIssued.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 text-muted-foreground">{item.title}</td>
                      <td className="py-2.5 text-muted-foreground font-mono">{item.date}</td>
                      <td className="py-2.5 text-right text-red-500 font-bold font-mono">{item.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Overdue Books</h3>
              <Link href="/library/fines" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[200px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2 font-semibold">Member</th>
                    <th className="pb-2 font-semibold">Due Date</th>
                    <th className="pb-2 font-semibold text-right">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueBooks.map((item, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                      <td className="py-2.5">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-[9px] text-muted-foreground truncate max-w-[100px]">{item.title}</p>
                      </td>
                      <td className="py-2.5 text-muted-foreground font-mono">{item.due}</td>
                      <td className="py-2.5 text-right text-red-500 font-bold">₹{item.fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Books (Most Issued) Horizontal Bar Chart */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Top Books (Most Issued)</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Month</option>
              </select>
            </div>
            
            <div className="h-[180px]">
              <HorizontalBarChart
                data={topBooks}
                yAxisKey="title"
                barKey="count"
                barName="Issue Count"
                color="#8b5cf6"
              />
            </div>
            <Link href="/library/books" className="flex items-center justify-center w-full pt-2.5 mt-auto text-[11px] font-bold text-primary hover:underline border-t border-border/45">
              View All Books
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 4: Recent Transactions Table (Full Width) ── */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Transactions</h3>
          <Link href="/library/transactions" className="text-xs font-bold text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 font-semibold">Transaction ID</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Member Name</th>
                <th className="pb-2 font-semibold">Book Title</th>
                <th className="pb-2 font-semibold">Date</th>
                <th className="pb-2 font-semibold">Due / Return Date</th>
                <th className="pb-2 font-semibold text-center">Status</th>
                <th className="pb-2 font-semibold text-right">Fine</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                  <td className="py-2.5 font-bold font-mono text-primary hover:underline cursor-pointer">{tx.id}</td>
                  <td className="py-2.5 font-medium text-foreground">{tx.type}</td>
                  <td className="py-2.5 font-medium text-foreground">{tx.name}</td>
                  <td className="py-2.5 text-muted-foreground">{tx.book}</td>
                  <td className="py-2.5 text-muted-foreground font-mono">{tx.date}</td>
                  <td className="py-2.5 text-muted-foreground font-mono">{tx.due}</td>
                  <td className="py-2.5 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold border inline-block uppercase",
                      tx.status === "Issued" && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                      tx.status === "Returned" && "bg-green-500/10 text-green-600 border-green-500/20",
                      tx.status === "Renewed" && "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-foreground">₹{tx.fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HR Manager Dashboard - matching reference image exactly
   ───────────────────────────────────────────────────────── */

function HrDashboard() {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: "lr-1",
      employeeName: "Rohit Sharma",
      department: "Computer Science",
      designation: "Teacher",
      leaveType: "Casual Leave",
      from: "29 May 2025",
      to: "30 May 2025",
      days: 2,
      reason: "Personal work",
      status: "Pending",
      appliedOn: "28 May 2025",
      avatar: "RS",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      id: "lr-2",
      employeeName: "Priya Verma",
      department: "Administration",
      designation: "Receptionist",
      leaveType: "Sick Leave",
      from: "28 May 2025",
      to: "29 May 2025",
      days: 2,
      reason: "Fever",
      status: "Approved",
      appliedOn: "27 May 2025",
      avatar: "PV",
      color: "bg-green-500/10 text-green-600"
    },
    {
      id: "lr-3",
      employeeName: "Arjun Patel",
      department: "Mathematics",
      designation: "Teacher",
      leaveType: "Privilege Leave",
      from: "02 Jun 2025",
      to: "06 Jun 2025",
      days: 5,
      reason: "Family function",
      status: "Pending",
      appliedOn: "27 May 2025",
      avatar: "AP",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      id: "lr-4",
      employeeName: "Neha Gupta",
      department: "Finance",
      designation: "Accountant",
      leaveType: "Casual Leave",
      from: "03 Jun 2025",
      to: "03 Jun 2025",
      days: 1,
      reason: "Doctor appointment",
      status: "Approved",
      appliedOn: "26 May 2025",
      avatar: "NG",
      color: "bg-orange-500/10 text-orange-600"
    }
  ]);

  const handleApprove = (id: string, name: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Approved" } : req));
    toast.success(`Leave approved for ${name}!`);
  };

  const handleReject = (id: string, name: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: "Rejected" } : req));
    toast.error(`Leave rejected for ${name}.`);
  };

  const employeeOverviewData = [
    { day: "1 May", Total: 90, Joined: 0, Resigned: 0 },
    { day: "6 May", Total: 96, Joined: 6, Resigned: 0 },
    { day: "11 May", Total: 104, Joined: 8, Resigned: 0 },
    { day: "16 May", Total: 110, Joined: 8, Resigned: 2 },
    { day: "21 May", Total: 118, Joined: 10, Resigned: 2 },
    { day: "26 May", Total: 124, Joined: 8, Resigned: 2 },
    { day: "31 May", Total: 128, Joined: 8, Resigned: 2 },
  ];

  const leaveSummaryData = [
    { name: "Casual Leave", value: 8, color: "#8b5cf6" },
    { name: "Sick Leave", value: 6, color: "#3b82f6" },
    { name: "Privilege Leave", value: 5, color: "#22c55e" },
    { name: "Earned Leave", value: 3, color: "#f59e0b" },
    { name: "Maternity Leave", value: 2, color: "#ef4444" },
  ];

  const recentJoinings = [
    { name: "Rohit Sharma", dept: "Computer Science", role: "Teacher", date: "26 May 2025", avatar: "RS", color: "bg-blue-500/10 text-blue-600" },
    { name: "Priya Verma", dept: "Administration", role: "Receptionist", date: "24 May 2025", avatar: "PV", color: "bg-green-500/10 text-green-600" },
    { name: "Arjun Patel", dept: "Mathematics", role: "Teacher", date: "20 May 2025", avatar: "AP", color: "bg-purple-500/10 text-purple-600" },
    { name: "Neha Gupta", dept: "Finance", role: "Accountant", date: "18 May 2025", avatar: "NG", color: "bg-amber-500/10 text-amber-600" },
    { name: "Vikram Singh", dept: "Physical Education", role: "Coach", date: "16 May 2025", avatar: "VS", color: "bg-rose-500/10 text-rose-600" },
  ];

  const upcomingBirthdays = [
    { name: "Anjali Mehta", dept: "English", date: "02 Jun", avatar: "AM", color: "bg-pink-500/10 text-pink-600" },
    { name: "Sandeep Kumar", dept: "Science", date: "05 Jun", avatar: "SK", color: "bg-indigo-500/10 text-indigo-600" },
    { name: "Pooja Sharma", dept: "Administration", date: "07 Jun", avatar: "PS", color: "bg-teal-500/10 text-teal-600" },
    { name: "Manish Verma", dept: "IT Department", date: "10 Jun", avatar: "MV", color: "bg-cyan-500/10 text-cyan-600" },
    { name: "Kavita Singh", dept: "Primary Wing", date: "12 Jun", avatar: "KS", color: "bg-orange-500/10 text-orange-600" },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Greenwood School Toolbar */}
      <PageHeader
        title="HR Manager Dashboard"
        description="Monitor staff attendance, leave claims, hiring cycles, and employee milestones."
        actions={
          <div className="flex items-center gap-3">
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Session 2024-25</option>
              <option>Session 2025-26</option>
            </select>
            <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
              <option>Green Valley School</option>
            </select>
          </div>
        }
      />

      {/* Date Display */}
      <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
        <span>Today, 29 May 2025</span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* ── Row 1: Top 5 KPI Cards ── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KPICard
          title="Total Employees"
          value="128"
          icon={Users}
          trend={{ value: 4.69, isPositive: true }}
          description="↑ 6 this month"
          color="blue"
        />
        <KPICard
          title="Present Today"
          value="98"
          icon={UserCheck}
          trend={{ value: 76.56, isPositive: true }}
          description="↑ 76.56% of total"
          color="green"
        />
        <KPICard
          title="On Leave Today"
          value="12"
          icon={Calendar}
          trend={{ value: 9.38, isPositive: false }}
          description="↓ 9.38% of total"
          color="orange"
        />
        <KPICard
          title="Total Departments"
          value="12"
          icon={Building2}
          description="Active Departments"
          color="indigo"
        />
        <KPICard
          title="Birthdays This Month"
          value="7"
          icon={Cake}
          description="Upcoming birthdays"
          color="purple"
        />
      </div>

      {/* ── Row 2: Charts + Quick Actions ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Employee Overview Area/Line Chart */}
        <div className="lg:col-span-5">
          <ChartContainer
            title="Employee Overview"
            subtitle="Comparing cumulative employee count vs joinings & resignations"
            action={
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Month</option>
              </select>
            }
          >
            <LineChart
              data={employeeOverviewData}
              xAxisKey="day"
              series={[
                { key: "Total", name: "Total Employees", color: "#8b5cf6" },
                { key: "Joined", name: "Joined", color: "#22c55e" },
                { key: "Resigned", name: "Resigned", color: "#ef4444" },
              ]}
            />
          </ChartContainer>
        </div>

        {/* Leave Summary Donut Chart */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Leave Summary</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Month</option>
              </select>
            </div>
            <div className="h-[200px] flex items-center justify-between gap-1">
              {/* Chart */}
              <div className="relative flex items-center justify-center h-full w-[45%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={leaveSummaryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leaveSummaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${Number(value)} Leaves (${((Number(value) / 24) * 100).toFixed(1)}%)`,
                        "Leaves",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                {/* Centered Total */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-foreground leading-none">24</span>
                  <span className="text-[8px] uppercase font-bold text-muted-foreground mt-0.5 leading-none">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-[55%] flex flex-col justify-center space-y-2 text-[10px] sm:text-[11px] pr-1">
                {leaveSummaryData.map((item) => {
                  const percent = ((item.value / 24) * 100).toFixed(0);
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground shrink-0 whitespace-nowrap pl-0.5">
                        {item.value} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Quick Actions</h3>
          <div className="flex-1 flex flex-col justify-center gap-2">
            {[
              { label: "Add Employee", icon: UserPlus, href: "/hr/employees/create", color: "text-blue-500 bg-blue-500/10 border-blue-500/10" },
              { label: "Apply Leave", icon: Calendar, href: "/hr/leave", color: "text-green-500 bg-green-500/10 border-green-500/10" },
              { label: "Mark Attendance", icon: UserCheck, href: "/hr/attendance", color: "text-orange-500 bg-orange-500/10 border-orange-500/10" },
              { label: "Create Announcement", icon: Megaphone, href: "/hr/communications", color: "text-purple-500 bg-purple-500/10 border-purple-500/10" },
              { label: "Add Holiday", icon: CalendarRange, href: "/hr/attendance", color: "text-teal-500 bg-teal-500/10 border-teal-500/10" },
              { label: "Generate Report", icon: FileText, href: "/hr/reports", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/10" },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-border transition-all group"
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", action.color)}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Joinings + Upcoming Birthdays + Attendance Circular Gauge ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Recent Joinings */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Joinings</h3>
              <Link href="/hr/employees" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3.5">
              {recentJoinings.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between hover:bg-muted/10 p-1.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0", person.color)}>
                      {person.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{person.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{person.dept} • {person.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">{person.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Birthdays</h3>
              <Link href="/hr/directory" className="text-xs font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-3.5">
              {upcomingBirthdays.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between hover:bg-muted/10 p-1.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0", person.color)}>
                      {person.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{person.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{person.dept}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                    <Cake className="h-3 w-3 shrink-0" />
                    {person.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance circular gauge */}
        <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Attendance Summary</h3>
              <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                <option>This Month</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2 flex-1">
              <div className="relative flex items-center justify-center h-32 w-32 shrink-0 mx-auto sm:mx-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-muted/20" strokeWidth="9" fill="transparent" />
                  <circle cx="50" cy="50" r="40" className="stroke-success" strokeWidth="9" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 76.56) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-extrabold text-foreground leading-none">76.56%</span>
                  <span className="text-[7px] text-muted-foreground font-bold mt-1 uppercase tracking-wide">Avg Presence</span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 text-xs w-full">
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-muted-foreground font-medium">Present Days</span>
                  </div>
                  <span className="font-bold text-green-500">98 (76.56%)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-muted-foreground font-medium">Absent Days</span>
                  </div>
                  <span className="font-bold text-red-500">24 (18.75%)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground font-medium">Leave Days</span>
                  </div>
                  <span className="font-bold text-amber-500">6 (4.69%)</span>
                </div>
                <div className="flex items-center justify-between pb-0.5 font-bold text-foreground">
                  <span>Total Working Days</span>
                  <span>128</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Leave Requests Table ── */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Leave Requests</h3>
          <Link href="/hr/leave" className="text-xs font-bold text-primary hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 font-semibold">Employee</th>
                <th className="pb-2 font-semibold">Leave Type</th>
                <th className="pb-2 font-semibold">From</th>
                <th className="pb-2 font-semibold">To</th>
                <th className="pb-2 font-semibold text-center">Days</th>
                <th className="pb-2 font-semibold">Reason</th>
                <th className="pb-2 font-semibold">Applied On</th>
                <th className="pb-2 font-semibold text-center">Status</th>
                <th className="pb-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req) => (
                <tr key={req.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0", req.color)}>
                        {req.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground leading-none">{req.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground pt-0.5">{req.designation} ({req.department})</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-foreground">{req.leaveType}</td>
                  <td className="py-3 text-muted-foreground font-mono">{req.from}</td>
                  <td className="py-3 text-muted-foreground font-mono">{req.to}</td>
                  <td className="py-3 text-center font-bold text-foreground">{req.days}</td>
                  <td className="py-3 text-muted-foreground max-w-[150px] truncate" title={req.reason}>{req.reason}</td>
                  <td className="py-3 text-muted-foreground font-mono">{req.appliedOn}</td>
                  <td className="py-3 text-center">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block",
                      req.status === "Approved" && "bg-green-500/10 text-green-600 border-green-500/20",
                      req.status === "Pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      req.status === "Rejected" && "bg-red-500/10 text-red-600 border-red-500/20"
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {req.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(req.id, req.employeeName)}
                          className="p-1 hover:bg-green-500/10 border hover:border-green-500/30 rounded text-green-600 transition-colors shrink-0"
                          title="Approve"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(req.id, req.employeeName)}
                          className="p-1 hover:bg-red-500/10 border hover:border-red-500/30 rounded text-red-600 transition-colors shrink-0"
                          title="Reject"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-medium italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
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
                        <circle cx="50" cy="50" r="40" className="stroke-green-500" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 64) / 100} />
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

      case "finance": {
        const kpis = [
          {
            title: "Total Collection (This Month)",
            value: "₹24,85,300",
            trend: "12.5% from last month",
            isPositive: true,
            icon: IndianRupee,
            bgClass: "bg-emerald-500 text-white",
            textClass: "text-emerald-500",
            trendText: "↑ 12.5% from last month"
          },
          {
            title: "Total Fees Due",
            value: "₹8,42,600",
            trend: "6.3% from last month",
            isPositive: false,
            icon: Users,
            bgClass: "bg-blue-500 text-white",
            textClass: "text-red-500",
            trendText: "↓ 6.3% from last month"
          },
          {
            title: "Total Expenses (This Month)",
            value: "₹5,18,750",
            trend: "8.1% from last month",
            isPositive: true,
            icon: FileText,
            bgClass: "bg-amber-500 text-white",
            textClass: "text-emerald-500",
            trendText: "↑ 8.1% from last month"
          },
          {
            title: "Balance (This Month)",
            value: "₹19,66,550",
            trend: "15.2% from last month",
            isPositive: true,
            icon: CreditCard,
            bgClass: "bg-purple-500 text-white",
            textClass: "text-emerald-500",
            trendText: "↑ 15.2% from last month"
          }
        ];

        const feeCollectionTrend = [
          { date: "1 May", current: 350000, previous: 300000 },
          { date: "6 May", current: 820000, previous: 680000 },
          { date: "11 May", current: 1150000, previous: 980000 },
          { date: "16 May", current: 1580000, previous: 1250000 },
          { date: "21 May", current: 1920000, previous: 1520000 },
          { date: "26 May", current: 2240000, previous: 1810000 },
          { date: "31 May", current: 2485300, previous: 2080000 },
        ];

        const classSplitData = [
          { name: "Class 1 - 5", value: 325400, color: "#3b82f6" },
          { name: "Class 6 - 8", value: 645800, color: "#22c55e" },
          { name: "Class 9 - 10", value: 785600, color: "#f59e0b" },
          { name: "Class 11 - 12", value: 615000, color: "#8b5cf6" },
          { name: "Other", value: 113500, color: "#94a3b8" },
        ];

        const recentFeeCollections = [
          { receiptNo: "RCP-2025-0501", studentName: "Aarav Sharma", class: "8-A", amount: 15600, date: "29 May 2025", mode: "Online", status: "online" },
          { receiptNo: "RCP-2025-0500", studentName: "Diya Singh", class: "6-B", amount: 12000, date: "29 May 2025", mode: "Cash", status: "cash" },
          { receiptNo: "RCP-2025-0499", studentName: "Kabir Verma", class: "10-A", amount: 18500, date: "29 May 2025", mode: "Online", status: "online" },
          { receiptNo: "RCP-2025-0498", studentName: "Myra Patel", class: "4-A", amount: 9800, date: "29 May 2025", mode: "Card", status: "card" },
          { receiptNo: "RCP-2025-0497", studentName: "Vivaan Gupta", class: "7-A", amount: 14300, date: "28 May 2025", mode: "Online", status: "online" },
        ];

        const topDueStudents = [
          { name: "Rohan Mehta", class: "9-B", amount: 24600 },
          { name: "Ananya Reddy", class: "8-A", amount: 18750 },
          { name: "Ishaan Malhotra", class: "7-B", amount: 17200 },
          { name: "Sara Khan", class: "6-A", amount: 14600 },
          { name: "Arjun Nair", class: "10-A", amount: 13350 },
        ];

        const expenseCategories = [
          { name: "Salaries", amount: 285400, percent: 55 },
          { name: "Maintenance", amount: 125600, percent: 24.2 },
          { name: "Utilities", amount: 45300, percent: 8.7 },
          { name: "Transport", amount: 36800, percent: 7.1 },
          { name: "Others", amount: 25650, percent: 4.9 },
        ];

        return (
          <div className="space-y-6 text-left">
            {/* Header Selector Toolbar */}
            <PageHeader
              title="Finance Manager Dashboard"
              description="Comprehensive financial metrics, fee tracking, and real-time operations ledger."
              actions={
                <div className="flex items-center gap-3">
                  <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
                    <option>Session 2024-25</option>
                    <option>Session 2025-26</option>
                  </select>
                  <select className="text-xs bg-card border border-border rounded-lg px-3 py-1.5 font-semibold text-muted-foreground outline-none cursor-pointer">
                    <option>Green Valley School</option>
                  </select>
                </div>
              }
            />

            {/* Date Display */}
            <div className="flex justify-end items-center gap-1.5 text-muted-foreground text-xs font-semibold -mt-2">
              <span>Today, 29 May 2025</span>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* KPIs Row */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div key={idx} className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{kpi.title}</span>
                      <span className="text-2xl font-bold tracking-tight text-foreground block">{kpi.value}</span>
                      <div className="flex items-center gap-1.5">
                        {kpi.isPositive ? (
                          <ArrowUpRight className={cn("h-3.5 w-3.5 shrink-0", kpi.textClass)} />
                        ) : (
                          <ArrowDownRight className={cn("h-3.5 w-3.5 shrink-0", kpi.textClass)} />
                        )}
                        <span className={cn("text-[11px] font-bold", kpi.textClass)}>{kpi.trend}</span>
                      </div>
                    </div>
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-inner", kpi.bgClass)}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row 2: Charts + Quick Actions */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
              {/* Fee Collection Overview Area Chart */}
              <div className="lg:col-span-5">
                <ChartContainer
                  title="Fee Collection Overview"
                  subtitle="Comparing cumulative collected vs last month"
                  action={
                    <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                      <option>This Month</option>
                    </select>
                  }
                >
                  <AreaChart
                    data={feeCollectionTrend}
                    xAxisKey="date"
                    series={[
                      { key: "current", name: "This Month", color: "#3b82f6" },
                      { key: "previous", name: "Last Month", color: "#94a3b8" },
                    ]}
                  />
                </ChartContainer>
              </div>

              {/* Fee Collection by Class Pie Chart */}
              <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Fee Collection by Class</h3>
                    <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                      <option>This Month</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                    <div className="relative flex items-center justify-center h-32 w-32 shrink-0 mx-auto sm:mx-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={classSplitData}
                            cx="50%"
                            cy="50%"
                            innerRadius={42}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {classSplitData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Collected"]}
                            contentStyle={{
                              backgroundColor: "white",
                              borderColor: "hsl(var(--border))",
                              color: "black",
                              borderRadius: "8px",
                              fontSize: "11px",
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground">Total</span>
                        <span className="text-xs font-extrabold text-foreground leading-none">₹24.85L</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-1 text-[11px] w-full">
                      {classSplitData.map((item, idx) => (
                        <div key={item.name} className="flex items-center justify-between border-b border-border/40 pb-1 last:border-0 last:pb-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground font-medium truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-right font-bold text-foreground">
                            <span>₹{item.value.toLocaleString()}</span>
                            <span className="text-muted-foreground w-8 font-semibold text-[10px]">
                              {((item.value / 2485300) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-1 border-t border-border font-bold text-foreground">
                        <span>Total</span>
                        <div className="flex items-center gap-1 text-right">
                          <span>₹24,85,300</span>
                          <span className="w-8">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col">
                <h3 className="text-sm font-semibold tracking-tight text-foreground pb-2 border-b border-border/40 mb-3">Quick Actions</h3>
                <div className="flex-1 flex flex-col justify-center gap-2">
                  {[
                    { label: "Collect Fee", icon: IndianRupee, href: "/finance/fee-collection", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/10" },
                    { label: "Create Receipt", icon: FileText, href: "/finance/receipts", color: "text-blue-500 bg-blue-500/10 border-blue-500/10" },
                    { label: "Add Expense", icon: Briefcase, href: "/finance/expenses", color: "text-amber-500 bg-amber-500/10 border-amber-500/10" },
                    { label: "Add Income", icon: BadgePercent, href: "/finance/income", color: "text-purple-500 bg-purple-500/10 border-purple-500/10" },
                    { label: "Approve Refund", icon: Shield, href: "/finance/approvals", color: "text-teal-500 bg-teal-500/10 border-teal-500/10" },
                    { label: "Generate Report", icon: FileText, href: "/finance/reports", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/10" },
                  ].map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={idx}
                        href={action.href}
                        className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-border transition-all group"
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", action.color)}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 3: Tables Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
              {/* Recent Fee Collections */}
              <div className="lg:col-span-5 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Fee Collections</h3>
                    <Link href="/finance/fee-collection" className="text-xs font-bold text-primary hover:underline">View All</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left min-w-[400px]">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="pb-2 font-semibold">Receipt No.</th>
                          <th className="pb-2 font-semibold">Student Name</th>
                          <th className="pb-2 font-semibold">Class</th>
                          <th className="pb-2 font-semibold">Amount</th>
                          <th className="pb-2 font-semibold">Date</th>
                          <th className="pb-2 font-semibold text-right">Payment Mode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentFeeCollections.map((row, idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                            <td className="py-2.5 font-bold text-primary hover:underline cursor-pointer">{row.receiptNo}</td>
                            <td className="py-2.5 font-medium text-foreground">{row.studentName}</td>
                            <td className="py-2.5 text-muted-foreground">{row.class}</td>
                            <td className="py-2.5 font-bold text-foreground">₹{row.amount.toLocaleString()}</td>
                            <td className="py-2.5 text-muted-foreground">{row.date}</td>
                            <td className="py-2.5 text-right">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block",
                                row.status === "online" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                row.status === "cash" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                row.status === "card" && "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              )}>
                                {row.mode}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Top Due Students */}
              <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Top Due Students</h3>
                    <Link href="/finance/due-management" className="text-xs font-bold text-primary hover:underline">View All</Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left min-w-[200px]">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="pb-2 font-semibold">Student Name</th>
                          <th className="pb-2 font-semibold">Class</th>
                          <th className="pb-2 font-semibold text-right">Due Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topDueStudents.map((row, idx) => (
                          <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/10">
                            <td className="py-2.5 font-medium text-foreground">{row.name}</td>
                            <td className="py-2.5 text-muted-foreground">{row.class}</td>
                            <td className="py-2.5 font-bold text-red-500 text-right">₹{row.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Expense Summary Progress Bars */}
              <div className="lg:col-span-4 rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-border/40 mb-4">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">Expense Summary</h3>
                    <select className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-medium text-muted-foreground outline-none cursor-pointer">
                      <option>This Month</option>
                    </select>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {expenseCategories.map((exp, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-medium">{exp.name}</span>
                          <span className="font-bold text-foreground">₹{exp.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${exp.percent}%` }} />
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border flex items-center justify-between font-bold text-sm text-foreground">
                      <span>Total Expenses</span>
                      <span>₹5,18,750</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: Recent Expenses */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-3">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Expenses</h3>
                <Link href="/finance/expenses" className="text-xs font-bold text-primary hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-2 font-semibold">Voucher No.</th>
                      <th className="pb-2 font-semibold">Category</th>
                      <th className="pb-2 font-semibold">Description</th>
                      <th className="pb-2 font-semibold">Amount</th>
                      <th className="pb-2 font-semibold">Date</th>
                      <th className="pb-2 font-semibold">Paid To</th>
                      <th className="pb-2 font-semibold">Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-muted/10">
                      <td className="py-2.5 font-bold text-primary hover:underline cursor-pointer">EXP-2025-0562</td>
                      <td className="py-2.5 font-medium text-foreground">Salaries</td>
                      <td className="py-2.5 text-muted-foreground">May 2025 - Teaching Staff Salary</td>
                      <td className="py-2.5 font-bold text-foreground">₹2,45,000</td>
                      <td className="py-2.5 text-muted-foreground">29 May 2025</td>
                      <td className="py-2.5 font-medium text-foreground">Teaching Staff</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-500/10 text-blue-600 border-blue-500/20">
                          Bank Transfer
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground">© 2025 School Management System ERP | All Rights Reserved</p>
            </div>
          </div>
        );
      }

      case "library":
        return <LibrarianDashboard />;

      case "hr":
        return <HrDashboard />;

      case "transport":
        return <TransportDashboard />;

      case "hostel":
        return <HostelDashboard />;

      case "teacher":
        return <TeacherDashboard />;

      case "student":
        return <StudentDashboard />;

      case "parent":
        return <ParentDashboard />;

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
