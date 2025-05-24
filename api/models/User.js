// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

