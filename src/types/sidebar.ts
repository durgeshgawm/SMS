import { LucideIcon } from "lucide-react";

export interface SidebarSubItem {
  label: string;
  href: string;
  badge?: number;
}

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  children?: SidebarSubItem[];
}

export interface SidebarConfig {
  role: string;
  roleLabel: string;
  items: SidebarItem[];
  quickLinks?: { label: string; href: string; icon: LucideIcon }[];
}
