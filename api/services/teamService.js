const Team = require("../models/Team");

// Récupérer toutes les équipes
const getTeams = async () => {
  return await Team.find();
};

// Récupérer une équipe par son ID
const getTeamById = async (id) => {
  return await Team.findById(id);
};

// Créer une nouvelle équipe
const createTeam = async (teamData) => {
  const newTeam = new Team(teamData);
  return await newTeam.save();
};

// Mettre à jour une équipe existante
const updateTeam = async (id, updatedData) => {
  return await Team.findByIdAndUpdate(id, updatedData, { new: true });
};

// Supprimer une équipe
const deleteTeam = async (id) => {
  return await Team.findByIdAndDelete(id);
};



// Récupérer les équipes par ID de pays
const getTeamsByCountryId = async (countryId) => {
  return await Team.find({ countryId }).populate('countryId');
};


module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsByCountryId,
};