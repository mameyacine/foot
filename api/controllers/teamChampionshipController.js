const teamChampionshipService = require("../services/teamChampionshipService");
const TeamChampionship = require("../models/TeamChampionship");

// Ajouter une équipe à un championnat
module.exports.addTeamToChampionship = async (req, res) => {
  try {
    const { teamId, championshipId, points } = req.body;
    const teamChampionship = await teamChampionshipService.addTeamToChampionship(teamId, championshipId, points);
    res.status(201).json(teamChampionship);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de l'ajout de l'équipe au championnat", error });
  }
};

//
//
// recuperer les équipes par championnat
module.exports.getTeamsByChampionshipId = async (req, res) => {
  try {
    const teams = await teamChampionshipService.getTeamsByChampionshipId(req.params.id);
    if (!teams.length) {
      return res.status(404).json({ message: "Aucune équipe trouvée pour ce championnat" });
    }
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des équipes par championnat", error });
  }
};

// recuperer les championnats par équipe
module.exports.getChampionshipsByTeamId = async (req, res) => {
  try {
    const championships = await teamChampionshipService.getChampionshipsByTeamId(req.params.id);
    if (!championships.length) {
      return res.status(404).json({ message: "Aucun championnat trouvé pour cette équipe" });
    }
    res.status(200).json(championships);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des championnats par équipe", error });
  }

};


exports.countTeamsByChampionshipId = async (req, res) => {
  try {
    const championshipId = req.params.id;

    const count = await TeamChampionship.countDocuments({ championshipId: championshipId });

    res.status(200).json({ championshipId, teamCount: count });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du comptage des équipes", error: error.message });
  }
};


