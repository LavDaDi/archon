import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useArchonStore } from "./store";

export function Node({
  id,
  position,
}: {
  id: string;
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const { selectedNode, setSelectedNode } = useArchonStore();

  const isSelected = selectedNode === id;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 2) * 0.05;

    ref.current.scale.setScalar(
      isSelected ? 1.5 : hovered ? 1.2 : pulse
    );
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setSelectedNode(id)}
    >
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        emissive={isSelected ? "#ff3c00" : "#ff7a00"}
        emissiveIntensity={2}
        color={hovered ? "#ffffff" : "#ffae00"}
      />
    </mesh>
  );
}