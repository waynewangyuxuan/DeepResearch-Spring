"use client";

import { useState } from "react";
import { TodoItem } from "@/lib/types";

interface TodoViewProps {
  items: TodoItem[];
  onRefresh?: () => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-status-critical",
  medium: "text-status-warn",
  low: "text-fg-tertiary",
};

export default function TodoView({
  items: initialItems,
  onRefresh,
}: TodoViewProps) {
  const [items, setItems] = useState(initialItems);

  const completedCount = items.filter((t) => t.checked).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = async (index: number) => {
    const item = items[index];
    const newChecked = !item.checked;

    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, checked: newChecked } : it))
    );

    try {
      await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineNumber: item.lineNumber,
          checked: newChecked,
        }),
      });
      onRefresh?.();
    } catch {
      setItems((prev) =>
        prev.map((it, i) =>
          i === index ? { ...it, checked: !newChecked } : it
        )
      );
    }
  };

  const grouped = {
    high: items.filter((t) => t.priority === "high"),
    medium: items.filter((t) => t.priority === "medium"),
    low: items.filter((t) => t.priority === "low"),
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-fg-tertiary tracking-wide uppercase">
            Completion
          </span>
          <span className="text-xs font-mono text-fg-secondary tabular-nums">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="h-1 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-status-done rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Priority groups */}
      {(["high", "medium", "low"] as const).map((priority) => {
        if (grouped[priority].length === 0) return null;
        return (
          <div key={priority}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`section-label ${PRIORITY_COLORS[priority]}`}
              >
                {PRIORITY_LABELS[priority]}
              </span>
              <span className="text-[10px] font-mono text-fg-tertiary tabular-nums">
                {grouped[priority].filter((t) => t.checked).length}/
                {grouped[priority].length}
              </span>
            </div>
            <div className="space-y-0.5">
              {grouped[priority].map((item) => {
                const globalIndex = items.indexOf(item);
                return (
                  <button
                    key={item.lineNumber}
                    onClick={() => handleToggle(globalIndex)}
                    className="w-full flex items-start gap-3 py-2 px-3 rounded-lg text-left transition-colors duration-150 hover:bg-bg-subtle group"
                  >
                    {/* Custom checkbox */}
                    <div className="mt-0.5 flex-shrink-0">
                      <div
                        className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all duration-200 ${
                          item.checked
                            ? "bg-status-done border-status-done"
                            : "border-border-strong group-hover:border-fg-tertiary"
                        }`}
                      >
                        {item.checked && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm leading-relaxed transition-all duration-200 ${
                        item.checked
                          ? "line-through text-fg-tertiary"
                          : "text-fg"
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
