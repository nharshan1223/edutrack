import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import DashboardPage from './DashboardPage';
import ProfilePage from './Profile';
import SignupPage from './Signup'; // Import SignupPage
import LoginPage from './Login'; // Import LoginPage

function App() {
  const handleLogin = (token) => {
    // Handle token storage or any other actions after login
    console.log('Logged in with token:', token);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignupPage />} /> {/* Route for Signup */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} /> {/* Route for Login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
