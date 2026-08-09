import type { HoloGraph } from "./types";

export const demoGraph: HoloGraph = {
  nodes: [
    { id: "A", label: "App.tsx", type: "file", position: [0, 0, 0] },
    { id: "B", label: "Scene.tsx", type: "file", position: [4, 2, 0] },
    { id: "C", label: "Node.tsx", type: "file", position: [-3, -2, 1] },
    { id: "D", label: "store.ts", type: "file", position: [2, -3, -2] },
  ],
  edges: [
    { source: "A", target: "B", type: "import" },
    { source: "B", target: "C", type: "import" },
    { source: "C", target: "D", type: "import" },
  ],
};