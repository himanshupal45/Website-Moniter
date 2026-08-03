import React from "react";
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaHeart, 
  FaServer,
  FaReact,
  FaNodeJs,
  FaDatabase
} from "react-icons/fa";
import { SiMongodb, SiVite } from "react-icons/si";
import WMlogo from "../../assets/WMlogo.png";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Row 1: Brand & Description */}
        <div className="footer-row footer-row-main">
          <div className="footer-brand">
            <img src={WMlogo} alt="Monitor Pro" className="footer-logo" />
            <div className="footer-brand-text">
              <h3>Monitor Pro</h3>
              <p>Real-time website monitoring made simple.</p>
            </div>
          </div>

          <div className="footer-social">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Row 2: Tech Stack */}
        <div className="footer-row footer-row-tech">
          <div className="tech-stack">
            <h4>Built With</h4>
            <div className="tech-icons">
              <span className="tech-item">
                <FaReact /> React
              </span>
              <span className="tech-item">
                <SiVite /> Vite
              </span>
              <span className="tech-item">
                <FaNodeJs /> Node.js
              </span>
              <span className="tech-item">
                <SiMongodb /> MongoDB
              </span>
            </div>
          </div>

          <div className="footer-status">
            <span className="status-badge">
              <span className="status-dot"></span>
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Row 3: Links */}
        <div className="footer-row footer-row-links">
          <div className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="/websites" className="footer-link">Websites</a>
            <a href="/add" className="footer-link">Add Website</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>

        {/* Row 4: Copyright */}
        <div className="footer-row footer-row-bottom">
          <p className="footer-copyright">
            © {currentYear} Monitor Pro. All rights reserved.
          </p>
          <p className="footer-made-with">
            Made with <FaHeart className="heart-icon" /> by Monitor Pro Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;