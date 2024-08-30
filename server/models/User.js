const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Create a model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
