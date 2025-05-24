const mongoose = require('mongoose');

  // models/Championship.js
  const championshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    wonPoint: Number,
    lostPoint: Number,
    drawPoint: Number,
    typeRanking: String,
  });
  
  module.exports = mongoose.model('Championship', championshipSchema);
  
  