const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", gameController.getGames);
router.get("/:id", gameController.getGameById);
router.post("/",verifyToken, gameController.createGame);
router.put("/:id",verifyToken, gameController.updateGame);
router.delete("/:id", verifyToken,gameController.deleteGame);
router.get("/championship/:id", gameController.getGamesByChampionshipId);
router.get("/team/:id", gameController.getGamesByTeamId);
module.exports = router;