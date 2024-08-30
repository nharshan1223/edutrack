import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCreationForm from './TaskCreationForm';
import ActiveTasksBar from './ActiveTasksBar';
import CompletedTasksBar from './CompletedTasksBar';
import LongTermTasksCalendar from './LongTermCalendar';
import Header from './Header';
import Footer from './Footer';
import './App.css';
function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('accessToken') || '');

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/tasks/get', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            if (error.response?.status === 403) {
                await refreshAccessToken();
            } else {
                console.error('Error fetching tasks:', error.message);
            }
        }
    };
    
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const response = await axios.post('http://localhost:3001/token', { token: refreshToken });
                setToken(localStorage.getItem('accessToken'));
                localStorage.setItem('accessToken', response.data.accessToken);
                await fetchTasks(); // Retry fetching tasks with the new token
            } catch (error) {
                console.error('Error refreshing access token:', error.message);
                // Redirect to login or notify user
                window.location.href = '/login'; // Redirect to login page
            }
        } else {
            // Redirect to login or notify user
            console.error('No refresh token available.');
            window.location.href = '/login'; // Redirect to login page
        }
    };
    const addTask = async (taskData) => {
        try {
            const response = await axios.post('http://localhost:3001/tasks', taskData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([...tasks, response.data]);
            handleCloseForm();
        } catch (error) {
            console.error('Error adding task:', error.response?.data || error.message);
            if (error.response?.status === 403) {
                await refreshAccessToken(); // Refresh the token
                const newToken = localStorage.getItem('accessToken');
                if (newToken) {
                    try {
                        const response = await axios.post('http://localhost:3001/tasks', taskData, {
                            headers: { Authorization: `Bearer ${newToken}` }
                        });
                        setTasks([...tasks, response.data]);
                        handleCloseForm();
                    } catch (retryError) {
                        console.error('Retry failed:', retryError.response?.data || retryError.message);
                        // Handle retry failure (e.g., redirect to login)
                        window.location.href = '/login'; // Redirect to login page
                    }
                } else {
                    // Handle case where token refresh fails or no new token is available
                    console.error('Unable to refresh token.');
                    window.location.href = '/login'; // Redirect to login page
                }
            }
        }
    };
    

    const updateTask = (updatedTask) => {
        axios.put(`http://localhost:3001/tasks/${updatedTask._id}`, updatedTask, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        })
        .catch(err => {
            console.error(err);
            if (err.response?.status === 403) {
                refreshAccessToken();
            }
        });
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleLogin = (accessToken, refreshToken) => {
        setToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        fetchTasks();
    };

    const shortTermTasks = tasks.filter(task => !task.isLongTerm && !task.isCompleted);
    const completedTasks = tasks.filter(task => task.isCompleted);
    const longTermTasks = tasks.filter(task => task.isLongTerm);

    return (
        <div className='home'>
            <Header />
            <div className='tasks_section'>
                <ActiveTasksBar tasks={shortTermTasks} onUpdateTask={updateTask} />
                <CompletedTasksBar tasks={completedTasks} />
                <LongTermTasksCalendar tasks={longTermTasks} refreshTasks={fetchTasks} />
            </div>
            <Footer />
            <button
                className='create_task_button'
                onClick={() => setShowForm(!showForm)}
            >
                +
            </button>
            {showForm && (
                <div className='create_form_container'>
                    <TaskCreationForm onAddTask={addTask} onClose={handleCloseForm} />
                </div>
            )}
        </div>
    );
}

export default HomePage;
