import { create } from "zustand";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "createdAt" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: "nt-1",
      title: "New Student Admission",
      description: "Aarav Sharma has completed payment for Class 10 Admission.",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      isRead: false,
      type: "success",
    },
    {
      id: "nt-2",
      title: "Library Book Overdue",
      description: "Book 'Introduction to Physics' is overdue for student Priya Patel.",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      isRead: false,
      type: "warning",
    },
    {
      id: "nt-3",
      title: "Salary Credited",
      description: "Your monthly salary for June 2026 has been processed.",
      createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
      isRead: true,
      type: "info",
    },
  ],
  unreadCount: 2,
  addNotification: (notif) =>
    set((state) => {
      const newNotif: NotificationItem = {
        ...notif,
        id: `nt-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      const notifications = [newNotif, ...state.notifications];
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      return {
        notifications,
        unreadCount: 0,
      };
    }),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
