"use client";

import React from "react";
import { formatCurrency, formatDate } from "@/lib/format";

// --- 1. PrintLayout wrapper ---
export function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-black p-6 print:p-0 w-full min-h-screen">
      {children}
    </div>
  );
}

// --- 2. FeeReceipt (A5 print layout) ---
interface FeeReceiptProps {
  receiptNo: string;
  date: string;
  studentName: string;
  admissionNo: string;
  className: string;
  paymentMode: string;
  txnId: string;
  items: { description: string; amount: number }[];
  receivedBy: string;
}

export function FeeReceipt({
  receiptNo,
  date,
  studentName,
  admissionNo,
  className,
  paymentMode,
  txnId,
  items,
  receivedBy,
}: FeeReceiptProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full max-w-[580px] border border-gray-300 p-6 bg-white mx-auto text-sm text-left">
      <div className="text-center border-b pb-3 mb-4">
        <h2 className="text-lg font-bold text-gray-800">GREENWOOD INTERNATIONAL SCHOOL</h2>
        <p className="text-xs text-gray-500">Sector 15, Dwarka, New Delhi - 110075</p>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mt-2 bg-gray-100 py-1">
          Fee Payment Receipt
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-y-1 text-xs mb-4">
        <div><strong>Receipt No:</strong> {receiptNo}</div>
        <div className="text-right"><strong>Date:</strong> {formatDate(date)}</div>
        <div><strong>Student Name:</strong> {studentName}</div>
        <div className="text-right"><strong>Admission No:</strong> {admissionNo}</div>
        <div><strong>Class & Section:</strong> {className}</div>
        <div className="text-right"><strong>Payment Mode:</strong> {paymentMode}</div>
        {txnId && <div><strong>Txn ID:</strong> {txnId}</div>}
      </div>

      <table className="w-full border-collapse border border-gray-300 text-xs mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Sl No.</th>
            <th className="border border-gray-300 p-2 text-left">Fee Head Description</th>
            <th className="border border-gray-300 p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-2">{idx + 1}</td>
              <td className="border border-gray-300 p-2">{item.description}</td>
              <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td colSpan={2} className="border border-gray-300 p-2 text-right">Total Paid</td>
            <td className="border border-gray-300 p-2 text-right">{formatCurrency(total)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-end mt-8 text-xs">
        <div>
          <p className="border-t border-gray-400 pt-1 text-gray-500 w-[120px] text-center">Parent Signature</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-700">{receivedBy}</p>
          <p className="border-t border-gray-400 pt-1 text-gray-500 w-[120px] text-center mt-1">Authorized Cashier</p>
        </div>
      </div>
    </div>
  );
}

// --- 3. ReportCard (A4 print layout) ---
interface ReportCardProps {
  studentName: string;
  rollNo: string;
  admissionNo: string;
  className: string;
  term: string;
  subjects: { name: string; maxMarks: number; obtainedMarks: number; grade: string }[];
  attendance: string;
  remarks: string;
}

