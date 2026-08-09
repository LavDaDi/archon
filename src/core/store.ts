import { create } from "zustand";

interface ArchonState {
  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
}

export const useArchonStore = create<ArchonState>((set) => ({
  selectedNode: null,
  setSelectedNode: (id) => set({ selectedNode: id }),
}));