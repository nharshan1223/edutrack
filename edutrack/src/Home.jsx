import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCreationForm from './TaskCreationForm';
import ActiveTasksBar from './ActiveTasksBar';
import CompletedTasksBar from './CompletedTasksBar';
import Header from './Header';
import Footer from './Footer';
import './App.css';

function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setTasks(result.data))
            .catch(err => console.log(err));
    }, []);

    const addTask = (task) => {
        axios.post('http://localhost:3001/add', task)
            .then(result => {
                setTasks([...tasks, result.data]);
                setShowForm(false);  // Hide form after adding task
            })
            .catch(err => console.log(err));
    };

    const updateTask = (updatedTask) => {
        setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    };

    return (
        <div className='home'>
            <Header />
            <div className='tasks_section'>
                <ActiveTasksBar tasks={tasks.filter(task => !task.isCompleted)} onUpdateTask={updateTask} />
                <CompletedTasksBar tasks={tasks.filter(task => task.isCompleted)} />
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
                    <TaskCreationForm onAddTask={addTask} />
                </div>
            )}
        </div>
    );
}

export default HomePage;
