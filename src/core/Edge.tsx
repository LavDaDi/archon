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
  const points = [
    new THREE.Vector3(...from),
    new THREE.Vector3(...to),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color="#ff7a00"
        transparent
        opacity={dimmed ? 0.1 : 0.6}
      />
    </line>
  );
}