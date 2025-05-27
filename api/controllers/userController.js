const userService = require("../services/userService");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
// Récupérer tous les utilisateurs
module.exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers({});
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
// Récupérer un utilisateur par son ID
module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const user = await User.findById(id); // ou avec .populate('tasks') si défini
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (e) {
    console.error("Erreur getUserById:", e);
    res.status(500).json({ message: e.message });
  }
};

// Récupérer un utilisateur par son email

module.exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getUserById({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }

};

// Créer un nouvel utilisateur
module.exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User(req.body);
    const savedUser = await userService.createUser(newUser);
    res.status(201).json(savedUser);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Mettre à jour un utilisateur
module.exports.updateUser = async (req, res) => {
  try {
    // Vérifier si le mot de passe existe dans la requête
    if (req.body.password) {
      // Générer un salt pour le mot de passe
      let salt = await bcrypt.genSalt(10);
      // Hacher le mot de passe avec le salt
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Appeler le service pour mettre à jour l'utilisateur
    const updatedUser = await userService.updateUser({ _id: req.params.id }, req.body);

    if (updatedUser.nModified === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser({ _id: req.params.id });
    res.status(200).json(deleted);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

