import { scanProject } from "./fileScanner";
import { parseFile } from "./astParser";
import { buildGraph } from "./graphBuilder";
import type { HoloGraph } from "../core/types";

export async function analyzeProject(
  projectPath: string
): Promise<HoloGraph> {
  console.log("🔍 A.R.C.H.O.N. analyzing:", projectPath);

  // 1. Сканируем файлы
  const files = await scanProject(projectPath);
  console.log(`📁 Found ${files.length} files`);

  // 2. Парсим каждый файл
  const importsMap = new Map();

  for (const file of files) {
    const imports = await parseFile(file.path);
    importsMap.set(file.path, imports);
  }

  // 3. Строим граф
  const graph = buildGraph(files, importsMap);
  console.log(`🧠 Generated graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);

  return graph;
}