import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaGlobe, FaCheckCircle, FaTimesCircle, FaSync, 
  FaPlus, FaTrash, FaExclamationTriangle, FaEdit
} from "react-icons/fa";
import { WiTime4 } from "react-icons/wi";
import moment from "moment";
import "./WebsitesList.css";

function WebsitesList({ 
  websites, 
  loading, 
  onCheckWebsite, 
  onDeleteWebsite, 
  onEditWebsite,
  stats, 
  refreshing, 
  onRefresh, 
  onCheckAll 
}) {
  const formatRelativeTime = (dateString) =>
    dateString ? moment(dateString).fromNow() : "Never";

  const getStatusConfig = (status) => {
    switch (status) {
      case "UP": return { icon: <FaCheckCircle />, text: "UP" };
      case "DOWN": return { icon: <FaTimesCircle />, text: "DOWN" };
      default: return { icon: <FaSync className="spinning" />, text: "CHECKING" };
    }
  };

  const handleEditClick = (website) => {
    const id = website.id || website._id;
    
    Swal.fire({
      title: 'Edit Website',
      html: `
        <div style="text-align: left;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">URL</label>
          <input id="swal-url" class="swal2-input" type="text" value="${website.url}" placeholder="https://example.com" />
          <label style="display: block; margin-top: 10px; margin-bottom: 5px; font-weight: 600;">Name</label>
          <input id="swal-name" class="swal2-input" type="text" value="${website.name || ''}" placeholder="Website Name" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const url = document.getElementById('swal-url').value.trim();
        const name = document.getElementById('swal-name').value.trim();
        
        if (!url) {
          Swal.showValidationMessage('URL is required');
          return false;
        }
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          Swal.showValidationMessage('URL must start with http:// or https://');
          return false;
        }
        
        return { url, name: name || url };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        onEditWebsite(id, result.value);
      }
    });
  };

  // ✅ UP aur DOWN websites ko filter karna
  const downWebsites = websites.filter(w => w.status === "DOWN");
  const upWebsites = websites.filter(w => w.status === "UP");
  const checkingWebsites = websites.filter(w => w.status !== "UP" && w.status !== "DOWN");

  // Website card render karne ka function (duplicate code se bachne ke liye)
  const renderWebsiteCard = (website) => {
    const config = getStatusConfig(website.status);
    const id = website.id || website._id;
    return (
      <div key={id} className={`website-card ${website.status?.toLowerCase() || "checking"}`}>
        <div className="card-header">
          <div>
            <h3 className="website-name">{website.name || "Unnamed"}</h3>
            <a href={website.url} target="_blank" rel="noreferrer" className="website-url">
              <FaGlobe /> {website.url}
            </a>
          </div>
          <div className="status-badge">
            {config.icon} <span>{config.text}</span>
          </div>
        </div>

        <div className="card-body">
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-label"><WiTime4 /> Response Time</div>
              <div className={`metric-value ${website.responseTime < 300 ? "time-fast" : "time-slow"}`}>
                {website.responseTime ? `${website.responseTime}ms` : "—"}
              </div>
            </div>
            <div className="metric">
              <div className="metric-label"><WiTime4 /> Last Checked</div>
              <div className="metric-value" style={{ fontSize: "0.85rem" }}>
                {formatRelativeTime(website.lastChecked)}
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button
            onClick={() => onCheckWebsite(id)}
            className="btn-action"
            title="Check now"
          >
            <FaSync /> Check
          </button>
          <button
            onClick={() => handleEditClick(website)}
            className="btn-action btn-edit"
            title="Edit"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDeleteWebsite(id, website.name || website.url)}
            className="btn-action btn-delete"
            title="Delete"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    );
  };

  // ✅ Section render karne ka function
  const renderSection = (title, websites, icon, emptyMessage) => {
    if (websites.length === 0) return null;
    return (
      <div className="status-section">
        <div className="section-header">
          <h3>{icon} {title} ({websites.length})</h3>
        </div>
        <div className="websites-grid">
          {websites.map(renderWebsiteCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="websites-section">
        <div className="section-header">
          <h1>Monitored Websites ({stats.total})</h1>
          <div className="header-actions">
            {stats.down > 0 && (
              <div className="down-alert">
                <FaExclamationTriangle /> {stats.down} Down
              </div>
            )}
            <div className="action-buttons">
              <button onClick={onRefresh} className="btn btn-refresh" disabled={refreshing}>
                <FaSync className={refreshing ? "spinning" : ""} /> Refresh
              </button>
              <button onClick={onCheckAll} className="btn btn-check-all" disabled={refreshing}>
                <FaSync /> Check All
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <FaSync className="spinning" style={{ fontSize: "2rem", marginBottom: "1rem" }} />
            <p>Loading websites...</p>
          </div>
        ) : websites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FaGlobe /></div>
            <h3>No websites added yet</h3>
            <p>Add your first website to start monitoring.</p>
            <Link to="/add" className="btn btn-check-all" style={{ textDecoration: "none" }}>
              <FaPlus /> Add Website
            </Link>
          </div>
        ) : (
          <>
            {/* 🔴 DOWN Websites Section - Pehle dikhegi */}
            {renderSection(
              "Websites Down", 
              downWebsites, 
              <FaTimesCircle style={{ color: "#ef4444" }} />,
              "No websites are down"
            )}

            {/* 🟢 UP Websites Section - Baad mein dikhegi */}
            {renderSection(
              "Websites Up", 
              upWebsites, 
              <FaCheckCircle style={{ color: "#22c55e" }} />,
              "No websites are up"
            )}

            {/* ⏳ Checking Websites Section - Agar koi checking mein ho */}
            {checkingWebsites.length > 0 && renderSection(
              "Checking Websites", 
              checkingWebsites, 
              <FaSync className="spinning" style={{ color: "#f59e0b" }} />,
              "No websites are checking"
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default WebsitesList;