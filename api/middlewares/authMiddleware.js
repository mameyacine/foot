const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Utilisation de req.headers['Authorization'] pour accéder à l'en-tête
  const jwtHeader = req.headers['authorization'];
  
  // Si l'en-tête n'existe pas, retourne une erreur
  if (!jwtHeader) {
    return res.status(401).json({ error: 'Access denied: No token provided' });
  }

  // Diviser le header "Bearer <token>"
  const parts = jwtHeader.split(' ');
  const prefix = parts[0];
  const token = parts[1];

  // Vérifie si le préfixe est bien "Bearer"
  if (prefix !== 'Bearer') {
    return res.status(401).json({ error: 'Access denied: Invalid token format' });
  }

  // Si aucun token, retourner une erreur
  if (!token) {
    return res.status(401).json({ error: 'Access denied: Token missing' });
  }

  try {
    // Vérification du token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId; // Assigner l'ID de l'utilisateur à la requête
    next(); // Passer au middleware suivant ou à la route
  } catch (e) {
  
    // Si le token est invalide ou expiré
    return res.status(401).json({ error: 'Invalid token: ' + e.message });
  }
}

module.exports = {verifyToken};