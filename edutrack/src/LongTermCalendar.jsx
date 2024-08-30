import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import axios from 'axios';

function LongTermTasksCalendar({ tasks, refreshTasks }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    // Function to get the authentication token
    const getAuthToken = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found');
        }
        return token;
    };

    const handleTokenRefresh = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.post('http://localhost:3001/api/token', { token: refreshToken });
            localStorage.setItem('authToken', response.data.accessToken);
            return response.data.accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const handleCheckboxChange = async (taskId, isChecked) => {
        try {
            let token = getAuthToken();
            const newStatus = isChecked ? 'done' : 'pending';

            const updateTask = async (authToken) => {
                return axios.put(
                    `http://localhost:3001/update/longterm/${taskId}`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            };

            try {
                await updateTask(token);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.log('Token expired, refreshing token...');
                    token = await handleTokenRefresh();
                    await updateTask(token);
                } else {
                    throw error;
                }
            }

            // Update localTasks to reflect the new status
            setLocalTasks(localTasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
            // Refresh tasks list in parent component
            refreshTasks();
        } catch (error) {
            console.error('Error updating task status:', error.response ? error.response.data : error.message);
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const tasksForDate = localTasks.filter(task =>
                task.isLongTerm && new Date(task.deadline).toDateString() === date.toDateString()
            );
            return tasksForDate.length > 0 ? (
                <div className='calendar-task-list'>
                    {tasksForDate.map(task => (
                        <div key={task._id} className='calendar-task-item'>
                            <input
                                type='checkbox'
                                checked={task.status === 'done'}
                                onChange={(e) => handleCheckboxChange(task._id, e.target.checked)}
                            />
                            <span className='calendar-task'>{task.task}</span>
                        </div>
                    ))}
                </div>
            ) : null;
        }
    };

    return (
        <div className='long_term_tasks_calendar'>
            <h3>Long-Term Tasks</h3>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
            />
        </div>
    );
}

export default LongTermTasksCalendar;
