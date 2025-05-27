// routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Exemple de route
router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeamById);
router.post("/",verifyToken, teamController.createTeam);
router.put("/:id", verifyToken, teamController.updateTeam);
router.delete("/:id",verifyToken, teamController.deleteTeam);
router.get("/country/:id", teamController.getTeamsByCountryId);
module.exports = router;