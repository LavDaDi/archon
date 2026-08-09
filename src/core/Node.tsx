import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useArchonStore } from "./store";

export function Node({
  id,
  position,
  dimmed,
}: {
  id: string;
  position: [number, number, number];
  dimmed?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const { selectedNode, setSelectedNode, showLabels } = useArchonStore();

  const isSelected = selectedNode === id;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 2) * 0.05;

    ref.current.scale.setScalar(
      isSelected ? 1.6 : hovered ? 1.2 : pulse
    );
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setSelectedNode(id)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          emissive={isSelected ? "#ff3c00" : "#ff7a00"}
          emissiveIntensity={dimmed ? 0.2 : 2}
          color={hovered ? "#ffffff" : "#ffae00"}
          transparent
          opacity={dimmed ? 0.2 : 1}
        />
      </mesh>

      {showLabels && (
        <Billboard position={[0, 0.9, 0]}>
          <Text
            fontSize={0.3}
            color={dimmed ? "#555555" : "#ffae00"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#ff7a00"
          >
            {id}
          </Text>
        </Billboard>
      )}
    </group>
  );
}