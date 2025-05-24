# ⚽ Football Championship API

Une API RESTful développée avec **Node.js**, **Express** et **MongoDB** permettant la gestion d’un championnat de football : utilisateurs, équipes, championnats, journées et résultats.

## 🚀 Fonctionnalités

- Authentification avec JWT
- Gestion des utilisateurs (CRUD)
- Gestion des équipes et des championnats
- Attribution des résultats par journée
- Sécurité des routes privées via un middleware `authMiddleware`

## 📦 Technologies utilisées

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT (authentification)
- dotenv
- body-parser

## 📁 Structure du projet
football-championship-api/
├── app.js
├── config/
│   └── db.js
├── controllers/
│   └── userController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   └── user.js
├── routes/
│   ├── authRoute.js
│   └── userRoute.js
├── services/
│   └── userService.js
├── .env
└── README.md


## ⚙️ Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/mameyacine/football-championship-api.git
   cd football-championship-api


2. Installer les dépendances
npm install

3.	Configurer les variables d’environnement dans un fichier .env :

PORT=8080
MONGODB_URI=mongodb://localhost:27017/football-db
JWT_SECRET=ton_secret
JWT_EXPIRATION=30d

4.	Lancer le serveur en développement :

npm run dev

🔐 Authentification
	•	POST /auth/register – Inscription d’un nouvel utilisateur
	•	POST /auth/login – Connexion et génération du token JWT

Toutes les routes commençant par /api/ sont protégées par un token.

📮 Endpoints utilisateurs (protégés)
	•	GET /api/users – Liste des utilisateurs
	•	GET /api/users/id/:id – Obtenir un utilisateur par ID
	•	GET /api/users/email/:email – Obtenir un utilisateur par email
	•	POST /api/users – Créer un utilisateur
	•	PUT /api/users/:id – Mettre à jour un utilisateur
	•	DELETE /api/users/:id – Supprimer un utilisateur

🛠 Améliorations futures
	•	Ajouter les routes pour la gestion des championnats
	•	Ajouter la gestion des équipes et résultats par journée
	•	Ajouter des tests automatisés avec Jest

👨‍💻 Auteurs 
	•	NDIAYE Mame Yacine – GitHub: mameyacine
    •   SAKHO Mama Aissata
