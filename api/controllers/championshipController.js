const championshipService = require("../services/championshipService");

// GET /championships
module.exports.getChampionships = async (req, res) => {
  try {
    const championships = await championshipService.getChampionships();
    res.status(200).json(championships);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des championnats", error });
  }
};

// GET /championships/:id
module.exports.getChampionshipById = async (req, res) => {
  try {
    const championship = await championshipService.getChampionshipById(req.params.id);
    if (!championship) {
      return res.status(404).json({ message: "Championnat non trouvé" });
    }
    res.status(200).json(championship);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du championnat", error });
  }
};

// POST /championships
module.exports.createChampionship = async (req, res) => {
  try {
    const newChampionship = await championshipService.createChampionship(req.body);
    res.status(201).json(newChampionship);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du championnat", error });
  }
};

// PUT /championships/:id
module.exports.updateChampionship = async (req, res) => {
  try {
    const updatedChampionship = await championshipService.updateChampionship(req.params.id, req.body);
    if (!updatedChampionship) {
      return res.status(404).json({ message: "Championnat non trouvé" });
    }
    res.status(200).json(updatedChampionship);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du championnat", error });
  }
};

// DELETE /championships/:id
module.exports.deleteChampionship = async (req, res) => {
  try {
    const deleted = await championshipService.deleteChampionship(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Championnat non trouvé" });
    }
    res.status(200).json({ message: "Championnat supprimé avec succès" });
  } catch (error) {
    console.error("❌ Detailed deletion error:", error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression du championnat",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

