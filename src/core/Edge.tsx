import * as THREE from "three";

export function Edge({
  from,
  to,
}: {
  from: number[];
  to: number[];
}) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ff7a00" transparent opacity={0.5} />
    </line>
  );
}