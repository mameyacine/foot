const Team = require("../models/Team");
const mongoose = require("mongoose");
const Game = require("../models/Game");
const TeamChampionship = require("../models/TeamChampionship");

// Récupérer toutes les équipes
const getTeams = async () => {
  return await Team.find();
};

// Récupérer une équipe par son ID
const getTeamById = async (id) => {
  return await Team.findById(id).populate('countryId');
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
  try {
    const objectId = new mongoose.Types.ObjectId(id);

    // Supprimer les matchs associés à cette équipe
    const deletedGames = await Game.deleteMany({
      $or: [
        { idTeam1: objectId },
        { idTeam2: objectId }
      ]
    });


    // Supprimer les liens équipe ↔ championnat
    const deletedLinks = await TeamChampionship.deleteMany({
      teamId: objectId
    });


    // Supprimer l'équipe elle-même
    const deletedTeam = await Team.findByIdAndDelete(objectId);

    if (!deletedTeam) {
      throw new Error("Équipe introuvable");
    }

    return deletedTeam;
  } catch (err) {
    console.error("Erreur lors de la suppression de l'équipe :", err);
    throw err;
  }
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