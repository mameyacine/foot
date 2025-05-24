const TeamChampionship = require("../models/TeamChampionship");
const Team = require("../models/Team");
const Championship = require("../models/Championship");

// Ajouter une équipe à un championnat
const addTeamToChampionship = async (teamId, championshipId, points = 0) => {
  const newTeamChampionship = new TeamChampionship({
    teamId,
    championshipId,
    points,
  });
  return await newTeamChampionship.save();
};

// Récupérer toutes les équipes d'un championnat
const getTeamsByChampionshipId = async (championshipId) => {
  const associations = await TeamChampionship.find({ championshipId }).populate('teamId');
  return associations.map(association => association.teamId);
};

// Récupérer tous les championnats d'une équipe
const getChampionshipsByTeamId = async (teamId) => {
  const associations = await TeamChampionship.find({ teamId }).populate('championshipId');
  return associations.map(association => association.championshipId);
};

module.exports = {
  addTeamToChampionship,
  getTeamsByChampionshipId,
  getChampionshipsByTeamId,
};