export function ReportCard({
  studentName,
  rollNo,
  admissionNo,
  className,
  term,
  subjects,
  attendance,
  remarks,
}: ReportCardProps) {
  const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const totalObtained = subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
  const percentage = (totalObtained / totalMax) * 100;

  return (
    <div className="w-full max-w-[800px] border border-gray-400 p-8 bg-white mx-auto text-sm text-left">
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800">GREENWOOD INTERNATIONAL SCHOOL</h1>
        <p className="text-xs text-gray-600">CBSE Affiliation No. 2730554 | Sector 15, New Delhi</p>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mt-3">
          Academic Achievement Report Card - {term}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 border p-4 rounded bg-gray-50/50 mb-6 text-xs">
        <div><strong>Student Name:</strong> {studentName}</div>
        <div><strong>Roll No:</strong> {rollNo}</div>
        <div><strong>Admission No:</strong> {admissionNo}</div>
        <div><strong>Class & Section:</strong> {className}</div>
        <div><strong>Session Term:</strong> {term}</div>
        <div><strong>Attendance Record:</strong> {attendance}</div>
      </div>

      <table className="w-full border-collapse border border-gray-400 text-xs mb-6">
        <thead>
          <tr className="bg-gray-150">
            <th className="border border-gray-400 p-2.5 text-left">Subject</th>
            <th className="border border-gray-400 p-2.5 text-center">Max Marks</th>
            <th className="border border-gray-400 p-2.5 text-center">Marks Obtained</th>
            <th className="border border-gray-400 p-2.5 text-center">Subject Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub, idx) => (
            <tr key={idx}>
              <td className="border border-gray-400 p-2.5 font-semibold">{sub.name}</td>
              <td className="border border-gray-400 p-2.5 text-center">{sub.maxMarks}</td>
              <td className="border border-gray-400 p-2.5 text-center">{sub.obtainedMarks}</td>
              <td className="border border-gray-400 p-2.5 text-center font-bold">{sub.grade}</td>
            </tr>
          ))}
          <tr className="font-extrabold bg-gray-100">
            <td className="border border-gray-400 p-2.5">Grand Total</td>
            <td className="border border-gray-400 p-2.5 text-center">{totalMax}</td>
            <td className="border border-gray-400 p-2.5 text-center">{totalObtained}</td>
            <td className="border border-gray-400 p-2.5 text-center">{percentage.toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>

      <div className="border p-4 rounded text-xs mb-8">
        <strong>Remarks / Class Teacher Assessment:</strong>
        <p className="text-gray-600 mt-1 italic">"{remarks}"</p>
      </div>

      <div className="flex justify-between items-end mt-12 text-xs">
        <div className="text-center w-[150px]">
          <div className="border-t border-gray-500 pt-1.5 text-gray-500">Parent Signature</div>
        </div>
        <div className="text-center w-[150px]">
          <div className="border-t border-gray-500 pt-1.5 text-gray-500">Class Teacher</div>
        </div>
        <div className="text-center w-[150px]">
          <div className="border-t border-gray-500 pt-1.5 text-gray-500">School Principal</div>
        </div>
      </div>
    </div>
  );
}

// --- 4. AdmitCard (A5 print layout) ---
interface AdmitCardProps {
  rollNo: string;
  studentName: string;
  className: string;
  admissionNo: string;
  examName: string;
  timetable: { subject: string; date: string; time: string }[];
}

export function AdmitCard({
  rollNo,
  studentName,
  className,
  admissionNo,
  examName,
  timetable,
}: AdmitCardProps) {
  return (
    <div className="w-full max-w-[550px] border-2 border-gray-600 p-5 bg-white mx-auto text-xs text-left">
      <div className="text-center border-b pb-2 mb-3">
        <h2 className="text-base font-bold text-gray-800">GREENWOOD INTERNATIONAL SCHOOL</h2>
        <p className="text-[10px] text-gray-500">EXAMINATION DEPARTMENT HALL TICKET</p>
        <span className="inline-block mt-1 px-3 py-0.5 bg-gray-800 text-white rounded font-semibold text-[10px] uppercase">
          {examName} - Admit Card
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-1 mb-4 border p-2 bg-gray-50 rounded">
        <div><strong>Roll No:</strong> {rollNo}</div>
        <div><strong>Class:</strong> {className}</div>
        <div><strong>Student Name:</strong> {studentName}</div>
        <div><strong>Admn No:</strong> {admissionNo}</div>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-[11px] mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1.5 text-left">Subject</th>
            <th className="border border-gray-300 p-1.5 text-center">Exam Date</th>
            <th className="border border-gray-300 p-1.5 text-center">Timings</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 p-1.5 font-medium">{item.subject}</td>
              <td className="border border-gray-300 p-1.5 text-center">{formatDate(item.date)}</td>
              <td className="border border-gray-300 p-1.5 text-center">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 text-[9px] text-gray-500 space-y-0.5 border-t pt-2">
        <p><strong>Instructions to Candidates:</strong></p>
        <p>1. Please report at least 15 minutes before the exam starts.</p>
        <p>2. Hall ticket is mandatory. Electronic devices are strictly prohibited.</p>
      </div>

      <div className="flex justify-between items-end mt-8 text-[10px]">
        <div className="w-[100px] border-t border-gray-400 pt-1 text-center text-gray-500">
          Candidate Sign
        </div>
        <div className="w-[100px] border-t border-gray-400 pt-1 text-center text-gray-500">
          Controller of Exams
        </div>
      </div>
    </div>
  );
}

