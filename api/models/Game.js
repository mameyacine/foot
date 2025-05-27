const mongoose = require('mongoose');

  // models/Game.js
  const gameSchema = new mongoose.Schema({
    team1Point: Number,
    team2Point: Number,
    idTeam1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    idTeam2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    idDay: { type: mongoose.Schema.Types.ObjectId, ref: 'Day' },
  });
  
  module.exports = mongoose.model('Game', gameSchema);
  
  