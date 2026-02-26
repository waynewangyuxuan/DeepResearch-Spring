"use client";

interface HeatCalendarProps {
  entries: { date: string; count: number }[];
  weeks?: number;
  onDateClick?: (date: string) => void;
}

export default function HeatCalendar({
  entries,
  weeks = 16,
  onDateClick,
}: HeatCalendarProps) {
  const dateMap = new Map(entries.map((e) => [e.date, e.count]));

  const today = new Date();
  const cells: { date: string; count: number }[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    cells.push({ date: dateStr, count: dateMap.get(dateStr) || 0 });
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-bg-muted";
    if (count === 1) return "bg-accent-muted";
    return "bg-accent";
  };

  return (
    <div
      className="grid gap-[3px]"
      style={{
        gridTemplateColumns: `repeat(${weeks}, 1fr)`,
        gridTemplateRows: "repeat(7, 1fr)",
        gridAutoFlow: "column",
      }}
    >
      {cells.map((cell) => (
        <button
          key={cell.date}
          className={`w-3 h-3 rounded-[3px] ${getColor(
            cell.count
          )} transition-all duration-150 hover:ring-1 hover:ring-accent hover:ring-offset-1 hover:ring-offset-surface`}
          title={`${cell.date}: ${cell.count} session(s)`}
          onClick={() => onDateClick?.(cell.date)}
        />
      ))}
    </div>
  );
}
