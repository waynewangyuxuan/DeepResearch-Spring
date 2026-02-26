"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  width = 60,
  height = 20,
}: SparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="inline-block align-middle"
    >
      <polyline
        points={points}
        fill="none"
        className="stroke-accent"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
