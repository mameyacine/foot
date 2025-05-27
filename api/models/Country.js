const mongoose = require('mongoose');

// models/Country.js
const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: String,
  });
  
  module.exports = mongoose.model('Country', countrySchema);
  
  