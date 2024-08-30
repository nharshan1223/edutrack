import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this file includes styles for notifications

function TaskItem({ task, onUpdateTask }) {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const startTime = new Date(task.startTime).getTime();
        const checkElapsedTime = () => {
            const now = new Date().getTime();
            const elapsedTime = now - startTime + task.elapsedTime; // Time in milliseconds
            
            if (elapsedTime > 3600000) { // 1 hour in milliseconds
                setShowNotification(true);
            }
        };

        const interval = setInterval(checkElapsedTime, 60000); // Check every minute

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [task.startTime, task.elapsedTime]);

    const handleStop = async () => {
        const now = new Date();
        const startTime = new Date(task.startTime);
        const elapsedTimeSinceStart = now - startTime; // Time in milliseconds
    
        // Convert elapsed time to seconds
        const totalElapsedTime = Math.floor(elapsedTimeSinceStart / 1000) + task.elapsedTime;
        const formatTime = (milliseconds) => {
            const seconds = Math.floor(milliseconds / 1000) % 60;
            const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
            const hours = Math.floor(milliseconds / (1000 * 60 * 60));
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };
    
        const updatedTask = {
            isCompleted: true,
            elapsedTime: totalElapsedTime
        };
    
        const token = localStorage.getItem('accessToken');
    
        try {
            const response = await axios.put(`http://localhost:3001/tasks/${task._id}`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onUpdateTask(response.data); // Update local state
        } catch (err) {
            console.error('Error updating task:', err.response?.data || err.message);
        }
    };
    
    return (
        <div className='task_item'>
            <h4>{task.task} - {task.category}</h4>
            <p>Elapsed Time: {Math.floor(task.elapsedTime / 1000)} seconds</p>
            <button onClick={handleStop}>Stop</button>
            {showNotification && (
                <div className='notification'>
                    <p>Time to get a break!</p>
                </div>
            )}
        </div>
    );
}

export default TaskItem;
