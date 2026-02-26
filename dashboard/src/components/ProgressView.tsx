"use client";

import { useState } from "react";
import { SessionEntry } from "@/lib/types";
import HeatCalendar from "./micro/HeatCalendar";

interface ProgressViewProps {
  sessions: SessionEntry[];
}

const DIMENSION_ICONS: Record<string, string> = {
  reading: "📚",
  ideas: "💡",
  prototypes: "🧪",
  directionChanges: "🧭",
};

export default function ProgressView({ sessions }: ProgressViewProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const calendarEntries = sessions.map((s) => ({
    date: s.date,
    count: 1,
  }));

  return (
    <div className="space-y-8">
      {/* Heat Calendar */}
      <div className="card">
        <div className="section-label mb-4">Activity</div>
        <HeatCalendar
          entries={calendarEntries}
          weeks={16}
          onDateClick={(date) =>
            setExpandedDate(expandedDate === date ? null : date)
          }
        />
      </div>

      {/* Session List */}
      <div>
        <div className="section-label mb-3">Sessions</div>
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xs text-fg-tertiary">
              No sessions recorded yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session, i) => {
              const isExpanded = expandedDate === session.date;
              return (
                <button
                  key={i}
                  onClick={() =>
                    setExpandedDate(isExpanded ? null : session.date)
                  }
                  className={`w-full text-left card-interactive ${
                    i === 0 ? "border-accent/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-fg tabular-nums">
                      {session.date}
                    </span>
                    {session.title && (
                      <span className="text-xs text-fg-secondary truncate">
                        {session.title}
                      </span>
                    )}
                    <div className="flex-1" />
                    {i === 0 && (
                      <span className="chip bg-accent-subtle text-accent">
                        latest
                      </span>
                    )}
                    <svg
                      className={`w-3.5 h-3.5 text-fg-tertiary transition-transform duration-200 ${
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
                    <div className="mt-3 pt-3 border-t border-border space-y-3 animate-slide-down">
                      {session.reading && (
                        <div className="flex gap-2">
                          <span className="text-sm flex-shrink-0">
                            {DIMENSION_ICONS.reading}
                          </span>
                          <div>
                            <div className="text-[10px] font-mono text-fg-tertiary tracking-wide uppercase mb-0.5">
                              Reading
                            </div>
                            <div className="text-xs text-fg-secondary whitespace-pre-line leading-relaxed">
                              {session.reading}
                            </div>
                          </div>
                        </div>
                      )}
                      {session.ideas && (
                        <div className="flex gap-2">
                          <span className="text-sm flex-shrink-0">
                            {DIMENSION_ICONS.ideas}
                          </span>
                          <div>
                            <div className="text-[10px] font-mono text-fg-tertiary tracking-wide uppercase mb-0.5">
                              Ideas
                            </div>
                            <div className="text-xs text-fg-secondary whitespace-pre-line leading-relaxed">
                              {session.ideas}
                            </div>
                          </div>
                        </div>
                      )}
                      {session.prototypes && (
                        <div className="flex gap-2">
                          <span className="text-sm flex-shrink-0">
                            {DIMENSION_ICONS.prototypes}
                          </span>
                          <div>
                            <div className="text-[10px] font-mono text-fg-tertiary tracking-wide uppercase mb-0.5">
                              Prototypes
                            </div>
                            <div className="text-xs text-fg-secondary whitespace-pre-line leading-relaxed">
                              {session.prototypes}
                            </div>
                          </div>
                        </div>
                      )}
                      {session.directionChanges && (
                        <div className="flex gap-2">
                          <span className="text-sm flex-shrink-0">
                            {DIMENSION_ICONS.directionChanges}
                          </span>
                          <div>
                            <div className="text-[10px] font-mono text-fg-tertiary tracking-wide uppercase mb-0.5">
                              Direction Changes
                            </div>
                            <div className="text-xs text-fg-secondary whitespace-pre-line leading-relaxed">
                              {session.directionChanges}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
