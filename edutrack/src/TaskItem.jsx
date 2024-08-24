import React from 'react';
import axios from 'axios';

function TaskItem({ task, onUpdateTask }) {
    const handleStop = () => {
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

        axios.put(`http://localhost:3001/update/${task._id}`, updatedTask)
            .then(response => {
                onUpdateTask(response.data); // Update local state
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='task_item'>
            <h4>{task.task} - {task.category}</h4>
            <p>Elapsed Time: {Math.floor(task.elapsedTime / 1000)} seconds</p>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
}

export default TaskItem;
