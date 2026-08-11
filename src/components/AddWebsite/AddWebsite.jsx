import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlusCircle, FaPlus, FaSync, FaGlobe, FaTag } from "react-icons/fa";
import "./AddWebsite.css";

function AddWebsite({ onAddWebsite, loading }) {
  const [newWebsite, setNewWebsite] = useState({ url: "", name: "" });
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newWebsite.url.startsWith("http://") && !newWebsite.url.startsWith("https://")) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid URL',
        text: 'URL must start with http:// or https://',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }

    setAdding(true);
    try {
      const success = await onAddWebsite(newWebsite);
      if (success) {
        setNewWebsite({ url: "", name: "" });
        navigate("/websites");
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Check your backend connection.',
        confirmButtonColor: '#4f46e5',
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="page-container">
      <div className="add-website-wrapper">
        <div className="add-website-header">
          <h1>Add New Website</h1>
          <p>Monitor your website's performance and uptime</p>
        </div>

        <div className="add-website-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="url">
                Website URL <span className="required">*</span>
              </label>
              <div className="input-icon-wrapper">
                <FaGlobe className="icon" />
                <input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  required
                  disabled={adding}
                />
              </div>
              <span className="form-hint">Must include https:// or http://</span>
            </div>

            <div className="form-group">
              <label htmlFor="name">
                Website Name <span className="optional">(Optional)</span>
              </label>
              <div className="input-icon-wrapper">
                <FaTag className="icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="My Website"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  disabled={adding}
                />
              </div>
              <span className="form-hint">Give your website a friendly name</span>
            </div>

            <button type="submit" className="btn-primary" disabled={adding}>
              {adding ? (
                <>
                  <FaSync className="spinning" /> Adding...
                </>
              ) : (
                <>
                  <FaPlus /> Add Website
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWebsite;