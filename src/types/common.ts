/**
 * Unified Roles for the School ERP
 */
export type UserRole =
  | "super-admin"
  | "branch-admin"
  | "academic"
  | "finance"
  | "hr"
  | "library"
  | "transport"
  | "hostel"
  | "teacher"
  | "student"
  | "parent";

/**
 * Standard User session shape
 */
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  branchId?: string;
  branchName?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated API / Data wrapper
 */
export interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Common Branch shape
 */
export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  city: string;
  status: "active" | "inactive";
}

/**
 * Common key-value pair for select/combobox items
 */
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Generic status shapes
 */
export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "completed"
  | "ongoing"
  | "cancelled"
  | "paid"
  | "unpaid"
  | "partial"
  | "overdue";

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}
