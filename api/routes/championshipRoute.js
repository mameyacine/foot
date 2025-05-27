const express = require("express");
const router = express.Router();
const championshipController = require("../controllers/championshipController");
const { verifyToken } = require("../middlewares/authMiddleware");
// Exemple de route
router.get("/", championshipController.getChampionships);
router.get("/:id", championshipController.getChampionshipById);

router.post("/",verifyToken, championshipController.createChampionship);
router.put("/:id", verifyToken, championshipController.updateChampionship);
router.delete("/:id",verifyToken, championshipController.deleteChampionship);


module.exports = router;