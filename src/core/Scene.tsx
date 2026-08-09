import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Node } from "./Node";
import { Edge } from "./Edge";
import { useForceSimulation } from "./useForceSimulation";
import type { HoloGraph } from "./types";

export function Scene({ graph }: { graph: HoloGraph }) {
  // Force simulation
  const positions = useForceSimulation(graph);

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

        return (
          <Node
            key={node.id}
            id={node.id}
            position={position}
          />
        );
      })}

      {/* Edges */}
      {graph.edges.map((edge, index) => {
        const sourcePos = positions[edge.source];
        const targetPos = positions[edge.target];

        if (!sourcePos || !targetPos) return null;

        return (
          <Edge
            key={index}
            from={sourcePos}
            to={targetPos}
          />
        );
      })}

      {/* Controls */}
      <OrbitControls enableDamping />

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