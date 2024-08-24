import React from 'react';
import './App.css'; // Ensure this CSS file includes the styles for the footer

function Footer() {
  return (
    <footer className="footer">
      <nav className="navbar">
        <a href="/home">HomePage</a>
        <a href="/dashboard">DashboardPage</a>
        <a href="/profile">MyProfile</a>
      </nav>
    </footer>
  );
}

export default Footer;
