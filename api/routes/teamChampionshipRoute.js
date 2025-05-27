const express = require("express");
const router = express.Router();
const teamChampionshipController = require("../controllers/teamChampionshipController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/add",verifyToken, teamChampionshipController.addTeamToChampionship);
router.get("/championship/:id/teams", teamChampionshipController.getTeamsByChampionshipId);
router.get("/team/:id/championships", teamChampionshipController.getChampionshipsByTeamId);
router.get("/championship/:id/teams/count", teamChampionshipController.countTeamsByChampionshipId);
module.exports = router;