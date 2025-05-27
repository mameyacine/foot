const mongoose = require("mongoose");
const Day = require("../models/day"); // Modèle Day
const Game = require("../models/Game");
// Récupérer tous les jours
const getAllDays = async () => {
  return await Day.find();
};

// Récupérer les jours par championnat
const getDaysByChampionshipId = async (championshipId) => {
    return await Day.find({ idChampionship: championshipId });
  };

// Récupérer un jour par ID
const getDayById = async (id) => {
  return await Day.findById(id);
};

// Créer un jour
const createDay = async ({ number, championshipId }) => {
    const newDay = new Day({
      number,
      idChampionship: championshipId,
    });
  
    await newDay.save(); // Enregistrer le jour dans la base de données
    return newDay; // Retourner l'objet du jour créé
  };

// Mettre à jour un jour
const updateDay = async (id, updateData) => {
  return await Day.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteDay = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID de journée invalide.");
  }

  // Supprime les matchs liés à cette journée
  await Game.deleteMany({ idDay: id });

  // Supprime la journée elle-même
  const deletedDay = await Day.findByIdAndDelete(id);

  if (!deletedDay) {
    throw new Error("Journée introuvable pour suppression.");
  }

  return deletedDay;
};


module.exports = {
  getAllDays,
  getDaysByChampionshipId,
  getDayById,
  createDay,
  updateDay,
  deleteDay
};