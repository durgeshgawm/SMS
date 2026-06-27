import { UserRole } from "@/types/common";

// --- 1. Branches ---
export interface BranchMock {
  id: string;
  name: string;
  code: string;
  city: string;
  adminsCount: number;
  studentsCount: number;
  revenue: number;
  status: "active" | "inactive";
}

export const mockBranches: BranchMock[] = [
  { id: "br-delhi", name: "Delhi Main Branch", code: "GW-DEL-01", city: "New Delhi", adminsCount: 3, studentsCount: 450, revenue: 1250000, status: "active" },
  { id: "br-mumbai", name: "Mumbai Branch", code: "GW-MUM-02", city: "Mumbai", adminsCount: 2, studentsCount: 280, revenue: 840000, status: "active" },
  { id: "br-chennai", name: "Chennai Campus", code: "GW-CHE-03", city: "Chennai", adminsCount: 2, studentsCount: 190, revenue: 520000, status: "active" },
  { id: "br-kolkata", name: "Kolkata Branch", code: "GW-KOL-04", city: "Kolkata", adminsCount: 1, studentsCount: 120, revenue: 310000, status: "inactive" },
  { id: "br-bangalore", name: "Bangalore Academy", code: "GW-BLR-05", city: "Bangalore", adminsCount: 2, studentsCount: 340, revenue: 980000, status: "active" },
];

// --- 2. Students ---
export interface StudentMock {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  fatherName: string;
  phone: string;
  email: string;
  status: "active" | "suspended" | "inactive";
  feeStatus: "paid" | "unpaid" | "partial" | "overdue";
}

export const mockStudents: StudentMock[] = [
  { id: "std-1", admissionNo: "GW-2026-401", rollNo: "10", name: "Aarav Sharma", class: "Class 10", section: "A", fatherName: "Rajesh Sharma", phone: "9876543210", email: "aarav@gmail.com", status: "active", feeStatus: "paid" },
  { id: "std-2", admissionNo: "GW-2026-508", rollNo: "24", name: "Priya Patel", class: "Class 10", section: "B", fatherName: "Dinesh Patel", phone: "9988776655", email: "priya@gmail.com", status: "active", feeStatus: "partial" },
  { id: "std-3", admissionNo: "GW-2026-214", rollNo: "05", name: "Kabir Dev", class: "Class 9", section: "A", fatherName: "Sanjay Dev", phone: "9123456789", email: "kabir@gmail.com", status: "active", feeStatus: "overdue" },
  { id: "std-4", admissionNo: "GW-2026-105", rollNo: "18", name: "Rohan Sen", class: "Class 9", section: "C", fatherName: "Amit Sen", phone: "9812739485", email: "rohan@gmail.com", status: "inactive", feeStatus: "unpaid" },
  { id: "std-5", admissionNo: "GW-2026-302", rollNo: "12", name: "Aanya Verma", class: "Class 10", section: "A", fatherName: "Sunil Verma", phone: "9564738291", email: "aanya@gmail.com", status: "active", feeStatus: "paid" },
];

// --- 3. Employees (Staff & HR) ---
export interface EmployeeMock {
  id: string;
  employeeNo: string;
  name: string;
  role: UserRole | "staff";
  department: string;
  designation: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  salary: number;
}

export const mockEmployees: EmployeeMock[] = [
  { id: "emp-1", employeeNo: "GW-EMP-001", name: "Ms. Shalini Gupta", role: "teacher", department: "Academics", designation: "Senior Mathematics Lecturer", phone: "9456123789", email: "shalini@school.com", status: "active", salary: 75000 },
  { id: "emp-2", employeeNo: "GW-EMP-002", name: "Mr. Vikram Malhotra", role: "finance", department: "Accounts", designation: "Chief Finance Manager", phone: "9562314789", email: "vikram@school.com", status: "active", salary: 85000 },
  { id: "emp-3", employeeNo: "GW-EMP-003", name: "Mr. Amit Rao", role: "academic", department: "Academics", designation: "Dean of Studies", phone: "9874561230", email: "dean@school.com", status: "active", salary: 95000 },
  { id: "emp-4", employeeNo: "GW-EMP-004", name: "Mr. Rajesh Kumar", role: "hostel", department: "Administration", designation: "Chief Hostel Warden", phone: "9156473820", email: "rajesh@school.com", status: "active", salary: 50000 },
  { id: "emp-5", employeeNo: "GW-EMP-005", name: "Ms. Sunita Deshmukh", role: "hr", department: "HR Operations", designation: "Senior HR Lead", phone: "9845123670", email: "sunita@school.com", status: "active", salary: 80000 },
];

// --- 4. Fee Collections ---
export interface FeeMock {
  id: string;
  receiptNo: string;
  studentName: string;
  class: string;
  amount: number;
  date: string;
  status: "paid" | "partial" | "unpaid";
  mode: string;
}

