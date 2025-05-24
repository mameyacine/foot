const dayService = require("../services/dayService");
const mongoose = require("mongoose");

// Récupérer tous les jours
module.exports.getDays = async (req, res) => {
  try {
    const days = await dayService.getAllDays();
    if (!days || days.length === 0) {
      return res.status(404).json({ message: "Aucun jour trouvé." });
    }
    res.status(200).json(days);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des jours.", error });
  }
};

// Récupérer les jours par ID du championnat
module.exports.getDaysByChampionshipId = async (req, res) => {
  try {
    const { id } = req.params;
    const days = await dayService.getDaysByChampionshipId(id);
    if (!days || days.length === 0) {
      return res.status(404).json({ message: "Aucun jour trouvé pour ce championnat." });
    }
    res.status(200).json(days);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des jours du championnat.", error });
  }
};

// Récupérer un jour par son ID
module.exports.getDayById = async (req, res) => {
  try {
    const { id } = req.params;
    const day = await dayService.getDayById(id);
    if (!day) {
      return res.status(404).json({ message: "Jour non trouvé." });
    }
    res.status(200).json(day);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du jour.", error });
  }
};

// Créer un nouveau jour
module.exports.createDay = async (req, res) => {
    try {
      const { number, championshipId } = req.body;
  
      // Vérifier si les champs requis sont présents
      if (!number || !championshipId) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
      }
  
      // Créer un nouveau jour avec les données reçues
      const newDay = await dayService.createDay({ number, championshipId });
  
      // Retourner le jour créé
      res.status(201).json(newDay);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création du jour.", error });
    }
  };

// Mettre à jour un jour existant
module.exports.updateDay = async (req, res) => {
    try {
      const { id } = req.params;
      const { number, idChampionship } = req.body;
  
      const updatedDay = await dayService.updateDay(id, { number, idChampionship });
      if (!updatedDay) {
        return res.status(404).json({ message: "Jour non trouvé pour mise à jour." });
      }
  
      res.status(200).json(updatedDay);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du jour.", error });
    }
  };

module.exports.deleteDay = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedDay = await dayService.deleteDay(id);
      if (!deletedDay) {
        return res.status(404).json({ message: "Jour non trouvé pour suppression." });
      }
      res.status(200).json({ message: "Jour supprimé avec succès." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du jour.", error });
    }
};