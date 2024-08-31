import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer'; // Import the Footer component
import './App.css'; // Ensure the styles are properly imported

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [taskStats, setTaskStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setUser(response.data.user);
                setTaskStats(response.data.taskStats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('refreshToken');
            await axios.delete('http://localhost:3001/api/logout', {
                data: { token },
            });
            // Clear tokens from local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Redirect to login page
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="profile-page">
            <header className="header">
                <h1>EduTrack</h1>
                <div className="auth-buttons">
                    <button onClick={() => window.location.href = '/login'}>Login</button>
                    <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <main className="main">
                {user && (
                    <div className="user-details">
                        <h2>User Details</h2>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                )}
                {taskStats && (
                    <div className="task-stats">
                        <h2>Task Statistics</h2>
                        <p><strong>Long-term Tasks:</strong> {taskStats.longTermTasks}</p>
                        <p><strong>Short-term Tasks:</strong> {taskStats.shortTermTasks}</p>
                        <p><strong>Completed Tasks:</strong> {taskStats.completedTasks}</p>
                        <p><strong>Total Time Tracked:</strong> {taskStats.timeTracked}</p>
                    </div>
                )}
            </main>
            <Footer /> {/* Include the Footer component */}
        </div>
    );
};

export default ProfilePage;
