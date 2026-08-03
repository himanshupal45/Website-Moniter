import React, { useRef, useEffect } from "react";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";
import "./DonutChart.css";  // ✅ Correct - just import the CSS

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function DonutChart({ up, down, total }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["UP", "DOWN"],
        datasets: [{
          data: total > 0 ? [up, down] : [1, 0],
          backgroundColor: total > 0 ? ["#10b981", "#dc2626"] : ["#94a3b8", "#2d3748"],
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
              },
            },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [up, down, total]);

  const upPct = total > 0 ? ((up / total) * 100).toFixed(1) : 0;
  const downPct = total > 0 ? ((down / total) * 100).toFixed(1) : 0;

  return (
    <div className="dash-card">
      <div className="dash-card-title">Overall Status</div>
      <div className="donut-canvas-wrap">
        <canvas ref={canvasRef} role="img" aria-label={`${up} UP, ${down} DOWN`}>
          {up} UP, {down} DOWN
        </canvas>
      </div>
      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#10b981" }} />
          <span style={{ color: "#10b981", fontWeight: 600, fontSize: "0.82rem" }}>
            UP ({up} websites, {upPct}%)
          </span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#dc2626" }} />
          <span style={{ color: "#dc2626", fontWeight: 600, fontSize: "0.82rem" }}>
            DOWN ({down} websites, {downPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default DonutChart;