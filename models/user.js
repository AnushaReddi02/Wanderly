// Import mongoose to create schema and model
const mongoose = require("mongoose");

// Extract Schema constructor from mongoose
const Schema = mongoose.Schema;

// Import passport-local-mongoose plugin
// This plugin simplifies username + password authentication
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

// Define User Schema
const userSchema = new Schema({
    // Email field for user
    email: {
        type: String,
        required: true   // Email is mandatory
    }
});

// Apply passport-local-mongoose plugin to schema
// 👉 It automatically adds:
// - username field
// - hashed password field
// - authentication methods (register, login, etc.)
userSchema.plugin(passportLocalMongoose);

// Export the model
// 👉 This creates a "User" collection in MongoDB
module.exports = mongoose.model('User', userSchema);