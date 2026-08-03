import React from "react";
import { FaCheckCircle, FaTimesCircle, FaGlobe, FaChartLine } from "react-icons/fa";
import DonutChart from "../Charts/DonutChart";
import UptimeLineChart from "../Charts/UptimeLineChart";
import "./Dashboard.css";

function Dashboard({ stats }) {
  const totalWebsites = stats.total || 0;
  const upWebsites = stats.up || 0;
  const downWebsites = stats.down || 0;
  const uptimeRate = totalWebsites > 0 ? ((upWebsites / totalWebsites) * 100).toFixed(1) : 0;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <span className="subtitle">Real-time monitoring overview</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon"><FaGlobe /></div>
          <div className="stat-info">
            <div className="stat-value">{totalWebsites}</div>
            <div className="stat-label">Total Websites</div>
          </div>
        </div>
        <div className="stat-card up">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: 'var(--color-up)' }}>{upWebsites}</div>
            <div className="stat-label">Online</div>
          </div>
        </div>
        <div className="stat-card down">
          <div className="stat-icon"><FaTimesCircle /></div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: 'var(--color-down)' }}>{downWebsites}</div>
            <div className="stat-label">Offline</div>
          </div>
        </div>
        <div className="stat-card uptime">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-info">
            <div className="stat-value">{uptimeRate}%</div>
            <div className="stat-label">Uptime Rate</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="dash-top-row">
        <DonutChart up={upWebsites} down={downWebsites} total={totalWebsites} />
        <UptimeLineChart uptimeRate={uptimeRate} />
      </div>
    </div>
  );
}

export default Dashboard;