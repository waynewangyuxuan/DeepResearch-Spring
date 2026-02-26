"use client";

import { PrototypeEntry } from "@/lib/types";

interface PrototypesViewProps {
  prototypes: PrototypeEntry[];
}

export default function PrototypesView({ prototypes }: PrototypesViewProps) {
  if (prototypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 rounded-full bg-bg-subtle flex items-center justify-center mb-4">
          <span className="text-lg">🧪</span>
        </div>
        <p className="text-sm text-fg-secondary">No prototypes yet.</p>
        <p className="text-[11px] text-fg-tertiary mt-1">
          First prototype expected after literature reading round.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {prototypes.map((proto) => (
        <div key={proto.slug} className="card group">
          <div className="flex items-start gap-3">
            {/* Status indicator */}
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                proto.status === "active"
                  ? "bg-status-active"
                  : "bg-status-idle"
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm font-mono text-fg">
                  {proto.slug}
                </span>
                <span
                  className={`chip ${
                    proto.status === "active"
                      ? "bg-accent-subtle text-accent"
                      : ""
                  }`}
                >
                  {proto.status}
                </span>
              </div>

              {proto.readmeExcerpt && (
                <p className="text-xs text-fg-secondary mt-1.5 leading-relaxed line-clamp-2">
                  {proto.readmeExcerpt}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] font-mono text-fg-tertiary tracking-wide">
                  {proto.lastModified.toLocaleDateString()}
                </span>
                {proto.relatedConcept && (
                  <span className="text-[10px]">
                    <span className="text-fg-tertiary">→ </span>
                    <span className="text-accent font-mono">
                      {proto.relatedConcept}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
