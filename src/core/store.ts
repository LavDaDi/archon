import { create } from "zustand";

interface ArchonState {
  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
  showLabels: boolean;
  toggleLabels: () => void;
  visualMode: "2D" | "3D";
  setVisualMode: (mode: "2D" | "3D") => void;
  graphMode: "demo" | "real";
  setGraphMode: (mode: "demo" | "real") => void;
}

export const useArchonStore = create<ArchonState>((set) => ({
  selectedNode: null,
  setSelectedNode: (id) => set({ selectedNode: id }),
  showLabels: true,
  toggleLabels: () =>
    set((state) => ({ showLabels: !state.showLabels })),
  visualMode: "2D",
  setVisualMode: (mode) => set({ visualMode: mode }),
  graphMode: "demo",
  setGraphMode: (mode) => set({ graphMode: mode }),
}));