import { Canvas } from "@react-three/fiber";
import { Scene } from "./core/Scene";
import { useArchonStore } from "./core/store";
import { demoGraph } from "./core/graphData";
import { realGraph } from "./core/realGraphData";

export default function App() {
  const {
    selectedNode,
    toggleLabels,
    showLabels,
    visualMode,
    setVisualMode,
    graphMode,
    setGraphMode,
  } = useArchonStore();

  // ✅ Выбираем граф в зависимости от режима
  const currentGraph = graphMode === "real" ? realGraph : demoGraph;

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
        key={`${visualMode}-${graphMode}`}
      >
        <Scene graph={currentGraph} key={`${visualMode}-${graphMode}`} />
      </Canvas>

      {/* Graph Mode Toggle */}
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
          onClick={() => setGraphMode("demo")}
          style={{
            background: graphMode === "demo" ? "#ff7a00" : "rgba(0,0,0,0.8)",
            border: "1px solid #ff7a00",
            color: graphMode === "demo" ? "#000" : "#ffae00",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          Demo
        </button>
        <button
          onClick={() => setGraphMode("real")}
          style={{
            background: graphMode === "real" ? "#ff7a00" : "rgba(0,0,0,0.8)",
            border: "1px solid #ff7a00",
            color: graphMode === "real" ? "#000" : "#ffae00",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          A.R.C.H.O.N.
        </button>
      </div>

      {/* Visual Mode Toggle */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 70,
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
          top: 120,
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
            <strong>Node:</strong> {selectedNode}
          </p>
          <p>
            <strong>Mode:</strong> {visualMode}
          </p>
          <p>
            <strong>Graph:</strong> {graphMode === "real" ? "Real" : "Demo"}
          </p>
          <p>
            <strong>Status:</strong> Active
          </p>
        </div>
      )}
    </div>
  );
}