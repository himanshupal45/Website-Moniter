import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaGithub, 
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt
} from "react-icons/fa";
import WMlogo from "../../assets/WMlogo.png";
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

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsScrolled, setTermsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const passwordStrength = checkPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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
    } else if (passwordStrength <= 1) {
      newErrors.password = "Password is too weak. Please use a stronger password.";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // ✅ Terms & Conditions validation - MANDATORY
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Account Created! 🎉",
          text: "Your account has been created successfully. Please login.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Server error. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Terms & Conditions Modal Content
  const TermsContent = () => (
    <div className="terms-content">
      <h3>Terms of Service</h3>
      <p><strong>Last Updated:</strong> January 2026</p>
      
      <h4>1. Acceptance of Terms</h4>
      <p>By creating an account and using Monitor Pro, you agree to these terms and conditions. If you do not agree, please do not use our service.</p>
      
      <h4>2. User Accounts</h4>
      <p>You are responsible for maintaining the security of your account and password. Monitor Pro cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
      
      <h4>3. Acceptable Use</h4>
      <p>You agree to use Monitor Pro only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the service.</p>
      
      <h4>4. Service Monitoring</h4>
      <p>Monitor Pro provides real-time website monitoring services. While we strive for accuracy, we do not guarantee that monitoring results will be error-free or uninterrupted.</p>
      
      <h4>5. Data Privacy</h4>
      <p>We collect and process your data in accordance with our Privacy Policy. By using Monitor Pro, you consent to such processing.</p>
      
      <h4>6. Account Termination</h4>
      <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in any suspicious activity.</p>
      
      <h4>7. Changes to Terms</h4>
      <p>We may update these terms from time to time. Continued use of the service after changes constitutes your acceptance of the new terms.</p>
      
      <h4>8. Disclaimer of Warranties</h4>
      <p>The service is provided "as is" without warranties of any kind, either express or implied, including but not limited to fitness for a particular purpose.</p>
      
      <h4>9. Limitation of Liability</h4>
      <p>Monitor Pro shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
      
      <h4>10. Contact Information</h4>
      <p>If you have any questions about these terms, please contact us at support@monitorpro.com.</p>
    </div>
  );

  const PrivacyContent = () => (
    <div className="terms-content">
      <h3>Privacy Policy</h3>
      <p><strong>Last Updated:</strong> January 2026</p>
      
      <h4>1. Information We Collect</h4>
      <p>We collect information you provide directly, such as your name, email address, and website URLs you wish to monitor.</p>
      
      <h4>2. How We Use Information</h4>
      <p>We use your information to provide, maintain, and improve our services, to communicate with you, and to monitor website status.</p>
      
      <h4>3. Data Security</h4>
      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access.</p>
      
      <h4>4. Data Sharing</h4>
      <p>We do not sell, trade, or rent your personal information to third parties. We may share data with service providers who assist us in operating our service.</p>
      
      <h4>5. Cookies</h4>
      <p>We use cookies to enhance your experience and for authentication purposes. You can control cookie preferences in your browser settings.</p>
      
      <h4>6. User Rights</h4>
      <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
      
      <h4>7. Third-Party Services</h4>
      <p>Our service may contain links to third-party websites. We are not responsible for their privacy practices.</p>
      
      <h4>8. Children's Privacy</h4>
      <p>Our service is not directed to children under 13. We do not knowingly collect information from children.</p>
      
      <h4>9. Changes to Privacy Policy</h4>
      <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
      
      <h4>10. Contact Us</h4>
      <p>If you have questions about this Privacy Policy, please contact us at privacy@monitorpro.com.</p>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us and start monitoring your websites</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Field */}
          <div className="auth-form-group">
            <label htmlFor="name">
              <FaUser /> Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "input-error" : ""}
              disabled={loading}
            />
            {errors.name && <div className="auth-error-message">{errors.name}</div>}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="auth-form-group">
            <label htmlFor="password">
              <FaLock /> Password <span className="required">*</span>
            </label>
            <div className="auth-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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
            
            {/* Password Strength Indicator */}
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
            
            {errors.password && <div className="auth-error-message">{errors.password}</div>}
          </div>

          {/* Confirm Password Field */}
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">
              <FaLock /> Confirm Password <span className="required">*</span>
            </label>
            <div className="auth-password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
            {errors.confirmPassword && <div className="auth-error-message">{errors.confirmPassword}</div>}
          </div>

          {/* ✅ Terms & Conditions with Modal */}
          <div className="auth-form-group">
            <div className={`auth-terms-wrapper ${errors.acceptTerms ? "auth-terms-error" : ""}`}>
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => {
                    setFormData({ ...formData, acceptTerms: e.target.checked });
                    if (e.target.checked && errors.acceptTerms) {
                      setErrors({ ...errors, acceptTerms: "" });
                    }
                  }}
                  disabled={loading}
                />
                <span className="auth-checkbox-label">
                  I accept the 
                  <button 
                    type="button" 
                    className="terms-link-btn"
                    onClick={() => setShowTermsModal(true)}
                  >
                    <FaFileAlt /> Terms of Service
                  </button>
                  and 
                  <button 
                    type="button" 
                    className="terms-link-btn"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>
            
            {errors.acceptTerms && (
              <div className="auth-error-message auth-error-terms">
                ⚠️ {errors.acceptTerms}
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            {loading ? <><FaSpinner className="spinning" /> Creating Account...</> : "Create Account"}
          </button>
        </form>

        <div className="auth-divider"><span>or sign up with</span></div>

        <div className="auth-social-buttons">
          <button 
            className="auth-social-btn" 
            onClick={() => Swal.fire({ icon: "info", title: "Coming Soon", text: "Google registration coming soon!" })}
          >
            <FaGoogle /> Google
          </button>
          <button 
            className="auth-social-btn" 
            onClick={() => Swal.fire({ icon: "info", title: "Coming Soon", text: "GitHub registration coming soon!" })}
          >
            <FaGithub /> GitHub
          </button>
        </div>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>

      {/* ✅ Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="terms-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <h2>
                <FaFileAlt /> Terms & Privacy Policy
              </h2>
              <button 
                className="terms-modal-close"
                onClick={() => setShowTermsModal(false)}
              >
                <FaTimesCircle />
              </button>
            </div>

            <div className="terms-modal-body">
              <div className="terms-tabs">
                <button 
                  className={`terms-tab ${!termsScrolled ? 'active' : ''}`}
                  onClick={() => setTermsScrolled(false)}
                >
                  Terms of Service
                </button>
                <button 
                  className={`terms-tab ${termsScrolled ? 'active' : ''}`}
                  onClick={() => setTermsScrolled(true)}
                >
                  Privacy Policy
                </button>
              </div>

              <div className="terms-scroll">
                {!termsScrolled ? <TermsContent /> : <PrivacyContent />}
              </div>
            </div>

            <div className="terms-modal-footer">
              <button 
                className="terms-modal-accept"
                onClick={() => {
                  setFormData({ ...formData, acceptTerms: true });
                  setErrors({ ...errors, acceptTerms: "" });
                  setShowTermsModal(false);
                }}
              >
                <FaCheckCircle /> I Accept All Terms
              </button>
              <button 
                className="terms-modal-decline"
                onClick={() => setShowTermsModal(false)}
              >
                <FaTimesCircle /> Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;