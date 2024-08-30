// taskModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Task Schema with user reference
const TaskSchema = new Schema({
    task: { type: String, required: true },
    category: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    startTime: { type: Date, default: null },
    elapsedTime: { type: Number, default: 0 },
    isLongTerm: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
    status: { type: String, default: null },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;

