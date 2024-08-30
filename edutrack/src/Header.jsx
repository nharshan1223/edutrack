import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Header() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); 
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/tasks/get', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fetchedTasks = response.data;
        setTasks(fetchedTasks);

        // Process notifications based on tasks
        const newNotifications = fetchedTasks
          .filter(task => !task.isCompleted)
          .filter(task => {
            const elapsedTimeInSeconds = Math.floor(task.elapsedTime / 1000); // Convert milliseconds to seconds
            return elapsedTimeInSeconds > 3600; // Check if elapsed time exceeds one hour (3600 seconds)
          })
          .map(task => `Task "${task.task}" has been active for over an hour.`);

        setNotifications(newNotifications);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDismissNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>EduTrack</h1>
      </div>
      <div className="header-extra">
        <span className="current-date">{currentDate}</span>
        <span className="notification-icon" onClick={handleToggleDropdown}>
          🔔
        </span>
        {showDropdown && (
          <div className={`notification-dropdown ${showDropdown ? 'show' : ''}`}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {notification}
                  <button className="dismiss-button" onClick={() => handleDismissNotification(index)}>Dismiss</button>
                </div>
              ))
            ) : (
              <div className="no-notifications">No new notifications</div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
