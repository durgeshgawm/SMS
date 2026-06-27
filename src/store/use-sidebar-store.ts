import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebar: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileSidebar: (open) => set({ isMobileOpen: open }),
}));
