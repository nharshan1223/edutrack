import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/signup', { name, email, password });
            alert('Signup successful! Please login.');
        } catch (err) {
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSignup}>
                <h1 className="login-title">Signup</h1>
                {error && <p className="error-message">{error}</p>}
                <input
                    className="login-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    className="login-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button className="login-button" type="submit">Signup</button>
                <p className="signup-prompt">
                    Already have an account? <a className="signup-link" href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
}

export default SignupPage;