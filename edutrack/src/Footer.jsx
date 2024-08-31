import React from 'react';
import { FaHome, FaTachometerAlt, FaUserCircle } from 'react-icons/fa'; // Import desired icons
import './App.css'; // Ensure this CSS file includes the styles for the footer

function Footer() {
  return (
    <footer className="footer">
      <nav className="navbar">
        <a href="/" className="footer-link">
          <FaHome className="footer-icon" />
          <span className="footer-text">Home</span>
        </a>
        <a href="/dashboard" className="footer-link">
          <FaTachometerAlt className="footer-icon" />
          <span className="footer-text">Dashboard</span>
        </a>
        <a href="/profile" className="footer-link">
          <FaUserCircle className="footer-icon" />
          <span className="footer-text">My Profile</span>
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
