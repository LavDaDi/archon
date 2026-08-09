import { create } from "zustand";

interface ArchonState {
  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
  showLabels: boolean;
  toggleLabels: () => void;
}

export const useArchonStore = create<ArchonState>((set) => ({
  selectedNode: null,
  setSelectedNode: (id) => set({ selectedNode: id }),
  showLabels: true,
  toggleLabels: () =>
    set((state) => ({ showLabels: !state.showLabels })),
}));