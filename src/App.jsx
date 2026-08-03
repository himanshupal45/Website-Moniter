import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// Import Components
import Dashboard from "./components/Dashboard/Dashboard";
import WebsitesList from "./components/WebsitesList/WebsitesList";
import AddWebsite from "./components/AddWebsite/AddWebsite";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer"; // ✅ New Footer Component
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import { ProtectedRoute, useAuth, logout } from "./components/Auth/ProtectedRoute";

// Import Styles
import "./App.css";
import "./components/Dashboard/Dashboard.css";
import "./components/WebsitesList/WebsitesList.css";
import "./components/AddWebsite/AddWebsite.css";
import "./components/Navbar/Navbar.css";
import "./components/Footer/Footer.css"; // ✅ Footer CSS

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, up: 0, down: 0, checking: 0 });
  const [backendStatus, setBackendStatus] = useState("checking");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

  // Fetch websites
  const fetchWebsites = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      const res = await axios.get(`${API_URL}/websites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        const d = res.data.data;
        setWebsites(d);
        setStats({
          total: d.length,
          up: d.filter((w) => w.status === "UP").length,
          down: d.filter((w) => w.status === "DOWN").length,
          checking: d.filter((w) => w.status === "CHECKING").length,
        });
        setBackendStatus("connected");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      if (e.response?.status === 401) {
        logout(navigate);
      }
      setBackendStatus("disconnected");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // All handlers (add, edit, delete, check, checkAll)
  const handleAddWebsite = async (websiteData) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      const res = await axios.post(`${API_URL}/websites`, {
        url: websiteData.url.trim(),
        name: websiteData.name.trim() || websiteData.url.trim(),
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Added! ✅',
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchWebsites();
        return true;
      }
      return false;
    } catch (e) {
      const msg = e.response?.data?.message || "Server error while adding website.";
      Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#dc2626' });
      return false;
    }
  };

  const handleEditWebsite = async (id, data) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      const res = await axios.put(`${API_URL}/websites/${id}`, {
        url: data.url,
        name: data.name,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data.success) {
        Swal.fire({ icon: 'success', title: 'Updated! ✅', timer: 1500, showConfirmButton: false });
        fetchWebsites();
      }
    } catch (e) {
      const msg = e.response?.data?.error || "Server error while updating website.";
      Swal.fire({ icon: 'error', title: 'Error', text: msg, confirmButtonColor: '#dc2626' });
    }
  };

  const handleCheckWebsite = async (id) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      await axios.post(`${API_URL}/websites/${id}/check`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchWebsites();
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Check Failed', text: 'Could not check the website.', confirmButtonColor: '#dc2626' });
    }
  };

  const handleDeleteWebsite = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Website?',
      html: `Are you sure you want to delete <strong>"${name}"</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

        const res = await axios.delete(`${API_URL}/websites/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success) {
          await Swal.fire({ icon: 'success', title: 'Deleted! 🗑️', timer: 1500, showConfirmButton: false });
          await fetchWebsites();
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Server Error', text: 'Could not delete website.', confirmButtonColor: '#dc2626' });
      }
    }
  };

  const handleCheckAll = async () => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      await axios.post(`${API_URL}/websites/check/all`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchWebsites();
      Swal.fire({ icon: 'success', title: 'All Checked! ✅', timer: 1500, showConfirmButton: false });
    } catch (e) {
      for (const site of websites) {
        try {
          const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
          await axios.post(`${API_URL}/websites/${site.id || site._id}/check`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch { }
      }
      await fetchWebsites();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWebsites();
      const cycle = setInterval(fetchWebsites, 30000);
      return () => clearInterval(cycle);
    }
  }, [isAuthenticated]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app">
      {/* Navbar */}
      {!isAuthPage && isAuthenticated && (
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          backendStatus={backendStatus}
        />
      )}

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard stats={stats} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/websites"
            element={
              <ProtectedRoute>
                <WebsitesList
                  websites={websites}
                  stats={stats}
                  refreshing={refreshing}
                  loading={loading}
                  onRefresh={fetchWebsites}
                  onCheckWebsite={handleCheckWebsite}
                  onDeleteWebsite={handleDeleteWebsite}
                  onEditWebsite={handleEditWebsite}
                  onCheckAll={handleCheckAll}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddWebsite loading={loading} onAddWebsite={handleAddWebsite} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer - Only show when authenticated and not on auth pages */}
      {!isAuthPage && isAuthenticated && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}