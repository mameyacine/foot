// routes/dayRoutes.js
const express = require("express");
const router = express.Router();
const dayController = require("../controllers/dayController");

// Récupérer la liste des journées
router.get("/",dayController.getDays )
// Récupérer la liste des journées suivant l’id d’un championnat
router.get("/championship/:id",dayController.getDaysByChampionshipId)

// Récupérer une journée suivant son id
router.get("/:id",dayController.getDayById)

// Créer une journée
router.post("/",dayController.createDay)

// Mettre à jour une journée
router.put("/:id",dayController.updateDay)

// Supprimer une journée
router.delete("/:id",dayController.deleteDay)

module.exports = router;