"use client";

import { ParsedSpec } from "@/lib/types";

interface StatusBarProps {
  spec: ParsedSpec;
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg font-semibold tracking-tighter tabular-nums">{value}</span>
      <span className="text-[10px] font-medium text-fg-tertiary uppercase tracking-[0.06em]">
        {label}
      </span>
    </div>
  );
}

function MiniBar({ segments }: { segments: { count: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0);
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-2 ml-1">
      <div className="flex h-1 w-16 rounded-full overflow-hidden bg-bg-muted">
        {segments.map((seg, i) =>
          seg.count > 0 ? (
            <div
              key={i}
              className="h-full transition-all duration-500"
              style={{
                width: `${(seg.count / total) * 100}%`,
                backgroundColor: seg.color,
              }}
            />
          ) : null
        )}
      </div>
      <div className="flex items-center gap-2">
        {segments.map(
          (seg, i) =>
            seg.count > 0 && (
              <span key={i} className="flex items-center gap-1 text-[10px] text-fg-tertiary">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                {seg.count}
              </span>
            )
        )}
      </div>
    </div>
  );
}

export default function StatusBar({ spec }: StatusBarProps) {
  const { queue } = spec.literature;
  const toRead = queue.filter((q) => q.status === "toread").length;
  const reading = queue.filter((q) => q.status === "reading").length;
  const read = queue.filter((q) => q.status === "read").length;
  const todosRemaining = spec.todo.filter((t) => !t.checked).length;

  return (
    <div className="flex items-center gap-8 px-6 h-10 border-b border-border flex-shrink-0 bg-bg">
      <div className="flex items-center gap-1">
        <Metric value={queue.length} label="papers" />
        <MiniBar
          segments={[
            { count: toRead, color: "#D6D3D1", label: "to read" },
            { count: reading, color: "#2563EB", label: "reading" },
            { count: read, color: "#059669", label: "read" },
          ]}
        />
      </div>

      <Metric value={spec.concepts.ideasLog.length} label="ideas" />
      <Metric value={spec.prototypes.length} label="prototypes" />
      <Metric value={spec.progress.length} label="sessions" />
      <Metric value={todosRemaining} label="open todos" />
    </div>
  );
}
