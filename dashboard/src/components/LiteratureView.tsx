"use client";

import { useState } from "react";
import { QueueItem } from "@/lib/types";

interface LiteratureViewProps {
  queue: QueueItem[];
}

const PRIORITY_DOT: Record<string, string> = {
  P0: "bg-status-critical",
  P1: "bg-status-warn",
  P2: "bg-fg-tertiary",
};

const STATUS_COLOR: Record<string, string> = {
  toread: "#D6D3D1",
  reading: "#2563EB",
  read: "#059669",
};

const STATUS_LABEL: Record<string, string> = {
  toread: "To Read",
  reading: "Reading",
  read: "Completed",
};

function PaperRow({ item, isExpanded, onToggle }: {
  item: QueueItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left group"
    >
      <div className="relative card-interactive px-4 py-3 overflow-hidden">
        {/* Status band */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
          style={{ backgroundColor: STATUS_COLOR[item.status] }}
        />

        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">{item.paper}</span>
              {item.priority && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[item.priority] || ""}`} />
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-fg-tertiary tracking-wide">
                {item.track}
              </span>
              {item.priority && (
                <span className="text-[10px] font-mono text-fg-tertiary">
                  {item.priority}
                </span>
              )}
            </div>

            {item.coreTakeaway && (
              <p className="text-xs text-status-done font-medium mt-2 leading-relaxed">
                {item.coreTakeaway}
              </p>
            )}

            {/* Expanded content */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-border animate-slide-down">
                {item.keywords && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.keywords.split(",").map((kw, i) => (
                      <span
                        key={i}
                        className="chip bg-bg-subtle text-fg-secondary"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {item.reason && (
                  <p className="text-xs text-fg-secondary leading-relaxed">{item.reason}</p>
                )}
              </div>
            )}
          </div>

          {/* Expand indicator */}
          <svg
            className={`w-4 h-4 text-fg-tertiary flex-shrink-0 mt-0.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function LiteratureView({ queue }: LiteratureViewProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const grouped = {
    toread: queue.filter((q) => q.status === "toread"),
    reading: queue.filter((q) => q.status === "reading"),
    read: queue.filter((q) => q.status === "read"),
  };

  let globalIdx = 0;

  return (
    <div className="space-y-8">
      {(["reading", "toread", "read"] as const).map((status) => {
        if (grouped[status].length === 0 && status !== "reading") return null;
        const startIdx = globalIdx;

        return (
          <section key={status}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[status] }}
              />
              <h3 className="section-label">{STATUS_LABEL[status]}</h3>
              <span className="text-[10px] font-mono text-fg-tertiary">
                {grouped[status].length}
              </span>
            </div>

            {grouped[status].length === 0 ? (
              <p className="text-xs text-fg-tertiary pl-4">
                No papers currently being read.
              </p>
            ) : (
              <div className="space-y-2">
                {grouped[status].map((item, i) => {
                  const idx = startIdx + i;
                  globalIdx = idx + 1;
                  return (
                    <PaperRow
                      key={idx}
                      item={item}
                      isExpanded={expanded === idx}
                      onToggle={() => setExpanded(expanded === idx ? null : idx)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
