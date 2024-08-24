import React, { useEffect } from 'react';
import TaskItem from './TaskItem';

function ActiveTasksBar({ tasks, onUpdateTask }) {
    useEffect(() => {
        const interval = setInterval(() => {
            tasks.forEach(task => {
                if (!task.isCompleted) {
                    const elapsedTime = new Date() - new Date(task.startTime);
                    task.elapsedTime = elapsedTime;
                    onUpdateTask(task);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [tasks, onUpdateTask]);

    return (
        <div className='active_tasks'>
            <h3>Active Tasks</h3>
            {tasks.length === 0 ? (
                <div><h4>No Active Tasks</h4></div>
            ) : (
                tasks.map(task => (
                    <TaskItem key={task._id} task={task} onUpdateTask={onUpdateTask} />
                ))
            )}
        </div>
    );
}

export default ActiveTasksBar;
