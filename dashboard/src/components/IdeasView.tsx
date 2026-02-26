"use client";

import { useState } from "react";
import { Idea } from "@/lib/types";

interface IdeasViewProps {
  ideas: Idea[];
}

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "💡", label: "Sprouting" },
  { key: "🔍", label: "Exploring" },
  { key: "📐", label: "Designing" },
  { key: "🧪", label: "Prototyping" },
  { key: "✅", label: "Validated" },
];

const STATUS_LABELS: Record<string, string> = {
  "💡": "Sprouting",
  "🔍": "Exploring",
  "📐": "Designing",
  "🧪": "Prototyping",
  "✅": "Validated",
};

export default function IdeasView({ ideas }: IdeasViewProps) {
  const [filter, setFilter] = useState("all");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered =
    filter === "all" ? ideas : ideas.filter((i) => i.status === filter);

  const designingOrBeyond = ideas.filter((i) =>
    ["📐", "🧪", "✅"].includes(i.status)
  ).length;
  const maturityPct =
    ideas.length > 0
      ? Math.round((designingOrBeyond / ideas.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg bg-bg-subtle p-0.5 gap-0.5">
          {STATUS_FILTERS.map((sf) => (
            <button
              key={sf.key}
              onClick={() => setFilter(sf.key)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all duration-200 ${
                filter === sf.key
                  ? "bg-surface text-fg font-medium shadow-sm"
                  : "text-fg-secondary hover:text-fg"
              }`}
            >
              {sf.key !== "all" && (
                <span className="mr-1">{sf.key}</span>
              )}
              {sf.label}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-mono text-fg-tertiary tracking-wide">
          {maturityPct}% mature
        </div>
      </div>

      {/* Ideas list */}
      <div className="space-y-2">
        {filtered.map((idea, i) => {
          const isExpanded = expandedIdx === i;
          return (
            <button
              key={i}
              onClick={() => setExpandedIdx(isExpanded ? null : i)}
              className="w-full text-left card-interactive group"
            >
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5 flex-shrink-0">
                  {idea.status}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg">
                      {idea.title}
                    </span>
                    <span className="chip">
                      {STATUS_LABELS[idea.status] || idea.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-mono text-fg-tertiary">
                      {idea.date}
                    </span>
                    {idea.trigger && (
                      <span className="text-[11px] text-fg-secondary">
                        via {idea.trigger}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-fg-tertiary transition-transform duration-200 mt-1 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-2 animate-slide-down">
                  {idea.intuition && (
                    <p className="text-xs text-fg-secondary leading-relaxed">
                      {idea.intuition}
                    </p>
                  )}
                  {idea.related && (
                    <div className="text-xs">
                      <span className="text-fg-tertiary">Related → </span>
                      <span className="text-accent font-mono text-[11px]">
                        {idea.related}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xs text-fg-tertiary">
            No ideas match the current filter.
          </p>
        </div>
      )}
    </div>
  );
}
