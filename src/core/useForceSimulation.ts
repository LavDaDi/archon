import { useEffect, useState } from "react";
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
} from "d3-force";

import type {
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";

import type { HoloGraph } from "./types";

interface ForceNode extends SimulationNodeDatum {
  id: string;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: string;
  target: string;
}

export function useForceSimulation(graph: HoloGraph) {
  const [positions, setPositions] = useState<
    Record<string, [number, number, number]>
  >({});

  useEffect(() => {
    if (!graph.nodes.length) return;

    // ✅ создаём ноды
    const nodes: ForceNode[] = graph.nodes.map((n) => ({
      id: n.id,
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
    }));

    // ✅ создаём связи
    const links: ForceLink[] = graph.edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));

    // ✅ создаём симуляцию
    const simulation = forceSimulation(nodes)
      .force("charge", forceManyBody().strength(-400)) // отталкивание
      .force(
        "link",
        forceLink<ForceNode, ForceLink>(links)
          .id((d) => d.id)
          .distance(5)
          .strength(0.7)
      )
      .force("center", forceCenter(0, 0))
      .force("collision", forceCollide().radius(1.2)) // избегаем наложений
      .force("x", forceX(0).strength(0.05))
      .force("y", forceY(0).strength(0.05))
      .alphaDecay(0.02)
      .velocityDecay(0.3)
      .alpha(1)
      .restart();

    simulation.on("tick", () => {
      const newPositions: Record<string, [number, number, number]> = {};

      nodes.forEach((node) => {
        newPositions[node.id] = [
          node.x ?? 0,
          node.y ?? 0,
          0, // пока 2D, позже сделаем 3D
        ];
      });

      setPositions(newPositions);
    });

    return () => {
      simulation.stop();
    };
  }, [graph]);

  return positions;
}