const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // <-- importer cors
const { verifyToken } = require("./middlewares/authMiddleware");
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connexion à la base de données
connectDB();

// Middleware CORS : autoriser ton frontend React
app.use(cors({
  origin: "http://localhost:3000", // adresse de ton frontend React
  credentials: true, // si tu utilises l’authentification avec cookies
}));

// Middleware global pour parser JSON
app.use(bodyParser.json());

// Routes publiques
const authRoute = require("./routes/authRoute");
app.use("/api/auth", authRoute);

const championshipRoute = require("./routes/championshipRoute");
app.use("/api/championships", championshipRoute);

const teamChampionshipRoute = require("./routes/teamChampionshipRoute");
app.use("/api/teamChampionships", teamChampionshipRoute);

const teamRoute = require("./routes/teamRoute");
app.use("/api/teams", teamRoute);

const gameRoute = require("./routes/gameRoute");
app.use("/api/games", gameRoute);
const dayRoute = require("./routes/dayRoute");
app.use("/api/days", dayRoute);

// Middleware de vérification du token pour les routes /api/*
app.use("/api", verifyToken);

// Routes protégées
const userRoute = require("./routes/userRoute");
app.use("/api/users", userRoute);

const countryRoute = require("./routes/countryRoute");
app.use("/api/countries", countryRoute);








// Lancer serveur
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}...`);
});

