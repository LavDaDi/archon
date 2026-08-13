import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Node } from "./Node";
import { Edge } from "./Edge";
import { useForceSimulation2D } from "./useForceSimulation2D";
import { useForceSimulation3D } from "./useForceSimulation3D";
import { useArchonStore } from "./store";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { HoloGraph } from "./types";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function Scene({ graph }: { graph: HoloGraph }) {
  const { selectedNode, visualMode } = useArchonStore();
  const { camera } = useThree();

  const { positions, startDrag, drag, endDrag } =
    visualMode === "3D"
      ? useForceSimulation3D(graph)
      : useForceSimulation2D(graph);

  const controlsRef = useRef<OrbitControlsImpl>(null!);

  // ✅ ДИНАМИЧЕСКАЯ ПОДСТРОЙКА КАМЕРЫ
  useEffect(() => {
    if (Object.keys(positions).length === 0) return;

    const posArray = Object.values(positions);
    
    // Вычисляем границы
    const xs = posArray.map((p) => p[0]);
    const ys = posArray.map((p) => p[1]);
    const zs = posArray.map((p) => p[2]);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const sizeZ = maxZ - minZ;

    const maxSize = Math.max(sizeX, sizeY, sizeZ);

    console.log("📐 Graph Bounds:", {
      X: [minX, maxX],
      Y: [minY, maxY],
      Z: [minZ, maxZ],
      center: [centerX, centerY, centerZ],
      maxSize,
    });

    // ✅ Подстраиваем камеру
    const distance = maxSize * 2;

    if (visualMode === "3D") {
      camera.position.set(
        centerX + distance * 0.7,
        centerY + distance * 0.7,
        centerZ + distance * 0.7
      );
    } else {
      camera.position.set(centerX, centerY, distance);
    }

    camera.lookAt(centerX, centerY, centerZ);

    // ✅ Обновляем OrbitControls
    if (controlsRef.current) {
      controlsRef.current.target.set(centerX, centerY, centerZ);
      controlsRef.current.update();
    }
  }, [positions, visualMode, camera]);

  useEffect(() => {
    console.log("=== A.R.C.H.O.N. DIAGNOSTIC ===");
    console.log("Visual Mode:", visualMode);
    console.log("Nodes:", graph.nodes.length);
    console.log("Edges:", graph.edges.length);
    console.log("Positions loaded:", Object.keys(positions).length);
  }, [visualMode, graph.nodes.length, graph.edges.length, positions]);

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

      {visualMode === "3D" && (
        <fog attach="fog" args={["#050505", 20, 200]} />
      )}

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {visualMode === "3D" && (
        <>
          <pointLight position={[-10, -10, 10]} intensity={0.6} color="#ff7a00" />
          <pointLight position={[0, 20, 0]} intensity={0.5} color="#ff7a00" />
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
        autoRotate={false}
      />

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>

      <Stars radius={200} depth={100} count={800} factor={2} />
    </>
  );
}