export const mockFees: FeeMock[] = [
  { id: "fee-1", receiptNo: "GW-F-2026-901", studentName: "Aarav Sharma", class: "Class 10-A", amount: 15000, date: "2026-06-15T10:30:00Z", status: "paid", mode: "Online UPI" },
  { id: "fee-2", receiptNo: "GW-F-2026-902", studentName: "Priya Patel", class: "Class 10-B", amount: 10000, date: "2026-06-18T14:15:00Z", status: "partial", mode: "Net Banking" },
  { id: "fee-3", receiptNo: "GW-F-2026-903", studentName: "Aanya Verma", class: "Class 10-A", amount: 15000, date: "2026-06-20T09:00:00Z", status: "paid", mode: "Credit Card" },
  { id: "fee-4", receiptNo: "GW-F-2026-904", studentName: "Kabir Dev", class: "Class 9-A", amount: 8000, date: "2026-06-22T11:45:00Z", status: "partial", mode: "Cash Payment" },
  { id: "fee-5", receiptNo: "GW-F-2026-905", studentName: "Rohan Sen", class: "Class 9-C", amount: 12000, date: "2026-06-25T16:00:00Z", status: "unpaid", mode: "Cheque Deposit" },
];

// --- 5. Library Books ---
export interface BookMock {
  id: string;
  code: string;
  title: string;
  author: string;
  quantity: number;
  available: number;
  location: string;
}

export const mockBooks: BookMock[] = [
  { id: "bk-1", code: "PHY-102", title: "Introduction to Physics", author: "H.C. Verma", quantity: 15, available: 12, location: "Shelf A-3" },
  { id: "bk-2", code: "MTH-205", title: "Advanced Mathematics", author: "R.D. Sharma", quantity: 20, available: 15, location: "Shelf B-1" },
  { id: "bk-3", code: "HST-015", title: "History of India", author: "Bipin Chandra", quantity: 8, available: 8, location: "Shelf C-5" },
  { id: "bk-4", code: "ENG-108", title: "English Literature Companion", author: "Wren & Martin", quantity: 25, available: 22, location: "Shelf D-2" },
  { id: "bk-5", code: "CS-301", title: "Computer Networks", author: "Tanenbaum", quantity: 10, available: 4, location: "Shelf E-1" },
];

// --- 6. Transport Routes ---
export interface TransportMock {
  id: string;
  vehicleNo: string;
  routeTitle: string;
  driverName: string;
  driverPhone: string;
  allocationCount: number;
  fuelLimit: number;
  status: "active" | "inactive";
}

export const mockTransport: TransportMock[] = [
  { id: "tr-1", vehicleNo: "DL-01-PA-1054", routeTitle: "Route 1: Dwarka - Janakpuri", driverName: "Ramesh Singh", driverPhone: "9874563210", allocationCount: 42, fuelLimit: 120, status: "active" },
  { id: "tr-2", vehicleNo: "DL-01-PA-2144", routeTitle: "Route 2: Rohini - Pitampura", driverName: "Manjeet Yadav", driverPhone: "9988445566", allocationCount: 35, fuelLimit: 100, status: "active" },
  { id: "tr-3", vehicleNo: "DL-01-PA-3288", routeTitle: "Route 3: Saket - Malviya Nagar", driverName: "Satish Kumar", driverPhone: "9564872130", allocationCount: 28, fuelLimit: 90, status: "active" },
  { id: "tr-4", vehicleNo: "DL-01-PA-4022", routeTitle: "Route 4: Vasant Kunj - Gurugram", driverName: "Gurpreet Singh", driverPhone: "9215487630", allocationCount: 48, fuelLimit: 150, status: "active" },
  { id: "tr-5", vehicleNo: "DL-01-PA-5110", routeTitle: "Route 5: Noida - Mayur Vihar", driverName: "Devender Dutt", driverPhone: "9812457890", allocationCount: 15, fuelLimit: 110, status: "inactive" },
];

// --- 7. Hostel Allotments ---
export interface HostelRoomMock {
  id: string;
  roomNo: string;
  block: string;
  capacity: number;
  allocated: number;
  rentPerMonth: number;
  wardenName: string;
}

export const mockHostelRooms: HostelRoomMock[] = [
  { id: "hs-1", roomNo: "Room 101", block: "Boys A-Block", capacity: 4, allocated: 4, rentPerMonth: 6500, wardenName: "Rajesh Kumar" },
  { id: "hs-2", roomNo: "Room 102", block: "Boys A-Block", capacity: 4, allocated: 3, rentPerMonth: 6500, wardenName: "Rajesh Kumar" },
  { id: "hs-3", roomNo: "Room 201", block: "Girls B-Block", capacity: 3, allocated: 3, rentPerMonth: 7500, wardenName: "Aarti Deshpande" },
  { id: "hs-4", roomNo: "Room 202", block: "Girls B-Block", capacity: 3, allocated: 1, rentPerMonth: 7500, wardenName: "Aarti Deshpande" },
  { id: "hs-5", roomNo: "Room 301", block: "Special Suite C", capacity: 2, allocated: 2, rentPerMonth: 12000, wardenName: "Rajesh Kumar" },
];
