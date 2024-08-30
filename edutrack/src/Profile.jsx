import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="profile-page">
            <header>
                <h1>Profile Page</h1>
            </header>
            <main>
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
            <footer>
                <button onClick={() => window.location.href = '/login'}>Logout</button>
            </footer>
        </div>
    );
};

export default ProfilePage;
