import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import fs from "fs/promises";

const traverse = (_traverse as any).default || _traverse;

export interface ImportInfo {
  source: string;
  specifiers: string[];
}

export async function parseFile(
  filePath: string
): Promise<ImportInfo[]> {
  try {
    const code = await fs.readFile(filePath, "utf-8");

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });

    const imports: ImportInfo[] = [];

    traverse(ast, {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        const specifiers = path.node.specifiers.map(
          (spec) => spec.local.name
        );

        imports.push({ source, specifiers });
      },
    });

    return imports;
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
    return [];
  }
}