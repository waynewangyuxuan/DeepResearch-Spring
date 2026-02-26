export interface QueueItem {
  paper: string;
  track: string;
  keywords: string;
  priority: string;
  reason: string;
  status: "toread" | "reading" | "read";
  startedDate?: string;
  notesLocation?: string;
  coreTakeaway?: string;
  notesLink?: string;
}

export interface Idea {
  title: string;
  date: string;
  trigger: string;
  intuition: string;
  related: string;
  status: string;
  statusLabel: string;
}

export interface PrototypeEntry {
  slug: string;
  readmeExcerpt: string;
  lastModified: Date;
  status: "active" | "archived";
  relatedConcept?: string;
}

export interface SessionEntry {
  date: string;
  title: string;
  reading: string;
  ideas: string;
  prototypes: string;
  directionChanges: string;
}

export interface TodoItem {
  text: string;
  checked: boolean;
  priority: "high" | "medium" | "low";
  lineNumber: number;
}

export interface ParsedSpec {
  literature: { queue: QueueItem[] };
  concepts: { ideasLog: Idea[] };
  prototypes: PrototypeEntry[];
  progress: SessionEntry[];
  todo: TodoItem[];
}
