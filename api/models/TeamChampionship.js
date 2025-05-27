const mongoose = require('mongoose');

// Table d'association entre Team et Championship
const teamChampionshipSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  championshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Championship', required: true },
});

module.exports = mongoose.model('TeamChampionship', teamChampionshipSchema);