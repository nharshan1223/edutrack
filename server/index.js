const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/User');
const TaskModel = require('./models/Task');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const URI = process.env.MONGODB_URI || "mongodb+srv://Student:TheStudent123@cluster0.fjcg0.mongodb.net/edutrack";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

let refreshTokens = [];

// Middleware for checking JWT token and attaching user
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expired', tokenExpired: true });
            }
            return res.status(403).json({ message: 'Token verification failed' });
        }

        req.user = user;
        next();
    });
}

// Route for user signup
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);

        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to refresh the access token
app.post('/api/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    if (!refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ id: user.id });
        res.json({ accessToken });
    });
});

// Route for logging out
app.delete('/api/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.sendStatus(204);
});

// Function to generate access token
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Route for getting user profile and task statistics
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const longTermTasks = await TaskModel.countDocuments({ user: req.user.id, isLongTerm: true });
        const shortTermTasks = await TaskModel.countDocuments({ user: req.user.id, isLongTerm: false });
        const completedTasks = await TaskModel.countDocuments({ user: req.user.id, isCompleted: true });

        const tasks = await TaskModel.find({ user: req.user.id, isLongTerm: false });
        const totalTimeTracked = tasks.reduce((total, task) => total + task.elapsedTime, 0);

        const hours = Math.floor(totalTimeTracked / 3600);
        const minutes = Math.floor((totalTimeTracked % 3600) / 60);
        const seconds = totalTimeTracked % 60;
        const timeTrackedFormatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        res.json({
            user: { name: user.name, email: user.email },
            taskStats: {
                longTermTasks,
                shortTermTasks,
                completedTasks,
                timeTracked: timeTrackedFormatted
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route for getting all tasks for the logged-in user
app.get('/tasks/get', authenticateToken, async (req, res) => {
    try {
        const tasks = await TaskModel.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route for creating a new task
app.post('/tasks', authenticateToken, async (req, res) => {
    const { task, category, isCompleted, startTime, elapsedTime, isLongTerm, deadline, status } = req.body;

    if (!task || !category) {
        return res.status(400).json({ error: 'Task and category are required' });
    }

    try {
        const newTask = new TaskModel({
            task,
            category,
            isCompleted: isCompleted || false,
            startTime: startTime || null,
            elapsedTime: elapsedTime || 0,
            isLongTerm: isLongTerm || false,
            deadline: deadline || null,
            status: status || (isLongTerm ? 'Pending' : null),
            user: req.user.id
        });

        const result = await newTask.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route for updating a task
app.put('/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route for updating long-term task status
app.put('/update/longterm/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await TaskModel.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.user.toString() !== req.user.id) { // Ensure the task belongs to the user
            console.log('Task ownership mismatch:', task.user.toString(), req.user.id);
            return res.status(403).json({ message: 'Forbidden' });
        }
        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route for deleting a task
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await TaskModel.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));
