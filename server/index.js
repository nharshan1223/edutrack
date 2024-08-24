const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TaskModel = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());  // Correctly invoke the JSON middleware

const URI = "mongodb+srv://Student:TheStudent123@cluster0.fjcg0.mongodb.net/edutrack";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

    app.get('/get', (req, res) => {
        TaskModel.find()
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).json({ error: err.message }));
    });
    
    app.post('/add', (req, res) => {
        const task = req.body;
        TaskModel.create(task)
            .then(result => res.json(result))
            .catch(err => res.json(err));
    });

    app.put('/update/:id', (req, res) => {
        const { id } = req.params;
        const { isCompleted, elapsedTime } = req.body;
    
        TaskModel.findByIdAndUpdate(
            id,
            { isCompleted, elapsedTime },
            { new: true }
        )
        .then(updatedTask => res.json(updatedTask))
        .catch(err => res.status(500).json({ error: err.message }));
    });
    
    
    
    
    
    
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
