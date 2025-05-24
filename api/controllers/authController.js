const authService = require("../services/AuthService");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification que email et password sont présents
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Recherche utilisateur par email via le service
    const user = await authService.getUserByQuery({ email });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    return res.status(200).json({ token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
};

// REGISTER
module.exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await authService.getUserByQuery({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userAuth = new User({  // <-- ici tu utilises User, pas UserAuth
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    userAuth = await authService.createUser(userAuth);

    const token = jwt.sign(
      { userId: userAuth._id, email: userAuth.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    return res.status(201).json({
      status: 201,
      data: {
        userId: userAuth._id,
        email: userAuth.email,
        firstName: userAuth.firstName,
        lastName: userAuth.lastName,
        token,
      },
      message: "Utilisateur créé et connecté avec succès",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
};