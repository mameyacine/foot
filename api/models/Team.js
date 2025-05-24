const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creationDate: Date,
  stade: String,
  logo: String,
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
});

module.exports = mongoose.model('Team', teamSchema);