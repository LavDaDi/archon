import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Node } from "./Node";
import { Edge } from "./Edge";
import type { HoloGraph } from "./types";

export function Scene({ graph }: { graph: HoloGraph }) {
  return (
    <>
      {/* Background */}
      <color attach="background" args={["#050505"]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Nodes */}
      {graph.nodes.map((node) => {
        if (!node.position) return null;

        return (
          <Node
            key={node.id}
            id={node.id}
            position={node.position}
          />
        );
      })}

      {/* Edges */}
      {graph.edges.map((edge, index) => {
        const sourceNode = graph.nodes.find(
          (n) => n.id === edge.source
        );
        const targetNode = graph.nodes.find(
          (n) => n.id === edge.target
        );

        if (!sourceNode?.position || !targetNode?.position)
          return null;

        return (
          <Edge
            key={index}
            from={sourceNode.position}
            to={targetNode.position}
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