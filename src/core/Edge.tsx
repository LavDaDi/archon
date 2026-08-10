import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function Edge({
  from,
  to,
  dimmed,
}: {
  from: number[];
  to: number[];
  dimmed?: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null!);

  useFrame(() => {
    if (!lineRef.current) return;

    const positions = lineRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    // ✅ обновляем позиции каждый frame
    positions.setXYZ(0, from[0], from[1], from[2]);
    positions.setXYZ(1, to[0], to[1], to[2]);
    positions.needsUpdate = true;
  });

  const points = [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#ff7a00"
        transparent
        opacity={dimmed ? 0.1 : 0.6}
      />
    </line>
  );
}