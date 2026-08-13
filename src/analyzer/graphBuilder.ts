import type { HoloGraph, HoloNode, HoloEdge } from "../core/types";
import type { ScannedFile } from "./fileScanner";
import type { ImportInfo } from "./astParser";
import path from "path";

export function buildGraph(
  files: ScannedFile[],
  importsMap: Map<string, ImportInfo[]>
): HoloGraph {
  const nodes: HoloNode[] = [];
  const edges: HoloEdge[] = [];

  // ✅ Создаём узлы из файлов
  files.forEach((file) => {
    nodes.push({
      id: file.name,
      label: file.name,
      type: "file",
    });
  });

  // ✅ Создаём рёбра из импортов
  files.forEach((file) => {
    const imports = importsMap.get(file.path) || [];

    imports.forEach((imp) => {
      // Находим файл, на который ссылается импорт
      const targetFile = files.find((f) =>
        f.path.includes(imp.source.replace(/^\.\//, ""))
      );

      if (targetFile) {
        edges.push({
          source: file.name,
          target: targetFile.name,
          type: "import",
        });
      }
    });
  });

  return { nodes, edges };
}