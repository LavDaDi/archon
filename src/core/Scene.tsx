import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Node } from "./Node";
import { Edge } from "./Edge";
import { useForceSimulation } from "./useForceSimulation";
import { useArchonStore } from "./store";
import type { HoloGraph } from "./types";

export function Scene({ graph }: { graph: HoloGraph }) {
  const positions = useForceSimulation(graph);
  const { selectedNode } = useArchonStore();

  // ✅ adjacency map (кто с кем связан)
  const adjacency = new Map<string, Set<string>>();

  graph.nodes.forEach((node) => {
    adjacency.set(node.id, new Set());
  });

  graph.edges.forEach((edge) => {
    adjacency.get(edge.source)?.add(edge.target);
    adjacency.get(edge.target)?.add(edge.source);
  });

  return (
    <>
      {/* Background */}
      <color attach="background" args={["#050505"]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Nodes */}
      {graph.nodes.map((node) => {
        const position = positions[node.id];
        if (!position) return null;

        const isConnected =
          selectedNode &&
          (node.id === selectedNode ||
            adjacency.get(selectedNode)?.has(node.id));

        return (
          <Node
            key={node.id}
            id={node.id}
            position={position}
            dimmed={!!selectedNode && !isConnected}
          />
        );
      })}

      {/* Edges */}
      {graph.edges.map((edge, index) => {
        const sourcePos = positions[edge.source];
        const targetPos = positions[edge.target];

        if (!sourcePos || !targetPos) return null;

        const isConnected =
          selectedNode &&
          (edge.source === selectedNode ||
            edge.target === selectedNode);

        return (
          <Edge
            key={index}
            from={sourcePos}
            to={targetPos}
            dimmed={!!selectedNode && !isConnected}
          />
        );
      })}

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        panSpeed={0.8}
        screenSpacePanning
        enablePan
      />

      {/* Post Processing */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>

      {/* Space ambience */}
      <Stars radius={100} depth={50} count={500} factor={2} />
    </>
  );
}