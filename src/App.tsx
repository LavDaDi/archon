import { Canvas } from "@react-three/fiber";
import { Scene } from "./core/Scene";
import { useArchonStore } from "./core/store";

export default function App() {
  const { selectedNode } = useArchonStore();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050505" }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <Scene />
      </Canvas>

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            background: "rgba(0,0,0,0.8)",
            border: "1px solid #ff7a00",
            padding: "15px",
            color: "#ffae00",
            fontFamily: "monospace",
          }}
        >
          <h3>A.R.C.H.O.N.</h3>
          <p>Node ID: {selectedNode}</p>
          <p>Status: Active</p>
        </div>
      )}  
    </div>
  );
}