interface WaterfallBar {
  label: string;
  start: number;
  duration: number;
  color: string;
}

interface WaterfallChartProps {
  bars: WaterfallBar[];
  totalTime: number;
}

export default function WaterfallChart({ bars, totalTime }: WaterfallChartProps) {
  if (bars.length === 0) {
    return (
      <div className="waterfall-chart-container">
        <div style={{ color: "var(--text-muted)", fontStyle: "italic", padding: "2rem", textAlign: "center" }}>
          Click load to see the waterfall
        </div>
      </div>
    );
  }

  const maxTime = Math.max(totalTime, ...bars.map(b => b.start + b.duration));
  // Gridlines at 500ms intervals
  const gridlines = Array.from({ length: Math.ceil(maxTime / 500) }, (_, i) => (i + 1) * 500);

  return (
    <div className="waterfall-chart-container">
      {/* Gridlines */}
      {gridlines.map(ms => (
        <div
          key={ms}
          style={{
            position: "absolute",
            left: `${(ms / maxTime) * 100}%`,
            top: 0,
            bottom: "2rem",
            borderLeft: "1px dashed var(--border)",
            zIndex: 0,
          }}
        />
      ))}

      {/* Bars */}
      {bars.map((bar, i) => (
        <div
          key={i}
          className="waterfall-bar"
          style={{
            top: `${i * 36 + 8}px`,
            left: `${(bar.start / maxTime) * 100}%`,
            width: `${Math.max((bar.duration / maxTime) * 100, 2)}%`,
            backgroundColor: bar.color,
          }}
        >
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {bar.label} — {bar.duration}ms
          </span>
        </div>
      ))}

      {/* Axis */}
      <div className="waterfall-axis" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        {gridlines.map(ms => (
          <span key={ms} style={{ position: "absolute", left: `${(ms / maxTime) * 100}%`, transform: "translateX(-50%)" }}>
            {ms}ms
          </span>
        ))}
      </div>

      {/* Total time marker */}
      <div style={{
        position: "absolute",
        right: 8,
        top: 8,
        background: "var(--accent)",
        color: "white",
        padding: "0.2rem 0.6rem",
        borderRadius: 4,
        fontFamily: "var(--font-mono)",
        fontSize: "0.8rem",
      }}>
        Total: {totalTime}ms
      </div>
    </div>
  );
}
