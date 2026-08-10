import { Canvas } from "@react-three/fiber";
import { Scene } from "./core/Scene";
import { useArchonStore } from "./core/store";
import { demoGraph } from "./core/graphData";

export default function App() {
  const {
    selectedNode,
    toggleLabels,
    showLabels,
    visualMode,
    setVisualMode,
  } = useArchonStore();

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
      <Canvas
        camera={{
          position: visualMode === "3D" ? [0, 0, 25] : [0, 0, 15],
          fov: 60,
        }}
        key={visualMode} // ✅ КЛЮЧЕВОЙ МОМЕНТ — пересоздаём Canvas при смене режима
      >
        <Scene graph={demoGraph} key={visualMode} /> {/* ✅ И сцену тоже */}
      </Canvas>

      {/* Mode Toggle */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={() => setVisualMode("2D")}
          style={{
            background: visualMode === "2D" ? "#ff7a00" : "rgba(0,0,0,0.8)",
            border: "1px solid #ff7a00",
            color: visualMode === "2D" ? "#000" : "#ffae00",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "monospace",
          }}
        >
          2D
        </button>
        <button
          onClick={() => setVisualMode("3D")}
          style={{
            background: visualMode === "3D" ? "#ff7a00" : "rgba(0,0,0,0.8)",
            border: "1px solid #ff7a00",
            color: visualMode === "3D" ? "#000" : "#ffae00",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "monospace",
          }}
        >
          3D
        </button>
      </div>

      {/* Labels Toggle */}
      <button
        onClick={toggleLabels}
        style={{
          position: "absolute",
          left: 20,
          top: 70,
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
            minWidth: "220px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>A.R.C.H.O.N.</h3>
          <p>
            <strong>Node ID:</strong> {selectedNode}
          </p>
          <p>
            <strong>Mode:</strong> {visualMode}
          </p>
          <p>
            <strong>Status:</strong> Active
          </p>
        </div>
      )}
    </div>
  );
}