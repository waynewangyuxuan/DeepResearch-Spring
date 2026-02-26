"use client";

import { useState, useEffect, useCallback } from "react";
import type { ParsedSpec, QueueItem, Idea, SessionEntry, TodoItem } from "@/lib/types";
import StatusBar from "./StatusBar";
import Navigation from "./Navigation";
import LiteratureView from "./LiteratureView";
import IdeasView from "./IdeasView";
import PrototypesView from "./PrototypesView";
import ProgressView from "./ProgressView";
import TodoView from "./TodoView";

export interface SerializedSpec {
  literature: { queue: QueueItem[] };
  concepts: { ideasLog: Idea[] };
  prototypes: Array<{
    slug: string;
    readmeExcerpt: string;
    lastModified: string;
    status: "active" | "archived";
    relatedConcept?: string;
  }>;
  progress: SessionEntry[];
  todo: TodoItem[];
}

interface DashboardClientProps {
  spec: SerializedSpec;
}

const VIEW_TITLES: Record<string, string> = {
  literature: "Literature",
  ideas: "Ideas",
  prototypes: "Prototypes",
  progress: "Progress",
  todo: "Todo",
};

export default function DashboardClient({ spec: initialSpec }: DashboardClientProps) {
  const [activeView, setActiveView] = useState("literature");
  const [spec, setSpec] = useState(initialSpec);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const prototypes = spec.prototypes.map((p) => ({
    ...p,
    lastModified: new Date(p.lastModified),
  }));
  const fullSpec: ParsedSpec = { ...spec, prototypes };

  const refreshSpec = useCallback(async () => {
    try {
      const res = await fetch("/api/spec");
      if (res.ok) {
        const data = await res.json();
        setSpec(data);
        setLastUpdate(new Date());
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/watch");
    es.onmessage = () => refreshSpec();
    return () => es.close();
  }, [refreshSpec]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 h-11 border-b border-border flex-shrink-0 bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight text-fg">
            Research Dashboard
          </h1>
          <span className="hidden sm:inline text-[10px] font-mono text-fg-tertiary tracking-wide">
            DeepResearch-Spring
          </span>
        </div>
        {lastUpdate && (
          <span className="text-[10px] text-fg-tertiary flex items-center gap-1.5 font-mono">
            <span className="w-1 h-1 rounded-full bg-status-done" />
            synced {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </header>

      {/* Metrics strip */}
      <StatusBar spec={fullSpec} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Navigation activeView={activeView} onViewChange={setActiveView} />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-8 py-8">
            {/* View title */}
            <h2 className="text-2xl font-semibold tracking-tighter mb-6">
              {VIEW_TITLES[activeView]}
            </h2>

            <div key={activeView} className="animate-fade-in">
              {activeView === "literature" && (
                <LiteratureView queue={fullSpec.literature.queue} />
              )}
              {activeView === "ideas" && (
                <IdeasView ideas={fullSpec.concepts.ideasLog} />
              )}
              {activeView === "prototypes" && (
                <PrototypesView prototypes={fullSpec.prototypes} />
              )}
              {activeView === "progress" && (
                <ProgressView sessions={fullSpec.progress} />
              )}
              {activeView === "todo" && (
                <TodoView items={fullSpec.todo} onRefresh={refreshSpec} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
