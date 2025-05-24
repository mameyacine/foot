const Game = require("../models/Game");
const Day = require("../models/Day");

const getGames = async () => {
    return await Game.find()
      .populate("idTeam1")
      .populate("idTeam2")
      .populate("idDay");
  };

// Récupérer un match par ID
const getGameById = async (id) => {
    return await Game.findById(id)
      .populate("idTeam1")
      .populate("idTeam2")
      .populate("idDay");
  };

// Créer un match
const createGame = async (gameData) => {
  const newGame = new Game(gameData);
  return await newGame.save();
};

// Mettre à jour un match
const updateGame = async (id, updatedData) => {
    return await Game.findByIdAndUpdate(id, updatedData, { new: true })
      .populate("idTeam1") // Utiliser les noms corrects des références
      .populate("idTeam2")
      .populate("idDay");
  };

// Supprimer un match
const deleteGame = async (id) => {
  return await Game.findByIdAndDelete(id);
};

const getGamesByChampionshipId = async (championshipId) => {
    // On récupère tous les IDs des journées liées à ce championnat
    const days = await Day.find({ idChampionship: championshipId }).select("_id");
    const dayIds = days.map((day) => day._id);
  
    // Ensuite, on récupère tous les matchs liés à ces journées
    return await Game.find({ idDay: { $in: dayIds } }) // Corrected "dayId" to "idDay"
      .populate("idTeam1") // Populate team 1 details
      .populate("idTeam2") // Populate team 2 details
      .populate("idDay");  // Populate day details
  };

module.exports = {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getGamesByChampionshipId,
};