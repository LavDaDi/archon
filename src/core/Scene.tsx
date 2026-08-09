import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Node } from "./Node";
import { Edge } from "./Edge";

export function Scene() {
  const nodes = [
    { id: "A", position: [0, 0, 0] },
    { id: "B", position: [4, 2, 0] },
    { id: "C", position: [-3, -2, 1] },
    { id: "D", position: [2, -3, -2] },
  ];

  const edges = [
    { from: nodes[0], to: nodes[1] },
    { from: nodes[0], to: nodes[2] },
    { from: nodes[1], to: nodes[3] },
  ];

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {nodes.map((node) => (
        <Node
            key={node.id}
            id={node.id}
            position={node.position as [number, number, number]}
        />
      ))}

      {edges.map((edge, i) => (
        <Edge key={i} from={edge.from.position} to={edge.to.position} />
      ))}

      <OrbitControls enableDamping />

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>

      <Stars radius={100} depth={50} count={500} factor={2} />
    </>
  );
}