import { create } from "zustand";

interface BranchState {
  selectedBranchId: string;
  selectedBranchName: string;
  setSelectedBranch: (id: string, name: string) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  selectedBranchId: "br-delhi",
  selectedBranchName: "Delhi Main Branch",
  setSelectedBranch: (id, name) => set({ selectedBranchId: id, selectedBranchName: name }),
}));
