import React, { useState } from 'react';

function TaskCreationForm({ onAddTask }) {
    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState('study');

    const handleAdd = () => {
        if (taskName.trim() === '') {
            alert('Task name cannot be empty.');
            return;
        }

        const newTask = {
            task: taskName,
            category: category,
            isCompleted: false,
            startTime: new Date(),
            elapsedTime: 0
        };
        
        onAddTask(newTask);
        setTaskName('');
        setCategory('study');
    };

    return (
        <div className='create_form'>
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
                <option value="others">Others</option>
            </select>
            <button type="button" onClick={handleAdd}>Add</button>
        </div>
    );
}

export default TaskCreationForm;
