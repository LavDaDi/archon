import fg from "fast-glob";
import path from "path";

export interface ScannedFile {
  path: string;
  name: string;
  ext: string;
}

export async function scanProject(
  projectPath: string
): Promise<ScannedFile[]> {
  console.log("📂 Scanning path:", projectPath);

  const pattern = `${projectPath}/**/*.{js,jsx,ts,tsx}`;
  console.log("🔎 Pattern:", pattern);

  const files = await fg(pattern, {
    ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    absolute: true,
    onlyFiles: true,
  });

  console.log("📄 Raw files found:", files.length);
  console.log("First 5 files:", files.slice(0, 5));

  return files.map((filePath) => ({
    path: filePath,
    name: path.basename(filePath),
    ext: path.extname(filePath),
  }));
}