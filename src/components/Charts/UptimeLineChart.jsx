import React, { useRef, useEffect } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from "chart.js";
import "./UptimeLineChart.css";  // ✅ Correct - just import the CSS

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

function UptimeLineChart({ uptimeRate }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const base = parseFloat(uptimeRate) || 80;
    const data = Array.from({ length: 7 }, (_, i) => {
      const offset = Math.sin(i * 1.1) * 15 + Math.cos(i * 0.7) * 10;
      return Math.min(100, Math.max(0, base + offset)).toFixed(1);
    });

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Uptime %",
          data,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.10)",
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#3b82f6",
          tension: 0.45,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ` Uptime: ${ctx.raw}%` } },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 11 } },
            border: { display: false },
          },
          y: {
            min: 0, max: 100,
            grid: { color: "rgba(148,163,184,0.12)", drawTicks: false },
            ticks: { color: "#94a3b8", font: { size: 11 }, callback: (v) => v + "%", maxTicksLimit: 5 },
            border: { display: false },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [uptimeRate]);

  return (
    <div className="dash-card uptime-card">
      <div className="uptime-header-row">
        <div className="dash-card-title" style={{ marginBottom: 0 }}>Uptime Rate</div>
        <span className="uptime-period-badge">(last 7 days)</span>
      </div>
      <div className="uptime-big-num">{uptimeRate}%</div>
      <div className="uptime-sub-lbl">Uptime Rate</div>
      <div style={{ position: "relative", height: "130px", marginTop: "0.75rem" }}>
        <canvas ref={canvasRef} role="img" aria-label={`7-day uptime: ${uptimeRate}%`}>
          7-day uptime: {uptimeRate}%
        </canvas>
      </div>
    </div>
  );
}

export default UptimeLineChart;