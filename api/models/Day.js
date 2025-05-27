const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  number: String,
  idChampionship: { type: mongoose.Schema.Types.ObjectId, ref: 'Championship' },
});

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);