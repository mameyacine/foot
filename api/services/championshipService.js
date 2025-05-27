const TeamChampionship = require("../models/TeamChampionship");
const Day = require("../models/Day");
const Game = require("../models/Game");
const Championship = require("../models/Championship");
const mongoose = require("mongoose");
// Récupérer tous les championnats
const getChampionships = async () => {
  return await Championship.find();
};

// Récupérer un championnat par son ID
const getChampionshipById = async (id) => {
  return await Championship.findById(id);
};

// Créer un nouveau championnat
const createChampionship = async (championshipData) => {
  const newChampionship = new Championship(championshipData);
  return await newChampionship.save();
};

// Mettre à jour un championnat existant
const updateChampionship = async (id, updatedData) => {
  return await Championship.findByIdAndUpdate(id, updatedData, { new: true });
};

// Supprimer un championnat
const deleteChampionship = async (championshipId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(championshipId)) {
      throw new Error("ID de championnat invalide.");
    }

    // Étape 1 : Récupérer les journées du championnat
    const days = await Day.find({ idChampionship: championshipId });
    const dayIds = days.map(day => day._id);
  

    // Étape 2 : Supprimer les matchs liés à ces journées
    if (dayIds.length > 0) {
      await Game.deleteMany({ idDay: { $in: dayIds } });
    }

    // Étape 3 : Supprimer les journées
    await Day.deleteMany({ idChampionship: championshipId });

    // Étape 4 : Supprimer les associations Team-Championship
    await TeamChampionship.deleteMany({ championshipId });

    // Étape 5 : Supprimer le championnat lui-même
    const deletedChampionship = await Championship.findByIdAndDelete(championshipId);

    return deletedChampionship;
  } catch (error) {
    console.error("❌ Erreur dans deleteChampionship:", error.message);
    console.error(error.stack);
    throw error;
  }
};

module.exports = {
  getChampionships,
  getChampionshipById,
  createChampionship,
  updateChampionship,
  deleteChampionship,
};