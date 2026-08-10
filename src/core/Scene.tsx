import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Node } from "./Node";
import { Edge } from "./Edge";
import { useForceSimulation2D } from "./useForceSimulation2D";
import { useForceSimulation3D } from "./useForceSimulation3D";
import { useArchonStore } from "./store";
import { useRef, useEffect } from "react";
import type { HoloGraph } from "./types";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function Scene({ graph }: { graph: HoloGraph }) {
  const { selectedNode, visualMode } = useArchonStore();

  const { positions, startDrag, drag, endDrag } =
    visualMode === "3D"
      ? useForceSimulation3D(graph)
      : useForceSimulation2D(graph);

  const controlsRef = useRef<OrbitControlsImpl>(null!);

  useEffect(() => {
    console.log("=== A.R.C.H.O.N. DIAGNOSTIC ===");
    console.log("Visual Mode:", visualMode);
    console.log("Number of nodes:", Object.keys(positions).length);

    if (Object.keys(positions).length > 0) {
      const firstNodeKey = Object.keys(positions)[0];
      const firstPos = positions[firstNodeKey];
      console.log(
        `First node (${firstNodeKey}):`,
        firstPos,
        `Z: ${firstPos[2]}`
      );
    }
  }, [positions, visualMode]);

  if (Object.keys(positions).length === 0) {
    return null;
  }

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
      <color attach="background" args={["#050505"]} />

      {/* ✅ FOG для 3D эффекта */}
      {visualMode === "3D" && (
        <fog attach="fog" args={["#050505", 20, 80]} />
      )}

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* ✅ Дополнительный свет для 3D */}
      {visualMode === "3D" && (
        <>
          <pointLight position={[-10, -10, 10]} intensity={0.6} />
          <pointLight position={[0, 20, 0]} intensity={0.5} />
        </>
      )}

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
            onDragStart={startDrag}
            onDrag={drag}
            onDragEnd={endDrag}
            onDragInitiate={() => {
              if (controlsRef.current) {
                controlsRef.current.enabled = false;
              }
            }}
            onDragFinish={() => {
              if (controlsRef.current) {
                controlsRef.current.enabled = true;
              }
            }}
          />
        );
      })}

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

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        panSpeed={0.8}
        screenSpacePanning
        enablePan
      />

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