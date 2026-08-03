import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEnvelope, FaArrowLeft, FaSpinner, FaCheckCircle } from "react-icons/fa";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email,
      });

      if (response.data.success) {
        setEmailSent(true);
        Swal.fire({
          icon: "success",
          title: "Reset Link Sent! 📧",
          text: "Check your email for password reset instructions.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Server error. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Failed",
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
        <Link to="/login" className="auth-back-link">
          <FaArrowLeft /> Back to Login
        </Link>

        <div className="auth-logo">
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group" style={{ gridColumn: "span 2" }}>
              <label htmlFor="email">
                <FaEnvelope /> Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "input-error" : ""}
                disabled={loading}
              />
              {errors.email && (
                <div className="auth-error-message">{errors.email}</div>
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
                  <FaSpinner className="spinning" /> Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="auth-success-message" style={{ gridColumn: "span 2" }}>
            <FaCheckCircle className="success-icon" />
            <h3>Check Your Email</h3>
            <p>
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
            </p>
            <p className="auth-tip">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                type="button"
                className="auth-resend-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                resend link
              </button>
            </p>
            <Link to="/login" className="auth-back-to-login">
              Return to Login
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

export default ForgotPassword;