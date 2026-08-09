import type { HoloGraph } from "./types";

export const demoGraph: HoloGraph = {
  nodes: [
    { id: "A", label: "App.tsx", type: "file" },
    { id: "B", label: "Scene.tsx", type: "file" },
    { id: "C", label: "Node.tsx", type: "file" },
    { id: "D", label: "Edge.tsx", type: "file" },
    { id: "E", label: "store.ts", type: "file" },
    { id: "F", label: "types.ts", type: "file" },
    { id: "G", label: "graphData.ts", type: "file" },
    { id: "H", label: "useForce.ts", type: "file" },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "B", target: "D" },
    { source: "C", target: "E" },
    { source: "C", target: "F" },
    { source: "D", target: "F" },
    { source: "E", target: "G" },
    { source: "F", target: "G" },
    { source: "G", target: "H" },
    { source: "H", target: "B" }, // цикл
  ],
};