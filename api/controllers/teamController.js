const teamService = require("../services/teamService");
const mongoose = require("mongoose");
// GET /teams
module.exports.getTeams = async (req, res) => {
  try {
    const teams = await teamService.getTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des équipes", error });
  }
};

module.exports.getTeamById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }
  
    try {
      const team = await teamService.getTeamById(id);
      if (!team) {
        return res.status(404).json({ message: "Équipe non trouvée" });
      }
      res.status(200).json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'équipe", error });
    }
  };

// POST /teams
module.exports.createTeam = async (req, res) => {
  try {
    const newTeam = await teamService.createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création de l'équipe", error });
  }
};

// PUT /teams/:id
module.exports.updateTeam = async (req, res) => {
  try {
    const updatedTeam = await teamService.updateTeam(req.params.id, req.body);
    if (!updatedTeam) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour de l'équipe", error });
  }
};

// DELETE /teams/:id

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await teamService.deleteTeam(id);

    if (!deleted) {
      return res.status(404).json({ message: "Équipe non trouvée." });
    }

    return res.status(200).json({ message: "Équipe et données associées supprimées avec succès." });
  } catch (error) {
    console.error("Erreur deleteTeam :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression de l'équipe.", error });
  }
};


// GET /teams/country/:id
module.exports.getTeamsByCountryId = async (req, res) => {
  try {
    const teams = await teamService.getTeamsByCountryId(req.params.id);
    if (!teams.length) {
      return res.status(404).json({ message: "Aucune équipe trouvée pour ce pays" });
    }
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des équipes par pays", error });
  }
};



