import { useEffect, useRef, useState } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
} from "d3-force";

import type {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
} from "d3-force";

import type { HoloGraph } from "./types";

interface ForceNode extends SimulationNodeDatum {
  id: string;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: string;
  target: string;
}

export function useForceSimulation3D(graph: HoloGraph) {
  const [positions, setPositions] = useState<
    Record<string, [number, number, number]>
  >({});

  const simulationRef = useRef<Simulation<ForceNode, ForceLink> | null>(null);
  const nodesRef = useRef<ForceNode[]>([]);

  useEffect(() => {
    if (!graph.nodes.length) return;

    const nodes: ForceNode[] = graph.nodes.map((n) => ({
      id: n.id,
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
    }));

    const links: ForceLink[] = graph.edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));

    nodesRef.current = nodes;

    const simulation = forceSimulation(nodes)
      .force("charge", forceManyBody().strength(-100)) // ✅ слабее
      .force(
        "link",
        forceLink<ForceNode, ForceLink>(links)
          .id((d) => d.id)
          .distance(5)
          .strength(0.7)
      )
      .force("center", forceCenter(0, 0))
      .force("collision", forceCollide().radius(1.2))
      .alphaDecay(0.02)
      .velocityDecay(0.5) // ✅ быстрее затухание
      .alpha(1)
      .restart();

    simulation.on("tick", () => {
      const newPositions: Record<string, [number, number, number]> = {};

      nodes.forEach((node) => {
        const nodeIndex = graph.nodes.findIndex((n) => n.id === node.id);
        const zLayer = (nodeIndex / graph.nodes.length) * 15 - 7.5;

        // ✅ ограничиваем X, Y координаты
        const x = Math.max(-50, Math.min(50, node.x ?? 0));
        const y = Math.max(-50, Math.min(50, node.y ?? 0));

        newPositions[node.id] = [x, y, zLayer];
      });

      setPositions(newPositions);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [graph]);

  const startDrag = (id: string) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (!node || !simulationRef.current) return;

    simulationRef.current.alphaTarget(0.5).restart();

    node.fx = node.x;
    node.fy = node.y;

    node.vx = 0;
    node.vy = 0;
  };

  const drag = (id: string, x: number, y: number) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (!node) return;

    node.fx = Math.max(-50, Math.min(50, x));
    node.fy = Math.max(-50, Math.min(50, y));
  };

  const endDrag = (id: string) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (!node || !simulationRef.current) return;

    simulationRef.current.alphaTarget(0);
  };

  return { positions, startDrag, drag, endDrag };
}