import chokidar from "chokidar";
import path from "path";

const SPEC_DIR = path.resolve(process.cwd(), "../spec");

export function getAffectedSection(filePath: string): string {
  if (filePath.includes("/Literature/")) return "literature";
  if (filePath.includes("/Concepts/")) return "concepts";
  if (filePath.includes("/Prototypes/")) return "prototypes";
  if (filePath.includes("/Progress/")) return "progress";
  if (filePath.includes("Todo.md")) return "todo";
  return "all";
}

export function createWatcher(
  onChange: (event: string, filePath: string, section: string) => void
) {
  const watcher = chokidar.watch(path.join(SPEC_DIR, "**/*.md"), {
    persistent: true,
    ignoreInitial: true,
  });

  const handler = (event: string) => (filePath: string) => {
    const section = getAffectedSection(filePath);
    onChange(event, filePath, section);
  };

  watcher.on("change", handler("change"));
  watcher.on("add", handler("add"));
  watcher.on("unlink", handler("unlink"));

  return watcher;
}
