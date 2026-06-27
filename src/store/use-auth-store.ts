import { create } from "zustand";
import { UserRole, UserSession } from "@/types/common";

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, role, name) => {
    const mockSession: UserSession = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role,
      avatar: "", // empty so fallbacks display initials
      branchId: "br-delhi",
      branchName: "Delhi Main Branch",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("user_session", JSON.stringify(mockSession));
    }
    set({ user: mockSession, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_session");
    }
    set({ user: null, isAuthenticated: false });
  },
  initialize: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as UserSession;
          set({ user: parsed, isAuthenticated: true });
        } catch (e) {
          localStorage.removeItem("user_session");
        }
      }
    }
  },
}));
