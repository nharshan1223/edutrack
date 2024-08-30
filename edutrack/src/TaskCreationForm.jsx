import React, { useState } from 'react';
import './App.css'; // Make sure to create and import this CSS file

function TaskCreationForm({ onAddTask, onClose }) {
    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState('study');
    const [taskType, setTaskType] = useState('short-term');
    const [deadline, setDeadline] = useState('');

    const handleAdd = () => {
        if (taskName.trim() === '') {
            alert('Task name cannot be empty.');
            return;
        }
  
        const newTask = {
            task: taskName,
            category: category,
            isCompleted: false,
            startTime: taskType === 'short-term' ? new Date() : null,
            elapsedTime: 0,
            isLongTerm: taskType === 'long-term',
            deadline: taskType === 'long-term' ? new Date(deadline) : null,
            status: taskType === 'long-term' ? 'Pending' : null,
        };
        
        onAddTask(newTask);
        setTaskName('');
        setCategory('study');
        setTaskType('short-term');
        setDeadline('');
    };

    return (
        <div className='create_form'>
             <div className='create_form_header'>
                <h2>Create Task</h2>
                <button className='close_button' onClick={onClose}>×</button>
            </div>
            <input 
                type="text" 
                value={taskName}
                placeholder='Enter Task' 
                onChange={(e) => setTaskName(e.target.value)} 
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="study">Study</option>
                <option value="projects">Projects</option>
                <option value="assignments">Assignments</option>
                <option value="Lecture/Class/School Time">Lecture/Class/School Time</option>
                <option value="breaks">Breaks</option>
                <option value="other">Other</option>
            </select>
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                <option value="short-term">Short-Term</option>
                <option value="long-term">Long-Term</option>
            </select>
            {taskType === 'long-term' && (
                <input 
                    type="datetime-local" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)} 
                />
            )}
            <button type="button" onClick={handleAdd}>Add</button>
        </div>
    );
}

export default TaskCreationForm;
