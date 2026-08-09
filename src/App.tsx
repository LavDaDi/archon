import { Canvas } from "@react-three/fiber";
import { Scene } from "./core/Scene";
import { useArchonStore } from "./core/store";

export default function App() {
  const { selectedNode, toggleLabels, showLabels } = useArchonStore();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#050505",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <Scene />
      </Canvas>

      {/* Toggle Labels Button */}
      <button
        onClick={toggleLabels}
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          background: "rgba(0,0,0,0.8)",
          border: "1px solid #ff7a00",
          color: "#ffae00",
          padding: "8px 14px",
          cursor: "pointer",
          fontFamily: "monospace",
        }}
      >
        {showLabels ? "Hide Labels" : "Show Labels"}
      </button>

      {/* Info Panel */}
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            background: "rgba(0,0,0,0.85)",
            border: "1px solid #ff7a00",
            padding: "15px",
            color: "#ffae00",
            fontFamily: "monospace",
            minWidth: "200px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>A.R.C.H.O.N.</h3>
          <p><strong>Node ID:</strong> {selectedNode}</p>
          <p><strong>Status:</strong> Active</p>
        </div>
      )}
    </div>
  );
}