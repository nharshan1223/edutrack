const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['study', 'projects', 'assignments', 'others'], // Limiting to specific categories
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    elapsedTime: {
        type: Number,
        default: 0 // Time in milliseconds
    }
});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;