// --- 5. Student IDCard (85.6mm × 54mm equivalent portrait) ---
export function IDCard({
  name,
  role,
  idNo,
  phone,
  email,
}: {
  name: string;
  role: string;
  idNo: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="w-[240px] h-[380px] border-2 border-primary rounded-2xl bg-white flex flex-col items-center justify-between p-4 shadow-xl mx-auto relative overflow-hidden text-center text-xs">
      {/* Background Header Pattern */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#1a1f36] flex flex-col items-center justify-center text-white">
        <h3 className="font-extrabold text-[11px] tracking-wide">GREENWOOD ACADEMY</h3>
        <p className="text-[8px] text-[#94a3b8]">New Delhi</p>
      </div>

      {/* Avatar block */}
      <div className="mt-16 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full border-4 border-primary/20 bg-muted/80 flex items-center justify-center text-xl font-bold text-primary shadow-md">
          {name.split(" ").map(n => n[0]).join("")}
        </div>
        <h4 className="font-extrabold text-sm text-foreground mt-3 uppercase tracking-tight">{name}</h4>
        <span className="px-3 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded-full mt-1 uppercase">
          {role}
        </span>
      </div>

      {/* Details info */}
      <div className="w-full space-y-1.5 text-left border-t border-border pt-3 mb-6 text-[10px] text-foreground">
        <div><strong>ID No:</strong> {idNo}</div>
        <div><strong>Emergency:</strong> {phone}</div>
        <div><strong>Email:</strong> {email}</div>
      </div>

      {/* Footer code bar */}
      <div className="w-full border-t border-border pt-2 text-[9px] text-muted-foreground">
        SCHOOL TERM: 2026-2027
      </div>
    </div>
  );
}

// --- 6. Payslip (A4 print layout) ---
export function Payslip({
  payslipId,
  employeeId,
  name,
  designation,
  month,
  earnings,
  deductions,
}: {
  payslipId: string;
  employeeId: string;
  name: string;
  designation: string;
  month: string;
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
}) {
  const totEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const netSalary = totEarnings - totDeductions;

  return (
    <div className="w-full max-w-[700px] border border-gray-300 p-6 bg-white mx-auto text-xs text-left">
      <div className="text-center border-b pb-3 mb-4">
        <h2 className="text-base font-bold text-gray-800">GREENWOOD INTERNATIONAL SCHOOL</h2>
        <p className="text-[10px] text-gray-500">Sector 15, Dwarka, New Delhi - 110075</p>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 mt-2 bg-gray-100 py-1">
          Salary Slip for {month}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-y-1 mb-4 border p-3 rounded bg-gray-50">
        <div><strong>Payslip Ref:</strong> {payslipId}</div>
        <div><strong>Employee ID:</strong> {employeeId}</div>
        <div><strong>Employee Name:</strong> {name}</div>
        <div><strong>Designation:</strong> {designation}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Earnings Table */}
        <div>
          <h4 className="font-bold border-b pb-1 mb-2 text-gray-700 uppercase tracking-wide">Earnings</h4>
          <table className="w-full border-collapse border border-gray-200">
            <tbody>
              {earnings.map((e, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-1.5">{e.name}</td>
                  <td className="p-1.5 text-right font-medium">{formatCurrency(e.amount)}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50 border-t">
                <td className="p-1.5">Total Earnings</td>
                <td className="p-1.5 text-right">{formatCurrency(totEarnings)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions Table */}
        <div>
          <h4 className="font-bold border-b pb-1 mb-2 text-gray-700 uppercase tracking-wide">Deductions</h4>
          <table className="w-full border-collapse border border-gray-200">
            <tbody>
              {deductions.map((d, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-1.5">{d.name}</td>
                  <td className="p-1.5 text-right font-medium">{formatCurrency(d.amount)}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-50 border-t">
                <td className="p-1.5">Total Deductions</td>
                <td className="p-1.5 text-right">{formatCurrency(totDeductions)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 border-2 border-gray-800 p-3 rounded flex items-center justify-between bg-gray-100/50">
        <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">Net Remuneration Paid</span>
        <span className="font-extrabold text-base text-green-700">{formatCurrency(netSalary)}</span>
      </div>

      <div className="flex justify-between items-end mt-12 text-[10px]">
        <div className="w-[120px] border-t border-gray-400 pt-1 text-center text-gray-500">
          Employee Signature
        </div>
        <div className="w-[120px] border-t border-gray-400 pt-1 text-center text-gray-500">
          Finance Manager
        </div>
      </div>
    </div>
  );
}

// --- 7. BonafideCertificate (A4 print layout) ---
export function BonafideCertificate({
  studentName,
  fatherName,
  admissionNo,
  className,
  session,
  issueDate,
}: {
  studentName: string;
  fatherName: string;
  admissionNo: string;
  className: string;
  session: string;
  issueDate: string;
}) {
  return (
    <div className="w-full max-w-[750px] border-[6px] border-double border-gray-400 p-12 bg-white mx-auto text-center text-sm relative">
      <div className="border-b border-gray-300 pb-4 mb-8">
        <h1 className="text-2xl font-black tracking-wide text-gray-800">GREENWOOD INTERNATIONAL SCHOOL</h1>
        <p className="text-xs text-gray-600">Dwarka Sector 15, New Delhi - 110075</p>
      </div>

      <h2 className="text-xl font-bold uppercase tracking-widest text-gray-700 underline underline-offset-8 decoration-gray-400 mb-8">
        Bonafide Certificate
      </h2>

      <p className="text-xs text-right text-gray-500 mb-8">
        <strong>Date:</strong> {formatDate(issueDate)}
      </p>

      <div className="leading-relaxed text-gray-800 text-left space-y-4 px-4 mb-16">
        <p>
          This is to certify that Master/Miss <strong className="text-black font-extrabold">{studentName}</strong>,
          son/daughter of Shri <strong className="text-black font-extrabold">{fatherName}</strong>, is a bonafide student
          of this institution.
        </p>
        <p>
          He/She is studying in Class <strong className="text-black font-extrabold">{className}</strong> under Admission Number{" "}
          <strong className="text-black font-extrabold">{admissionNo}</strong> during the academic session{" "}
          <strong className="text-black font-extrabold">{session}</strong>.
        </p>
        <p>
          To the best of our knowledge and school records, his/her character and conduct have been{" "}
          <strong className="text-black font-bold">Good</strong>.
        </p>
      </div>

      <div className="flex justify-between items-end text-xs pt-8 px-4">
        <div className="text-left text-gray-500">
          <p>Prepared By: ____________</p>
        </div>
        <div className="text-center">
          <div className="w-[150px] border-t border-gray-500 pt-1 text-gray-700 font-bold uppercase">
            School Principal
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 8. LibrarySlip (Receipt slip print layout) ---
export function LibrarySlip({
  slipNo,
  studentName,
  bookTitle,
  bookCode,
  issueDate,
  dueDate,
}: {
  slipNo: string;
  studentName: string;
  bookTitle: string;
  bookCode: string;
  issueDate: string;
  dueDate: string;
}) {
  return (
    <div className="w-[200px] border border-dashed border-gray-400 p-3 bg-white mx-auto text-[10px] text-left leading-normal">
      <div className="text-center border-b border-dashed pb-1.5 mb-2">
        <h3 className="font-bold text-gray-800 text-[11px]">GREENWOOD LIBRARY</h3>
        <span className="text-[8px] text-gray-500">BOOK ISSUE SLIP</span>
      </div>

      <div className="space-y-1 text-gray-700">
        <div><strong>Slip Ref:</strong> {slipNo}</div>
        <div><strong>Member:</strong> {studentName}</div>
        <div className="border-t border-dashed my-1"></div>
        <div><strong>Book Title:</strong></div>
        <div className="font-semibold text-black leading-tight">{bookTitle}</div>
        <div><strong>Book Code:</strong> {bookCode}</div>
        <div className="border-t border-dashed my-1"></div>
        <div><strong>Issued On:</strong> {formatDate(issueDate)}</div>
        <div className="text-red-600"><strong>Return Due:</strong> {formatDate(dueDate)}</div>
      </div>

      <div className="text-[8px] text-center text-gray-400 mt-3 border-t border-dashed pt-1">
        Please return overdue books to avoid fine of ₹5/day.
      </div>
    </div>
  );
}
