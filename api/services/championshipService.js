



const Championship = require("../models/Championship");

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
const deleteChampionship = async (id) => {
  return await Championship.findByIdAndDelete(id);
};

module.exports = {
  getChampionships,
  getChampionshipById,
  createChampionship,
  updateChampionship,
  deleteChampionship,
};