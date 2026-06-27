import { format as formatDateFns, formatDistanceToNow as formatDistanceFns, parseISO } from "date-fns";

/**
 * Format currency to Indian Rupees (INR)
 */
export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a date object or ISO string to standard Indian date display (dd/MM/yyyy)
 */
export function formatDate(date: Date | string | null | undefined, formatStr: string = "dd/MM/yyyy"): string {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  try {
    return formatDateFns(dateObj, formatStr);
  } catch (error) {
    return "-";
  }
}

/**
 * Format a date to a long human-readable format (e.g. 15 Aug 2026)
 */
export function formatDateLong(date: Date | string | null | undefined): string {
  return formatDate(date, "dd MMM yyyy");
}

/**
 * Format a date to include time (e.g. 15 Aug 2026, 04:30 PM)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, "dd MMM yyyy, hh:mm a");
}

/**
 * Format date to relative time (e.g. "2 hours ago", "yesterday")
 */
export function formatDistanceToNow(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  try {
    return formatDistanceFns(dateObj, { addSuffix: true });
  } catch (error) {
    return "-";
  }
}

/**
 * Format number with Indian numbering system (e.g., 100,000 -> 1,00,000)
 */
export function formatNumber(num: number | string): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
}

/**
 * Format percentage
 */
export function formatPercent(num: number | string): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

/**
 * Format Indian phone number (e.g., 9876543210 -> +91 98765 43210)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "-";
  // Clean all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}
