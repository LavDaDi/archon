export type NodeType = "file" | "function" | "class" | "module";

export interface HoloNode {
  id: string;
  label: string;
  type: NodeType;
  position?: [number, number, number];
}

export interface HoloEdge {
  source: string;
  target: string;
  type?: "import" | "call" | "inherit";
}

export interface HoloGraph {
  nodes: HoloNode[];
  edges: HoloEdge[];
}