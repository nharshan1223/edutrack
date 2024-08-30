import React from 'react';
import './App.css'; // Ensure this CSS file includes the styles for the footer

function Footer() {
  return (
    <footer className="footer">
      <nav className="navbar">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/profile">My Profile</a>
      </nav>
    </footer>
  );
}

export default Footer;
