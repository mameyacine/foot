const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");
const { verifyToken } = require("../middlewares/authMiddleware");


// import le controlleur


router.get("/", countryController.getCountries);
router.get("/:id", countryController.getCountryById);
router.post("/",verifyToken, countryController.createCountry);
router.put("/:id",verifyToken, countryController.updateCountry);
router.delete("/:id",verifyToken, countryController.deleteCountry);
router.get("/team/:teamId", countryController.getCountryByTeamId);


module.exports = router; 


