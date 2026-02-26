"use client";

const STATUS_COLORS: Record<string, string> = {
  toread: "bg-status-idle",
  reading: "bg-status-active",
  read: "bg-status-done",
  sprouting: "bg-status-idle",
  exploring: "bg-status-active",
  designing: "bg-status-warn",
  prototyping: "bg-status-active",
  validated: "bg-status-done",
  abandoned: "bg-status-idle",
  active: "bg-status-active",
  archived: "bg-status-idle",
  high: "bg-status-critical",
  medium: "bg-status-warn",
  low: "bg-status-idle",
};

export default function StatusDot({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status] || "bg-status-idle";
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${colorClass} flex-shrink-0`}
    />
  );
}
