import React from 'react';
import './App.css'; // Ensure your CSS is imported

function CompletedTasksBar({ tasks }) {
    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Get today's date range
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Filter tasks to include only those completed today
    const todayCompletedTasks = tasks.filter(task => {
        const taskCompletionDate = new Date(task.startTime);
        return task.isCompleted && taskCompletionDate >= todayStart && taskCompletionDate < todayEnd;
    });

    return (
        <div className='completed_tasks'>
            <h3>Completed Tasks</h3>
            {todayCompletedTasks.length === 0 ? (
                <div><h4>No Completed Tasks for Today</h4></div>
            ) : (
                todayCompletedTasks.map(task => (
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
