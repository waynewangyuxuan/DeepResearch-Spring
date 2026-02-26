import fs from "fs";
import path from "path";
import {
  QueueItem,
  Idea,
  PrototypeEntry,
  SessionEntry,
  TodoItem,
  ParsedSpec,
} from "./types";

const SPEC_DIR = path.resolve(process.cwd(), "../spec");

function readFile(relativePath: string): string {
  const filePath = path.join(SPEC_DIR, relativePath);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

function parseTableRows(tableText: string): string[][] {
  const lines = tableText.split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 2) return [];
  // Skip header and separator rows
  return lines.slice(2).map((line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim())
  );
}

export function parseReadingQueue(): QueueItem[] {
  const content = readFile("Literature/Reading-Queue.md");
  if (!content) return [];

  const items: QueueItem[] = [];
  const sections = content.split(/^## /m);

  for (const section of sections) {
    let status: QueueItem["status"] = "toread";
    if (section.startsWith("待读")) status = "toread";
    else if (section.startsWith("在读")) status = "reading";
    else if (section.startsWith("已读")) status = "read";
    else continue;

    const rows = parseTableRows(section);
    for (const row of rows) {
      if (row.length < 2) continue;
      if (row[0] === "(none currently)") continue;

      if (status === "toread" && row.length >= 5) {
        items.push({
          paper: row[0],
          track: row[1],
          keywords: row[2],
          priority: row[3],
          reason: row[4],
          status,
        });
      } else if (status === "reading" && row.length >= 4) {
        items.push({
          paper: row[0],
          track: row[1],
          keywords: "",
          priority: "",
          reason: "",
          status,
          startedDate: row[2],
          notesLocation: row[3],
        });
      } else if (status === "read" && row.length >= 4) {
        items.push({
          paper: row[0],
          track: row[1],
          keywords: "",
          priority: "",
          reason: "",
          status,
          coreTakeaway: row[2],
          notesLink: row[3],
        });
      }
    }
  }

  return items;
}

const STATUS_MAP: Record<string, string> = {
  "💡": "sprouting",
  "🔍": "exploring",
  "📐": "designing",
  "🧪": "prototyping",
  "✅": "validated",
  "❌": "abandoned",
};

export function parseIdeasLog(): Idea[] {
  const content = readFile("Concepts/Ideas-Log.md");
  if (!content) return [];

  const ideas: Idea[] = [];
  let currentDate = "";

  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Date heading
    if (line.startsWith("## ")) {
      currentDate = line.replace("## ", "").trim();
      i++;
      continue;
    }

    // Idea heading
    if (line.startsWith("### ")) {
      const headingText = line.replace("### ", "").trim();
      const emoji = headingText.match(/^[^\w\s]/u)?.[0] || "";
      const title = headingText.replace(emoji, "").trim();

      const idea: Idea = {
        title,
        date: currentDate,
        trigger: "",
        intuition: "",
        related: "",
        status: emoji,
        statusLabel: STATUS_MAP[emoji] || "unknown",
      };

      i++;
      // Parse fields until next heading or end
      while (i < lines.length && !lines[i].startsWith("##")) {
        const fieldLine = lines[i];
        if (fieldLine.startsWith("**Trigger**:")) {
          idea.trigger = fieldLine.replace("**Trigger**:", "").trim();
        } else if (fieldLine.startsWith("**Intuition**:")) {
          let intuition = fieldLine.replace("**Intuition**:", "").trim();
          // Multi-line intuition
          while (
            i + 1 < lines.length &&
            lines[i + 1] &&
            !lines[i + 1].startsWith("**") &&
            !lines[i + 1].startsWith("###")
          ) {
            i++;
            intuition += " " + lines[i].trim();
          }
          idea.intuition = intuition;
        } else if (fieldLine.startsWith("**Related**:")) {
          idea.related = fieldLine.replace("**Related**:", "").trim();
        } else if (fieldLine.startsWith("**Status**:")) {
          // Override from explicit status field
          const statusText = fieldLine.replace("**Status**:", "").trim();
          const statusEmoji = statusText.match(/^[^\w\s]/u)?.[0] || emoji;
          idea.status = statusEmoji;
          idea.statusLabel = STATUS_MAP[statusEmoji] || "unknown";
        }
        i++;
      }

      ideas.push(idea);
      continue;
    }

    i++;
  }

  return ideas;
}

export function parsePrototypes(): PrototypeEntry[] {
  const prototypesDir = path.join(SPEC_DIR, "Prototypes");
  if (!fs.existsSync(prototypesDir)) return [];

  const entries: PrototypeEntry[] = [];
  const items = fs.readdirSync(prototypesDir, { withFileTypes: true });

  for (const item of items) {
    if (!item.isDirectory() || !item.name.match(/^proto-\d+/)) continue;

    const readmePath = path.join(prototypesDir, item.name, "README.md");
    let readmeExcerpt = "";
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, "utf-8");
      const paragraphs = readmeContent.split("\n\n");
      readmeExcerpt =
        paragraphs.find((p) => p.trim() && !p.startsWith("#")) || "";
    }

    const stat = fs.statSync(path.join(prototypesDir, item.name));
    const isArchived = item.name.startsWith("ARCHIVED-");

    entries.push({
      slug: item.name,
      readmeExcerpt: readmeExcerpt.trim(),
      lastModified: stat.mtime,
      status: isArchived ? "archived" : "active",
    });
  }

  return entries;
}

export function parseProgress(): SessionEntry[] {
  const content = readFile("Progress/LATEST.md");
  if (!content) return [];

  const entries: SessionEntry[] = [];
  const sessionBlocks = content.split(/^## Session: /m).slice(1);

  for (const block of sessionBlocks) {
    const lines = block.split("\n");
    const firstLine = lines[0] || "";
    const [date, ...titleParts] = firstLine.split("—").map((s) => s.trim());

    const entry: SessionEntry = {
      date: date || "",
      title: titleParts.join("—") || "",
      reading: "",
      ideas: "",
      prototypes: "",
      directionChanges: "",
    };

    let currentSection = "";
    for (const line of lines.slice(1)) {
      if (line.startsWith("### Reading")) currentSection = "reading";
      else if (line.startsWith("### Ideas")) currentSection = "ideas";
      else if (line.startsWith("### Prototypes")) currentSection = "prototypes";
      else if (line.startsWith("### Direction"))
        currentSection = "directionChanges";
      else if (line.trim() && currentSection) {
        const key = currentSection as keyof typeof entry;
        entry[key] = entry[key] ? entry[key] + "\n" + line : line;
      }
    }

    entries.push(entry);
  }

  return entries;
}

export function parseTodo(): TodoItem[] {
  const content = readFile("Todo.md");
  if (!content) return [];

  const items: TodoItem[] = [];
  const lines = content.split("\n");
  let currentPriority: TodoItem["priority"] = "medium";

  lines.forEach((line, index) => {
    if (line.startsWith("## High")) currentPriority = "high";
    else if (line.startsWith("## Medium")) currentPriority = "medium";
    else if (line.startsWith("## Low")) currentPriority = "low";

    const checkboxMatch = line.match(/^- \[([ x])\] (.+)/);
    if (checkboxMatch) {
      items.push({
        text: checkboxMatch[2],
        checked: checkboxMatch[1] === "x",
        priority: currentPriority,
        lineNumber: index,
      });
    }
  });

  return items;
}

export function parseSpec(): ParsedSpec {
  return {
    literature: { queue: parseReadingQueue() },
    concepts: { ideasLog: parseIdeasLog() },
    prototypes: parsePrototypes(),
    progress: parseProgress(),
    todo: parseTodo(),
  };
}
