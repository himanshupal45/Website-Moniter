import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaSpinner } from "react-icons/fa";
import WMlogo from "../../assets/WMlogo.png";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // ✅ Remember Me validation - MANDATORY
    if (!formData.rememberMe) {
      newErrors.rememberMe = "You must agree to Remember Me to login";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const token = response.data.token;
        
        // ✅ Remember Me is always checked now
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        Swal.fire({
          icon: "success",
          title: "Welcome back! 👋",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Server error. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "input-error" : ""}
              disabled={loading}
            />
            {errors.email && <div className="auth-error-message">{errors.email}</div>}
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">
              <FaLock /> Password <span className="required">*</span>
            </label>
            <div className="auth-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? "input-error" : ""}
                disabled={loading}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <div className="auth-error-message">{errors.password}</div>}
          </div>

          {/* ✅ Remember Me with Validation */}
          <div className="auth-remember-section">
            <div className="auth-remember-wrapper">
              <label className={`auth-checkbox ${errors.rememberMe ? "auth-checkbox-error" : ""}`}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => {
                    setFormData({ ...formData, rememberMe: e.target.checked });
                    // Clear error when checkbox is checked
                    if (e.target.checked && errors.rememberMe) {
                      setErrors({ ...errors, rememberMe: "" });
                    }
                  }}
                  disabled={loading}
                />
                <span className="auth-checkbox-label">
                  I agree to stay logged in
                </span>
              </label>
              {errors.rememberMe && (
                <div className="auth-error-message auth-error-remember">
                  ⚠️ {errors.rememberMe}
                </div>
              )}
            </div>
            
            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            {loading ? <><FaSpinner className="spinning" /> Logging in...</> : "Login"}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="auth-social-buttons">
          <button 
            className="auth-social-btn" 
            onClick={() => Swal.fire({ 
              icon: "info", 
              title: "Coming Soon", 
              text: "Google login coming soon!" 
            })}
          >
            <FaGoogle /> Google
          </button>
          <button 
            className="auth-social-btn" 
            onClick={() => Swal.fire({ 
              icon: "info", 
              title: "Coming Soon", 
              text: "GitHub login coming soon!" 
            })}
          >
            <FaGithub /> GitHub
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;