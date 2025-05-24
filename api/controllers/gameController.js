const gameService = require("../services/gameService");


// Récupérer tous les matchs
module.exports.getGames = async (req, res) => {
  try {
    const games = await gameService.getGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des matchs.", error });
  }
};

// Récupérer un match par ID
module.exports.getGameById = async (req, res) => {
  try {
    const game = await gameService.getGameById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: "Match non trouvé." });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du match.", error });
  }
};

// Créer un nouveau match
module.exports.createGame = async (req, res) => {
  try {
    const newGame = await gameService.createGame(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du match.", error });
  }
};

// Mettre à jour un match
module.exports.updateGame = async (req, res) => {
  try {
    const updatedGame = await gameService.updateGame(req.params.id, req.body);
    if (!updatedGame) {
      return res.status(404).json({ message: "Match non trouvé pour mise à jour." });
    }
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du match.", error });
  }
};

// Supprimer un match
module.exports.deleteGame = async (req, res) => {
  try {
    const deletedGame = await gameService.deleteGame(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ message: "Match non trouvé pour suppression." });
    }
    res.status(200).json({ message: "Match supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du match.", error });
  }
};

// Récupérer les matchs par championnat (via les journées)
module.exports.getGamesByChampionshipId = async (req, res) => {
  try {
    const games = await gameService.getGamesByChampionshipId(req.params.id);
    if (!games || games.length === 0) {
      return res.status(404).json({ message: "Aucun match trouvé pour ce championnat." });
    }
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des matchs du championnat.", error });
  }
};