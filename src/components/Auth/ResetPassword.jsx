import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner, 
  FaCheckCircle,
  FaArrowLeft 
} from "react-icons/fa";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const checkPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
};

const getPasswordStrengthLabel = (score) => {
  if (score <= 1) return { label: "Weak", class: "weak" };
  if (score === 2) return { label: "Medium", class: "medium" };
  if (score >= 3) return { label: "Strong", class: "strong" };
  return { label: "Very Weak", class: "weak" };
};

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");
    if (!resetToken) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "The password reset link is invalid or has expired.",
        confirmButtonColor: "#dc2626",
      }).then(() => {
        navigate("/login");
      });
    } else {
      setToken(resetToken);
    }
  }, [location, navigate]);

  const passwordStrength = checkPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength <= 1) {
      newErrors.password = "Password is too weak. Please use a stronger password.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token: token,
        password: formData.password,
      });

      if (response.data.success) {
        setResetSuccess(true);
        Swal.fire({
          icon: "success",
          title: "Password Reset! 🎉",
          text: "Your password has been reset successfully. Please login with your new password.",
          timer: 3000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Server error. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: message,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/login" className="auth-back-link">
          <FaArrowLeft /> Back to Login
        </Link>

        <div className="auth-logo">
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Create a new password for your account.
          </p>
        </div>

        {!resetSuccess ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {/* New Password */}
            <div className="auth-form-group" style={{ gridColumn: "span 2" }}>
              <label htmlFor="password">
                <FaLock /> New Password <span className="required">*</span>
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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

              {/* Password Strength */}
              {formData.password && (
                <>
                  <div className="password-strength">
                    <div className={`password-strength-bar ${strengthInfo.class}`} />
                    <div className={`password-strength-bar ${strengthInfo.class}`} />
                    <div className={`password-strength-bar ${strengthInfo.class}`} />
                    <div className={`password-strength-bar ${strengthInfo.class}`} />
                  </div>
                  <div className="password-strength-text">
                    Password strength: <strong className={strengthInfo.class}>{strengthInfo.label}</strong>
                  </div>
                </>
              )}

              {errors.password && (
                <div className="auth-error-message">{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-form-group" style={{ gridColumn: "span 2" }}>
              <label htmlFor="confirmPassword">
                <FaLock /> Confirm Password <span className="required">*</span>
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className={errors.confirmPassword ? "input-error" : ""}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="auth-error-message">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
              style={{ gridColumn: "span 2" }}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinning" /> Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        ) : (
          <div className="auth-success-message" style={{ gridColumn: "span 2" }}>
            <FaCheckCircle className="success-icon" />
            <h3>Password Reset Successful! 🎉</h3>
            <p>
              Your password has been reset successfully.
              You will be redirected to login page shortly.
            </p>
            <Link to="/login" className="auth-back-to-login">
              Go to Login
            </Link>
          </div>
        )}

        <div className="auth-footer">
          Remember your password? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;