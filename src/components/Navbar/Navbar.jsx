import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaPlusCircle, 
  FaList, 
  FaMoon, 
  FaSun, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";
import { useAuth, logout } from "../Auth/ProtectedRoute";
import Swal from "sweetalert2";
import WMlogo from "../../assets/WMlogo.png";
import "./Navbar.css";

const Navbar = ({ theme, toggleTheme, backendStatus }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        logout(navigate);
        closeSidebar();
        Swal.fire({ 
          icon: 'success', 
          title: 'Logged out!', 
          timer: 1500, 
          showConfirmButton: false 
        });
      }
    });
  };

  if (!isAuthenticated) return null;

  const navLinks = [
    { path: "/", icon: <FaHome />, label: "Dashboard" },
    { path: "/websites", icon: <FaList />, label: "Websites" },
    { path: "/add", icon: <FaPlusCircle />, label: "Add Website" },
  ];

  return (
    <>
      {/* ===== MAIN NAVBAR ===== */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Left Section - Logo & Hamburger */}
          <div className="navbar-left">
            <button 
              className="hamburger-btn" 
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
            
            <Link to="/" className="navbar-brand">
              <img src={WMlogo} alt="Monitor Pro" className="brand-logo" />
              <span className="brand-text">Monitor Pro</span>
            </Link>
          </div>

          {/* Center Section - Desktop Navigation */}
          <nav className="navbar-center desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section - User Info & Controls */}
          <div className="navbar-right">
            {/* User Info */}
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.name}</span>
            </div>

            {/* Theme Toggle */}
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>

            {/* Backend Status */}
            <div className={`connection-status ${backendStatus}`}>
              <span className="dot"></span>
              <span className="status-text">{backendStatus.toUpperCase()}</span>
            </div>

            {/* Logout Button (Desktop) */}
            <button 
              className="logout-btn desktop-logout" 
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={closeSidebar}
      ></div>

      {/* ===== MOBILE SIDEBAR ===== */}
      <aside className={`mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={WMlogo} alt="Monitor Pro" className="sidebar-logo" />
            <span>Monitor Pro</span>
          </div>
          <button 
            className="sidebar-close" 
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Profile */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{user?.name || "User"}</div>
            <div className="sidebar-useremail">{user?.email || "user@example.com"}</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={closeSidebar}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className={`status-dot ${backendStatus}`}></span>
            <span>Backend: {backendStatus.toUpperCase()}</span>
          </div>
          
          <button 
            className="sidebar-logout-btn" 
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;