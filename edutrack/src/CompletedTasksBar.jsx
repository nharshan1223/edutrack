import React from 'react';
import './App.css'; // Ensure your CSS is imported

function CompletedTasksBar({ tasks }) {
    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className='completed_tasks'>
            <h3>Completed Tasks</h3>
            {tasks.length === 0 ? (
                <div><h4>No Completed Tasks</h4></div>
            ) : (
                tasks.map(task => (
                    <div key={task._id} className='task_card'>
                        <h4>{task.task} - {task.category}</h4>
                        <p>Total Time: {formatTime(task.elapsedTime)}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default CompletedTasksBar;
