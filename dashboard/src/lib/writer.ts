import fs from "fs";
import path from "path";

const SPEC_DIR = path.resolve(process.cwd(), "../spec");

export function updateTodoStatus(
  lineNumber: number,
  checked: boolean
): boolean {
  const todoPath = path.join(SPEC_DIR, "Todo.md");
  if (!fs.existsSync(todoPath)) return false;

  const lines = fs.readFileSync(todoPath, "utf-8").split("\n");

  if (lineNumber < 0 || lineNumber >= lines.length) return false;

  const line = lines[lineNumber];
  if (checked) {
    lines[lineNumber] = line.replace("- [ ]", "- [x]");
  } else {
    lines[lineNumber] = line.replace("- [x]", "- [ ]");
  }

  fs.writeFileSync(todoPath, lines.join("\n"), "utf-8");
  return true;
}
