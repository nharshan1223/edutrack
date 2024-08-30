import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import './App.css';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

// In handleLogin function
const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/api/login', { email, password });
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        onLogin(accessToken); // Notify parent component of login
        alert('Login successful!');
        window.location.href = '/'; // Redirect to home or another page
    } catch (err) {
        setError('Login failed: ' + err.response.data.error);
    }
};

return (
    <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
            <h1 className="login-title">Login</h1>
            {error && <p className="error-message">{error}</p>}
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                className="login-input"
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="login-input"
            />
            <button type="submit" className="login-button">Login</button>
            <p className="signup-prompt">
                Don't have an account? <Link to="/signup" className="signup-link">Sign up here</Link>.
            </p>
        </form>
    </div>
);
}

export default LoginPage;
